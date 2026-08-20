import { useCallback, useEffect, useMemo, useRef } from "react";
import { BLACK_FRAME, FRAME_TOTAL, SEAMS, filmSize, frameSrc } from "../film";

const CONCURRENCY = 6;
const LATTICE = 24; // coarse pass: every Nth frame first, so the whole film scrubs immediately

const easeInOut = (t: number) => t * t * (3 - 2 * t);

/**
 * The film engine: streams all 1888 frames with proximity priority and
 * renders the continuous camera journey on one canvas — every frame is
 * the primary image of its own scroll moment; clip boundaries blend
 * through designed seams (alpha triangle + opposing scale drift + dip).
 */
export function useFilm() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const size = useMemo(() => (typeof window === "undefined" ? 1280 : filmSize()), []);
  const images = useRef<(HTMLImageElement | null)[]>([]);
  const loaded = useRef<boolean[]>([]);
  const started = useRef(false);
  const posRef = useRef(0); // current scrub position (frames)
  const dirRef = useRef(1); // scroll direction
  const lastDrawn = useRef<string>("");
  // pre-decoded bitmap ring around the camera: drawing a bitmap costs ~1ms,
  // while drawing an Image can force a synchronous decode on the main thread
  const bitmaps = useRef(new Map<number, ImageBitmap>());
  const bmPending = useRef(new Set<number>());
  // late-binding self-reference so loaders can force a repaint at the current position
  const redrawRef = useRef<() => void>(() => {});
  const prevGRef = useRef(0);
  const shownRef = useRef(-1); // primary frame actually on screen
  const repaintPending = useRef(false);

  /* ---------- loading ---------- */

  const inFlight = useRef(0);

  const pickNext = useCallback((): number => {
    const ld = loaded.current;
    const imgs = images.current;
    const pos = posRef.current;
    const fwd = dirRef.current >= 0;
    let best = -1;
    let bestScore = Infinity;
    for (let i = 0; i < FRAME_TOTAL; i++) {
      if (ld[i] || imgs[i]) continue; // done or already requested
      const ahead = fwd ? i >= pos : i <= pos;
      const score = Math.abs(i - pos) * (ahead ? 1 : 3);
      if (score < bestScore) {
        bestScore = score;
        best = i;
      }
    }
    return best;
  }, []);

  const pump = useCallback(() => {
    while (inFlight.current < CONCURRENCY) {
      const i = pickNext();
      if (i < 0) return;
      const img = new Image();
      img.decoding = "async";
      images.current[i] = img;
      inFlight.current++;
      const done = () => {
        inFlight.current--;
        pump();
      };
      img.onload = () => {
        loaded.current[i] = true;
        redrawRef.current();
        done();
      };
      img.onerror = done;
      img.src = frameSrc(size, i);
    }
  }, [pickNext, size]);

  const start = useCallback(() => {
    if (started.current) return;
    started.current = true;
    images.current = new Array(FRAME_TOTAL).fill(null);
    loaded.current = new Array(FRAME_TOTAL).fill(false);
    // lattice first: request keyframes immediately, bypassing the picker
    let k = 0;
    const lattice: number[] = [];
    for (let i = 0; i < FRAME_TOTAL; i += LATTICE) lattice.push(i);
    lattice.push(FRAME_TOTAL - 1);
    const loadLattice = () => {
      if (k >= lattice.length) {
        pump();
        return;
      }
      let dispatched = 0;
      while (k < lattice.length && dispatched < CONCURRENCY) {
        const i = lattice[k++];
        if (images.current[i]) continue;
        const img = new Image();
        img.decoding = "async";
        images.current[i] = img;
        dispatched++;
        img.onload = () => {
          loaded.current[i] = true;
          redrawRef.current();
          loadLattice();
        };
        img.onerror = () => loadLattice();
        img.src = frameSrc(size, i);
      }
      if (dispatched === 0) pump();
    };
    loadLattice();
  }, [pump, size]);

  /* ---------- rendering ---------- */

  const nearestLoaded = useCallback((i: number): number => {
    const ld = loaded.current;
    if (ld[i]) return i;
    for (let d = 1; d < FRAME_TOTAL; d++) {
      if (i - d >= 0 && ld[i - d]) return i - d;
      if (i + d < FRAME_TOTAL && ld[i + d]) return i + d;
    }
    return -1;
  }, []);

  /** best drawable for a frame: pre-decoded bitmap if the ring has it */
  const sourceFor = useCallback((i: number): CanvasImageSource | null => {
    const bm = bitmaps.current.get(i);
    if (bm) return bm;
    return loaded.current[i] ? images.current[i] : null;
  }, []);

  const coverDraw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      src: CanvasImageSource,
      scale: number,
      alpha: number,
      dx = 0,
      dy = 0,
      blur = 0
    ) => {
      const cw = ctx.canvas.width;
      const ch = ctx.canvas.height;
      const iw = (src as ImageBitmap).width || (src as HTMLImageElement).naturalWidth;
      const ih = (src as ImageBitmap).height || (src as HTMLImageElement).naturalHeight;
      const s = Math.max(cw / iw, ch / ih) * scale;
      const dw = iw * s;
      const dh = ih * s;
      ctx.globalAlpha = alpha;
      const useBlur = blur > 0.4 && "filter" in ctx;
      if (useBlur) ctx.filter = `blur(${(blur * (cw / 1440)).toFixed(1)}px)`;
      ctx.drawImage(src, (cw - dw) / 2 + dx * cw, (ch - dh) / 2 + dy * ch, dw, dh);
      if (useBlur) ctx.filter = "none";
      ctx.globalAlpha = 1;
    },
    []
  );

  /** keep a decoded window sliding with the camera; evict what falls behind */
  const ensureBitmaps = useCallback((center: number, dir: number) => {
    if (typeof createImageBitmap !== "function") return;
    const AHEAD = 28;
    const BEHIND = 8;
    const lo = center - (dir >= 0 ? BEHIND : AHEAD);
    const hi = center + (dir >= 0 ? AHEAD : BEHIND);
    for (const [k, bm] of bitmaps.current) {
      if (k < lo - 6 || k > hi + 6) {
        bm.close();
        bitmaps.current.delete(k);
      }
    }
    let inflight = bmPending.current.size;
    const order: number[] = [];
    for (let off = 0; off <= AHEAD; off++) order.push(center + off * (dir >= 0 ? 1 : -1));
    for (let off = 1; off <= BEHIND; off++) order.push(center - off * (dir >= 0 ? 1 : -1));
    for (const i of order) {
      if (inflight >= 6) break;
      if (i < 0 || i >= FRAME_TOTAL) continue;
      if (bitmaps.current.has(i) || bmPending.current.has(i) || !loaded.current[i]) continue;
      const img = images.current[i];
      if (!img) continue;
      bmPending.current.add(i);
      inflight++;
      createImageBitmap(img)
        .then((bm) => {
          bmPending.current.delete(i);
          const c = Math.floor(posRef.current);
          if (i < c - 40 || i > c + 60) {
            bm.close();
            return;
          }
          bitmaps.current.set(i, bm);
        })
        .catch(() => bmPending.current.delete(i));
    }
  }, []);

  /** g: fractional global frame position (may exceed FRAME_TOTAL during the black hold) */
  const draw = useCallback(
    (g: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;
      dirRef.current = g >= posRef.current ? 1 : -1;
      posRef.current = g;

      // held darkness: guaranteed black regardless of network state
      const speed = Math.abs(g - prevGRef.current);
      prevGRef.current = g;

      if (g >= BLACK_FRAME) {
        if (lastDrawn.current !== "black") {
          lastDrawn.current = "black";
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        return;
      }

      // under fast flicks, quantize the drawn frame: decoding every
      // intermediate frame is invisible at speed and starves the main thread
      const q = speed > 14 ? 8 : speed > 6 ? 4 : speed > 2.5 ? 2 : 1;
      const want = Math.max(
        0,
        Math.min(FRAME_TOTAL - 1, q === 1 ? Math.floor(g) : Math.floor(g / q) * q)
      );
      const primary = nearestLoaded(want);
      if (primary < 0) return;

      // seam context
      let seam: (typeof SEAMS)[number] | null = null;
      let sd = 0;
      for (const s of SEAMS) {
        const d = g - s.at;
        if (Math.abs(d) < s.half) {
          seam = s;
          sd = d;
          break;
        }
      }

      const key = `${primary}|${seam ? sd.toFixed(2) : ""}`;
      if (key === lastDrawn.current) return;
      lastDrawn.current = key;

      let pScale = 1;
      let pdx = 0;
      let pdy = 0;
      let overlay: {
        src: CanvasImageSource;
        scale: number;
        alpha: number;
        dx: number;
        dy: number;
        blur: number;
      } | null = null;
      let dipAlpha = 0;
      let tri = 0;

      if (seam) {
        const t = (sd + seam.half) / (2 * seam.half); // 0..1 through the zone
        tri = 1 - Math.abs(sd) / seam.half; // peaks at the boundary
        const cross = easeInOut(tri) * 0.92;
        dipAlpha = seam.dip * Math.pow(tri, 1.6);
        const drx = seam.drift?.x ?? 0;
        const dry = seam.drift?.y ?? 0;
        // blur only at deliberate speeds — invisible during flicks, and cheaper
        const blurAmt = speed < 8 ? (seam.blur ?? 0) * tri : 0;
        if (sd < 0) {
          // outgoing side: the camera pushes on; the next space bleeds through
          pScale = 1 + 0.07 * t;
          pdx = -drx * t;
          pdy = -dry * t;
          const oi = nearestLoaded(seam.at);
          const osrc = oi >= 0 && oi >= seam.at ? sourceFor(oi) : null;
          if (osrc) {
            overlay = {
              src: osrc,
              scale: 1.07 - 0.07 * t,
              alpha: cross,
              dx: drx * (1 - t),
              dy: dry * (1 - t),
              blur: blurAmt,
            };
          }
        } else {
          // incoming side: the camera settles; the last space falls away
          pScale = 1.07 - 0.07 * t;
          pdx = drx * (1 - t);
          pdy = dry * (1 - t);
          const oi = nearestLoaded(seam.at - 1);
          const osrc = oi >= 0 && oi < seam.at ? sourceFor(oi) : null;
          if (osrc) {
            overlay = {
              src: osrc,
              scale: 1 + 0.07 * t,
              alpha: cross,
              dx: -drx * t,
              dy: -dry * t,
              blur: blurAmt,
            };
          }
        }
      }

      const psrc = sourceFor(primary);
      if (!psrc) return;
      shownRef.current = primary;
      coverDraw(ctx, psrc, pScale, 1, pdx, pdy);
      if (overlay) coverDraw(ctx, overlay.src, overlay.scale, overlay.alpha, overlay.dx, overlay.dy, overlay.blur);
      if (dipAlpha > 0.004) {
        const cw = canvas.width;
        const ch = canvas.height;
        if (seam?.iris) {
          // darkness closes from the edges toward the center — a doorway, not a fade
          const grad = ctx.createRadialGradient(
            cw / 2,
            ch / 2,
            0,
            cw / 2,
            ch / 2,
            Math.hypot(cw, ch) / 2
          );
          grad.addColorStop(0, `rgba(0,0,0,${(dipAlpha * Math.pow(tri, 1.4)).toFixed(3)})`);
          grad.addColorStop(0.55, `rgba(0,0,0,${(dipAlpha * 0.8).toFixed(3)})`);
          grad.addColorStop(1, `rgba(0,0,0,${Math.min(1, dipAlpha * 1.15).toFixed(3)})`);
          ctx.fillStyle = grad;
        } else {
          ctx.fillStyle = `rgba(0,0,0,${dipAlpha.toFixed(3)})`;
        }
        ctx.fillRect(0, 0, cw, ch);
      }

      // keep the pre-decoded window sliding with the camera — but only at a
      // deliberate pace; feeding the ring during flicks is pure churn
      if (speed <= 2.5) ensureBitmaps(want, dirRef.current);
    },
    [coverDraw, nearestLoaded]
  );

  useEffect(() => {
    // repaint only when the on-screen frame is a stand-in for one that just
    // arrived, and never more than once per animation frame
    redrawRef.current = () => {
      if (repaintPending.current) return;
      const want = Math.max(0, Math.min(FRAME_TOTAL - 1, Math.floor(posRef.current)));
      if (shownRef.current === want && posRef.current < BLACK_FRAME) return;
      if (posRef.current >= BLACK_FRAME) return; // black is black
      repaintPending.current = true;
      requestAnimationFrame(() => {
        repaintPending.current = false;
        lastDrawn.current = "";
        draw(posRef.current);
      });
    };
  }, [draw]);

  // canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const fit = () => {
      const rect = canvas.getBoundingClientRect();
      // backing store never exceeds ~1.15x the source frames — anything more
      // is wasted raster work with no visible gain (the source is the limit)
      const srcCap = rect.width > 0 ? (size * 1.15) / rect.width : 1;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75, Math.max(1, srcCap));
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { alpha: false });
        if (ctx) ctx.imageSmoothingQuality = "high";
        lastDrawn.current = "";
        draw(posRef.current);
      }
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [draw]);

  return { canvasRef, draw, start, size };
}

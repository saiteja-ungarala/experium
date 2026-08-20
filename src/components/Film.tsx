import { Fragment, useCallback, useLayoutEffect, useRef } from "react";
import { gsap, motionOK } from "../lib/motion";
import { registerFilm } from "../lib/filmScroll";
import {
  CUES,
  Cue,
  FILM_CHAPTERS,
  FRAME_TOTAL,
  HOLD_FRAMES,
  filmSize,
  frameSrc,
} from "../film";
import { useFilm } from "../hooks/useFilm";

const FADE = 14; // frames over which a cue settles in / dissolves out

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

function CueBody({ cue, first = false }: { cue: Cue; first?: boolean }) {
  const Title = first ? "h1" : "h2";
  return (
    <>
      {cue.overline && <p className="overline">{cue.overline}</p>}
      {cue.title && (
        <Title className={first ? "display display--xl" : "display display--lg"}>
          {cue.title.split("\n").map((line, i, arr) => (
            <Fragment key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </Fragment>
          ))}
        </Title>
      )}
      {cue.accent && <p className="accent-line">{cue.accent}</p>}
      {cue.cueLine && (
        <span className="scroll-cue">
          <i aria-hidden="true" /> Scroll to enter
        </span>
      )}
    </>
  );
}

/**
 * The film: one pinned viewport, one canvas, one continuous camera.
 * Scroll is the timeline; the copy lives on the frames and dissolves
 * with the camera. Chapters are positions on the same journey, not
 * separate sections.
 */
export function Film({ started }: { started: boolean }) {
  const root = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cueEls = useRef<(HTMLDivElement | null)[]>([]);
  const chapterRef = useRef<string>("");
  const { canvasRef, draw, start } = useFilm();

  const updateCues = useCallback((g: number) => {
    CUES.forEach((c, i) => {
      const el = cueEls.current[i];
      if (!el) return;
      const aIn = clamp01((g - c.from) / FADE);
      const aOut = clamp01((c.to - g) / FADE);
      const a = smooth(Math.min(aIn, aOut));
      if (a <= 0.001) {
        if (el.style.visibility !== "hidden") {
          el.style.visibility = "hidden";
          el.style.opacity = "0";
        }
        return;
      }
      el.style.visibility = "visible";
      el.style.opacity = a.toFixed(3);
      const y = (1 - aIn) * 28 - (1 - aOut) * 20;
      el.style.transform = `translateY(${y.toFixed(1)}px)`;
    });
    // progress rail
    let active = FILM_CHAPTERS[0].id;
    for (const ch of FILM_CHAPTERS) if (g >= ch.frame - 6) active = ch.id;
    if (active !== chapterRef.current) {
      chapterRef.current = active;
      window.dispatchEvent(new CustomEvent("experium:chapter", { detail: active }));
    }
  }, []);

  useLayoutEffect(() => {
    if (!motionOK || !root.current) return;
    const vt = FRAME_TOTAL + HOLD_FRAMES;
    const px = Math.max(22, Math.round(window.innerHeight * 0.033));
    const proxy = { g: 0 };
    const ctx = gsap.context(() => {
      const tween = gsap.to(proxy, {
        g: vt - 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: `+=${vt * px}`,
          scrub: 0.85,
          pin: stageRef.current,
          anticipatePin: 1,
        },
        onUpdate: () => {
          draw(proxy.g);
          updateCues(proxy.g);
        },
      });
      const st = tween.scrollTrigger;
      if (st) registerFilm(st, vt);
    }, root);
    start();
    draw(0);
    updateCues(0);
    return () => {
      registerFilm(null, vt);
      ctx.revert();
    };
    // the film timeline is fixed for the life of the component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // gentle first-paint entrance once the preloader lifts
  useLayoutEffect(() => {
    if (!motionOK || !started || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".film__cues",
        { opacity: 0 },
        { opacity: 1, duration: 1.6, delay: 0.2, ease: "power2.out" }
      );
    }, root);
    return () => ctx.revert();
  }, [started]);

  if (!motionOK) {
    const size = filmSize();
    return (
      <section id="film" className="film" aria-label="A journey through the Experium estate">
        {FILM_CHAPTERS.map((ch) => {
          const cue = CUES.find((c) => c.from >= ch.frame && c.from < ch.frame + 120);
          return (
            <figure className="film-static" key={ch.id}>
              <img
                src={frameSrc(size, ch.frame)}
                alt={`${ch.label} — a scene from the Experium estate`}
                loading="lazy"
                decoding="async"
              />
              <figcaption className="film-static__copy">
                {cue ? <CueBody cue={cue} /> : <p className="overline">{ch.label}</p>}
              </figcaption>
            </figure>
          );
        })}
      </section>
    );
  }

  return (
    <section id="film" ref={root} className="film" aria-label="A continuous journey through the Experium estate">
      <div className="film__stage" ref={stageRef}>
        <canvas
          ref={canvasRef}
          className="film__canvas"
          role="img"
          aria-label="One continuous camera journey: through the door of the Experium estate at dusk, along the colonnade, across the water court, into the great hall, up the staircase to the game room, until the eight-ball drops and the picture falls to black"
        />
        <div className="film__grade" aria-hidden="true" />
        <div className="film__cues">
          {CUES.map((c, i) => (
            <div
              key={`${c.from}-${c.to}`}
              className={`film-cue film-cue--${c.pos}`}
              ref={(el) => (cueEls.current[i] = el)}
              style={{ visibility: "hidden", opacity: 0 }}
            >
              <CueBody cue={c} first={i === 0} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

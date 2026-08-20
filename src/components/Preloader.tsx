import { useEffect, useRef, useState } from "react";
import { gsap, motionOK } from "../lib/motion";
import { filmSize, frameSrc } from "../film";

const MIN_MS = 2400;
const LETTERS = "EXPERIUM".split("");

export function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const meterRef = useRef<HTMLElement | null>(null);
  const pctRef = useRef<HTMLSpanElement | null>(null);
  const [gone, setGone] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const size = filmSize();
    // the film's opening seconds + fonts
    const critical: string[] = [];
    for (let i = 0; i <= 96; i += 8) critical.push(frameSrc(size, i));
    const total = critical.length + 1;
    let finished = 0;
    const t0 = performance.now();
    let exited = false;

    const display = { v: 0 };
    const render = () => {
      meterRef.current?.style.setProperty("--p", display.v.toFixed(4));
      if (pctRef.current) {
        pctRef.current.textContent = String(Math.round(display.v * 100)).padStart(2, "0");
      }
    };

    const exit = () => {
      if (exited) return;
      exited = true;
      if (!motionOK) {
        setGone(true);
        doneRef.current();
        return;
      }
      const q = (s: string) => el.querySelectorAll(s);
      gsap
        .timeline({
          onComplete: () => {
            setGone(true);
            doneRef.current();
          },
        })
        .to(q(".preloader__meta"), { opacity: 0, y: -8, duration: 0.5, ease: "power2.in" })
        .to(
          q(".preloader__mark"),
          { letterSpacing: "0.85em", duration: 1.4, ease: "power2.inOut" },
          0
        )
        .to(q(".preloader__mark span"), {
          opacity: 0,
          y: -14,
          duration: 0.8,
          stagger: 0.035,
          ease: "power2.in",
        }, 0.35)
        .to(el, { autoAlpha: 0, duration: 1.1, ease: "power2.inOut" }, 0.7);
    };

    const bump = () => {
      finished++;
      gsap.to(display, {
        v: finished / total,
        duration: 0.7,
        ease: "power2.out",
        onUpdate: render,
      });
      if (finished >= total) {
        const wait = Math.max(0, MIN_MS - (performance.now() - t0));
        window.setTimeout(exit, wait);
      }
    };

    for (const src of critical) {
      const img = new Image();
      img.onload = bump;
      img.onerror = bump;
      img.src = src;
    }
    document.fonts.ready.then(bump).catch(bump);

    // entrance
    if (motionOK) {
      const q = (s: string) => el.querySelectorAll(s);
      gsap.fromTo(
        q(".preloader__mark span"),
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 1.1, stagger: 0.055, ease: "power3.out", delay: 0.2 }
      );
      gsap.fromTo(
        q(".preloader__meta"),
        { opacity: 0 },
        { opacity: 1, duration: 1.2, delay: 0.9 }
      );
    }

    // safety: never trap the visitor behind a stuck loader
    const failsafe = window.setTimeout(exit, 12000);
    return () => window.clearTimeout(failsafe);
  }, []);

  if (gone) return null;

  return (
    <div className="preloader" ref={root} aria-label="Loading Experium">
      <div className="preloader__inner">
        <span className="preloader__mark" aria-hidden="true">
          {LETTERS.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </span>
        <div className="preloader__meta">
          <span className="preloader__hint">A private world, opening</span>
          <span className="preloader__meter" ref={(n) => (meterRef.current = n)}>
            <i />
          </span>
          <span className="preloader__pct">
            <span ref={pctRef}>00</span>
          </span>
        </div>
      </div>
    </div>
  );
}

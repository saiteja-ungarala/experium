import { useEffect, useRef, useState } from "react";
import { gsap, motionOK } from "../lib/motion";
import { INQUIRY_MAIL, media } from "../content";

/** Out of the held darkness: gold particles assemble the name. Plays once,
 *  freezes on the resolved wordmark, and the entry invitation rises. */
export function Reveal() {
  const root = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [ended, setEnded] = useState(false);
  const playedRef = useRef(false);

  useEffect(() => {
    if (!motionOK) {
      setEnded(true);
      return;
    }
    const stage = stageRef.current;
    const video = videoRef.current;
    if (!stage || !video) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.intersectionRatio >= 0.55 && !playedRef.current) {
            playedRef.current = true;
            video.preload = "auto";
            void video.play().catch(() => setEnded(true));
          }
        }
      },
      { threshold: [0.55] }
    );
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!ended || !ctaRef.current) return;
    gsap.to(ctaRef.current, { opacity: 1, y: 0, duration: 1.4, delay: 0.3 });
  }, [ended]);

  return (
    <section id="enter" ref={root} className="reveal" aria-label="Experium — enter">
      <div className="reveal__stage" ref={stageRef}>
        {motionOK && (
          <video
            ref={videoRef}
            src={media.video("reveal")}
            poster={media.poster("reveal")}
            muted
            playsInline
            preload="metadata"
            onEnded={() => setEnded(true)}
            aria-hidden="true"
          />
        )}
        {(ended || !motionOK) && (
          <img
            src={media.poster("reveal-end")}
            alt="EXPERIUM — the name rendered in golden particles against darkness"
            style={motionOK ? { opacity: ended ? 1 : 0 } : undefined}
          />
        )}
        <div
          ref={ctaRef}
          className="reveal__cta"
          style={!motionOK ? { opacity: 1, transform: "none" } : undefined}
        >
          <hr className="rule" />
          <p>Entry is by inquiry</p>
          <a className="btn-entry" href={INQUIRY_MAIL}>
            Request entry
          </a>
        </div>
      </div>
    </section>
  );
}

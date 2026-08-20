import type ScrollTrigger from "gsap/ScrollTrigger";

/** registry connecting the film's ScrollTrigger to the nav (jump-to-frame) */
let trigger: ScrollTrigger | null = null;
let virtualTotal = 1;

export function registerFilm(st: ScrollTrigger | null, vt: number) {
  trigger = st;
  virtualTotal = Math.max(1, vt);
}

/** absolute scroll Y that puts the film at the given global frame */
export function filmFrameToY(frame: number): number | null {
  if (!trigger) return null;
  const p = Math.min(1, Math.max(0, frame / (virtualTotal - 1)));
  return trigger.start + p * (trigger.end - trigger.start);
}

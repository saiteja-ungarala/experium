import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({ ignoreMobileResize: true });
gsap.defaults({ ease: "power2.out", duration: 0.9 });

let lenis: Lenis | null = null;

export const motionOK =
  typeof window !== "undefined" &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initSmoothScroll(): Lenis | null {
  if (!motionOK || lenis) return lenis;
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  // exposed for scripted QA drives
  (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
  (window as unknown as { __st?: typeof ScrollTrigger }).__st = ScrollTrigger;
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function scrollToY(y: number) {
  if (lenis) {
    lenis.scrollTo(y, { duration: 1.8 });
  } else {
    window.scrollTo(0, y);
  }
}

export function scrollToTarget(target: string) {
  const el = document.querySelector(target);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el as HTMLElement, { duration: 1.6 });
  } else {
    (el as HTMLElement).scrollIntoView({ behavior: "auto", block: "start" });
  }
}

export { gsap, ScrollTrigger };

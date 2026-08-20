import { useEffect, useState } from "react";
import { initSmoothScroll, ScrollTrigger } from "./lib/motion";
import { Preloader } from "./components/Preloader";
import { Nav } from "./components/Nav";
import { Film } from "./components/Film";
import { Reveal } from "./components/Reveal";
import { Coda } from "./components/chapters/Coda";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    initSmoothScroll();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const id = requestAnimationFrame(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(id);
  }, [ready]);

  return (
    <>
      <a className="skip-link" href="#enter">
        Skip the film — go to entry
      </a>
      <Preloader onDone={() => setReady(true)} />
      <Nav ready={ready} />
      <div className="grain" aria-hidden="true" />
      <main>
        <Film started={ready} />
        <Reveal />
        <Coda />
      </main>
    </>
  );
}

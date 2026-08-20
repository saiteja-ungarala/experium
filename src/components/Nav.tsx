import { useEffect, useRef, useState } from "react";
import { INQUIRY_MAIL } from "../content";
import { FILM_CHAPTERS } from "../film";
import { filmFrameToY } from "../lib/filmScroll";
import { ScrollTrigger, motionOK, scrollToTarget, scrollToY } from "../lib/motion";

const ITEMS = [
  ...FILM_CHAPTERS.map((c) => ({ id: c.id, numeral: c.numeral, label: c.label })),
  { id: "enter", numeral: "IX", label: "Enter" },
];

export function Nav({ ready }: { ready: boolean }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>(ITEMS[0].id);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);

  // the film reports its own chapter as the camera travels
  useEffect(() => {
    const onChapter = (e: Event) => setActive((e as CustomEvent<string>).detail);
    window.addEventListener("experium:chapter", onChapter);
    let st: ScrollTrigger | null = null;
    if (motionOK) {
      const el = document.getElementById("enter");
      if (el) {
        st = ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom top",
          onToggle: (self) => {
            if (self.isActive) setActive("enter");
          },
        });
      }
    }
    return () => {
      window.removeEventListener("experium:chapter", onChapter);
      st?.kill();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    window.setTimeout(() => {
      if (id === "enter") {
        scrollToTarget("#enter");
        return;
      }
      const ch = FILM_CHAPTERS.find((c) => c.id === id);
      if (!ch) return;
      const y = filmFrameToY(ch.frame);
      if (y != null) scrollToY(y);
      else scrollToTarget("#film");
    }, open ? 250 : 0);
  };

  return (
    <>
      <header className="nav" data-ready={ready}>
        <button
          className="nav__mark"
          onClick={() => go("arrival")}
          aria-label="EXPERIUM — back to the beginning"
        >
          EXPERIUM
        </button>
        <button
          ref={menuBtn}
          className="nav__menu-btn"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          Menu <i aria-hidden="true" />
        </button>
      </header>

      <nav className="rail" data-ready={ready} aria-label="Chapters">
        {ITEMS.map((c) => (
          <button
            key={c.id}
            className="rail__dot"
            data-active={active === c.id}
            onClick={() => go(c.id)}
            aria-label={`Chapter ${c.numeral} — ${c.label}`}
          >
            <span>{c.label}</span>
          </button>
        ))}
      </nav>

      <div
        className="menu"
        data-open={open}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
      >
        <div className="menu__top">
          <span className="nav__mark" aria-hidden="true">
            EXPERIUM
          </span>
          <button
            ref={closeBtn}
            className="menu__close"
            onClick={() => {
              setOpen(false);
              menuBtn.current?.focus();
            }}
            tabIndex={open ? 0 : -1}
          >
            Close
          </button>
        </div>
        <ul className="menu__list">
          {ITEMS.map((c) => (
            <li key={c.id}>
              <button
                className="menu__link"
                onClick={() => go(c.id)}
                tabIndex={open ? 0 : -1}
              >
                <em>{c.numeral}</em> {c.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="menu__foot">
          <a href={INQUIRY_MAIL} tabIndex={open ? 0 : -1}>
            Request entry
          </a>
          <span>By inquiry only</span>
        </div>
      </div>
    </>
  );
}

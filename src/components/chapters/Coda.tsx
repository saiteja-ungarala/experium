import { INQUIRY_MAIL } from "../../content";
import { scrollToTarget } from "../../lib/motion";

const YEAR = new Date().getFullYear();

export function Coda() {
  return (
    <section className="coda" aria-label="Contact and colophon">
      <div className="coda__inner">
        <p className="overline">Afterwards</p>
        <h2 className="display display--lg">
          Until the door
          <br />
          opens again.
        </h2>
        <p className="body-copy">
          Experium is an experiential concept — a private estate composed for a
          single evening at a time. No timetable is published, and no two nights
          repeat. Entry, private hire, and partnerships are arranged in
          conversation.
        </p>
        <div className="coda__contact">
          <span>Begin with a message:</span>
          <a href={INQUIRY_MAIL}>entry@experium.example</a>
        </div>
      </div>
      <footer className="footer">
        <span>© {YEAR} Experium — an experiential concept</span>
        <nav aria-label="Footer">
          <button className="footer__link" onClick={() => scrollToTarget("#film")}>
            Beginning
          </button>
          <button className="footer__link" onClick={() => scrollToTarget("#enter")}>
            Enter
          </button>
        </nav>
        <span>All imagery: the estate, rendered</span>
      </footer>
    </section>
  );
}

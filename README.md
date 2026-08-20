# EXPERIUM — A Private Experiential Estate

One camera. One continuous journey. One world. No obvious cuts.

The site is a single scroll-driven film built from **every frame** of the
eight source clips — 1,888 frames, in source order, each one the primary
image of its own scroll moment. Clip boundaries are designed seams (the
camera passes through architecture and darkness), the copy lives on the
frames and dissolves with the camera, and after the eight-ball drops the
screen falls to true black — out of which the EXPERIUM reveal video
assembles the name from golden particles.

The authoritative storyboard is [CINEMATIC_SEQUENCE.md](./CINEMATIC_SEQUENCE.md).

## Run

```bash
npm install
npm run dev        # http://localhost:5210
npm run build      # production build -> dist/
npm run preview    # serve the production build
```

## Stack

- **Vite + React 18 + TypeScript**
- **GSAP + ScrollTrigger** — the pinned film timeline (scrub-smoothed)
- **Lenis** — inertial smooth scrolling (skipped under `prefers-reduced-motion`)
- **@fontsource** — self-hosted Marcellus / Manrope / Cormorant Garamond

## Architecture

```
src/
  film.ts                the manifest: clip ranges (sums to 1888 — the module
                         throws on any mismatch), seam definitions, text cues,
                         chapter jump targets, frame-size selection
  hooks/useFilm.ts       the film engine: progressive frame streaming
                         (coarse lattice first, then proximity-priority fill,
                         6 concurrent), cover-fit canvas rendering, seam
                         blending (alpha triangle + opposing scale drift +
                         darkness dip), decode-ahead, guaranteed-black tail
  lib/filmScroll.ts      registry mapping global frames -> scroll positions
                         (used by the menu / progress rail)
  components/
    Film.tsx             the pinned film: one canvas + on-frame text cues
                         driven by the same scrub position; static editorial
                         fallback for prefers-reduced-motion
    Reveal.tsx           blackout -> Experium.mp4 plays once -> freeze on the
                         wordmark -> entry CTA
    Nav.tsx              wordmark, menu overlay, chapter rail (jumps move the
                         camera along the film, not between sections)
    Preloader.tsx        loads the film's opening frames + fonts
    chapters/Coda.tsx    contact + colophon after the reveal
scripts/
  build-film.ps1         ffmpeg pipeline: every source frame -> delogo
                         (watermark removal) -> WebP at 1280w + 640w with
                         global sequential numbering; HARD-FAILS if
                         used-frame count != source-frame count
  build-assets.ps1       legacy pipeline (reveal video + posters still used)
```

### Frame integrity (validated)

- Source frames: clip1–5, 7, 8 = 240 each; clip6 = 208 → **1,888 total**
- Emitted: `public/media/film/1280/f0000..f1887.webp` (49.9 MB) and
  `public/media/film/640/…` (22.5 MB) — **1,888 each, verified by the build
  script**; `src/film.ts` re-asserts the same totals at runtime.
- No frame is skipped, reordered, or duplicated. The `Experium.mp4` clip is
  not scrubbed as frames: after the blackout the reveal is the video itself.

### Loading strategy

The film streams: every 24th frame loads first (the whole journey is
scrubbable within seconds), then frames fill in ordered by distance from
the current camera position with a forward bias. The renderer always draws
the nearest loaded frame, so fast scrolling never blanks; a load completing
near the camera repaints in place. The final stretch (from global frame
1838) is painted as guaranteed black regardless of network state.

### Accessibility

`prefers-reduced-motion` renders the film as a static editorial sequence
(one composition per clip with its chapter copy). Semantic landmarks,
alt/aria text on the canvas and imagery, visible focus, Escape-closable
menu dialog, and a "skip the film" link to the entry section.

## Licensing note

`MainAssets/awesome-design-md-main.zip` is VoltAgent's MIT-licensed
*awesome-design-md* (DESIGN.md analyses of real brands). Reference reading
only — nothing brand-distinctive was copied. The Experium design system,
copy, and implementation are original. The e-mail address and canonical URL
are placeholders (`entry@experium.example`) — replace before launch.

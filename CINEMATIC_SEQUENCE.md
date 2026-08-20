# EXPERIUM — CINEMATIC SEQUENCE MANIFEST

One camera. One continuous journey. One world. No obvious cuts.

The frames are the timeline. Every source frame is used, in source order,
as the primary frame of its own scroll moment. Source of truth:
`assets/video/clip1..clip8.mp4`, frames extracted per clip as
`ezgif-frame-001..NNN` (numbering = playback order at 30fps extraction).

## Frame inventory (validated by scripts/build-film.ps1)

| Clip | Content (from visual audit)                                  | Source frames | Global index |
|------|--------------------------------------------------------------|---------------|--------------|
| 1    | Daylight arrival — stone portico, walnut door opens inward   | 240           | 0–239        |
| 2    | Dusk colonnade — camera walks the courtyard passage          | 240           | 240–479      |
| 3    | Water court — glide across the reflecting pool to pavilion   | 240           | 480–719      |
| 4    | Great hall — chandelier, fire tables, toward the staircase   | 240           | 720–959      |
| 5    | Ascent — up the floating stair, arriving at the game room    | 240           | 960–1199     |
| 6    | Game room — the table, the players, the evening's ritual     | 208           | 1200–1407    |
| 7    | The shot — cue strikes, the eight begins its roll            | 240           | 1408–1647    |
| 8    | The drop — pocket macro, the eight falls, camera follows into darkness (true black from ~global 1838) | 240 | 1648–1887 |

**TOTAL SOURCE FRAMES = 1888. TOTAL USED FRAMES = 1888.**
(Enforced: the build script hard-fails on any mismatch; the runtime manifest
in `src/film.ts` must sum to the same total.)

The `Experium.mp4` clip is NOT scrubbed as frames. After the blackout the
reveal is the video itself, emerging from the same darkness (see below).

## Camera language

A single virtual camera: slow forward dolly throughout, driven by scroll.
Scroll maps linearly to the global frame index with inertia (Lenis) and
scrub smoothing (ScrollTrigger), so the film never advances in steps the
eye can catch. Frames are drawn on one full-viewport canvas (cover-fit);
during boundary seams both neighbouring shots exist on screen at once.

## Seam design (every clip boundary is a designed transition)

Seam mechanic: within ±10 frames of a boundary, the outgoing/incoming
neighbour frame is blended over the advancing primary frame with an alpha
triangle, opposing scale drift (outgoing pushes in, incoming settles back),
and an optional darkness dip whose depth depends on how far apart the two
spaces feel. Nothing ever "switches" — the camera passes through.

Each seam combines an alpha dissolve, opposing scale drift, **directional
drift matching the camera's travel**, **motion blur on the outgoing layer**
(peaking at the boundary, gone at the edges), and — where the spaces are far
apart — an **iris**: darkness that closes from the frame edges toward the
center, like passing through a doorway.

| Boundary | Global | Treatment | Rationale |
|----------|--------|-----------|-----------|
| 1 → 2    | 240    | iris dip (1.0), vertical drift, blur | Through the front door: daylight dies inside the threshold shadow; the camera emerges into the dusk colonnade. |
| 2 → 3    | 480    | long crossfade (h16), lateral drift, blur | Colonnade opens onto the same water court clip 3 glides across. |
| 3 → 4    | 720    | iris dip (0.6), drift, blur | Crossing the pavilion glass into the hall — the glazing masks the seam. |
| 4 → 5    | 960    | long crossfade, upward drift, blur | The hall axis tilts up onto the staircase — same room, same axis. |
| 5 → 6    | 1200   | long crossfade, upward drift, blur | The stair rises into the game room — a vertical hand-off. |
| 6 → 7    | 1408   | crossfade, lateral drift, blur | Wide table → player close-up, a push through the room. |
| 7 → 8    | 1648   | iris dip (0.38), blur | The rolling eight becomes the pocket macro; darkness gathers. |
| 8 → end  | ~1838  | source blackout | The pocket swallows the camera; the film's own black tail is the exit. Held black for a breathing beat of scroll. |

## Text choreography (content lives on the frames)

Copy fades up as the camera settles, tracks the composition's negative
space, and dissolves as the camera moves on — no text survives a seam.
Positions were chosen per shot so type never covers the subject.

| Global frames | Position | Copy |
|---------------|----------|------|
| 0–96     | lower left    | EXPERIUM — A PRIVATE WORLD / "Not every door is meant to be opened." / scroll cue |
| 108–196  | lower center  | "Some are meant to be invited through." |
| 204–232  | lower center  | "Step inside." |
| 262–378  | lower left    | I — THE THRESHOLD / "Leave the ordinary behind." |
| 398–460  | lower right   | "Architecture that walks you in." |
| 505–626  | lower right   | II — THE HOUSE / "Built for moments worth remembering." |
| 646–702  | lower left    | "Every room has a reason to linger." |
| 748–876  | lower left    | III — THE PEOPLE / "Because a place is never just a place." |
| 896–946  | lower right   | "It is the people who bring it to life." |
| 992–1126 | upper left    | IV — THE DISCOVERY / "And just when you think you've seen it all—" |
| 1144–1182| upper left    | "—there's another room." |
| 1226–1340| lower left    | V — PLAY / "Not everything here is meant to be serious." |
| 1444–1572| lower left    | VI — THE GAME / "After the conversation, comes the game." |
| 1668–1764| lower center  | "Some experiences are better discovered than explained." |
| 1850–1944| center        | "The best part is what comes next." |

## Blackout & reveal

The film's final frames are true black (measured luminance ≈ 1/255 from
global ~1838). The pinned film holds this black for a short scroll beat.
Immediately after the pin releases, the reveal stage (already black)
plays `Experium.mp4` once: darkness → gold particles → the wordmark
assembles → freeze on the final frame. Entry CTA rises beneath it.
No frames after the blackout are scrubbed — the video IS the emergence.

## Fallbacks

- `prefers-reduced-motion`: the film renders as a static editorial
  sequence (first frame of each clip with its chapter copy); the reveal
  shows the final wordmark still. No pinning, no autoplay.
- Frames stream progressively (coarse lattice first, then
  proximity-filled); the renderer draws the nearest loaded frame so
  scrubbing never blanks.

/**
 * EXPERIUM film manifest — the single source of truth for the cinematic
 * timeline. Mirrors CINEMATIC_SEQUENCE.md. Every source frame is used:
 * the clip ranges below must sum to FRAME_TOTAL, which must equal the
 * number of files emitted by scripts/build-film.ps1 (validated there).
 */

export interface Clip {
  n: number;
  start: number; // global index of first frame
  count: number;
}

export const CLIPS: Clip[] = [
  { n: 1, start: 0, count: 240 },
  { n: 2, start: 240, count: 240 },
  { n: 3, start: 480, count: 240 },
  { n: 4, start: 720, count: 240 },
  { n: 5, start: 960, count: 240 },
  { n: 6, start: 1200, count: 208 },
  { n: 7, start: 1408, count: 240 },
  { n: 8, start: 1648, count: 240 },
];

export const FRAME_TOTAL = 1888;

// frame-count validation (§23 of the directive): fail loudly, not silently
const summed = CLIPS.reduce((a, c) => a + c.count, 0);
if (summed !== FRAME_TOTAL || CLIPS.some((c, i) => i > 0 && CLIPS[i - 1].start + CLIPS[i - 1].count !== c.start)) {
  throw new Error(`Film manifest invalid: clips sum ${summed}, expected ${FRAME_TOTAL}`);
}

/** first film frame that is true black (measured YAVG ≈ 1.1/255) */
export const BLACK_FRAME = 1838;

/** virtual frames of held darkness after the last real frame */
export const HOLD_FRAMES = 70;

export interface Seam {
  at: number; // boundary global index (first frame of the incoming clip)
  half: number; // seam half-width in frames
  dip: number; // 0..1 darkness dip strength at the boundary center
  /** iris: darkness closes from the frame edges toward the center —
   *  the camera passing through a doorway/shadow, not a fade */
  iris?: boolean;
  /** directional drift of the layers (fraction of viewport), matching the
   *  camera's travel so the seam reads as movement, not a swap */
  drift?: { x: number; y: number };
  /** peak motion blur (px at 1x DPR) on the outgoing layer */
  blur?: number;
}

/** designed transitions — the camera passes through, it never cuts */
export const SEAMS: Seam[] = [
  // through the front door: daylight dies inside the threshold shadow
  { at: 240, half: 14, dip: 1, iris: true, drift: { x: 0, y: 0.015 }, blur: 2.2 },
  // colonnade opens onto the water court — continuous forward glide
  { at: 480, half: 16, dip: 0.28, drift: { x: 0.02, y: 0 }, blur: 1.8 },
  // crossing the pavilion glass into the hall
  { at: 720, half: 14, dip: 0.6, iris: true, drift: { x: 0, y: 0.012 }, blur: 2.2 },
  // hall axis flows onto the staircase — camera tilts upward
  { at: 960, half: 16, dip: 0.18, drift: { x: 0, y: 0.03 }, blur: 1.8 },
  // the stair rises into the game room — vertical hand-off
  { at: 1200, half: 16, dip: 0.24, drift: { x: 0, y: 0.035 }, blur: 1.8 },
  // wide table into the player's close-up — a push through the room
  { at: 1408, half: 14, dip: 0.22, drift: { x: 0.015, y: 0 }, blur: 1.8 },
  // the rolling eight becomes the pocket macro — darkness gathering
  { at: 1648, half: 14, dip: 0.38, iris: true, drift: { x: 0, y: 0.01 }, blur: 1.5 },
];

export type CuePos = "bl" | "br" | "bc" | "tl" | "c";

export interface Cue {
  from: number;
  to: number;
  pos: CuePos;
  overline?: string;
  title?: string;
  accent?: string;
  cueLine?: boolean; // show the scroll cue under this text
}

/** copy lives on the frames; it settles in and dissolves with the camera —
 *  cinematic narration, one thought at a time, never fighting the subject */
export const CUES: Cue[] = [
  {
    from: -14, // fully settled at frame 0 — the film opens on the invitation
    to: 96,
    pos: "bl",
    overline: "Experium — a private world",
    title: "Not every door\nis meant to be opened.",
    cueLine: true,
  },
  { from: 108, to: 196, pos: "bc", accent: "Some are meant to be invited through." },
  { from: 204, to: 232, pos: "bc", accent: "Step inside." },
  {
    from: 262,
    to: 378,
    pos: "bl",
    overline: "I — The Threshold",
    title: "Leave the ordinary\nbehind.",
  },
  { from: 398, to: 460, pos: "br", accent: "Architecture that walks you in." },
  {
    from: 505,
    to: 626,
    pos: "br",
    overline: "II — The House",
    title: "Built for moments\nworth remembering.",
  },
  { from: 646, to: 702, pos: "bl", accent: "Every room has a reason to linger." },
  {
    from: 748,
    to: 876,
    pos: "bl",
    overline: "III — The People",
    title: "Because a place\nis never just a place.",
  },
  { from: 896, to: 946, pos: "br", accent: "It is the people who bring it to life." },
  {
    from: 992,
    to: 1126,
    pos: "tl",
    overline: "IV — The Discovery",
    title: "And just when you think\nyou've seen it all—",
  },
  { from: 1144, to: 1182, pos: "tl", accent: "—there's another room." },
  {
    from: 1226,
    to: 1340,
    pos: "bl",
    overline: "V — Play",
    title: "Not everything here\nis meant to be serious.",
  },
  {
    from: 1444,
    to: 1572,
    pos: "bl",
    overline: "VI — The Game",
    title: "After the conversation,\ncomes the game.",
  },
  {
    from: 1668,
    to: 1764,
    pos: "bc",
    accent: "Some experiences are better discovered than explained.",
  },
  { from: 1850, to: 1887 + HOLD_FRAMES - 14, pos: "c", accent: "The best part is what comes next." },
];

/** chapters exposed to the menu and progress rail (jump targets = frames) */
export interface FilmChapter {
  id: string;
  numeral: string;
  label: string;
  frame: number;
}

export const FILM_CHAPTERS: FilmChapter[] = [
  { id: "invitation", numeral: "I", label: "The Invitation", frame: 0 },
  { id: "threshold", numeral: "II", label: "The Threshold", frame: 252 },
  { id: "house", numeral: "III", label: "The House", frame: 492 },
  { id: "people", numeral: "IV", label: "The People", frame: 732 },
  { id: "discovery", numeral: "V", label: "The Discovery", frame: 972 },
  { id: "play", numeral: "VI", label: "Play", frame: 1212 },
  { id: "game", numeral: "VII", label: "The Game", frame: 1420 },
  { id: "drop", numeral: "VIII", label: "The Drop", frame: 1660 },
];

/** pick the served frame width for this device */
export function filmSize(): 1280 | 640 {
  const w = Math.min(window.innerWidth, window.innerHeight * (16 / 9));
  const eff = w * Math.min(window.devicePixelRatio || 1, 2);
  return eff <= 760 ? 640 : 1280;
}

export function frameSrc(size: number, i: number): string {
  return `/media/film/${size}/f${String(i).padStart(4, "0")}.webp`;
}

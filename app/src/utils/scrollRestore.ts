const KEY = 'experium:scrollY';

let saved = 0;
let tracking = false;
let initialised = false;

/**
 * Owns the scroll position across reloads.
 *
 * The browser's native restoration (history.scrollRestoration = 'auto') fights
 * the intro: the Preloader sets body overflow:hidden on mount, which makes the
 * document unscrollable and clamps the restored offset back to 0. When the lock
 * lifts 2.5s later the browser can re-apply its saved offset, so the page
 * lurches forward from the top and the frame sequence runs forward instead of
 * staying where it was reloaded.
 *
 * So we switch the native behaviour off and restore the offset ourselves, at a
 * moment we control: see restoreSavedScroll, called while the curtain is still
 * opaque. Call this as early as possible (main.tsx, before render) so 'manual'
 * is set before the browser attempts its own restore.
 */
export function initScrollRestore() {
  if (initialised || typeof window === 'undefined') return;
  initialised = true;

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  try {
    const stored = Number(sessionStorage.getItem(KEY) ?? '0');
    saved = Number.isFinite(stored) && stored > 0 ? stored : 0;
  } catch {
    saved = 0; // private mode / storage disabled
  }

  let ticking = false;
  const record = () => {
    // Never record while the intro lock is up: overflow:hidden clamps scrollY
    // to 0, which would overwrite the position we are about to restore.
    if (!tracking || ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      try {
        sessionStorage.setItem(KEY, String(Math.round(window.scrollY)));
      } catch { /* ignore */ }
    });
  };

  window.addEventListener('scroll', record, { passive: true });
  window.addEventListener('pagehide', record);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') record();
  });

  // Safety net: if the Preloader never hands off, start recording anyway so the
  // next reload still has a position to return to.
  window.setTimeout(() => { tracking = true; }, 6000);
}

/** Scroll offset this tab was at before the reload (0 on a fresh visit). */
export function getSavedScroll() {
  return saved;
}

/**
 * Puts the page back where it was reloaded. The Preloader calls this at the
 * moment it releases the scroll lock, while the black curtain still covers the
 * viewport, so the jump itself is never seen. The synthetic scroll event makes
 * every scroll-driven section recompute its frame for the restored offset.
 */
export function restoreSavedScroll() {
  if (typeof window === 'undefined') return;

  const finish = () => {
    tracking = true;
    window.dispatchEvent(new Event('scroll'));
  };

  if (saved > 0) {
    window.scrollTo(0, saved);
    // Re-apply on the next frame: the tall sections are laid out by now, but a
    // late font/image reflow can otherwise leave us a few pixels off.
    requestAnimationFrame(() => {
      window.scrollTo(0, saved);
      finish();
    });
  } else {
    finish();
  }
}

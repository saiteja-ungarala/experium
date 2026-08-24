import { useEffect, useState } from 'react';

const QUERY = '(max-width: 768px)';

// Shared breakpoint hook for layouts whose geometry is computed in JS
// (canvas sizing, scroll-driven transforms) and so can't respond to CSS
// media queries on their own. Keep the breakpoint in sync with responsive.css.
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}

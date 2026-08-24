import React, { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

interface CharacterLayerProps {
  progress: number; // 0.0 to 1.0
  totalFrames: number;
}

export const CharacterLayer: React.FC<CharacterLayerProps> = ({ progress, totalFrames }) => {
  const isMobile = useIsMobile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  // Don't touch the network until the section is within ~two viewports, so
  // this 240-frame sequence never competes with the hero's initial load.
  useEffect(() => {
    if (shouldLoad) return;
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setShouldLoad(true);
      },
      { rootMargin: '200% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldLoad]);

  // Preload frames with a small worker pool (in order, 6 at a time) instead
  // of firing all 240 requests at once. The character appears as soon as the
  // first chunk is in; the rest keep streaming while the user scrolls.
  useEffect(() => {
    if (!shouldLoad) return;
    let isCancelled = false;
    const loadedImages: HTMLImageElement[] = [];
    const EARLY_SHOW = Math.min(24, totalFrames);
    let next = 1;
    let done = 0;

    const loadIndex = (i: number) =>
      new Promise<void>((res) => {
        const paddedIndex = i.toString().padStart(3, '0');
        const img = new Image();
        img.onload = () => {
          loadedImages[i - 1] = img;
          res();
        };
        img.onerror = () => res(); // skip a bad frame rather than block
        img.src = `/welcome-section-frames-webp/ezgif-frame-${paddedIndex}.webp`;
      });

    const worker = async () => {
      while (!isCancelled) {
        const i = next++;
        if (i > totalFrames) break;
        await loadIndex(i);
        done++;
        if (done === EARLY_SHOW) {
          setImages(loadedImages);
          setLoaded(true);
        } else if (done === totalFrames) {
          // fresh array reference forces one final redraw with the full set
          setImages([...loadedImages]);
          setLoaded(true);
        }
      }
    };
    for (let w = 0; w < 6; w++) worker();

    return () => {
      isCancelled = true;
    };
  }, [shouldLoad, totalFrames]);

  // Render the correct frame based on progress
  useEffect(() => {
    if (!loaded || images.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameIndex = Math.floor(progress * (totalFrames - 1));
    frameIndex = Math.max(0, Math.min(frameIndex, totalFrames - 1));
    
    const img = images[frameIndex];
    if (!img) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const scale = canvas.height / img.height;
      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;
      const x = (canvas.width - drawWidth) / 2;
      const y = 0;
      ctx.drawImage(img, x, y, drawWidth, drawHeight);
    };

    requestAnimationFrame(draw);
  }, [progress, loaded, images, totalFrames]);

  // Handle canvas resize. On mobile the character shrinks to the lower
  // portion of the screen so the story text can live above it.
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const size = Math.round(window.innerHeight * (isMobile ? 0.52 : 1));
        canvasRef.current.height = size;
        canvasRef.current.width = size;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // Character physical travel logic (X translation)
  // Interpolate X position: starts left, moves right (shorter on mobile).
  const easeInOutQuad = (t: number) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  const easedProgress = easeInOutQuad(progress);
  const travel = isMobile ? 22 : 50;
  const translateX = -travel / 2 + (easedProgress * travel);

  return (
    <div ref={wrapperRef} style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      display: 'flex',
      alignItems: isMobile ? 'flex-end' : 'center',
      justifyContent: 'center',
      paddingBottom: isMobile ? '5vh' : 0,
      zIndex: 5
    }}>
      <canvas
        ref={canvasRef}
        style={{
          transform: `translateX(${translateX}vw)`,
          willChange: 'transform'
        }}
      />
    </div>
  );
};

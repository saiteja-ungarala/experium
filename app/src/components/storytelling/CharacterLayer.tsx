import React, { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

interface CharacterLayerProps {
  progress: number; // 0.0 to 1.0
  totalFrames: number;
}

/** Closest frame we already hold, so the canvas is never blank mid-stream. */
const nearestLoaded = (list: HTMLImageElement[], index: number) => {
  for (let radius = 1; radius <= list.length; radius++) {
    const before = list[index - radius];
    if (before) return before;
    const after = list[index + radius];
    if (after) return after;
  }
  return undefined;
};

export const CharacterLayer: React.FC<CharacterLayerProps> = ({ progress, totalFrames }) => {
  const isMobile = useIsMobile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Preload all frames
  useEffect(() => {
    let isCancelled = false;
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    // Publish as frames arrive rather than only at 100%: a reload inside this
    // section would otherwise show no character at all until all 240 are in.
    const publish = () => {
      if (loadedCount === totalFrames || loadedCount % 12 === 0) {
        setImages([...loadedImages]);
        setLoaded(true);
      }
    };

    for (let i = 1; i <= totalFrames; i++) {
      const paddedIndex = i.toString().padStart(3, '0');
      const pngSrc = `/welcome-section-frames-transparent/ezgif-frame-${paddedIndex}.png`;
      const jpgSrc = `/welcome-section-frames/ezgif-frame-${paddedIndex}.jpg`;
      
      const img = new Image();
      // Try to load the transparent PNG first (from background removal script)
      img.src = pngSrc;
      
      img.onload = () => {
        if (isCancelled) return;
        loadedImages[i - 1] = img;
        loadedCount++;
        publish();
      };
      
      img.onerror = () => {
        // If PNG fails (not processed yet), fallback to JPG
        const fallbackImg = new Image();
        fallbackImg.src = jpgSrc;
        fallbackImg.onload = () => {
          if (isCancelled) return;
          loadedImages[i - 1] = fallbackImg;
          loadedCount++;
          publish();
        };
        fallbackImg.onerror = () => {
          if (isCancelled) return;
          loadedCount++;
          publish();
        };
      };
    }

    return () => {
      isCancelled = true;
    };
  }, [totalFrames]);

  // Render the correct frame based on progress
  useEffect(() => {
    if (!loaded || images.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameIndex = Math.floor(progress * (totalFrames - 1));
    frameIndex = Math.max(0, Math.min(frameIndex, totalFrames - 1));
    
    const img = images[frameIndex] ?? nearestLoaded(images, frameIndex);
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
    <div style={{
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

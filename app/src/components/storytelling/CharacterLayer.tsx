import React, { useEffect, useRef, useState } from 'react';

interface CharacterLayerProps {
  progress: number; // 0.0 to 1.0
  totalFrames: number;
}

export const CharacterLayer: React.FC<CharacterLayerProps> = ({ progress, totalFrames }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Preload all frames
  useEffect(() => {
    let isCancelled = false;
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

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
        if (loadedCount === totalFrames) {
          setImages(loadedImages);
          setLoaded(true);
        }
      };
      
      img.onerror = () => {
        // If PNG fails (not processed yet), fallback to JPG
        const fallbackImg = new Image();
        fallbackImg.src = jpgSrc;
        fallbackImg.onload = () => {
          if (isCancelled) return;
          loadedImages[i - 1] = fallbackImg;
          loadedCount++;
          if (loadedCount === totalFrames) {
            setImages(loadedImages);
            setLoaded(true);
          }
        };
        fallbackImg.onerror = () => {
          if (isCancelled) return;
          loadedCount++;
          if (loadedCount === totalFrames) {
            setImages(loadedImages);
            setLoaded(true);
          }
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

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const vh = window.innerHeight;
        canvasRef.current.height = vh;
        canvasRef.current.width = vh;
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Character physical travel logic (X translation)
  // Interpolate X position: starts left, moves right.
  const easeInOutQuad = (t: number) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  const easedProgress = easeInOutQuad(progress);
  const translateX = -25 + (easedProgress * 50);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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

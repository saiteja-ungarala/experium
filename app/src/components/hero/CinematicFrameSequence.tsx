import React, { useEffect, useState, useMemo, useRef } from 'react';
import { FramePreloader } from './FramePreloader';
import { CanvasRenderer } from './CanvasRenderer';

interface CinematicFrameSequenceProps {
  totalFrames: number;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  pathTemplate: (index: number) => string;
  onFrameChange?: (frameIndex: number) => void;
}

export const CinematicFrameSequence: React.FC<CinematicFrameSequenceProps> = ({ 
  totalFrames, 
  scrollContainerRef,
  pathTemplate,
  onFrameChange
}) => {
  const [isReady, setIsReady] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(1);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [loadingProgress, setLoadingProgress] = useState(0);

  const preloader = useMemo(() => new FramePreloader(totalFrames, pathTemplate), [totalFrames, pathTemplate]);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Track container resize for canvas dimensions
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const updateSize = () => {
      setDimensions({
        width: container.clientWidth,
        height: container.clientHeight
      });
    };
    
    // Initial size
    updateSize();
    
    const observer = new ResizeObserver(() => {
      updateSize();
    });
    
    observer.observe(container);
    
    return () => {
      observer.disconnect();
    };
  }, []);

  // Initialize preloader
  useEffect(() => {
    preloader.setOnProgress(setLoadingProgress);
    preloader.startPreloading(20).then(() => {
      setIsReady(true);
    });
  }, [preloader]);

  // Handle scroll logic
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            
            // Calculate how far we've scrolled inside the container
            // We start sequence when container top hits viewport top (0)
            const rect = container.getBoundingClientRect();
            
            // Height available for scrolling (container height - viewport height)
            const scrollableHeight = container.scrollHeight - window.innerHeight;
            
            // Progress from 0 to 1
            const progress = Math.min(Math.max(-rect.top / scrollableHeight, 0), 1);
            
            // Map progress to frame index (1 to totalFrames)
            let frameIndex = Math.floor(progress * (totalFrames - 1)) + 1;
            
            // Prevent going out of bounds
            if (frameIndex > totalFrames) frameIndex = totalFrames;
            if (frameIndex < 1) frameIndex = 1;
            
            setCurrentFrameIndex(frameIndex);
            if (onFrameChange) {
              onFrameChange(frameIndex);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollContainerRef, totalFrames, onFrameChange]);

  const currentImage = preloader.getFrame(currentFrameIndex);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', backgroundColor: 'transparent' }}>
      {!isReady && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
          zIndex: 50,
          background: 'transparent'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '1rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Initializing Sequence
            </div>
            <div style={{ width: '200px', height: '2px', background: '#333', overflow: 'hidden' }}>
              <div style={{ 
                height: '100%', 
                width: `${loadingProgress * 100}%`, 
                background: '#fff',
                transition: 'width 0.2s ease-out' 
              }} />
            </div>
          </div>
        </div>
      )}
      
      {dimensions.width > 0 && dimensions.height > 0 && currentImage && (
        <CanvasRenderer 
          image={currentImage} 
          width={dimensions.width} 
          height={dimensions.height} 
        />
      )}
    </div>
  );
};

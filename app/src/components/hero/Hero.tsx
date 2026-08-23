import React, { useRef, useCallback, useState } from 'react';
import { CinematicFrameSequence } from './CinematicFrameSequence';
import { HeroContentOverlay } from './HeroContentOverlay';

export const Hero: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(1);

  // Helper to format frame path. Frame names are frame-001.jpg up to 377
  const getFramePath = useCallback((index: number) => {
    const paddedIndex = index.toString().padStart(3, '0');
    return `/frames/frame-${paddedIndex}.jpg`;
  }, []);

  // Fade to beige at the end to transition smoothly into the MasterStorytellingSection
  // Starts fading at frame 340, fully opaque by frame 377.
  const fadeOutOpacity = currentFrame > 340 ? Math.min(1, (currentFrame - 340) / 37) : 0;

  return (
    <div 
      ref={scrollContainerRef}
      style={{ 
        // 700vh means scrolling ~6 viewport heights to see all 377 frames.
        height: '700vh', 
        position: 'relative',
        width: '100%',
        backgroundColor: '#000'
      }}
    >
      <div 
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden'
        }}
      >
        <CinematicFrameSequence 
          totalFrames={377} 
          scrollContainerRef={scrollContainerRef}
          pathTemplate={getFramePath}
          onFrameChange={setCurrentFrame}
        />
        <HeroContentOverlay currentFrame={currentFrame} />

        {/* Transition Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#fdf3e1',
          opacity: fadeOutOpacity,
          pointerEvents: 'none',
          zIndex: 50,
          transition: 'opacity 0.1s linear',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Elegant design to highlight the plain transition */}
          <div style={{
            width: '1px',
            height: '100px',
            backgroundColor: 'var(--text-dark)',
            opacity: 0.3,
            marginBottom: '2rem'
          }} />
          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '1.5rem',
            fontWeight: 400,
            letterSpacing: '8px',
            textTransform: 'uppercase',
            color: 'var(--text-dark)',
            margin: 0
          }}>
            Experium
          </h2>
          <div style={{
            width: '1px',
            height: '100px',
            backgroundColor: 'var(--text-dark)',
            opacity: 0.3,
            marginTop: '2rem'
          }} />
        </div>
      </div>
    </div>
  );
};

import React, { useRef, useCallback, useState } from 'react';
import { CinematicFrameSequence } from './CinematicFrameSequence';
import { HeroContentOverlay } from './HeroContentOverlay';

export const Hero: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(1);

  // Helper to format frame path. 
  // Frame 1 is the custom herostartingframe.png.
  // Frames 2+ map to frame-115.jpg onwards.
  const getFramePath = useCallback((index: number) => {
    if (index === 1) {
      return `/frames/herostartingframe.png`;
    }
    const actualFrame = index + 113; // index 2 -> 115
    const paddedIndex = actualFrame.toString().padStart(3, '0');
    return `/frames/frame-${paddedIndex}.jpg`;
  }, []);

  // Fade to beige at the end to transition smoothly into the MasterStorytellingSection
  // Total frames now 264. Starts fading at frame 227, fully opaque by frame 264.
  const fadeOutOpacity = currentFrame > 227 ? Math.min(1, (currentFrame - 227) / 37) : 0;

  return (
    <div 
      ref={scrollContainerRef}
      style={{ 
        // 500vh maintains the same scroll speed as 700vh for 377 frames (now 263 frames).
        height: '500vh', 
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
          totalFrames={264} 
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
            fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
            fontWeight: 400,
            letterSpacing: 'clamp(4px, 1.5vw, 8px)',
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

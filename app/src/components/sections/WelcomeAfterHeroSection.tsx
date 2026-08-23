import React, { useRef, useCallback, useState, useEffect } from 'react';
import { CinematicFrameSequence } from '../hero/CinematicFrameSequence';

export const WelcomeAfterHeroSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(1);

  // Helper to format frame path for the new sequence
  const getFramePath = useCallback((index: number) => {
    const paddedIndex = index.toString().padStart(3, '0');
    return `/welcome-afterhero-frames-transparent/frame-${paddedIndex}.png`;
  }, []);

  // Determine which word to show based on frame progress
  // Total frames: 240
  // Phase 1 (1-60): Club
  // Phase 2 (61-120): Explore
  // Phase 3 (121-180): Discover
  // Phase 4 (181-240): Experience

  const getOpacity = (start: number, end: number, frame: number) => {
    const fadeRange = 10; // Frames it takes to crossfade
    if (frame < start || frame > end) return 0;
    if (frame < start + fadeRange) return (frame - start) / fadeRange; // Fade in
    if (frame > end - fadeRange) return (end - frame) / fadeRange; // Fade out
    return 1; // Fully visible in between
  };

  const words = [
    { text: 'Club', start: 1, end: 60 },
    { text: 'Explore', start: 61, end: 120 },
    { text: 'Discover', start: 121, end: 180 },
    { text: 'Experience', start: 181, end: 240 }
  ];

  return (
    <section ref={scrollContainerRef} className="section-light" style={{ height: '500vh', position: 'relative' }}>
      <div style={{
        position: 'sticky',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10%'
      }}>
        
        {/* Left Side: Overlapping Text */}
        <div style={{ 
          zIndex: 2, 
          position: 'relative',
          width: '50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 4vw, 4rem)', 
            fontWeight: 300, 
            letterSpacing: '-2px',
            margin: '0 0 0 20px',
            textTransform: 'uppercase',
            color: 'var(--text-dark)'
          }}>
            Your Welcome To
          </h2>
          
          <div style={{ position: 'relative', height: '200px', marginLeft: '50px' }}>
            {words.map((word, idx) => (
              <h3 key={idx} className="script-font" style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                fontSize: 'clamp(6rem, 12vw, 14rem)', 
                margin: 0, 
                lineHeight: 0.8,
                color: 'var(--text-dark)',
                opacity: getOpacity(word.start, word.end, currentFrame),
                transition: 'opacity 0.1s linear',
                willChange: 'opacity',
                whiteSpace: 'nowrap'
              }}>
                {word.text}
              </h3>
            ))}
          </div>
        </div>

        {/* Right Side: The Bounded Canvas Image Block */}
        <div style={{ 
          position: 'absolute',
          right: '10%',
          height: '75vh', // Tall portrait height
          aspectRatio: '9/16', // Enforce 9:16 ratio
          zIndex: 1,
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
        }}>
          {/* We position absolute to ensure the canvas fills this block */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <CinematicFrameSequence 
              totalFrames={240} 
              scrollContainerRef={scrollContainerRef}
              pathTemplate={getFramePath}
              onFrameChange={setCurrentFrame}
            />
          </div>
        </div>

      </div>
    </section>
  );
};

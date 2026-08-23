import React, { useMemo } from 'react';

interface HeroContentOverlayProps {
  currentFrame: number;
}

export const HeroContentOverlay: React.FC<HeroContentOverlayProps> = ({ currentFrame }) => {
  // Experium logic
  const experiumOpacity = currentFrame > 30 ? Math.max(0, 1 - (currentFrame - 30) / (120 - 30)) : 1;
  const experiumScale = 1 + (currentFrame * 0.0015);
  const experiumTranslateY = -(currentFrame * 0.5);

  // Helper to calculate animation state for a word
  const getWordStyle = (startFadeIn: number, endFadeIn: number, startFadeOut: number, endFadeOut: number, type: 'entering-the' | 'world') => {
    let opacity = 0;
    let scale = 1;
    let blur = 0;

    if (currentFrame >= startFadeIn && currentFrame <= endFadeIn) {
      // Fading in
      const progress = (currentFrame - startFadeIn) / (endFadeIn - startFadeIn);
      opacity = progress;
      scale = 1.2 - (0.2 * progress); // Subtle scale down
      blur = 10 - (10 * progress);
    } else if (currentFrame > endFadeIn && currentFrame < startFadeOut) {
      // Fully visible
      opacity = 1;
      scale = 1;
      blur = 0;
    } else if (currentFrame >= startFadeOut && currentFrame <= endFadeOut) {
      // Fading out
      const progress = (currentFrame - startFadeOut) / (endFadeOut - startFadeOut);
      opacity = 1 - progress;
      scale = 1 + (0.2 * progress); // Subtle scale up
      blur = 10 * progress;
    }

    const baseStyle = {
      opacity,
      transform: `scale(${scale})`,
      filter: `blur(${blur}px)`,
      display: opacity > 0 ? 'block' : 'none',
      position: 'absolute' as const,
      willChange: 'transform, opacity, filter',
      textAlign: 'center' as const,
      width: '100%'
    };

    if (type === 'entering-the') {
      return {
        ...baseStyle,
        color: '#000',
        fontFamily: "'Cinzel', serif",
        fontSize: '8rem',
        fontWeight: '600',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.8rem',
        textShadow: '0 0 30px rgba(255,255,255,0.5)',
      };
    } else {
      // "world" type
      return {
        ...baseStyle,
        color: '#fdf3e1',
        fontFamily: "'Pinyon Script', cursive",
        fontSize: '14rem',
        fontWeight: 'normal',
        textTransform: 'none' as const,
        textShadow: '0 0 30px rgba(253, 243, 225, 0.3), 0 10px 20px rgba(0,0,0,0.8)',
      };
    }
  };

  // "Entering" fades in 110-130, fades out 160-180
  const word1Style = useMemo(() => getWordStyle(110, 130, 160, 180, 'entering-the'), [currentFrame]);
  
  // "The" fades in 180-190, fades out 220-230 (guaranteed to disappear before garden scene)
  const word2Style = useMemo(() => getWordStyle(180, 190, 220, 230, 'entering-the'), [currentFrame]);
  
  // "World" starts right as garden scene begins (250)
  const word3Style = useMemo(() => getWordStyle(250, 280, 340, 370, 'world'), [currentFrame]);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 10,
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      
      {/* Brand Text - Phase 0 */}
      <h1 style={{
        position: 'absolute',
        fontFamily: "'Pinyon Script', cursive",
        fontSize: '14rem',
        margin: 0,
        opacity: experiumOpacity,
        transform: `translateY(${experiumTranslateY}px) scale(${experiumScale})`,
        color: '#fdf3e1',
        textShadow: '0 0 30px rgba(253, 243, 225, 0.3), 0 10px 20px rgba(0,0,0,0.8)',
        fontWeight: 'normal',
        willChange: 'transform, opacity',
        display: experiumOpacity > 0 ? 'block' : 'none'
      }}>
        Experium
      </h1>

      {/* Sequential Words - Phases 1, 2, 3 */}
      <div style={word1Style}>Entering</div>
      <div style={word2Style}>The</div>
      <div style={word3Style}>World</div>

      <div style={{ 
        position: 'absolute', 
        bottom: '40px', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        opacity: currentFrame < 15 ? 0.6 : 0,
        transition: 'opacity 0.5s ease',
        color: '#fdf3e1',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <p style={{ letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.8rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
          Scroll to Explore
        </p>
      </div>
    </div>
  );
};

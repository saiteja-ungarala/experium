import React, { useMemo } from 'react';

interface HeroContentOverlayProps {
  currentFrame: number;
}

export const HeroContentOverlay: React.FC<HeroContentOverlayProps> = ({ currentFrame }) => {
  // Experium logic (adjusted for new sequence)
  // Fades out earlier to prevent overlap with "Entering"
  const experiumOpacity = currentFrame > 5 ? Math.max(0, 1 - (currentFrame - 5) / (25 - 5)) : 1;
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
        fontSize: 'clamp(3rem, 13vw, 8rem)',
        fontWeight: '600',
        textTransform: 'uppercase' as const,
        letterSpacing: 'clamp(0.25rem, 1.5vw, 0.8rem)',
        textShadow: '0 0 30px rgba(255,255,255,0.5)',
      };
    } else {
      // "world" type
      return {
        ...baseStyle,
        color: '#ebd5b3',
        fontFamily: "'Pinyon Script', cursive",
        fontSize: 'clamp(5.5rem, 22vw, 14rem)',
        fontWeight: 'normal',
        textTransform: 'none' as const,
        textShadow: '0 0 30px rgba(253, 243, 225, 0.3), 0 10px 20px rgba(0,0,0,0.8)',
      };
    }
  };

  // "Entering" fades in 25-40 (after Experium fades out), fades out 55-70
  const word1Style = useMemo(() => getWordStyle(25, 40, 55, 70, 'entering-the'), [currentFrame]);
  
  // "The" fades in 70-80 (right after Entering fades out), fades out 105-115
  const word2Style = useMemo(() => getWordStyle(70, 80, 105, 115, 'entering-the'), [currentFrame]);
  
  // "World" starts right as garden scene begins (image 250 -> frame 136)
  const word3Style = useMemo(() => getWordStyle(140, 160, 230, 250, 'world'), [currentFrame]);

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
      
      {/* Background Dimming for Text Contrast */}
      <div style={{
        position: 'absolute',
        inset: '-20%',
        background: 'radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 60%)',
        opacity: experiumOpacity,
        pointerEvents: 'none',
        display: experiumOpacity > 0 ? 'block' : 'none'
      }} />

      {/* Brand Text - Phase 0 */}
      <h1 style={{
        position: 'absolute',
        fontFamily: "'Pinyon Script', cursive",
        fontSize: 'clamp(4.5rem, 20vw, 14rem)',
        margin: 0,
        opacity: experiumOpacity,
        transform: `translateY(${experiumTranslateY}px) scale(${experiumScale})`,
        background: 'linear-gradient(135deg, #ffffff 0%, #f0d5a3 30%, #d4af37 70%, #ffffff 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        color: 'transparent',
        filter: 'drop-shadow(0px 12px 24px rgba(0,0,0,0.7)) drop-shadow(0px 4px 8px rgba(0,0,0,0.8))',
        fontWeight: 'normal',
        willChange: 'transform, opacity',
        display: experiumOpacity > 0 ? 'block' : 'none',
        lineHeight: 1,
        padding: '20px' // Prevents shadow clipping
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

import React from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

interface TextStoryLayerProps {
  progress: number;
}

export const TextStoryLayer: React.FC<TextStoryLayerProps> = ({ progress }) => {
  const isMobile = useIsMobile();
  // We have 5 stages as requested by user.
  // We divide the progress 0.0 - 1.0 into 5 chunks (0.2 each).
  
  const numStages = 6;
  const stageDuration = 1 / numStages;

  const getStageStyle = (stageIndex: number) => {
    const startProgress = stageIndex * stageDuration;
    const endProgress = (stageIndex + 1) * stageDuration;
    
    // Active if we are in or near this stage
    const isActive = progress >= startProgress && progress <= endProgress;
    const localProgress = (progress - startProgress) / stageDuration; // 0.0 to 1.0 within this stage
    
    let opacity = 0;
    let transformY = 20; 
    let blur = 10;
    
    if (isActive) {
      if (localProgress < 0.2) {
        opacity = localProgress / 0.2;
        transformY = 20 * (1 - opacity);
        blur = 10 * (1 - opacity);
      } else if (localProgress > 0.8) {
        opacity = (1 - localProgress) / 0.2;
        transformY = -20 * (1 - opacity);
        blur = 10 * (1 - opacity);
      } else {
        opacity = 1;
        transformY = 0;
        blur = 0;
      }
    }
    
    return {
      opacity,
      transform: `translateY(${transformY}px)`,
      filter: `blur(${blur}px)`,
      display: opacity > 0 ? 'flex' : 'none',
      position: 'absolute' as const,
      flexDirection: 'column' as const,
      justifyContent: 'center',
      willChange: 'opacity, transform, filter',
      transition: 'opacity 0.1s, transform 0.1s, filter 0.1s',
    };
  };

  // Custom logic for Stage 0 ("Your Welcome To Club")
  const isStage0Active = progress <= stageDuration;
  const stage0LocalProgress = Math.max(0, progress / stageDuration);

  // "Your Welcome" is visible from the start, only fades out at the end of Stage 0
  let stage0Opacity = 0;
  if (isStage0Active) {
    if (stage0LocalProgress > 0.8) {
      stage0Opacity = (1 - stage0LocalProgress) / 0.2;
    } else {
      stage0Opacity = 1; 
    }
  }

  // "To Club" fades in normally between 0 and 0.2 of Stage 0
  let toClubOpacity = 0;
  let toClubTransformY = 20;
  if (isStage0Active) {
    if (stage0LocalProgress < 0.2) {
      toClubOpacity = stage0LocalProgress / 0.2;
      toClubTransformY = 20 * (1 - toClubOpacity);
    } else if (stage0LocalProgress > 0.8) {
      toClubOpacity = (1 - stage0LocalProgress) / 0.2;
      toClubTransformY = -20 * (1 - toClubOpacity);
    } else {
      toClubOpacity = 1;
      toClubTransformY = 0;
    }
  }

  // Determine which side the text should be on.
  const isTextRight = progress < 0.5;

  // Mobile: the character occupies the lower half of the screen, so the text
  // lives full-width in the upper half instead of alternating left/right.
  const containerStyle: React.CSSProperties = isMobile
    ? {
        position: 'absolute',
        top: '9%',
        bottom: '52%',
        width: '88%',
        left: '6%',
        right: 'auto',
        display: 'flex',
        alignItems: 'center',
        zIndex: 10
      }
    : {
        position: 'absolute',
        top: '10%',
        bottom: '10%',
        width: '40%',
        left: isTextRight ? 'auto' : '10%',
        right: isTextRight ? '10%' : 'auto',
        transition: 'left 1s ease, right 1s ease, opacity 0.1s linear',
        display: 'flex',
        alignItems: 'center',
        zIndex: 10
      };

  const headingWrapperStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    marginBottom: '1.5rem'
  };

  const textHeadingStyle = {
    fontSize: isMobile ? 'clamp(1.6rem, 7vw, 2.2rem)' : 'clamp(2rem, 4vw, 4rem)',
    fontWeight: 300,
    letterSpacing: '-2px',
    textTransform: 'uppercase' as const,
    color: 'var(--text-dark)',
    margin: 0,
  };

  const scriptStyle = {
    fontSize: isMobile ? 'clamp(2.8rem, 13vw, 4rem)' : 'clamp(4rem, 8vw, 9rem)',
    margin: 0,
    lineHeight: 0.7,
    color: 'var(--text-dark)',
    marginLeft: isMobile ? '12px' : '20px',
    whiteSpace: 'nowrap' as const,
  };

  const textBodyStyle = {
    fontFamily: 'system-ui, sans-serif',
    fontSize: isMobile ? '0.95rem' : 'clamp(1rem, 1.2vw, 1.2rem)',
    lineHeight: 1.6,
    color: '#333',
    maxWidth: '400px'
  };

  return (
    <div style={containerStyle}>
      {/* STAGE 1: Your Welcome To Club */}
      <div style={{
        opacity: stage0Opacity,
        transform: `translateY(${stage0LocalProgress > 0.8 ? -20 * (1 - stage0Opacity) : 0}px)`,
        display: stage0Opacity > 0 ? 'flex' : 'none',
        position: 'absolute' as const,
        flexDirection: 'column' as const,
        justifyContent: 'center',
        willChange: 'opacity, transform',
        transition: 'opacity 0.1s, transform 0.1s',
      }}>
        <div style={headingWrapperStyle}>
          <h2 style={textHeadingStyle}>Your Welcome</h2>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            opacity: toClubOpacity,
            transform: `translateY(${toClubTransformY}px)`,
            willChange: 'opacity, transform',
            transition: 'opacity 0.1s, transform 0.1s',
            marginTop: '10px'
          }}>
            <h2 style={textHeadingStyle}>To</h2>
            <h3 className="script-font" style={scriptStyle}>Club</h3>
          </div>
        </div>
      </div>

      {/* STAGE 2 */}
      <div style={getStageStyle(1)}>
        <div style={headingWrapperStyle}>
          <h2 style={textHeadingStyle}>The Journey</h2>
          <h3 className="script-font" style={scriptStyle}>Begins</h3>
        </div>
        <p style={textBodyStyle}>Step into a world crafted for the extraordinary. Every detail is meticulously designed to elevate your lifestyle.</p>
      </div>

      {/* STAGE 3 */}
      <div style={getStageStyle(2)}>
        <div style={headingWrapperStyle}>
          <h2 style={textHeadingStyle}>Unrivaled</h2>
          <h3 className="script-font" style={scriptStyle}>Comfort</h3>
        </div>
        <p style={textBodyStyle}>Experience spaces that breathe. We prioritize architectural harmony that connects you with nature seamlessly.</p>
      </div>

      {/* STAGE 4 */}
      <div style={getStageStyle(3)}>
        <div style={headingWrapperStyle}>
          <h2 style={textHeadingStyle}>Exclusive</h2>
          <h3 className="script-font" style={scriptStyle}>Community</h3>
        </div>
        <p style={textBodyStyle}>Join a network of visionary individuals. A private members club where privacy meets prestige.</p>
      </div>

      {/* STAGE 5 */}
      <div style={getStageStyle(4)}>
        <div style={headingWrapperStyle}>
          <h2 style={textHeadingStyle}>Curated</h2>
          <h3 className="script-font" style={scriptStyle}>Amenities</h3>
        </div>
        <p style={textBodyStyle}>From world-class dining to bespoke wellness centers, everything you need is just steps away.</p>
      </div>

      {/* STAGE 6 */}
      <div style={getStageStyle(5)}>
        <div style={headingWrapperStyle}>
          <h2 style={textHeadingStyle}>Welcome</h2>
          <h3 className="script-font" style={scriptStyle}>Home</h3>
        </div>
        <p style={textBodyStyle}>Your sanctuary awaits. Embrace the Experium way of living today.</p>
      </div>
    </div>
  );
};

import React, { useRef, useCallback, useState, useEffect } from 'react';
import { CinematicFrameSequence } from '../hero/CinematicFrameSequence';

export const FinalCardSequenceSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [, setCurrentFrame] = useState(1);
  const [progress, setProgress] = useState(0);

  // Track scroll progress for the final fade
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const rect = scrollContainerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollableDistance = rect.height - viewportHeight;
      const scrolled = -rect.top;
      
      let p = scrolled / scrollableDistance;
      p = Math.max(0, Math.min(1, p));
      setProgress(p);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getFramePath = useCallback((index: number) => {
    const paddedIndex = index.toString().padStart(3, '0');
    return `/final-section-frames/ezgif-frame-${paddedIndex}.jpg`;
  }, []);

  // Fade to beige starts at progress 0.75
  const beigeOpacity = progress < 0.75 ? 0 : Math.min(1, (progress - 0.75) / 0.15);

  return (
    <section 
      ref={scrollContainerRef} 
      style={{ 
        height: '600vh', 
        position: 'relative',
        backgroundColor: '#000',
        zIndex: 1
      }}
    >
      <div style={{
        position: 'sticky',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        overflow: 'hidden'
      }}>
        <div style={{ 
          position: 'absolute', 
          inset: 0,
          opacity: 1 - beigeOpacity // Fade out the frame sequence
        }}>
          <CinematicFrameSequence 
            totalFrames={240} 
            scrollContainerRef={scrollContainerRef}
            pathTemplate={getFramePath}
            onFrameChange={setCurrentFrame}
          />
        </div>

        {/* Intro Text Overlay (Visible early in the sequence) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 15,
          opacity: progress < 0.3 ? 1 : progress < 0.45 ? 1 - (progress - 0.3) / 0.15 : 0,
          transform: `translateY(${-(progress * 150)}px)`,
          transition: 'opacity 0.1s linear'
        }}>
          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(3rem, 6vw, 6rem)',
            fontWeight: 400,
            color: '#fdf3e1',
            textTransform: 'uppercase',
            letterSpacing: 'clamp(3px, 1.2vw, 8px)',
            margin: '0 0 20px 0',
            textShadow: '0 10px 30px rgba(0,0,0,0.8)',
            textAlign: 'center',
            padding: '0 16px'
          }}>
            The Invitation
          </h2>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 'clamp(0.85rem, 2.5vw, 1.2rem)',
            color: 'rgba(253, 243, 225, 0.8)',
            letterSpacing: 'clamp(2px, 0.8vw, 4px)',
            textTransform: 'uppercase',
            maxWidth: '600px',
            textAlign: 'center',
            lineHeight: 1.6,
            textShadow: '0 4px 10px rgba(0,0,0,0.8)',
            padding: '0 24px'
          }}>
            An exclusive symbol of prestige. Reserved only for the visionary few.
          </p>
        </div>
        
        {/* Beige Background Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#fdf3e1',
          opacity: beigeOpacity,
          pointerEvents: 'none',
          zIndex: 10
        }} />

        {/* Final Card Layout Stage */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 20, 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: beigeOpacity,
          pointerEvents: progress > 0.75 ? 'auto' : 'none'
        }}>
          {/* Background EXPERIUM text */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '15vw',
            fontFamily: "'Cinzel', serif",
            fontWeight: 700,
            color: 'rgba(0, 0, 0, 0.05)',
            letterSpacing: '1vw',
            zIndex: -1,
            whiteSpace: 'nowrap'
          }}>
            EXPERIUM
          </div>

          <div className="final-stage" style={{
            display: 'flex',
            width: '80%',
            height: '80%',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* Card on Left */}
            <div className="final-card-col" style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transform: `translateY(${Math.sin(progress * Math.PI * 10) * 10}px)`,
            }}>
              <h2 style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '2rem',
                fontWeight: 600,
                color: '#000',
                marginBottom: '2rem',
                letterSpacing: '4px'
              }}>
                EXPERIUM
              </h2>
              <img 
                src="/images/card-experium.png" 
                alt="Experium Card" 
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))'
                }}
              />
            </div>

            {/* Info on Right */}
            <div className="final-info-col" style={{
              flex: 1,
              paddingLeft: '4rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <h3 style={{
                fontSize: 'clamp(2.5rem, 4vw, 4rem)',
                fontWeight: 300,
                letterSpacing: '-1px',
                textTransform: 'uppercase',
                color: 'var(--text-dark)',
                marginBottom: '1rem',
                lineHeight: 1.1
              }}>
                Join The <br/>
                <span className="script-font" style={{ fontSize: '1.2em', textTransform: 'none', marginLeft: '10px' }}>Club Now</span>
              </h3>
              
              <div className="final-divider" style={{
                width: '50px',
                height: '2px',
                backgroundColor: 'var(--text-dark)',
                marginBottom: '2rem'
              }} />

              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '1.2rem',
                lineHeight: 1.6,
                color: '#333',
                marginBottom: '2rem',
                maxWidth: '400px'
              }}>
                Unlock a world of unparalleled luxury. The Experium Card is your key to exclusive experiences, bespoke services, and a community of visionaries.
              </p>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '1.1rem',
                color: '#444'
              }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#000' }}>✦</span> Priority access to global events
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#000' }}>✦</span> Dedicated 24/7 concierge service
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#000' }}>✦</span> Exclusive partner benefits
                </li>
              </ul>
              
              <button style={{
                marginTop: '3rem',
                padding: '1rem 3rem',
                backgroundColor: '#000',
                color: '#fdf3e1',
                border: 'none',
                fontFamily: "'Montserrat', sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                width: 'fit-content',
                transition: 'background-color 0.3s'
              }}>
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import { restoreSavedScroll } from '../utils/scrollRestore';

export const Preloader: React.FC = () => {
  const [isMorphing, setIsMorphing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // 2.5 second loading sequence, then start morphing
    const timer = setTimeout(() => {
      setIsMorphing(true);
      document.body.style.overflow = 'auto';

      // Put the page back where it was reloaded. Done here, while the curtain
      // still covers the viewport, so the jump is never visible.
      restoreSavedScroll();

      // 1.2 seconds for the morph animation to complete
      setTimeout(() => {
        setIsComplete(true);
      }, 1200); 
    }, 2500);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (isComplete) return null;

  return (
    <>
      {/* The Black Curtain */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000',
        zIndex: 999998,
        transition: 'transform 1.2s cubic-bezier(0.77, 0, 0.175, 1), border-radius 1.2s cubic-bezier(0.77, 0, 0.175, 1)',
        transform: isMorphing ? 'translateY(-100%)' : 'translateY(0)',
        borderBottomLeftRadius: isMorphing ? '50%' : '0%',
        borderBottomRightRadius: isMorphing ? '50%' : '0%',
        pointerEvents: 'none'
      }} />

      {/* The Morphing Logo */}
      <div style={{
        position: 'fixed',
        // Start centered, end at header position (approx top 30px, centered horizontally)
        // Wait, Header padding is 30px, so top edge of the text is at 30px.
        top: isMorphing ? '30px' : '50%',
        left: '50%',
        // When morphing, we translate only -50% on X because we want the top edge to be at 30px.
        // Before morphing, we translate -50%, -50% to perfectly center it on screen.
        transform: isMorphing ? 'translateX(-50%)' : 'translate(-50%, -50%)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        // Coordinate the movement with the curtain
        transition: 'top 1.2s cubic-bezier(0.77, 0, 0.175, 1), transform 1.2s cubic-bezier(0.77, 0, 0.175, 1)'
      }}>
        <h1 style={{
          fontFamily: "'Cinzel', serif",
          margin: 0,
          textTransform: 'uppercase',
          color: '#fdf3e1', // Always use the beige color while morphing so it stands out against the black curtain sliding up
          
          // Animate from large preloader size to small header size
          fontSize: isMorphing ? '1.5rem' : 'clamp(2rem, 5vw, 4rem)',
          fontWeight: isMorphing ? 400 : 300,
          letterSpacing: isMorphing ? '6px' : '15px',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          
          transition: 'all 1.2s cubic-bezier(0.77, 0, 0.175, 1)',
          animation: isMorphing ? 'none' : 'preloaderPulse 2s infinite alternate, preloaderTrack 2.5s ease-out forwards'
        }}>
          Experium
        </h1>
      </div>
      
      <style>
        {`
          @keyframes preloaderPulse {
            0% { filter: blur(1px) brightness(0.8); }
            100% { filter: blur(0px) brightness(1.2); }
          }
          @keyframes preloaderTrack {
            0% { letter-spacing: 15px; }
            100% { letter-spacing: 20px; }
          }
        `}
      </style>
    </>
  );
};

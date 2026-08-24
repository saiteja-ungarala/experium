import React, { useState, useEffect } from 'react';

export const Header: React.FC = () => {
  const [logoReady, setLogoReady] = useState(false);

  useEffect(() => {
    // The Preloader takes 2500ms to load + 1200ms to morph.
    // So the Header logo should appear exactly at 3700ms when the Preloader unmounts.
    const timer = setTimeout(() => {
      setLogoReady(true);
    }, 3700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="site-header" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      padding: '30px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 9999, // Needs to be above everything, even sticky containers
      pointerEvents: 'none', // Let clicks pass through empty space
      mixBlendMode: 'difference', // Ensures visibility on both light and dark backgrounds
      color: '#fff' // Will invert to black on light backgrounds
    }}>
      {/* Left side placeholder for balance (e.g., Menu) */}
      <div style={{ flex: 1, pointerEvents: 'auto' }}>
        <button className="header-btn" style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          cursor: 'pointer'
        }}>
          Menu
        </button>
      </div>

      {/* Center Logo */}
      <div className="header-logo" style={{
        flex: 1,
        textAlign: 'center',
        pointerEvents: 'auto',
        opacity: logoReady ? 1 : 0 // Invisible until the Preloader morphs into place and hands off
      }}>
        <h1 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '1.5rem',
          fontWeight: 400,
          margin: 0,
          letterSpacing: '6px',
          textTransform: 'uppercase'
        }}>
          Experium
        </h1>
      </div>

      {/* Right side placeholder for balance (e.g., Apply) */}
      <div style={{ flex: 1, textAlign: 'right', pointerEvents: 'auto' }}>
        <button 
          className="header-btn" 
          onClick={() => window.dispatchEvent(new Event('open-registration'))}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            cursor: 'pointer',
            padding: '10px 15px'
          }}
        >
          Register Now
        </button>
      </div>
    </header>
  );
};

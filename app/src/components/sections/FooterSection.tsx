import React from 'react';

export const FooterSection: React.FC = () => {
  return (
    <section style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#000' }}>
      {/* Background Image */}
      <img 
        src="/images/footer-bg.avif" 
        alt="Experium Footer Background" 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          objectPosition: 'center bottom', // Anchor the image to the bottom so mountains look grounded
          opacity: 0.8
        }} 
      />
      
      <div style={{
        position: 'absolute',
        inset: 0,
        // Softer, more elegant gradient that allows the stars to shine through
        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        color: '#fdf3e1', // Theme beige color
        padding: '60px 40px'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '10vh' }}>
          <div style={{ 
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '0.9rem', 
            textTransform: 'uppercase', 
            letterSpacing: '6px',
            marginBottom: '30px',
            fontWeight: 300,
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}>
            Your Escape Starts Here
          </div>
          <button style={{ 
            background: 'rgba(253, 243, 225, 0.1)', 
            color: '#fdf3e1', 
            border: '1px solid rgba(253, 243, 225, 0.5)', 
            padding: '16px 48px', 
            borderRadius: '0', // Sleeker, sharp edges for luxury feel
            fontSize: '0.85rem',
            fontFamily: "'Montserrat', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '3px',
            cursor: 'pointer',
            transition: 'all 0.4s ease',
            backdropFilter: 'blur(5px)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(253, 243, 225, 1)';
            e.currentTarget.style.color = '#000';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(253, 243, 225, 0.1)';
            e.currentTarget.style.color = '#fdf3e1';
          }}
          >
            Apply for the club
          </button>
        </div>

        {/* Massive Typography */}
        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
          <h2 style={{ 
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(5rem, 15vw, 18rem)', 
            fontWeight: 400, 
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            margin: 0,
            lineHeight: 0.85,
            color: 'rgba(253, 243, 225, 0.9)',
            textShadow: '0 10px 30px rgba(0,0,0,0.8)'
          }}>
            Experium
          </h2>
        </div>

        {/* Footer Links */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          fontSize: '0.7rem', 
          fontFamily: "'Montserrat', sans-serif",
          textTransform: 'uppercase', 
          letterSpacing: '3px',
          marginTop: '60px',
          opacity: 0.7,
          borderTop: '1px solid rgba(253, 243, 225, 0.2)',
          paddingTop: '30px'
        }}>
          <span>© 2026 Experium Club</span>
          <div style={{ display: 'flex', gap: '40px' }}>
            <span style={{ cursor: 'pointer' }}>Terms & Conditions</span>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
          </div>
        </div>

      </div>
    </section>
  );
};

import React from 'react';

export const LocationSection: React.FC = () => {
  return (
    <section className="container" style={{ padding: '150px 40px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: '800px', display: 'flex', alignItems: 'center' }}>
        
        {/* Overlapping Text */}
        <div style={{ 
          position: 'absolute', 
          left: '-10%', 
          zIndex: 2,
          display: 'flex',
          alignItems: 'baseline'
        }}>
          <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px', marginRight: '20px', transform: 'translateY(-40px)' }}>It awaits you in</span>
          <h3 style={{ 
            fontSize: 'clamp(3rem, 6vw, 6rem)', 
            fontWeight: 300, 
            letterSpacing: '-2px',
            margin: 0,
            display: 'flex',
            alignItems: 'center'
          }}>
            <span className="script-font" style={{ fontSize: '1.5em', marginRight: '10px', transform: 'translateY(10px)' }}>U</span>
            nited states based
          </h3>
        </div>

        {/* Image Box */}
        <div style={{ marginLeft: 'auto', width: '400px', height: '500px', position: 'relative' }}>
          <img 
            src="https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=800&auto=format&fit=crop" 
            alt="Yacht from above" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <div style={{ 
            position: 'absolute', 
            bottom: '-40px', 
            left: 0, 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'space-between',
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            <span>[United States]</span>
            <span style={{ fontSize: '1.2rem' }}>⟶</span>
          </div>
        </div>

      </div>
    </section>
  );
};

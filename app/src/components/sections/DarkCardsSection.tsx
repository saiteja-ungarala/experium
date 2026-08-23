import React from 'react';

export const DarkCardsSection: React.FC = () => {
  return (
    <section className="container" style={{ padding: '80px 40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Card 1: Haven */}
        <div className="section-dark" style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '300px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.7 }}>
            <span>Private</span>
            <span>Unprecedented Access</span>
            <span>Wilderness</span>
          </div>
          
          <h3 style={{ fontSize: '5rem', fontWeight: 300, margin: '40px 0', display: 'flex', alignItems: 'center' }}>
            <span className="script-font" style={{ fontSize: '1.5em', marginRight: '5px', transform: 'translateY(5px)' }}>H</span>
            aven
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <span>Feature</span>
              <span>Golf, Tennis, Spa</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>VIEW PACKAGE</span>
              <span style={{ fontSize: '1.2rem' }}>⟶</span>
            </div>
          </div>
        </div>

        {/* Card 2: Estate */}
        <div className="section-dark" style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '300px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.7 }}>
            <span>Private</span>
            <span>Unprecedented Access</span>
            <span>Wilderness</span>
            <span>02</span>
          </div>
          
          <h3 style={{ fontSize: '5rem', fontWeight: 300, margin: '40px 0', display: 'flex', alignItems: 'center' }}>
            <span className="script-font" style={{ fontSize: '1.5em', marginRight: '5px', transform: 'translateY(5px)' }}>E</span>
            state
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <span>Feature</span>
              <span>Golf, Tennis, Spa, Equestrian, Yachting</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>VIEW PACKAGE</span>
              <span style={{ fontSize: '1.2rem' }}>⟶</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

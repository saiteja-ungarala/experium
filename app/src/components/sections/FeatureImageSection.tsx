import React from 'react';

export const FeatureImageSection: React.FC = () => {
  return (
    <section style={{ width: '100%', height: '80vh', position: 'relative' }}>
      <img 
        src="https://images.unsplash.com/photo-1593111774240-d529f12cb416?q=80&w=2000&auto=format&fit=crop" 
        alt="Golfer at sunset" 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
      />
      
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.2)', // Slight overlay
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
      }}>
        <p style={{ 
          fontSize: '0.8rem', 
          textTransform: 'uppercase', 
          letterSpacing: '2px', 
          marginBottom: '20px',
          textAlign: 'center',
          maxWidth: '300px',
          lineHeight: 1.6
        }}>
          The ultimate destination for those who seek the extraordinary.
        </p>
        
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          fontSize: '0.7rem', 
          textTransform: 'uppercase', 
          letterSpacing: '1px',
          border: '1px solid rgba(255,255,255,0.5)',
          padding: '10px 30px',
          borderRadius: '30px'
        }}>
          <span>Watch</span>
          <span>•</span>
          <span>The</span>
          <span>•</span>
          <span>Film</span>
        </div>
      </div>
    </section>
  );
};

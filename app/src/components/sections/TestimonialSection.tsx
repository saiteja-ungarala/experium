import React from 'react';

export const TestimonialSection: React.FC = () => {
  return (
    <section className="container" style={{ padding: '120px 40px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '80px', alignItems: 'center' }}>
        
        {/* Image */}
        <div style={{ width: '300px', height: '400px', overflow: 'hidden' }}>
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop" 
            alt="Testimonial portrait" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>

        {/* Text */}
        <div style={{ maxWidth: '400px' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '20px', letterSpacing: '4px' }}>
            ★★★★★
          </div>
          <p style={{ 
            fontSize: '1.4rem', 
            fontWeight: 300, 
            lineHeight: 1.4, 
            margin: '0 0 30px 0',
            letterSpacing: '-0.5px'
          }}>
            "Elysian Club has completely transformed our weekends—the perfect balance of relaxation, sport, and nature. Every visit feels special."
          </p>
          <div style={{ 
            fontSize: '0.7rem', 
            textTransform: 'uppercase', 
            letterSpacing: '2px', 
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <span>JULIA ADAMS</span>
            <span style={{ fontSize: '1.2rem' }}>⟶</span>
          </div>
        </div>

      </div>
    </section>
  );
};

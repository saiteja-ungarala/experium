import React, { useState, useEffect } from 'react';

export const RegistrationModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-registration', handleOpen);
    return () => window.removeEventListener('open-registration', handleOpen);
  }, []);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999, // Super high to cover everything
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(10px)',
      padding: '20px',
      animation: 'fadeIn 0.4s ease-out'
    }}>
      
      {/* Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(10px); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Close Background Area */}
      <div 
        style={{ position: 'absolute', inset: 0, cursor: 'pointer' }}
        onClick={() => setIsOpen(false)}
      />

      {/* Modal Container */}
      <div style={{
        maxWidth: '850px',
        width: '95%',
        backgroundColor: 'rgba(20, 20, 20, 0.85)',
        border: '1px solid rgba(253, 243, 225, 0.15)',
        borderRadius: '24px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
        position: 'relative',
        animation: 'slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        
        {/* Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: '#fff',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            transition: 'background 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          ✕
        </button>

        {/* Left Side: Aspirational Message */}
        <div style={{
          flex: '1 1 300px',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle Ambient Glow */}
          <div style={{
            position: 'absolute',
            top: '-30%',
            left: '-30%',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(17,17,17,0) 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none'
          }} />

          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 400,
            marginBottom: '15px',
            lineHeight: 1.2,
            background: 'linear-gradient(135deg, #ffffff 0%, #ebd5b3 50%, #d4af37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent',
            position: 'relative'
          }}>
            Begin Your <br/> Experium Journey
          </h2>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '0.9rem',
            lineHeight: 1.5,
            color: 'rgba(253, 243, 225, 0.7)',
            marginBottom: '30px',
            position: 'relative'
          }}>
            Register your interest to connect with our luxury concierges and design your bespoke escape.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', position: 'relative' }}>
            <img 
              src="/assets/ai-chatbot.png" 
              alt="Concierge" 
              style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(212, 175, 55, 0.5)' }} 
            />
            <div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>Speak to an Expert</div>
              <div style={{ fontFamily: 'system-ui, sans-serif', color: 'rgba(253, 243, 225, 0.6)', fontSize: '0.75rem' }}>Usually replies within 24 hours</div>
            </div>
          </div>
        </div>

        {/* Right Side: The Form */}
        <div style={{
          flex: '1 1 350px',
          padding: '40px',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <form 
            onSubmit={(e) => e.preventDefault()} 
            style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
          >
            <div style={{ display: 'flex', gap: '15px' }}>
              <input 
                type="text" 
                placeholder="First Name" 
                style={{ ...inputStyle, flex: 1 }} 
              />
              <input 
                type="text" 
                placeholder="Last Name" 
                style={{ ...inputStyle, flex: 1 }} 
              />
            </div>
            <input 
              type="email" 
              placeholder="Email Address" 
              style={inputStyle} 
            />
            <input 
              type="tel" 
              placeholder="Phone Number (Optional)" 
              style={inputStyle} 
            />
            <select style={{...inputStyle, appearance: 'none', cursor: 'pointer', color: 'rgba(253, 243, 225, 0.7)'}}>
              <option value="">Preferred Experience</option>
              <option value="garden">The Secret Garden</option>
              <option value="ocean">The Sapphire Ocean</option>
              <option value="mountain">The Alpine Retreat</option>
            </select>

            <button 
              type="submit"
              onClick={() => setIsOpen(false)}
              style={{
                marginTop: '10px',
                padding: '14px 24px',
                backgroundColor: '#ebd5b3',
                color: '#111',
                border: 'none',
                borderRadius: '8px',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease, transform 0.3s ease',
                boxShadow: '0 4px 15px rgba(235, 213, 179, 0.2)',
                alignSelf: 'flex-start'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#d4af37';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ebd5b3';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Request Consultation
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  border: '1px solid rgba(253, 243, 225, 0.1)',
  borderRadius: '6px',
  color: '#fdf3e1',
  fontFamily: 'system-ui, sans-serif',
  fontSize: '0.85rem',
  outline: 'none',
  transition: 'border-color 0.3s ease, background-color 0.3s ease',
  boxSizing: 'border-box'
};

import React, { useState, useEffect } from 'react';

export const FloatingWidgets: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  // Show bubble briefly after expanding to draw attention
  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => setShowBubble(true), 600);
      return () => clearTimeout(timer);
    } else {
      setShowBubble(false);
    }
  }, [isExpanded]);

  const openRegistration = () => {
    window.dispatchEvent(new Event('open-registration'));
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '20px',
      zIndex: 1000,
      pointerEvents: 'none'
    }}>
      
      {/* Expanded State container */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '20px',
        opacity: isExpanded ? 1 : 0,
        transform: isExpanded ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.9)',
        pointerEvents: isExpanded ? 'auto' : 'none',
        transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transformOrigin: 'bottom right'
      }}>
        
        {/* WhatsApp Floating Button */}
        <a 
          href="#whatsapp" 
          style={{
            width: '56px',
            height: '56px',
            backgroundColor: '#25D366',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
            cursor: 'pointer',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            marginRight: '12px' // align with chatbot
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(37, 211, 102, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 211, 102, 0.4)';
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>

        {/* AI Chatbot Expert Card */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* Speech Bubble */}
          <div style={{
            backgroundColor: '#fff',
            color: '#333',
            padding: '12px 24px',
            borderRadius: '24px 24px 0px 24px',
            fontSize: '14px',
            fontWeight: '600',
            fontFamily: 'system-ui, sans-serif',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            marginBottom: '15px',
            position: 'relative',
            cursor: 'pointer',
            border: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            opacity: showBubble ? 1 : 0,
            transform: showBubble ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 0.4s ease'
          }}
          onClick={openRegistration}
          >
            Talk to Our Experts !
            <div style={{
              position: 'absolute',
              bottom: '-8px',
              right: '20px',
              width: '16px',
              height: '16px',
              backgroundColor: '#fff',
              borderBottom: '1px solid #e0e0e0',
              borderRight: '1px solid #e0e0e0',
              transform: 'rotate(45deg)',
            }} />
          </div>

          {/* Expert Avatar Card */}
          <div 
            onClick={openRegistration}
            style={{
              width: '180px',
              height: '240px',
              borderRadius: '20px',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            {/* The Image (Updated to requested ai-chatbot.png) */}
            <img 
              src="/assets/ai-chatbot.png" 
              alt="AI Assistant" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />

            {/* Talk to Expert Overlay Button */}
            <div style={{
              position: 'absolute',
              bottom: '15px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(20, 20, 20, 0.8)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              padding: '10px 16px',
              borderRadius: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: '600',
              fontFamily: 'system-ui, sans-serif',
              whiteSpace: 'nowrap',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
              AI Assistant
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Base Button (Toggle) */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          pointerEvents: 'auto',
          backgroundColor: '#ebd5b3', // Signature beige/gold color
          color: '#111',
          padding: '12px 24px',
          borderRadius: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          fontFamily: 'system-ui, sans-serif',
          fontWeight: '600',
          fontSize: '14px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.4)',
          transition: 'all 0.3s ease',
          marginRight: '0' // Moved right as requested
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d4af37'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ebd5b3'; }}
      >
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: '#111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ebd5b3',
          transition: 'transform 0.4s ease',
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
        }}>
          {isExpanded ? '✕' : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>}
        </div>
        {isExpanded ? "Close" : "Talk To Expert"}
      </div>

    </div>
  );
};

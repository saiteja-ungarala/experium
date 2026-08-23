import React, { useRef, useState, useEffect } from 'react';

const COLLECTION = [
  {
    subtitle: 'THE ARCHITECTURE',
    title: 'Estates',
    description: 'Modern masterpieces of private living. Overlooking the ocean, these villas offer absolute privacy, infinity pools, and warm, cinematic evenings.',
    img: '/images/villa_architecture.jpg',
    theme: 'light' // Blends with EscapeCardsSection above (#fdf3e1)
  },
  {
    subtitle: 'THE SERVICE',
    title: 'Concierge',
    description: 'Seamless travel and ground transport. From private jet charters to luxury chauffeur vehicles waiting outside high-end hotels, we handle every detail.',
    img: '/images/luxury_concierge.jpg',
    theme: 'dark' // Transitions to dark (#000000)
  },
  {
    subtitle: 'THE COMMUNITY',
    title: 'Events',
    description: 'Elite networking in grand historic ballrooms. Join an exclusive masquerade or high-end gala, where luxury formal wear meets cinematic lighting.',
    img: '/images/exclusive_gala.jpg',
    theme: 'dark' // #1a1a1a
  }
];

export const ExperiumCollectionSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate how much is scrollable within this container
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

  // Determine current active panel for background color transitions
  const activeIndex = Math.min(2, Math.floor(progress * 3));
  const currentTheme = COLLECTION[activeIndex]?.theme || 'dark';
  
  // Background colors
  const darkBg = '#000000';
  const lightBg = '#fdf3e1';
  
  const bgColor = currentTheme === 'dark' ? darkBg : lightBg;
  const textColor = currentTheme === 'dark' ? lightBg : darkBg;

  // Horizontal translation percentage based on scroll progress
  // progress 0 -> translate 0
  // progress 1 -> translate -66.666% (to show the 3rd panel)
  const translateX = -(progress * 66.666);

  return (
    <section 
      ref={containerRef} 
      style={{ 
        height: '400vh', 
        position: 'relative',
        backgroundColor: bgColor,
        color: textColor,
        transition: 'background-color 0.8s ease, color 0.8s ease'
      }}
    >
      <div style={{
        position: 'sticky',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex'
      }}>
        
        {/* Horizontal Scrolling Track */}
        <div style={{
          display: 'flex',
          height: '100%',
          width: '300vw', // 3 panels * 100vw
          transform: `translateX(${translateX}%)`,
          willChange: 'transform'
        }}>
          
          {COLLECTION.map((item, idx) => {
            
            // Calculate local parallax for the image inside each panel
            // When panel is exactly in view, localProgress = 0
            // When panel is entering from right, localProgress = 1
            // When panel is exiting to left, localProgress = -1
            const panelCenterProgress = idx * 0.5; // 0, 0.5, 1.0
            const diff = progress - panelCenterProgress; 
            
            // Subtle parallax effect on the image
            const imageX = diff * 50; // pixels

            return (
              <div 
                key={idx} 
                style={{ 
                  width: '100vw', 
                  height: '100vh', 
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 10vw'
                }}
              >
                
                {/* Text Content */}
                <div style={{ 
                  flex: 1, 
                  paddingRight: '5vw',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    fontFamily: "'Montserrat', sans-serif",
                    textTransform: 'uppercase', 
                    letterSpacing: '4px',
                    marginBottom: '20px',
                    opacity: 0.8
                  }}>
                    {item.subtitle}
                  </div>
                  <h2 style={{ 
                    fontFamily: "'Cinzel', serif",
                    fontSize: 'clamp(4rem, 8vw, 8rem)', 
                    fontWeight: 300, 
                    margin: '0 0 40px 0',
                    lineHeight: 1
                  }}>
                    {item.title}
                  </h2>
                  <p style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '1.2rem',
                    lineHeight: 1.6,
                    maxWidth: '400px',
                    opacity: 0.9,
                    fontWeight: 300
                  }}>
                    {item.description}
                  </p>
                  
                  <div style={{
                    marginTop: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    cursor: 'pointer',
                    fontFamily: "'Montserrat', sans-serif",
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    fontSize: '0.8rem'
                  }}>
                    <span>Explore</span>
                    <span style={{ fontSize: '1.5rem', transition: 'transform 0.3s' }} className="arrow-hover">⟶</span>
                  </div>
                </div>

                {/* Image Reveal Box */}
                <div style={{
                  flex: 1,
                  height: '60vh',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    style={{ 
                      width: '120%', // Wider to allow parallax
                      height: '100%', 
                      objectFit: 'cover',
                      position: 'absolute',
                      left: '-10%',
                      transform: `translateX(${imageX}px)`,
                      filter: 'brightness(0.9)',
                      transition: 'transform 0.1s linear'
                    }} 
                  />
                </div>
                
              </div>
            );
          })}
          
        </div>
      </div>
    </section>
  );
};

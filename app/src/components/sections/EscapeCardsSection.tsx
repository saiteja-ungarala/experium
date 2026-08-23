import React, { useRef, useState, useEffect } from 'react';

const CARDS = [
  {
    num: '01',
    category: 'Epicurean',
    title: 'Culinary\nExcellence',
    desc1: 'Exclusive',
    desc2: 'Michelin-starred private dining.',
    desc3: 'Curated',
    desc4: 'Bespoke menus by global master chefs.',
    img: '/images/club_dining.jpg'
  },
  {
    num: '02',
    category: 'Voyage',
    title: 'Global\nAccess',
    desc1: 'Exclusive',
    desc2: 'Unrestricted private aviation services.',
    desc3: 'Curated',
    desc4: 'Seamless, luxurious travel anywhere.',
    img: '/images/private_jet.jpg'
  },
  {
    num: '03',
    category: 'Sanctuary',
    title: 'Holistic\nWellness',
    desc1: 'Exclusive',
    desc2: 'World-class spa and rejuvenation.',
    desc3: 'Curated',
    desc4: 'Personalized wellness programs.',
    img: '/images/luxury_spa.jpg'
  }
];

export const EscapeCardsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
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

  // Determine active index based on progress (0 to 1 split into 3 segments)
  const activeIndex = Math.min(2, Math.floor(progress * 3));

  return (
    <section 
      ref={containerRef} 
      style={{ 
        height: '400vh', 
        backgroundColor: '#fdf3e1', 
        position: 'relative'
      }}
    >
      <div style={{
        position: 'sticky',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        padding: '0 5vw'
      }}>
        
        {/* Left Content Column */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          height: '100%'
        }}>
          {CARDS.map((card, idx) => {
            // Active state
            const isActive = idx === activeIndex;
            // Calculate local progress for parallax/fade
            // idx=0: progress 0 to 0.33
            // idx=1: progress 0.33 to 0.66
            // idx=2: progress 0.66 to 1.0
            const startProgress = idx * 0.33;
            const endProgress = (idx + 1) * 0.33;

            // Fading logic: fade in fast, stay, fade out fast
            let opacity = 0;
            let translateY = 20;
            if (isActive) {
              opacity = 1;
              translateY = 0;
            } else if (progress < startProgress && idx === activeIndex + 1) {
              // Coming up next
              opacity = 0;
              translateY = 50;
            } else if (progress > endProgress && idx === activeIndex - 1) {
              // Just passed
              opacity = 0;
              translateY = -50;
            }

            return (
              <div 
                key={idx} 
                style={{ 
                  position: 'absolute',
                  top: '50%',
                  transform: `translateY(calc(-50% + ${translateY}px))`,
                  opacity: opacity,
                  transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  pointerEvents: isActive ? 'auto' : 'none',
                  width: '80%'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                  <div>
                    <span style={{ 
                      fontSize: '0.8rem', 
                      textTransform: 'uppercase', 
                      letterSpacing: '3px',
                      fontFamily: "'Montserrat', sans-serif"
                    }}>
                      {card.category}
                    </span>
                    <h4 style={{ 
                      margin: '15px 0 0 0', 
                      fontSize: 'clamp(2rem, 4vw, 4rem)', 
                      whiteSpace: 'pre-line', 
                      fontWeight: 300,
                      fontFamily: "'Cinzel', serif",
                      lineHeight: 1.1,
                      color: '#000'
                    }}>
                      {card.title}
                    </h4>
                  </div>
                  <span style={{ 
                    fontSize: 'clamp(4rem, 8vw, 8rem)', 
                    fontWeight: 300, 
                    lineHeight: 0.8,
                    color: 'rgba(0,0,0,0.1)',
                    fontFamily: "'Cinzel', serif"
                  }}>
                    {card.num}
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontFamily: "'Montserrat', sans-serif", color: '#444' }}>
                  <div style={{ width: '45%' }}>
                    <strong style={{ display: 'block', color: '#000', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>{card.desc1}</strong>
                    {card.desc2}
                  </div>
                  <div style={{ width: '45%' }}>
                    <strong style={{ display: 'block', color: '#000', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>{card.desc3}</strong>
                    {card.desc4}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Image Column */}
        <div style={{
          flex: 1,
          height: '70vh',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '2px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
        }}>
          {CARDS.map((card, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: isActive ? 1 : 0,
                  transition: 'opacity 1s ease',
                  zIndex: isActive ? 5 : 1
                }}
              >
                <img 
                  src={card.img} 
                  alt={card.title.replace('\n', ' ')} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    // Slight parallax scale effect based on whether it's active
                    transform: isActive ? 'scale(1)' : 'scale(1.1)',
                    transition: 'transform 6s ease-out'
                  }} 
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

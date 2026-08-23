import React, { useEffect, useRef, useState } from 'react';
import { CharacterLayer } from './CharacterLayer';
import { TextStoryLayer } from './TextStoryLayer';

export const MasterStorytellingSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // useScrollTimeline logic
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate how far we have scrolled through the container
      // rect.top is 0 when the top of the container hits the top of viewport.
      // We want progress to go from 0 to 1 as we scroll through the container.
      // The total scrollable distance is container height - viewport height.
      const scrollableDistance = rect.height - viewportHeight;
      const scrolled = -rect.top;
      
      let p = scrolled / scrollableDistance;
      p = Math.max(0, Math.min(1, p)); // Clamp between 0 and 1
      
      setProgress(p);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={containerRef} 
      style={{ 
        height: '600vh', 
        backgroundColor: '#fdf3e1', 
        position: 'relative',
        zIndex: 1
      }}
    >
      <div style={{
        position: 'sticky',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
      }}>
        
        {/* Animated Luxury Ambient Background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0, // Behind character and text
          overflow: 'hidden',
          pointerEvents: 'none'
        }}>
          {/* Orb 1: Champagne Gold */}
          <div style={{
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            width: '60vw',
            height: '60vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(229, 211, 179, 0.8) 0%, rgba(253, 243, 225, 0) 70%)',
            filter: 'blur(60px)',
            transform: `translate(${progress * 30}vw, ${progress * 15}vh)`,
            willChange: 'transform'
          }} />

          {/* Orb 2: Soft Sage (Connecting with Garden) */}
          <div style={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '70vw',
            height: '70vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 224, 215, 0.7) 0%, rgba(253, 243, 225, 0) 70%)',
            filter: 'blur(80px)',
            transform: `translate(${-progress * 20}vw, ${-progress * 25}vh)`,
            willChange: 'transform'
          }} />

          {/* Orb 3: Warm Peach */}
          <div style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            width: '50vw',
            height: '50vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(242, 213, 196, 0.6) 0%, rgba(253, 243, 225, 0) 70%)',
            filter: 'blur(70px)',
            transform: `translate(${-progress * 40}vw, ${progress * 20}vh) scale(${1 + progress * 0.5})`,
            willChange: 'transform'
          }} />
          
          {/* Fine Noise Texture Overlay for Premium Feel */}
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.2,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            mixBlendMode: 'overlay',
          }} />
        </div>

        <CharacterLayer progress={progress} totalFrames={240} />
        <TextStoryLayer progress={progress} />

      </div>
    </section>
  );
};

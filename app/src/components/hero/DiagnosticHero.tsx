import React, { useState, useEffect } from 'react';
import { CanvasRenderer } from './CanvasRenderer';

export const DiagnosticHero: React.FC = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [mode, setMode] = useState<'canvas' | 'img' | 'raw'>('canvas');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = '/frames/frame-001.jpg';
    img.onload = () => {
      setImage(img);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#000', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', zIndex: 100, top: 10, left: 10, display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.8)', padding: '10px', borderRadius: '8px' }}>
        <button onClick={() => setMode('canvas')} style={{ color: mode === 'canvas' ? '#0f0' : '#fff' }}>Canvas Render</button>
        <button onClick={() => setMode('img')} style={{ color: mode === 'img' ? '#0f0' : '#fff' }}>IMG tag (cover)</button>
        <button onClick={() => setMode('raw')} style={{ color: mode === 'raw' ? '#0f0' : '#fff' }}>IMG tag (raw 100%)</button>
      </div>

      {image && dimensions.width > 0 && (
        <>
          {mode === 'canvas' && (
            <CanvasRenderer image={image} width={dimensions.width} height={dimensions.height} />
          )}
          {mode === 'img' && (
            <img 
              src="/frames/frame-001.jpg" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              alt="frame" 
            />
          )}
          {mode === 'raw' && (
            <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
              <img 
                src="/frames/frame-001.jpg" 
                style={{ width: 'auto', height: 'auto', maxWidth: 'none' }} 
                alt="frame" 
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

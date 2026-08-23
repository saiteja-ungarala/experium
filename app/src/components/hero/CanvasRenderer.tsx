import React, { useRef, useEffect } from 'react';

interface CanvasRendererProps {
  image?: HTMLImageElement;
  width: number;
  height: number;
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({ image, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    // Set actual size in CSS
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    // Calculate object-fit: cover dimensions
    const canvasRatio = width / height;
    const imageRatio = image.width / image.height;

    let drawWidth = width;
    let drawHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    if (imageRatio > canvasRatio) {
      // Image is wider than canvas, crop sides
      drawWidth = height * imageRatio;
      offsetX = (width - drawWidth) / 2;
    } else {
      // Image is taller than canvas, crop top/bottom
      drawHeight = width / imageRatio;
      offsetY = (height - drawHeight) / 2;
    }

    // Clear canvas before drawing
    ctx.clearRect(0, 0, width, height);

    // Draw the image
    ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
  }, [image, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0
      }}
    />
  );
};

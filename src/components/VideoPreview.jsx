import React, { forwardRef, useEffect, useState, useRef } from 'react';

const VideoPreview = forwardRef(({ videoSrc, onClick, onMouseEnter, onMouseLeave }, ref) => {
  const containerRef = useRef(null);
  const [isInRange, setIsInRange] = useState(false);
  const [transform, setTransform] = useState('');
  const DETECTION_RANGE = 350; 
  const MAX_ROTATION = 35; 
  const MAX_TRANSLATE = 20; 
  const PERSPECTIVE = 800; 
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance <= DETECTION_RANGE) {
        if (!isInRange) {
          setIsInRange(true);
          onMouseEnter?.();
        }
        
        const normalizedX = deltaX / DETECTION_RANGE;
        const normalizedY = deltaY / DETECTION_RANGE;
        
        const rotateX = -(normalizedY) * MAX_ROTATION;
        const rotateY = (normalizedX) * MAX_ROTATION;
        const rotateZ = (normalizedX) * 5;
        
        const translateX = normalizedX * MAX_TRANSLATE;
        const translateY = normalizedY * MAX_TRANSLATE;
        const translateZ = (1 - distance / DETECTION_RANGE) * 50;
        
        const scale = 1 + (1 - distance / DETECTION_RANGE) * 0.2;
        
        setTransform(
          `perspective(${PERSPECTIVE}px) 
           rotateX(${rotateX}deg) 
           rotateY(${rotateY}deg) 
           rotateZ(${rotateZ}deg)
           translateX(${translateX}px)
           translateY(${translateY}px)
           translateZ(${translateZ}px)
           scale(${scale})`
        );
      } else {
        if (isInRange) {
          setIsInRange(false);
          onMouseLeave?.();
        }
        // Reset to a resting state
        setTransform(`perspective(${PERSPECTIVE}px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(0.9)`);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isInRange, onMouseEnter, onMouseLeave]);
  
  return (
    <div 
      ref={containerRef}
      onClick={onClick}
      className="relative"
      style={{
        opacity: isInRange ? 1 : 0,
        pointerEvents: isInRange ? 'auto' : 'none', 
        transform: transform,
        transition: 'opacity 0.3s ease-out, transform 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67)',
        transformStyle: 'preserve-3d',
      }}
    >
      <video
        ref={ref}
        src={videoSrc}
        loop
        muted
        playsInline
        aria-hidden="true"
        className="size-64 object-cover object-center rounded-lg"
        style={{
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
        }}
      />
    </div>
  );
});

VideoPreview.displayName = 'VideoPreview';

export default VideoPreview;
import React, { useRef, useState } from 'react';

/**
 * TiltedCard (Inspired by ReactBits & 21st.dev)
 * Interactive 3D perspective tilt card that responds smoothly to mouse movement.
 * Respects prefers-reduced-motion.
 */
export default function TiltedCard({
  children,
  className = '',
  maxTilt = 8,
  scale = 1.02,
  glare = true,
  ...props
}) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });

  const handleMouseMove = (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * maxTilt;
    const rotY = ((x - centerX) / centerX) * maxTilt;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(${scale}, ${scale}, 1)`,
      transition: 'transform 0.15s ease-out',
    });

    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlareStyle({
        opacity: 0.15,
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.4), transparent 60%)`,
        transition: 'opacity 0.2s ease',
      });
    }
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out',
    });
    if (glare) {
      setGlareStyle({ opacity: 0, transition: 'opacity 0.4s ease-out' });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`tilted-card-root ${className}`}
      style={style}
      {...props}
    >
      {children}
      {glare && (
        <div
          className="tilted-card-glare-overlay"
          style={glareStyle}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

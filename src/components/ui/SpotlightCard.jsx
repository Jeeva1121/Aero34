import React, { useRef, useState } from 'react';

/**
 * SpotlightCard (Inspired by 21st.dev & ReactBits)
 * Tracks mouse position to create a dynamic radial spotlight effect on card surface and borders.
 * Strictly adheres to dark obsidian luxury palette (NO rainbow gradients, NO AI slop).
 */
export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(255, 255, 255, 0.12)',
  borderColor = 'rgba(255, 255, 255, 0.2)',
  ...props
}) {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`spotlight-card-wrapper ${className}`}
      {...props}
    >
      {/* Dynamic Border Highlight Layer */}
      <div
        className="spotlight-card-border-glow"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${borderColor}, transparent 60%)`,
        }}
        aria-hidden="true"
      />

      {/* Dynamic Surface Highlight Layer */}
      <div
        className="spotlight-card-surface-glow"
        style={{
          opacity,
          background: `radial-gradient(450px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 65%)`,
        }}
        aria-hidden="true"
      />

      {/* Card Content Container */}
      <div className="spotlight-card-content">
        {children}
      </div>
    </div>
  );
}

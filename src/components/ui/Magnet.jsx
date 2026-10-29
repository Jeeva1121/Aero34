import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * Magnet (Inspired by ReactBits & 21st.dev)
 * Attracts elements towards the mouse cursor on hover for a magnetic, tactile feel.
 * Respects prefers-reduced-motion.
 */
export default function Magnet({
  children,
  strength = 0.35,
  activeDistance = 60,
  className = '',
  ...props
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

      if (dist < activeDistance + Math.max(rect.width, rect.height) / 2) {
        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;
        xTo(deltaX);
        yTo(deltaY);
      } else {
        xTo(0);
        yTo(0);
      }
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, activeDistance]);

  return (
    <div ref={containerRef} className={`magnet-wrapper ${className}`} {...props}>
      {children}
    </div>
  );
}

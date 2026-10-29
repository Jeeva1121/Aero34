import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * ReserveButton: Modern Compact Luxury Square Glass Button for Header.
 * 
 * Distinct animation from Take Flight:
 * - Serene aerodynamic cruising levitation in resting state
 * - On hover: GSAP takeoff banking pitch (+16° climb), afterburner thrust acceleration,
 *   electric cyan engine glow, and fluid liquid glass specular sheen
 * - High-contrast smoked obsidian glass (never white)
 * - Proportional compact squircle (border-radius: 7px, height: 38px)
 */
export default function ReserveButton({
  label = 'Reserve Flight',
  onClick,
  className = '',
  ariaLabel,
}) {
  const buttonRef = useRef(null);
  const jetRef = useRef(null);
  const beaconRingRef = useRef(null);
  const hoverTlRef = useRef(null);
  const ambientTlRef = useRef(null);

  useEffect(() => {
    const jet = jetRef.current;
    const beaconRing = beaconRingRef.current;
    if (!jet) return;

    // Reduced motion accessibility
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Ambient Serene Cruising Levitation
    const ambientTl = gsap.timeline({ repeat: -1, yoyo: true });
    ambientTl.to(jet, {
      y: -1.2,
      duration: 1.8,
      ease: 'sine.inOut',
    });
    ambientTlRef.current = ambientTl;

    // Periodic radar beacon ping
    if (beaconRing) {
      const pingTl = gsap.timeline({ repeat: -1, repeatDelay: 2.2 });
      pingTl.fromTo(
        beaconRing,
        { scale: 0.8, opacity: 0.8 },
        { scale: 2.2, opacity: 0, duration: 1.2, ease: 'power2.out' }
      );
    }

    return () => {
      ambientTl.kill();
    };
  }, []);

  const handleMouseEnter = () => {
    const jet = jetRef.current;
    if (!jet) return;

    // GSAP Takeoff Banking Pitch & Afterburner Surge
    gsap.to(jet, {
      rotation: -16,
      x: 3,
      y: -2.5,
      scale: 1.15,
      duration: 0.35,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    const jet = jetRef.current;
    if (!jet) return;

    // Smooth return to level cruise flight
    gsap.to(jet, {
      rotation: 0,
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.45,
      ease: 'power2.out',
    });
  };

  const handleClick = (e) => {
    const jet = jetRef.current;
    if (jet) {
      gsap.to(jet, {
        x: 8,
        opacity: 0,
        duration: 0.18,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(jet, { x: -4, opacity: 0 });
          gsap.to(jet, { x: 0, opacity: 1, duration: 0.25, ease: 'power2.out' });
        },
      });
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`square-glass-btn reserve-flight-btn ${className}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={ariaLabel || label}
    >
      {/* Specular Top Razor Edge Highlight */}
      <span className="glass-specular-edge" aria-hidden="true" />

      {/* Organic Liquid Specular Sheen (Refractive light wave across obsidian glass) */}
      <span className="flight-liquid-sheen" aria-hidden="true" />

      {/* Button Content */}
      <span className="reserve-btn-body">
        <span className="reserve-btn-label">{label}</span>

        {/* Hairline Glass Separator */}
        <span className="reserve-btn-divider" aria-hidden="true" />

        {/* Supersonic Aircraft Beacon Stage */}
        <span className="reserve-jet-stage" aria-hidden="true">
          <svg
            className="reserve-jet-svg"
            viewBox="0 0 24 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Radar Beacon Ping Ring */}
            <circle
              ref={beaconRingRef}
              cx="12"
              cy="10"
              r="6"
              fill="none"
              stroke="rgba(125, 211, 252, 0.7)"
              strokeWidth="0.8"
              opacity="0"
            />

            {/* Supersonic Passenger Airliner (Pivoted at Center of Gravity 12, 10) */}
            <g ref={jetRef} className="reserve-jet-icon" style={{ transformOrigin: '12px 10px' }}>
              <path
                d="M 17 10 L 13.2 9.2 L 11 5.4 L 9.8 5.4 L 10.6 9.2 L 8.2 9.2 L 7 7.8 L 6 7.8 L 6.6 10 L 6 12.2 L 7 12.2 L 8.2 10.8 L 10.6 10.8 L 9.8 14.6 L 11 14.6 L 13.2 10.8 Z"
                fill="#ffffff"
              />
            </g>
          </svg>
        </span>
      </span>
    </button>
  );
}

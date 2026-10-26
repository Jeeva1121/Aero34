import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * FlightButton: Compact Square Glass Aviation Button with Mathematically Aligned Curved Flight.
 * 
 * - Compact modern architectural square/squircle (border-radius: 8px)
 * - Deep smoked obsidian glass with razor specular edge (100% contrast, never white)
 * - Parabolic flight trajectory (viewBox: 0 0 54 22):
 *   * Origin: (4, 16)
 *   * Apex: arches up to y=3
 *   * Destination: (50, 14) with horizontal 0° arrival (no nosediving)
 * - Native SVG transform attribute manipulation:
 *   * Eliminates CSS transformOrigin bounding box offsets (which caused the plane to fly 10px below the line)
 *   * The airplane is 100% locked to the exact curve coordinates (end.x, end.y)
 * - Real-time de Casteljau sub-curve generation for progressive dotted flight trail
 * - Zero lag, zero GPU texture caching bugs
 * - Touchdown target radar pulse ping
 * - Interactive hover acceleration and liquid glass specular wave
 */
export default function FlightButton({
  label = 'Take Flight',
  onClick,
  className = '',
  ariaLabel,
}) {
  const buttonRef = useRef(null);
  const activePathRef = useRef(null);
  const planeRef = useRef(null);
  const targetRingRef = useRef(null);
  const tlRef = useRef(null);

  // Parabolic Curve Control Points with continuous slight curve into destination (viewBox: 0 0 54 22)
  // Origin (4, 16) -> Climb (18, 4) -> Gentle Arc (38, 11) -> Destination (50, 15)
  // Smooth continuous curve all the way to touchdown with zero flat plateau
  const p0 = { x: 4, y: 16 };
  const p1 = { x: 18, y: 4 };
  const p2 = { x: 38, y: 11 };
  const p3 = { x: 50, y: 15 };

  // Full Ghost Guide Path
  const fullPathData = `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;

  useEffect(() => {
    const activePath = activePathRef.current;
    const plane = planeRef.current;
    const targetRing = targetRingRef.current;
    if (!activePath || !plane) return;

    // Check for user reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      activePath.setAttribute('d', fullPathData);
      plane.setAttribute('transform', 'translate(27, 4.5) rotate(0)');
      return;
    }

    // de Casteljau algorithm: computes exact point and tangent angle on the curve
    const updateFlight = (t) => {
      const ct = Math.max(0.001, Math.min(0.999, t));

      const q0 = { x: p0.x + (p1.x - p0.x) * ct, y: p0.y + (p1.y - p0.y) * ct };
      const q1 = { x: p1.x + (p2.x - p1.x) * ct, y: p1.y + (p2.y - p1.y) * ct };
      const q2 = { x: p2.x + (p3.x - p2.x) * ct, y: p2.y + (p3.y - p2.y) * ct };

      const r0 = { x: q0.x + (q1.x - q0.x) * ct, y: q0.y + (q1.y - q0.y) * ct };
      const r1 = { x: q1.x + (q2.x - q1.x) * ct, y: q1.y + (q2.y - q1.y) * ct };

      const end = { x: r0.x + (r1.x - r0.x) * ct, y: r0.y + (r1.y - r0.y) * ct };
      const angle = Math.atan2(r1.y - r0.y, r1.x - r0.x) * (180 / Math.PI);

      // 1. Draw the active dotted trail ending precisely at the plane
      activePath.setAttribute(
        'd',
        `M ${p0.x} ${p0.y} C ${q0.x.toFixed(2)} ${q0.y.toFixed(2)}, ${r0.x.toFixed(2)} ${r0.y.toFixed(2)}, ${end.x.toFixed(2)} ${end.y.toFixed(2)}`
      );

      // 2. Position the airplane with NATIVE SVG transform attribute (NO CSS transform-origin bugs!)
      // Rotates strictly around local (0, 0) of the airplane, locked 100% dead on the curve
      plane.setAttribute(
        'transform',
        `translate(${end.x.toFixed(2)}, ${end.y.toFixed(2)}) rotate(${angle.toFixed(1)})`
      );
    };

    // Initial position at origin
    updateFlight(0.001);

    const flightObj = { progress: 0 };

    // Majestic Slow GSAP Flight Timeline (Duration: 4.8s)
    const tl = gsap.timeline({
      repeat: -1,
      defaults: { ease: 'power1.inOut' },
    });

    // 1. Silky smooth flight along the curve
    tl.to(flightObj, {
      progress: 1,
      duration: 4.8,
      onUpdate: () => updateFlight(flightObj.progress),
    });

    // 2. Touchdown radar pulse at destination target
    if (targetRing) {
      tl.fromTo(
        targetRing,
        { scale: 1, opacity: 0.9, transformOrigin: '50px 15px' },
        { scale: 2.6, opacity: 0, duration: 0.5, ease: 'power2.out' },
        4.65
      );
    }

    // 3. Elegant soft fade out at destination
    tl.to(
      plane,
      {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
      },
      4.7
    );

    tl.to(
      activePath,
      {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
      },
      4.7
    );

    // 4. Reset to origin and soft fade in for next flight
    tl.call(() => {
      flightObj.progress = 0;
      updateFlight(0.001);
      gsap.set([plane, activePath], { opacity: 1 });
    });

    tlRef.current = tl;

    return () => {
      tl.kill();
    };
  }, []);

  const handleMouseEnter = () => {
    if (tlRef.current) {
      gsap.to(tlRef.current, { timeScale: 2.0, duration: 0.4, ease: 'power2.out' });
    }
  };

  const handleMouseLeave = () => {
    if (tlRef.current) {
      gsap.to(tlRef.current, { timeScale: 1.0, duration: 0.5, ease: 'power2.out' });
    }
  };

  const handleClick = (e) => {
    if (planeRef.current) {
      gsap.to(planeRef.current, {
        scale: 1.25,
        duration: 0.12,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
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
      className={`square-glass-btn flight-trajectory-btn ${className}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={ariaLabel || label}
    >
      {/* Specular Top Razor Edge Highlight */}
      <span className="glass-specular-edge" aria-hidden="true" />

      {/* Organic Liquid Specular Sheen (Translucent Water/Glass Refraction, NEVER White) */}
      <span className="flight-liquid-sheen" aria-hidden="true" />

      {/* Button Content Composition */}
      <span className="flight-btn-body">
        {/* Crisp Luxury Typography */}
        <span className="flight-btn-label">{label}</span>

        {/* Hairline Glass Separator */}
        <span className="flight-btn-divider" aria-hidden="true" />

        {/* Compact Flight Radar Stage with Neat Parabolic Arch (viewBox: 0 0 54 22) */}
        <span className="flight-map-stage" aria-hidden="true">
          <svg
            className="flight-trajectory-svg"
            viewBox="0 0 54 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Origin Beacon Dot */}
            <circle cx="4" cy="16" r="1.8" fill="#ffffff" />
            <circle className="radar-pulse-ring" cx="4" cy="16" r="1.8" fill="none" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="0.8" />

            {/* Destination Target Beacon (y = 15) */}
            <circle cx="50" cy="15" r="2.2" fill="none" stroke="#ffffff" strokeWidth="1" />
            <circle cx="50" cy="15" r="0.9" fill="#ffffff" />
            <circle ref={targetRingRef} cx="50" cy="15" r="2.2" fill="none" stroke="rgba(125, 211, 252, 0.9)" strokeWidth="1" opacity="0" />

            {/* Ghost Background Great-Circle Flight Path (Subtle guide dots) */}
            <path
              d={fullPathData}
              fill="none"
              stroke="rgba(255, 255, 255, 0.18)"
              strokeWidth="1.2"
              strokeDasharray="1.2 3"
              strokeLinecap="round"
            />

            {/* Active Dotted Route (Generated in real-time trailing directly behind the plane) */}
            <path
              ref={activePathRef}
              d={`M ${p0.x} ${p0.y} L ${p0.x} ${p0.y}`}
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.4"
              strokeDasharray="1.2 3"
              strokeLinecap="round"
              className="active-flight-dots"
            />

            {/* Supersonic Passenger Airliner Vector (Locked 100% directly onto curve) */}
            <g ref={planeRef} className="moving-jet-group">
              <path
                d="M 5 0 L 1.2 -0.8 L -1 -4.6 L -2.2 -4.6 L -1.4 -0.8 L -3.8 -0.8 L -5 -2.2 L -6 -2.2 L -5.4 0 L -6 2.2 L -5 2.2 L -3.8 0.8 L -1.4 0.8 L -2.2 4.6 L -1 4.6 L 1.2 0.8 Z"
                fill="#ffffff"
              />
            </g>
          </svg>
        </span>
      </span>
    </button>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import BlurText from './ui/BlurText';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * CityDioramaSection: 21st.dev Perspective Split-View Slider
 * - London Miniature Map vs Paris Spherical Planet
 * - Smooth GSAP ScrollTrigger curtain wipe + manual interactive drag scrub
 * - Clean straight ZT Chintzy typography
 * - Strictly NO unnecessary words with slashes
 */
export default function CityDioramaSection() {
  const sectionRef = useRef(null);
  const frameRef = useRef(null);
  const londonLayerRef = useRef(null);
  const dividerRef = useRef(null);
  const [activeCity, setActiveCity] = useState('london');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pinned ScrollTrigger with smooth duration
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=120%',
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;

          let wipe = 0;
          if (p <= 0.3) {
            wipe = 0;
          } else if (p >= 0.7) {
            wipe = 100;
          } else {
            wipe = ((p - 0.3) / 0.4) * 100;
          }

          setActiveCity(p >= 0.5 ? 'paris' : 'london');

          if (londonLayerRef.current) {
            londonLayerRef.current.style.clipPath = `inset(0 ${wipe}% 0 0)`;
          }

          if (dividerRef.current) {
            dividerRef.current.style.left = `${100 - wipe}%`;
            dividerRef.current.style.opacity = wipe > 0 && wipe < 100 ? '1' : '0';
          }
        },
      });

      // Section header entrance
      gsap.fromTo(
        '.diorama-header-block',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handlePointerMove = (e) => {
    if (e.buttons === 1 && frameRef.current) {
      const rect = frameRef.current.getBoundingClientRect();
      const clientX = e.clientX;
      const relX = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const pctFromLeft = (relX / rect.width) * 100;
      const clipInsetRight = 100 - pctFromLeft;

      if (londonLayerRef.current) {
        londonLayerRef.current.style.clipPath = `inset(0 ${clipInsetRight}% 0 0)`;
      }
      if (dividerRef.current) {
        dividerRef.current.style.left = `${pctFromLeft}%`;
        dividerRef.current.style.opacity = '1';
      }
      setActiveCity(pctFromLeft >= 50 ? 'paris' : 'london');
    }
  };

  return (
    <section
      ref={sectionRef}
      id="diorama-section"
      className="city-diorama-section"
      aria-label="Destination Perspectives"
    >
      <div className="diorama-inner-wrapper">
        {/* Editorial Header (Pure Clean Typography - ZERO slashes) */}
        <div className="diorama-header-block">
          <span className="diorama-eyebrow">AERIAL CARTOGRAPHY</span>
          <h2 className="diorama-headline">
            <BlurText text="DESTINATION PERSPECTIVES" as="span" animateBy="words" />
          </h2>
          <p className="diorama-desc">
            Capturing iconic global capitals from a panoramic, physical perspective.
          </p>

          {/* Minimalist Editorial City Switcher */}
          <div className="diorama-editorial-nav" aria-live="polite">
            <button
              type="button"
              className={`city-label-btn ${activeCity === 'london' ? 'active' : ''}`}
              onClick={() => {
                setActiveCity('london');
                if (londonLayerRef.current) londonLayerRef.current.style.clipPath = 'inset(0 0% 0 0)';
                if (dividerRef.current) dividerRef.current.style.left = '100%';
              }}
            >
              London
            </button>
            <span className="city-separator">•</span>
            <button
              type="button"
              className={`city-label-btn ${activeCity === 'paris' ? 'active' : ''}`}
              onClick={() => {
                setActiveCity('paris');
                if (londonLayerRef.current) londonLayerRef.current.style.clipPath = 'inset(0 100% 0 0)';
                if (dividerRef.current) dividerRef.current.style.left = '0%';
              }}
            >
              Paris
            </button>
          </div>
        </div>

        {/* 16:9 Viewport Frame */}
        <div
          ref={frameRef}
          className="diorama-viewport-frame"
          onPointerMove={handlePointerMove}
          title="Scroll or drag to view London and Paris perspectives"
        >
          {/* Base Layer: Paris Spherical Planet Diorama */}
          <div className="diorama-layer diorama-layer-paris">
            <img
              src="/destinations/paris-spherical-planet.jpg"
              alt="Paris spherical architectural planet diorama"
              className="diorama-active-img"
            />
          </div>

          {/* Top Layer: London Miniature Map Diorama */}
          <div
            ref={londonLayerRef}
            className="diorama-layer diorama-layer-london"
            style={{ clipPath: 'inset(0 0% 0 0)' }}
          >
            <img
              src="/destinations/london-miniature-map.png"
              alt="London 3D map architectural diorama with Big Ben and Tower Bridge"
              className="diorama-active-img"
            />
          </div>

          {/* Clean Vertical Laser Hairline Divider */}
          <div
            ref={dividerRef}
            className="diorama-laser-divider"
            style={{ left: '100%', opacity: 0 }}
            aria-hidden="true"
          >
            <div className="divider-line" />
          </div>
        </div>
      </div>
    </section>
  );
}

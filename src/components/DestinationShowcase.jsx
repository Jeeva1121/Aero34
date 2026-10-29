import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DESTINATIONS = [
  {
    id: 'paris',
    index: '01',
    title: 'PARIS',
    region: 'France, Europe Corridor',
    airport: 'CDG, Charles de Gaulle',
    flightTime: '8h 15m Nonstop',
    altitude: '38,000 FT',
    tagline: 'The City of Light and Haussmann Grandeur',
    description:
      'Glide over the iconic curves of the Seine River at golden sunset. From the timeless spire of the Eiffel Tower to Pont Alexandre III, experience Europe’s crown jewel in supreme comfort.',
    image: '/destinations/paris-8k.jpg',
    coordinates: '48.8566 N, 2.3522 E',
  },
  {
    id: 'tokyo',
    index: '02',
    title: 'TOKYO',
    region: 'Japan, Pacific Dawn',
    airport: 'HND, Tokyo Haneda',
    flightTime: '11h 20m Nonstop',
    altitude: '41,000 FT',
    tagline: 'Far East Serenity Under Mount Fuji',
    description:
      'Witness the sun rise over snow-capped Mount Fuji as Tokyo’s futuristic glass skyline awakens in delicate dawn pastels. Ancient tranquility harmoniously merged with tomorrow.',
    image: '/destinations/tokyo-8k.jpg',
    coordinates: '35.6762 N, 139.6503 E',
  },
  {
    id: 'alps',
    index: '03',
    title: 'SWISS ALPS',
    region: 'Switzerland, Alpine Sanctuary',
    airport: 'ZRH, Zurich Kloten',
    flightTime: '6h 40m Direct',
    altitude: '39,000 FT',
    tagline: 'Glacial Horizons and Lauterbrunnen Valleys',
    description:
      'Soar past the majestic summits of the Jungfrau and Eiger. Crystal turquoise glacial waters, cascading cliffside waterfalls, and pristine alpine meadows untouched by time.',
    image: '/destinations/alps-8k.jpg',
    coordinates: '46.5935 N, 7.9090 E',
  },
  {
    id: 'horizon',
    index: '04',
    title: 'HORIZON OCEAN',
    region: 'Transoceanic Summit, Cloud Sea',
    airport: 'Aero 34 Cruise Level',
    flightTime: '5h 30m Direct',
    altitude: '43,000 FT',
    tagline: 'Endless Sea of Clouds and Sunrise Alpine Peaks',
    description:
      'Gaze across an infinite ocean of golden morning clouds rolling beneath razor-sharp alpine summits. Pure tranquility cruising at 43,000 feet above the world.',
    image: '/destinations/world-horizon-8k.jpg',
    coordinates: '46.5935 N, 7.9090 E',
  },
];

/**
 * DestinationShowcase: 21st.dev & ReactBits Inspired Stacking Shutter Portals
 * - Powered by straight ZT Chintzy typography (stark pure white, zero slashes, zero colors)
 * - Vertical shutter deck transitions
 * - Interactive 3D mouse perspective tilt on card hover
 * - Pinned ScrollTrigger timeline
 * - Strictly NO unnecessary words with slashes
 */
export default function DestinationShowcase() {
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // Main Scrubbing Timeline pinned over 280vh
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=280%',
          pin: true,
          pinSpacing: true,
          scrub: 0.9,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            let current = 0;
            if (p < 0.28) current = 0;
            else if (p < 0.62) current = 1;
            else if (p < 0.88) current = 2;
            else current = 3;
            setActiveIdx(current);
          },
        },
      });

      triggerRef.current = tl.scrollTrigger;

      // Card 0 -> 1 (Tokyo)
      tl.to(
        '.card-0 .dest-deck-inner',
        {
          scale: 0.94,
          opacity: 0.35,
          yPercent: -5,
          ease: 'power2.inOut',
          duration: 1,
        },
        'step1'
      );
      tl.fromTo(
        '.card-1',
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'power2.inOut',
          duration: 1,
        },
        'step1'
      );
      tl.fromTo(
        '.card-1 .dest-slide-bg-img',
        { scale: 1.15 },
        { scale: 1.0, ease: 'power2.out', duration: 1 },
        'step1'
      );
      tl.fromTo(
        '.card-1 .dest-title-char',
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.03,
          ease: 'power3.out',
          duration: 0.8,
        },
        'step1+=0.2'
      );

      // Card 1 -> 2 (Swiss Alps)
      tl.to(
        '.card-1 .dest-deck-inner',
        {
          scale: 0.94,
          opacity: 0.35,
          yPercent: -5,
          ease: 'power2.inOut',
          duration: 1,
        },
        'step2'
      );
      tl.fromTo(
        '.card-2',
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'power2.inOut',
          duration: 1,
        },
        'step2'
      );
      tl.fromTo(
        '.card-2 .dest-slide-bg-img',
        { scale: 1.15 },
        { scale: 1.0, ease: 'power2.out', duration: 1 },
        'step2'
      );
      tl.fromTo(
        '.card-2 .dest-title-char',
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.03,
          ease: 'power3.out',
          duration: 0.8,
        },
        'step2+=0.2'
      );

      // Card 2 -> 3 (Horizon Ocean)
      tl.to(
        '.card-2 .dest-deck-inner',
        {
          scale: 0.94,
          opacity: 0.35,
          yPercent: -5,
          ease: 'power2.inOut',
          duration: 1,
        },
        'step3'
      );
      tl.fromTo(
        '.card-3',
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'power2.inOut',
          duration: 1,
        },
        'step3'
      );
      tl.fromTo(
        '.card-3 .dest-slide-bg-img',
        { scale: 1.15 },
        { scale: 1.0, ease: 'power2.out', duration: 1 },
        'step3'
      );
      tl.fromTo(
        '.card-3 .dest-title-char',
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.03,
          ease: 'power3.out',
          duration: 0.8,
        },
        'step3+=0.2'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // 3D Perspective Tilt on Card Hover
  const handleCardMouseMove = (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotX = -(y / (rect.height / 2)) * 4;
    const rotY = (x / (rect.width / 2)) * 4;
    gsap.to(card, {
      rotateX: rotX,
      rotateY: rotY,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000,
    });
  };

  const handleCardMouseLeave = (e) => {
    gsap.to(e.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'power2.out',
    });
  };

  return (
    <section
      ref={containerRef}
      id="destinations-section"
      className="destinations-pinned-slider-section"
      aria-label="Global Horizons Destination Showcase"
    >
      <div className="dest-deck-container">
        {DESTINATIONS.map((dest, i) => (
          <article
            key={dest.id}
            className={`dest-deck-card card-${i} ${activeIdx === i ? 'is-active' : ''}`}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            aria-label={`${dest.title} - ${dest.tagline}`}
          >
            <div className="dest-deck-inner">
              {/* Full Bleed High-Res Cinematic Scenery */}
              <div className="dest-slide-img-viewport">
                <img
                  src={dest.image}
                  alt={`${dest.title} panoramic view`}
                  className="dest-slide-bg-img"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
                <div className="dest-cinematic-scrim" aria-hidden="true" />
              </div>

              {/* Architectural Straight Pure White Typography Composition */}
              <div className="dest-editorial-content">
                {/* Hairline Telemetry (NO slashes!) */}
                <div className="dest-editorial-top">
                  <span className="dest-meta-index">{dest.index}</span>
                  <span className="dest-meta-eyebrow">{dest.region}</span>
                  <span className="dest-meta-time">{dest.flightTime}</span>
                </div>

                {/* Straight ZT Chintzy Headline with Word-Grouped Masked Characters */}
                <div className="dest-title-wrap">
                  <h2 className="dest-monumental-title" aria-label={dest.title}>
                    {dest.title.split(' ').map((word, wordIdx) => (
                      <span key={wordIdx} className="dest-title-word">
                        {word.split('').map((char, charIdx) => (
                          <span key={charIdx} className="dest-title-char-mask">
                            <span className="dest-title-char">{char}</span>
                          </span>
                        ))}
                      </span>
                    ))}
                  </h2>
                </div>

                {/* Editorial Description & Technical Specs (NO slashes!) */}
                <div className="dest-editorial-bottom">
                  <p className="dest-editorial-tagline">{dest.tagline}</p>
                  <p className="dest-editorial-desc">{dest.description}</p>

                  <div className="dest-editorial-specs">
                    <div className="spec-item">
                      <span className="spec-label">TERMINAL ROUTE</span>
                      <strong className="spec-val">{dest.airport}</strong>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">CRUISE ALTITUDE</span>
                      <strong className="spec-val">{dest.altitude}</strong>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">COORDINATES</span>
                      <strong className="spec-val">{dest.coordinates}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FLAGSHIP_CRAFT = [
  {
    id: 1,
    model: "Boom Overture Flagship",
    manufacturer: "Boom Supersonic",
    category: "Commercial Supersonic",
    speed: "Mach 1.7",
    altitude: "60,000 FT",
    range: "4,250 NM",
    route: "Tokyo → Seattle (4h 30m)",
    cover: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1080&h=720&fit=crop&q=85&auto=format",
    video: "https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-2408-large.mp4",
    award: "Aero Grand Prix • Commercial Supersonic",
    logline: "Sustained Mach 1.7 cruise powered by 100% Sustainable Aviation Fuel (SAF). Crossing oceans in half the standard flight time.",
    specs: "Four Symphony Turbofans • 65-80 Passengers • Carbon Composite Airframe"
  },
  {
    id: 2,
    model: "Gulfstream G800 Horizon",
    manufacturer: "Gulfstream Aerospace",
    category: "Executive Long-Range",
    speed: "Mach 0.925",
    altitude: "51,000 FT",
    range: "8,000 NM",
    route: "London → Singapore Nonstop",
    cover: "https://images.unsplash.com/photo-1520437358207-323b43b50729?w=1080&h=720&fit=crop&q=85&auto=format",
    video: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
    award: "Design Excellence • Ultra-Long Range",
    logline: "The longest-range private jet in civil aviation. Features Gulfstream Symmetry Flight Deck with active control sidesticks.",
    specs: "Rolls-Royce Pearl 700 Engines • 16 Panoramic Windows • 100% Fresh Air Cabin"
  },
  {
    id: 3,
    model: "Concorde Heritage II",
    manufacturer: "Aérospatiale / BAC",
    category: "Supersonic Legend",
    speed: "Mach 2.04",
    altitude: "60,000 FT",
    range: "3,900 NM",
    route: "Paris → New York (3h 15m)",
    cover: "https://images.unsplash.com/photo-1583321500900-82807e458f3c?w=1080&h=720&fit=crop&q=85&auto=format",
    video: "https://assets.mixkit.co/videos/preview/mixkit-going-down-a-curved-highway-through-a-mountain-range-41576-large.mp4",
    award: "Legend Honour • Supersonic Pioneer",
    logline: "The golden standard of supersonic passenger flight. Ogival delta wing architecture slicing through the upper stratosphere.",
    specs: "Four Olympus 593 Turbojets • Reheat Afterburners • Droop Nose Architecture"
  },
  {
    id: 4,
    model: "Lockheed Martin X-59 QueSST",
    manufacturer: "NASA / Skunk Works",
    category: "Experimental Low-Boom",
    speed: "Mach 1.42",
    altitude: "55,000 FT",
    range: "3,100 NM",
    route: "Edwards AFB → Transcontinental",
    cover: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=1080&h=720&fit=crop&q=85&auto=format",
    video: "https://assets.mixkit.co/videos/preview/mixkit-ink-swirling-in-water-in-slow-motion-42654-large.mp4",
    award: "Breakthrough Award • Low-Boom Tech",
    logline: "Quiet SuperSonic Technology designed to reduce sonic booms to a gentle 75 PLdB sonic thump over populated land.",
    specs: "General Electric F414-GE-100 • eXternal Vision System (XVS) 4K HUD"
  }
];

export default function FlagshipFleet({ onSelectAircraft }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 3D Staggered entrance for flagship cards
      gsap.from('.flagship-card', {
        scrollTrigger: {
          trigger: '.flagship-grid',
          start: 'top 80%',
        },
        y: 60,
        rotateX: 16,
        opacity: 0,
        stagger: 0.14,
        duration: 0.9,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // 3D hover tilt
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotX = -(y / (rect.height / 2)) * 6;
    const rotY = (x / (rect.width / 2)) * 6;

    gsap.to(card, {
      rotateX: rotX,
      rotateY: rotY,
      z: 20,
      transformPerspective: 1000,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      z: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  return (
    <section ref={containerRef} className="flagship-section" id="flagship-section">
      <div className="content-wrapper">
        <header className="page-hero-header">
          <p className="page-eyebrow">AEROSPACE ARCHIVE & FLEET</p>
          <h2 className="page-main-heading">
            Four Flagship <span className="marker-text gold active">Icons</span>
          </h2>
          <p className="page-lede">
            Curated civil and experimental aerospace engineering. Select any aircraft to inspect high-altitude telemetry and flight specifications.
          </p>
        </header>

        <div className="flagship-grid">
          {FLAGSHIP_CRAFT.map((craft) => (
            <article
              key={craft.id}
              className="flagship-card"
              onClick={() => onSelectAircraft(craft)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelectAircraft(craft)}
              aria-label={`View aircraft ${craft.model}`}
            >
              <div className="flagship-img-wrap">
                <span className="flagship-speed-badge">{craft.speed}</span>
                <span className="flagship-cat-badge">{craft.category}</span>
                <img
                  src={craft.cover}
                  alt={craft.model}
                  className="flagship-img"
                  loading="lazy"
                />
              </div>

              <div className="flagship-body">
                <div className="flagship-route-tag">{craft.route}</div>
                <h3 className="flagship-title">{craft.model}</h3>
                <p className="flagship-manufacturer">{craft.manufacturer} • Range {craft.range}</p>
                <p className="flagship-logline">{craft.logline}</p>
                
                <div className="flagship-footer-specs">
                  <span>{craft.specs}</span>
                  <span className="flagship-award-tag">★ {craft.award.split('•')[0]}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

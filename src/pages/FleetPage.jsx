import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CARDS_DATA, CATEGORIES } from '../data/fleetData';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FleetPage({ onSelectAircraft }) {
  const [selectedCat, setSelectedCat] = useState("All Fleets");
  const [searchQuery, setSearchQuery] = useState("");
  const pageRef = useRef(null);
  const gridRef = useRef(null);

  const filteredFleet = useMemo(() => {
    return CARDS_DATA.filter((craft) => {
      const matchCat = selectedCat === "All Fleets" || craft.category === selectedCat;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        craft.model.toLowerCase().includes(q) ||
        craft.manufacturer.toLowerCase().includes(q) ||
        craft.route.toLowerCase().includes(q) ||
        craft.speed.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [selectedCat, searchQuery]);

  // GSAP ScrollTrigger batch animations with 3D perspective tilt
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Text highlight markers scrubbed to scroll
      gsap.utils.toArray('.marker-text').forEach((marker) => {
        ScrollTrigger.create({
          trigger: marker,
          start: 'top 85%',
          onEnter: () => marker.classList.add('active'),
          onLeaveBack: () => marker.classList.remove('active'),
        });
      });

      // 2. ScrollTrigger.batch for 3D aircraft cards entering viewport
      if (gridRef.current) {
        ScrollTrigger.batch('.aircraft-card', {
          interval: 0.08,
          batchMax: 4,
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              {
                opacity: 0,
                y: 65,
                rotateX: 18,
                translateZ: -60,
                transformPerspective: 1000,
              },
              {
                opacity: 1,
                y: 0,
                rotateX: 0,
                translateZ: 0,
                stagger: 0.08,
                duration: 0.85,
                ease: 'power3.out',
                overwrite: true,
              }
            );
          },
          onLeaveBack: (batch) => {
            gsap.to(batch, {
              opacity: 0,
              y: 40,
              rotateX: 12,
              duration: 0.4,
              overwrite: true,
            });
          },
          start: 'top 88%',
        });
      }
    }, pageRef);

    return () => ctx.revert();
  }, [filteredFleet]);

  // Interactive 3D Perspective Tilt on Card Hover
  const handleCardMouseMove = (e) => {
    const cardEl = e.currentTarget;
    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotX = -(y / (rect.height / 2)) * 7;
    const rotY = (x / (rect.width / 2)) * 7;

    gsap.to(cardEl, {
      rotateX: rotX,
      rotateY: rotY,
      z: 16,
      transformPerspective: 1000,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleCardMouseLeave = (e) => {
    const cardEl = e.currentTarget;
    gsap.to(cardEl, {
      rotateX: 0,
      rotateY: 0,
      z: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  // Award-winning badge colors
  const getBadgeClass = (category) => {
    if (category.includes('Supersonic')) return 'badge-vermillion';
    if (category.includes('Executive')) return 'badge-gold';
    if (category.includes('Ultra Long')) return 'badge-blue';
    if (category.includes('Experimental')) return 'badge-violet';
    return 'badge-emerald';
  };

  return (
    <div ref={pageRef} className="page-container" style={{ position: 'relative' }}>
      <div className="content-wrapper" style={{ position: 'relative', zIndex: 10 }}>
        <header className="page-hero-header">
          <p className="page-eyebrow">GLOBAL CIVIL & SUPERSONIC HANGAR</p>
          <h1 id="fleet-heading" className="page-main-heading">
            Thirty-Four <span className="marker-text red active">Aircraft</span>
          </h1>
          <p className="page-lede">
            The world's preeminent fleet of supersonic passenger jets, ultra-long-range airliners, and next-generation aerospace prototypes.
          </p>

          {/* Filter Toolbar & Search Bar */}
          <div className="films-toolbar">
            <div className="filter-chips-group">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`filter-chip ${selectedCat === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCat(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="search-wrap">
              <input
                type="text"
                placeholder="Search model, manufacturer, speed..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </header>

        {/* Fleet Cards Grid with ScrollTrigger.batch() & 3D Perspective Tilt */}
        <div ref={gridRef} className="films-grid">
          {filteredFleet.map((craft) => (
            <article
              key={craft.id}
              className="film-card aircraft-card"
              onClick={() => onSelectAircraft(craft)}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelectAircraft(craft)}
              aria-label={`View aircraft ${craft.model} by ${craft.manufacturer}`}
            >
              <div className="film-poster-wrap">
                <span className="film-tag-badge">#{craft.reelNumber} • {craft.category}</span>
                <span className="aircraft-speed-tag">{craft.speed}</span>
                <img
                  src={craft.cover}
                  alt={craft.model}
                  className="film-poster-img"
                  loading="lazy"
                />
              </div>

              <div className="film-card-body">
                <h2 className="film-card-title">{craft.model}</h2>
                <p className="film-card-director">
                  {craft.manufacturer} • Range {craft.range}
                </p>
                <p className="film-card-logline">
                  {craft.logline}
                </p>
                <div className={`film-card-award ${getBadgeClass(craft.category)}`}>
                  ★ {craft.award}
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredFleet.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--color-text-secondary)' }}>
            <p>No aircraft matching "{searchQuery}" in category "{selectedCat}".</p>
          </div>
        )}
      </div>
    </div>
  );
}

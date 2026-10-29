import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CARDS_DATA, CATEGORIES } from '../data/cardsData';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FilmsPage({ onSelectFilm }) {
  const [selectedCat, setSelectedCat] = useState("All Films");
  const [searchQuery, setSearchQuery] = useState("");
  const pageRef = useRef(null);
  const gridRef = useRef(null);

  const filteredFilms = useMemo(() => {
    return CARDS_DATA.filter((film) => {
      const matchCat = selectedCat === "All Films" || film.category === selectedCat;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        film.title.toLowerCase().includes(q) ||
        film.director.toLowerCase().includes(q) ||
        film.country.toLowerCase().includes(q);
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

      // 2. ScrollTrigger.batch for 3D card entrances as they enter viewport
      if (gridRef.current) {
        ScrollTrigger.batch('.film-card', {
          interval: 0.08, // Time window to batch cards
          batchMax: 4,   // Max elements per batch
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
  }, [filteredFilms]);

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

  // Award badge color assignment
  const getAwardColorClass = (award) => {
    if (award.includes('Cannes')) return 'award-vermillion';
    if (award.includes('Venice')) return 'award-blue';
    if (award.includes('Sundance')) return 'award-gold';
    if (award.includes('Berlin')) return 'award-emerald';
    return 'award-violet';
  };

  return (
    <div ref={pageRef} className="page-container" style={{ position: 'relative' }}>
      <div className="content-wrapper" style={{ position: 'relative', zIndex: 10 }}>
        <header className="page-hero-header">
          <h1 id="films-heading" className="page-main-heading">
            Thirty-Four <span className="marker-text red active">Films</span>
          </h1>
          <p className="page-lede">
            Official international competition collection. Select any reel to experience its high-resolution cinematographic preview.
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
                placeholder="Search by title, director, country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </header>

        {/* Film Cards Grid with ScrollTrigger.batch() & 3D Perspective Tilt */}
        <div ref={gridRef} className="films-grid">
          {filteredFilms.map((film) => (
            <article
              key={film.id}
              className="film-card"
              onClick={() => onSelectFilm(film)}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelectFilm(film)}
              aria-label={`View film ${film.title} directed by ${film.director}`}
            >
              <div className="film-poster-wrap">
                <span className="film-tag-badge">#{film.reelNumber} • {film.category}</span>
                <img
                  src={film.cover}
                  alt={film.title}
                  className="film-poster-img"
                  loading="lazy"
                />
              </div>

              <div className="film-card-body">
                <h2 className="film-card-title">{film.title}</h2>
                <p className="film-card-director">
                  Dir. {film.director} ({film.country}) • {film.duration}
                </p>
                <p className="film-card-logline">
                  {film.logline}
                </p>
                <div className={`film-card-award ${getAwardColorClass(film.award)}`}>
                  ★ {film.award}
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredFilms.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--color-text-secondary)' }}>
            <p>No films matching "{searchQuery}" in category "{selectedCat}".</p>
          </div>
        )}
      </div>
    </div>
  );
}

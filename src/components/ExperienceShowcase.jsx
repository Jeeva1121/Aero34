import React, { useState, useRef, useEffect } from 'react';
import BlurText from './ui/BlurText';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SANCTUARIES = [
  {
    id: 'suites',
    num: '01',
    category: 'SANCTUARY',
    title: 'Private Sky Suites',
    tagline: 'Lie-flat double bed and panoramic sky views',
    image: '/first-class-suite.jpg',
  },
  {
    id: 'dining',
    num: '02',
    category: 'GASTRONOMY',
    title: 'Stratospheric Dining',
    tagline: 'Haute cuisine and Grand Cru selections at 41,000 feet',
    image: '/sky-dining-luxury.jpg',
  },
  {
    id: 'concierge',
    num: '03',
    category: 'CONCIERGE',
    title: 'Terminal Concierge',
    tagline: 'Expedited private clearance and direct tarmac chauffeur',
    image: '/airport-terminal.jpg',
  },
];

/**
 * ExperienceShowcase: Clean Luxury Filmstrip
 * - Zero ticks, zero boxed pills, zero cluttering paragraphs over photos
 * - Unobstructed luxury photography with smooth interactive expansion
 * - Straight ZT Chintzy typography in stark pure white
 * - Generous top spacing avoiding navbar collision
 */
export default function ExperienceShowcase() {
  const sectionRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(1); // Default to middle panel (Stratospheric Dining)

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.sanctuary-panel',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.sanctuary-accordion-stage',
            start: 'top 82%',
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience-section"
      className="experience-showcase-section"
      aria-label="First Class In-Flight Sanctuary"
    >
      <div className="experience-container">
        {/* Editorial Section Header with generous breathing room */}
        <div className="experience-header-block">
          <span className="experience-eyebrow">FIRST CLASS EXCELLENCE</span>
          <h2 className="experience-main-title">
            <BlurText text="CRAFTED FOR TRANQUILITY" as="span" animateBy="words" />
          </h2>
          <p className="experience-subtitle">
            Three bespoke sanctuaries engineered for effortless transoceanic passage.
          </p>
        </div>

        {/* Clean, Unobstructed Full-Bleed Filmstrip (Zero boxes, zero ticks, zero clutter) */}
        <div className="sanctuary-accordion-stage" role="region" aria-label="Sanctuary Showcase Panels">
          {SANCTUARIES.map((item, idx) => {
            const isActive = activeIdx === idx;
            return (
              <article
                key={item.id}
                className={`sanctuary-panel ${isActive ? 'is-expanded' : 'is-collapsed'}`}
                onMouseEnter={() => setActiveIdx(idx)}
                onClick={() => setActiveIdx(idx)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveIdx(idx);
                  }
                }}
                aria-expanded={isActive}
                aria-label={`${item.title} - ${item.tagline}`}
              >
                {/* Background Image - Clean and Crisp */}
                <div className="sanctuary-img-wrapper">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="sanctuary-bg-img"
                    loading="lazy"
                  />
                  <div className="sanctuary-scrim-overlay" aria-hidden="true" />
                </div>

                {/* Collapsed Spine (Visible when panel is narrow) */}
                <div className="sanctuary-spine-content" aria-hidden={isActive}>
                  <span className="spine-number">{item.num}</span>
                  <span className="spine-title">{item.title}</span>
                </div>

                {/* Expanded Clean Minimalist Caption (Zero ticks, zero pills, zero boxes) */}
                <div className="sanctuary-expanded-content">
                  <div className="sanctuary-top-meta">
                    <span className="sanctuary-num-badge">{item.num}</span>
                    <span className="sanctuary-cat-label">{item.category}</span>
                  </div>

                  <div className="sanctuary-main-text">
                    <h3 className="sanctuary-title">{item.title}</h3>
                    <p className="sanctuary-tagline">{item.tagline}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

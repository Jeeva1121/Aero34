import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Authentic Luxury Aviation Chapters for The Culinary Suite & Private Salon.
 * Completely distinct, non-AI editorial storytelling.
 * 4 unique 4K perspectives with zero cards on top of images and zero bottom cards.
 */
const CULINARY_CHAPTERS = [
  {
    num: "01",
    subtitle: "Sanctuary Architecture",
    title: "The Private Sky Salon",
    lede: "An intimate sky sanctuary crafted with hand-stitched Connolly leather, brushed titanium, and acoustic soundproofing that keeps cabin noise at an unprecedented whisper-quiet 42 decibels.",
    spec: "Whisper-Quiet 42 dB • Custom Connolly Leather • Ambient Horizon Views",
    image: "/inside-airplane-luxury.jpg",
    alt: "Private luxury first class cabin sky salon with leather seating and sunset window"
  },
  {
    num: "02",
    subtitle: "Michelin Gastronomy",
    title: "Ateliers de Haute Cuisine",
    lede: "Multi-course seasonal degustation menus orchestrated in partnership with three-star Michelin masters. Prepared fresh to order at 40,000 feet, served on Bernardaud porcelain with Christofle silver service.",
    spec: "3-Star Michelin Collaboration • Line-Caught Turbot • Plated Fresh to Order",
    image: "/sky-dining-luxury.jpg",
    alt: "First Class in-flight luxury private dining suite at sunset with gourmet meal and champagne"
  },
  {
    num: "03",
    subtitle: "Altitude Cellar",
    title: "The Grand Cru Sky Vault",
    lede: "An altitude-pressurized cellar housing rare vintage Champagnes, premier cru Bordeaux estates, and bespoke sommelier pairings curated to maintain full aromatic richness in pressurized cabin air.",
    spec: "Dom Pérignon 2012 Vintage • Premier Cru Estates • Riedel Crystal Stemware",
    image: "/dreamliner-cabin.jpg",
    alt: "Widebody oceanic interior and sky cellar ambient lounge"
  },
  {
    num: "04",
    subtitle: "Rest & Rejuvenation",
    title: "Master Suite Sanctuary",
    lede: "A fully enclosed private double bedroom suite featuring a handcrafted Savoir lie-flat bed, bespoke Italian cashmere linens, and private en-suite dressing amenities high above the ocean.",
    spec: "Handcrafted Savoir Bed • Cashmere Blankets • En-Suite Privacy Suite",
    image: "/first-class-suite.jpg",
    alt: "Enclosed private double master suite with mood lighting and lie-flat bed"
  }
];

/**
 * DiningLoungePage: The Culinary Suite & Private Sky Salon.
 * 
 * DESIGN PRINCIPLES (Strictly following user feedback):
 * 1. 100% Pure White & Black Theme (#ffffff background, #0a0a0c pitch black typography, #27272a deep slate body).
 * 2. Absolutely ZERO cards, pills, or badges on top of the 1:1 image.
 * 3. Absolutely ZERO cards or telemetry boxes at the bottom.
 * 4. Airy, slight letter-spacing across all text elements for effortless luxury readability.
 * 5. Distinct GSAP interaction: Pinned interactive chapter reveal with dynamic 1:1 visual switching,
 *    curtain clip-path wipes, and staggered typography reveals.
 */
export default function DiningLoungePage() {
  const sectionRef = useRef(null);
  const visualContainerRef = useRef(null);
  const imagesRef = useRef([]);
  const storiesListRef = useRef(null);
  const indicatorRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // Switch active chapter with smooth GSAP transition
  const handleSelectChapter = (idx) => {
    if (idx === activeIdx) return;
    setActiveIdx(idx);

    // GSAP Crossfade & Curtain Clip Reveal between 1:1 visual frames
    imagesRef.current.forEach((imgEl, i) => {
      if (!imgEl) return;
      if (i === idx) {
        gsap.killTweensOf(imgEl);
        gsap.fromTo(
          imgEl,
          {
            opacity: 0,
            scale: 1.06,
            clipPath: 'inset(8% 0% 8% 0%)',
            zIndex: 5,
          },
          {
            opacity: 1,
            scale: 1.0,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.85,
            ease: 'power3.out',
          }
        );
      } else {
        gsap.killTweensOf(imgEl);
        gsap.to(imgEl, {
          opacity: 0,
          scale: 0.98,
          duration: 0.55,
          ease: 'power2.inOut',
          zIndex: 1,
        });
      }
    });
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ctx;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        // 1. Initial 1:1 Visual Frame Reveal
        if (visualContainerRef.current) {
          gsap.fromTo(
            visualContainerRef.current,
            {
              clipPath: 'inset(12% 0% 12% 0%)',
              opacity: 0,
              y: 40,
            },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: visualContainerRef.current,
                start: 'top 85%',
                end: 'top 35%',
                scrub: 0.8,
              }
            }
          );
        }

        // 2. Editorial Header entrance
        gsap.from('.dining-editorial-header > *', {
          scrollTrigger: {
            trigger: '.dining-editorial-header',
            start: 'top 82%',
          },
          y: 35,
          opacity: 0,
          stagger: 0.14,
          duration: 0.9,
          ease: 'power3.out',
        });

        // 3. Editorial Story Items staggered reveal
        if (storiesListRef.current) {
          gsap.from('.dining-story-card', {
            scrollTrigger: {
              trigger: storiesListRef.current,
              start: 'top 78%',
            },
            y: 45,
            opacity: 0,
            stagger: 0.16,
            duration: 0.85,
            ease: 'power3.out',
          });
        }
      }, section);
    }, 50);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="dining-section"
      className="dining-editorial-section"
      aria-labelledby="culinary-heading"
    >
      <div className="content-wrapper">
        {/* Pure White & Black Minimalist Editorial Header */}
        <header className="dining-editorial-header">
          <p className="dining-eyebrow">The Private Sky Salon & Gastronomy</p>
          <h2 id="culinary-heading" className="dining-main-title">
            The Culinary Suite
          </h2>
          <p className="dining-lede">
            Curated private sky sanctuaries combining haute gastronomy, vintage cellar selections, and bespoke sleeping suites above the clouds.
          </p>
        </header>

        {/* 1:1 SQUARE Visual + Editorial Chapters (Zero Cards on Image, Zero Bottom Cards) */}
        <div className="dining-editorial-grid">
          {/* Pure 1:1 SQUARE Visual Frame (Clean, unblemished, zero cards on top) */}
          <div ref={visualContainerRef} className="square-dining-frame" aria-hidden="true">
            {CULINARY_CHAPTERS.map((chapter, i) => (
              <img
                key={chapter.num}
                ref={(el) => (imagesRef.current[i] = el)}
                src={chapter.image}
                alt={chapter.alt}
                className={`square-dining-img ${i === activeIdx ? 'active' : ''}`}
                style={{
                  opacity: i === activeIdx ? 1 : 0,
                  zIndex: i === activeIdx ? 5 : 1,
                }}
              />
            ))}
          </div>

          {/* Clean Numbered Chapters List (Pure White & Black Luxury Editorial) */}
          <div ref={storiesListRef} className="dining-stories-column" role="tablist" aria-label="Culinary Chapters">
            {CULINARY_CHAPTERS.map((chapter, idx) => {
              const isActive = activeIdx === idx;
              return (
                <article
                  key={chapter.num}
                  role="tab"
                  tabIndex={0}
                  aria-selected={isActive}
                  className={`dining-story-card ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectChapter(idx)}
                  onMouseEnter={() => handleSelectChapter(idx)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectChapter(idx);
                    }
                  }}
                >
                  {/* Left Column: Architectural Number & Active Hairline */}
                  <div className="dining-story-num-col">
                    <span className="dining-story-num">{chapter.num}</span>
                    <div className="dining-active-line" aria-hidden="true" />
                  </div>

                  {/* Right Column: Title, Subtitle, Narrative, and Spec */}
                  <div className="dining-story-content-col">
                    <span className="dining-story-tag">{chapter.subtitle}</span>
                    <h3 className="dining-story-title">{chapter.title}</h3>
                    <p className="dining-story-lede">{chapter.lede}</p>
                    <div className="dining-story-spec">
                      <span>{chapter.spec}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

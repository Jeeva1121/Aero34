import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SUITES_AND_AIRPORTS = [
  {
    id: 'first-class-suite',
    model: "First Class Sky Suite",
    role: "Private Oceanic Sanctuary",
    fullImg: "/inside-airplane-luxury.jpg",
    description: "The pinnacle of private transatlantic travel. Features a handcrafted lie-flat double bed, warm ambient evening illumination, private dining suite, and panoramic passenger windows looking out over ocean clouds.",
    highlight: "Lie-Flat Double Bed • Window Cloud View • Ambient Evening Glow",
    route: "Paris ✈ New York",
    terminal: "Terminal 2e • Private departure suite"
  },
  {
    id: 'airport-terminal-hub',
    model: "Flagship Terminal Hub",
    role: "Global Departure Concourse",
    fullImg: "/airport-terminal.jpg",
    description: "Expansive glass curtain walls overlooking long-haul passenger airliners docked at boarding gates during golden hour sunset. Designed with natural light, polished terrazzo, and serene private departure lounges.",
    highlight: "Panoramic Tarmac Views • Glass Jet Bridges • Dedicated Departure Lounge",
    route: "London ✈ Tokyo",
    terminal: "Terminal 5 Concourse • Runway 27l"
  },
  {
    id: 'dreamliner-cabin',
    model: "Dreamliner Sky Cabin",
    role: "Widebody Oceanic Interior",
    fullImg: "/inside-airplane-cabin.jpg",
    description: "Engineered for restful transoceanic journeys. Features lie-flat ergonomic suites, calming blue circadian lighting, smart electrochromic dimming windows, and higher cabin atmospheric humidity.",
    highlight: "Circadian Mood Lighting • Smart Dimmable Windows • Quiet HEPA Cabin",
    route: "New York ✈ London",
    terminal: "Transatlantic Service • Flight 34"
  }
];

/**
 * FleetShowcase: Full-Page GSAP Bottom-to-Top Slider.
 * 100% Width Full-Bleed 4K Photography covering the entire viewport.
 * Sharp square cards & badges (Zero rounded pills, zero toggle buttons).
 * Powered by Ceraso for titles and SwilyBright for editorial typography.
 */
export default function FleetShowcase() {
  const containerRef = useRef(null);
  const slidesWrapperRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ctx;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        const slideEls = gsap.utils.toArray('.fleet-fullscreen-slide');
        if (slideEls.length < 2) return;

        // Ensure slides 1 and 2 start below the screen
        gsap.set(slideEls[1], { yPercent: 100 });
        gsap.set(slideEls[2], { yPercent: 100 });

        // Master Pinned Bottom-to-Top GSAP Scroll Slider
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            pin: true,
            start: 'top top',
            end: () => `+=${slideEls.length * 110}%`,
            pinSpacing: true,
            scrub: 1.2,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          }
        });

        // ------------------------------------------------------------------
        // SLIDE 0: First Class Sky Suite (Seamless GSAP Transition from Flight Cruise)
        // ------------------------------------------------------------------
        tl.fromTo(
          slideEls[0],
          { opacity: 0.9, scale: 1.04 },
          { opacity: 1, scale: 1.0, duration: 0.8, ease: 'power2.out' },
          0
        )
        .fromTo(
          '.slide-card-0',
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          0.05
        )
        .fromTo(
          '.slide-top-bar-0',
          { y: -25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
          0.1
        );

        // ------------------------------------------------------------------
        // SLIDE 1: Flagship Terminal Hub (Slides UP from bottom 100%)
        // ------------------------------------------------------------------
        tl.to(
          slideEls[1],
          {
            yPercent: 0,
            ease: 'none',
            duration: 1.2,
          },
          0.8
        )
        .fromTo(
          '.slide-card-1',
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          1.2
        )
        .fromTo(
          '.slide-top-bar-1',
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
          1.3
        );

        // ------------------------------------------------------------------
        // SLIDE 2: Dreamliner Sky Cabin (Slides UP from bottom 100%)
        // ------------------------------------------------------------------
        tl.to(
          slideEls[2],
          {
            yPercent: 0,
            ease: 'none',
            duration: 1.2,
          },
          2.0
        )
        .fromTo(
          '.slide-card-2',
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          2.4
        )
        .fromTo(
          '.slide-top-bar-2',
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
          2.5
        );
      }, container);
    }, 40);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="flagship-section"
      className="fleet-slider-container"
      aria-label="Commercial Aircraft Cabins and Modern International Airport Terminals"
    >
      <div ref={slidesWrapperRef} className="fleet-slides-stage">
        {SUITES_AND_AIRPORTS.map((item, idx) => (
          <div
            key={item.id}
            className={`fleet-fullscreen-slide slide-index-${idx}`}
            style={{ zIndex: idx + 5 }}
          >
            {/* 100% WIDTH FULL-BLEED 4K PHOTO BACKGROUND */}
            <div className="full-width-photo-stage">
              <img
                src={item.fullImg}
                alt={item.model}
                className="full-width-bg-photo"
              />
              {/* Cinematic Vignette Overlay */}
              <div className="full-width-photo-vignette" />
            </div>

            {/* FULL SLIDE CONTENT OVERLAY */}
            <div className="full-width-content-overlay">
              {/* Top Bar with Sleek Square Badges */}
              <div className={`full-slide-top-bar slide-top-bar-${idx}`}>
                <div className="square-meta-badge">
                  <span>{item.role}</span>
                </div>
                <div className="square-route-badge">
                  <span>{item.route}</span>
                </div>
              </div>

              {/* Bottom Aerospace Square Card */}
              <div className={`aerospace-square-card slide-card-${idx}`}>
                <div className="square-card-header">
                  <span className="square-card-terminal">{item.terminal}</span>
                  <h3 className="square-card-title">{item.model}</h3>
                </div>

                <p className="square-card-narrative">{item.description}</p>

                <div className="square-card-hairline" />

                <div className="square-card-amenities">
                  <span className="square-amenities-label">Key Highlights</span>
                  <span className="square-amenities-text">{item.highlight}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

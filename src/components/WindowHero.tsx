import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface WindowHeroProps {
  onExploreNext?: () => void;
}

export const WindowHero: React.FC<WindowHeroProps> = ({ onExploreNext }) => {
  const containerRef = useRef<HTMLElement>(null);
  const windowWrapperRef = useRef<HTMLDivElement>(null);
  const cloudLeftRef = useRef<HTMLImageElement>(null);
  const cloudRightRef = useRef<HTMLImageElement>(null);
  const titleWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heroEl = containerRef.current;
    if (!heroEl) return;

    const ctx = gsap.context(() => {
      // Gentle subtle zoom on passenger window as user scrolls
      if (windowWrapperRef.current) {
        gsap.to(windowWrapperRef.current, {
          scale: 1.08,
          y: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: heroEl,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      // Pure white clouds part sideways at the bottom as you scroll
      if (cloudLeftRef.current) {
        gsap.to(cloudLeftRef.current, {
          xPercent: -85,
          opacity: 0.1,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: heroEl,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      if (cloudRightRef.current) {
        gsap.to(cloudRightRef.current, {
          xPercent: 85,
          opacity: 0.1,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: heroEl,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      // Title soft lift
      if (titleWrapperRef.current) {
        gsap.to(titleWrapperRef.current, {
          y: -40,
          opacity: 0.35,
          ease: 'none',
          scrollTrigger: {
            trigger: heroEl,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }
    }, heroEl);

    return () => ctx.revert();
  }, []);

  const handleScrollDown = () => {
    if (onExploreNext) {
      onExploreNext();
    } else {
      const flyby = document.getElementById('flyby-section');
      if (flyby) {
        flyby.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
      }
    }
  };

  return (
    <section ref={containerRef} className="window-hero-container" id="window-hero">
      <div className="window-hero-stage">
        {/* Authentic Passenger Window Photo */}
        <div ref={windowWrapperRef} className="window-hero-full-rig">
          <img
            src="/hero-window-nyc-liberty.png"
            alt="Commercial airliner passenger window looking out at sky and skyline"
            loading="eager"
            decoding="async"
            className="passenger-window-backdrop-img"
          />

          {/* Acrylic Double-Pane Glare */}
          <div className="window-hero-glare" aria-hidden="true" />
        </div>

        {/* Two pure white clouds parting sideways at bottom */}
        <div className="window-parting-clouds-wrapper" aria-hidden="true">
          <img
            ref={cloudLeftRef}
            src="/cloud-single.png"
            alt=""
            loading="eager"
            decoding="async"
            className="parting-cloud parting-cloud-left"
          />
          <img
            ref={cloudRightRef}
            src="/cloud-4k-fluffy.png"
            alt=""
            loading="eager"
            decoding="async"
            className="parting-cloud parting-cloud-right"
          />
        </div>

        {/* Pure Clean Stark White Headline — Zero Slashes */}
        <div ref={titleWrapperRef} className="window-hero-minimal-title-box">
          <p className="minimal-eyebrow">Direct Long-Haul Aviation</p>
          <h1 className="window-hero-headline">ABOVE THE CLOUDS</h1>
        </div>

        {/* Clean Scroll Cue Button */}
        <div className="window-scroll-hint-wrapper">
          <button
            type="button"
            className="luxe-scroll-btn"
            onClick={handleScrollDown}
            aria-label="Scroll down to transition to flight"
          >
            <span>Take Flight ↓</span>
          </button>
        </div>
      </div>
    </section>
  );
};

import React, { useEffect, useRef } from 'react';
import Magnet from './ui/Magnet';
import BlurText from './ui/BlurText';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * WindowHero: 21st.dev & ReactBits Inspired Cabin Portal
 * - Passenger Window looking out at sky, engine & clouds
 * - Kinetic BlurText typography for "ABOVE THE CLOUDS" in straight ZT Chintzy
 * - Authentic double-pane cabin window glare with subtle perspective tilt
 * - Two pure white clouds parting sideways on scroll
 * - ReactBits Magnet button for "Take Flight"
 * - Strictly NO unnecessary words with slashes
 */
export default function WindowHero({ onExploreNext }) {
  const containerRef = useRef(null);
  const windowWrapperRef = useRef(null);
  const cloudLeftRef = useRef(null);
  const cloudRightRef = useRef(null);
  const titleWrapperRef = useRef(null);
  const eyebrowRef = useRef(null);
  const scrollHintRef = useRef(null);

  useEffect(() => {
    const heroEl = containerRef.current;
    if (!heroEl) return;

    const ctx = gsap.context(() => {
      // Gentle, subtle zoom on scroll - never loses the window frame
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

      // Parting clouds drift sideways on scroll
      if (cloudLeftRef.current) {
        gsap.to(cloudLeftRef.current, {
          xPercent: -90,
          opacity: 0.2,
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
          xPercent: 90,
          opacity: 0.2,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: heroEl,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      // Title subtle float and soft fade on scroll
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

  return (
    <section ref={containerRef} className="window-hero-container" id="window-hero">
      <div className="window-hero-stage">
        {/* Full-view authentic passenger cabin window photo */}
        <div ref={windowWrapperRef} className="window-hero-full-rig">
          <img
            src="/hero-window-nyc.png"
            alt="Commercial airliner passenger window looking out at New York City, Statue of Liberty, and Manhattan skyline"
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

        {/* Straight ZT Chintzy Headline with ReactBits BlurText (Pure Stark White, Zero Colors, No Italics, NO slashes) */}
        <div ref={titleWrapperRef} className="window-hero-minimal-title-box">
          <p ref={eyebrowRef} className="minimal-eyebrow">
            Transoceanic First Class
          </p>
          <h1 className="window-hero-headline">
            <BlurText text="ABOVE THE CLOUDS" as="span" animateBy="words" delay={0.2} />
          </h1>
        </div>

        {/* ReactBits Magnet Take Flight Button */}
        <div ref={scrollHintRef} className="window-scroll-hint-wrapper">
          <Magnet strength={0.4} activeDistance={50}>
            <button
              type="button"
              className="modern-magnet-flight-btn"
              onClick={onExploreNext}
              aria-label="Scroll to transition to flight"
            >
              <span className="magnet-btn-glow" aria-hidden="true" />
              <span className="magnet-btn-text">Take Flight</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
            </button>
          </Magnet>
        </div>
      </div>
    </section>
  );
}

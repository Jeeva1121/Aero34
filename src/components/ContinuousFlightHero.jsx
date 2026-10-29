import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ContinuousFlightHero: 100% Seamless Aviation Journey.
 * 1. Hero Page: Passenger Window View with gentle, subtle zoom (scale 1.10 - never over-zoomed).
 * 2. Transition to Flight: Commercial airliner gliding center stage across open sky and clouds.
 * 3. Typography: OdenaGlamour for "Above the Clouds" and "Transition to Flight".
 * 4. Zero empty broken pages, zero white gaps.
 */
export default function ContinuousFlightHero({ onExploreDestinations }) {
  const containerRef = useRef(null);
  const pinnedStageRef = useRef(null);
  const windowRigRef = useRef(null);
  const cloudLeftRef = useRef(null);
  const cloudRightRef = useRef(null);
  const windowTitleRef = useRef(null);
  const scrollCueRef = useRef(null);

  // Flight Cruise elements
  const flightCorridorRef = useRef(null);
  const flightHeaderRef = useRef(null);
  const airplaneRef = useRef(null);
  const cloudBackgroundRef = useRef(null);
  const cloudMidgroundRef = useRef(null);
  const cloudEndRightRef = useRef(null);
  const cloudForegroundRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const stage = pinnedStageRef.current;
    if (!container || !stage) return;

    let ctx;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        // Master Continuous GSAP Timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            pin: stage,
            start: 'top top',
            end: '+=300%',
            pinSpacing: true,
            scrub: 1.2,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // ==========================================
        // PHASE 1: Gentle slight zoom on passenger window (never over-zoomed)
        // ==========================================
        tl.to(
          windowRigRef.current,
          {
            scale: 1.10,
            transformOrigin: '48% 44%',
            ease: 'power1.inOut',
            duration: 1.2,
          },
          0
        );

        // Parting clouds slide away sideways
        if (cloudLeftRef.current) {
          tl.to(
            cloudLeftRef.current,
            {
              xPercent: -120,
              yPercent: 8,
              opacity: 0,
              ease: 'power1.inOut',
              duration: 1.0,
            },
            0
          );
        }

        if (cloudRightRef.current) {
          tl.to(
            cloudRightRef.current,
            {
              xPercent: 120,
              yPercent: 8,
              opacity: 0,
              ease: 'power1.inOut',
              duration: 1.0,
            },
            0
          );
        }

        // Window hero title lifts and dissolves
        if (windowTitleRef.current) {
          tl.to(
            windowTitleRef.current,
            {
              opacity: 0,
              y: -35,
              ease: 'power1.out',
              duration: 0.6,
            },
            0.05
          );
        }

        // Scroll cue fades out immediately
        if (scrollCueRef.current) {
          tl.to(
            scrollCueRef.current,
            {
              opacity: 0,
              y: 20,
              duration: 0.4,
            },
            0
          );
        }

        // Window bezel fades smoothly as Transition to Flight takes over
        tl.to(
          windowRigRef.current,
          {
            opacity: 0,
            ease: 'power1.in',
            duration: 0.5,
          },
          0.85
        );

        // ==========================================
        // PHASE 2: Transition to Flight (Airliner & Clouds)
        // ==========================================
        if (flightCorridorRef.current) {
          tl.fromTo(
            flightCorridorRef.current,
            { opacity: 0 },
            { opacity: 1, ease: 'power1.out', duration: 0.6 },
            0.8
          );
        }

        // "Transition to Flight" Header reveals
        if (flightHeaderRef.current) {
          tl.fromTo(
            flightHeaderRef.current,
            { opacity: 0, y: 35 },
            { opacity: 1, y: 0, ease: 'power2.out', duration: 0.8 },
            0.9
          ).to(
            flightHeaderRef.current,
            { opacity: 0.9, y: -15, ease: 'power1.inOut', duration: 1.2 },
            1.8
          );
        }

        // Commercial Passenger Airliner: Cruises center stage
        tl.fromTo(
          airplaneRef.current,
          {
            x: '25vw',
            y: '4vh',
            rotate: 2,
            scale: 0.96,
            opacity: 0.85,
          },
          {
            x: '0vw',
            y: '0vh',
            rotate: 0,
            scale: 1.04,
            opacity: 1,
            ease: 'power1.out',
            duration: 1.2,
          },
          0.9
        ).to(
          airplaneRef.current,
          {
            x: '-45vw',
            y: '-3vh',
            rotate: -1.8,
            scale: 1.1,
            ease: 'power1.in',
            duration: 1.2,
          },
          2.0
        );

        // Parallax Clouds Drifting
        if (cloudBackgroundRef.current) {
          tl.fromTo(
            cloudBackgroundRef.current,
            { xPercent: 12, yPercent: 4 },
            { xPercent: -28, yPercent: -4, ease: 'none', duration: 2.6 },
            0.8
          );
        }

        if (cloudMidgroundRef.current) {
          tl.fromTo(
            cloudMidgroundRef.current,
            { xPercent: 20, yPercent: 6 },
            { xPercent: -45, yPercent: -8, ease: 'none', duration: 2.6 },
            0.8
          );
        }

        if (cloudForegroundRef.current) {
          tl.fromTo(
            cloudForegroundRef.current,
            { xPercent: 50, yPercent: 10, scale: 0.95 },
            { xPercent: -65, yPercent: -10, scale: 1.15, ease: 'none', duration: 2.6 },
            0.8
          );
        }

        // Clouds billowing into the right side at end of flight
        if (cloudEndRightRef.current) {
          tl.fromTo(
            cloudEndRightRef.current,
            {
              xPercent: 70,
              yPercent: 20,
              opacity: 0,
              scale: 0.85,
            },
            {
              xPercent: 0,
              yPercent: -5,
              opacity: 1,
              scale: 1.15,
              ease: 'power2.out',
              duration: 1.3,
            },
            1.8
          );
        }

        // GSAP Staggered Feature Cards reveal
        if (featuresRef.current) {
          tl.fromTo(
            '.flyby-feature-card',
            { opacity: 0, y: 30, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, stagger: 0.1, ease: 'power2.out', duration: 0.8 },
            1.1
          );
        }
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
      className="continuous-hero-container"
      id="window-hero"
      aria-label="Transatlantic Passenger Flight Experience"
    >
      <div ref={pinnedStageRef} className="continuous-hero-pinned-stage">
        {/* Natural Sky Blue Backdrop */}
        <div className="continuous-sky-backdrop" aria-hidden="true" />

        {/* ===================================================================
            LAYER 1: Authentic Passenger Window Rig (Crisp, subtle gentle zoom)
            =================================================================== */}
        <div ref={windowRigRef} className="continuous-window-rig">
          <img
            src="/passenger-window-user.png"
            alt="Commercial airliner passenger window looking out at sky, engine, and clouds"
            className="passenger-window-backdrop-img"
          />

          {/* Acrylic Double-Pane Glare */}
          <div className="window-hero-glare" aria-hidden="true" />

          {/* Parting Clouds at Bottom */}
          <div className="window-parting-clouds-wrapper" aria-hidden="true">
            <img
              ref={cloudLeftRef}
              src="/cloud-single.png"
              alt=""
              className="parting-cloud parting-cloud-left"
            />
            <img
              ref={cloudRightRef}
              src="/cloud-4k-fluffy.png"
              alt=""
              className="parting-cloud parting-cloud-right"
            />
          </div>

          {/* Window Minimal Title with OdenaGlamour (Small letters, no caps, no italics) */}
          <div ref={windowTitleRef} className="window-hero-minimal-title-box">
            <p className="minimal-eyebrow">Paris to New York</p>
            <h1 className="window-hero-headline">ABOVE THE CLOUDS</h1>
          </div>

          {/* Award-Winning Porcelain Scroll Trigger (Zero AI Icons, Pure Editorial Luxury) */}
          <div ref={scrollCueRef} className="window-scroll-hint-wrapper">
            <button
              className="luxe-scroll-btn"
              onClick={() => {
                if (window.__lenis) {
                  window.__lenis.scrollTo(window.innerHeight * 1.5, { duration: 1.2 });
                } else {
                  window.scrollTo({ top: window.innerHeight * 1.5, behavior: 'smooth' });
                }
              }}
              aria-label="Scroll to fly across the ocean"
            >
              <span className="luxe-scroll-fill" aria-hidden="true" />
              <span className="luxe-scroll-label">Take Flight</span>
            </button>
          </div>
        </div>

        {/* ===================================================================
            LAYER 2: Transition to Flight Page (Airliner & Moving Clouds)
            =================================================================== */}
        <div ref={flightCorridorRef} className="continuous-flight-corridor" id="flyby-section">
          {/* Transition to Flight Editorial Header */}
          <div ref={flightHeaderRef} className="flyby-header-wrapper">
            <h2 className="flyby-title">TRANSITION TO FLIGHT</h2>
            <p className="flyby-subtitle">
              Cruising peacefully above the cloud deck on transoceanic routes.
            </p>
          </div>

          {/* Cloud Parallax + Airliner Center Stage */}
          <div className="flight-corridor-stage" aria-hidden="true">
            {/* Deep Cloud Bank */}
            <img
              ref={cloudBackgroundRef}
              src="/cloud-4k-fluffy.png"
              alt=""
              className="flyby-cloud cloud-bg"
            />

            {/* Midground Fluffy Cloud Bank */}
            <img
              ref={cloudMidgroundRef}
              src="/cloud-4k-fluffy.png"
              alt=""
              className="flyby-cloud cloud-mid"
            />

            {/* The Commercial Passenger Airliner */}
            <div ref={airplaneRef} className="passenger-airplane-vessel">
              <img
                src="/passenger-airplane.png"
                alt="Commercial passenger airliner cruising above clouds"
                className="airplane-img-render"
              />
              <div className="wingtip-vapor-line vapor-top" />
              <div className="wingtip-vapor-line vapor-bottom" />
            </div>

            {/* Billowing clouds on right at end of flight */}
            <img
              ref={cloudEndRightRef}
              src="/cloud-4k-fluffy.png"
              alt=""
              className="flyby-cloud cloud-end-right"
            />

            {/* Foreground Fluffy Cloud Drift */}
            <img
              ref={cloudForegroundRef}
              src="/cloud-single.png"
              alt=""
              className="flyby-cloud cloud-fg"
            />
          </div>

          {/* Feature Cards with GSAP (Clean, no ticks, no buzzwords) */}
          <div ref={featuresRef} className="flyby-features-row">
            <div className="flyby-feature-card">
              <h4>Cabin Quietness</h4>
              <p>High-bypass turbofans engineered for peaceful, restful journeys across oceans.</p>
            </div>

            <div className="flyby-feature-card">
              <h4>Fresh Air</h4>
              <p>Advanced HEPA filtration providing continuous outdoor atmospheric air renewal.</p>
            </div>

            <div className="flyby-feature-card">
              <h4>Smooth Flight</h4>
              <p>Lightweight composite wings engineered to flex gently and dampen turbulence.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

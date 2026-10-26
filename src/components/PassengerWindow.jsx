import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * PassengerWindow: An authentic supersonic airplane passenger cabin window.
 * Pinned with GSAP ScrollTrigger. As the user scrolls:
 * - The clouds drift and cruise past the window at 43,000 feet.
 * - Flight telemetry counters (Altitude, Mach Speed, Temperature) scrub in real time.
 * - The aircraft wing banks through the clouds with realistic aerodynamic lighting.
 */
export default function PassengerWindow() {
  const windowSectionRef = useRef(null);
  const windowFrameRef = useRef(null);
  const cloudFrontRef = useRef(null);
  const cloudBackRef = useRef(null);
  const cloudPuff3Ref = useRef(null);
  const wingRef = useRef(null);
  const sunGlareRef = useRef(null);

  // Telemetry HUD text refs for scroll-scrubbed counters
  const altValueRef = useRef(null);
  const machValueRef = useRef(null);
  const tempValueRef = useRef(null);

  useEffect(() => {
    const section = windowSectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Pinned GSAP ScrollTrigger timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=140%', // 140vh of scroll exploration inside the passenger view
          pin: true,
          pinSpacing: true,
          scrub: 1.2,
          invalidateOnRefresh: true,
        }
      });

      // 1. Camera pushes closer to the passenger window (Dolly-in)
      tl.fromTo(
        windowFrameRef.current,
        { scale: 0.92, rotateX: 6 },
        { scale: 1.06, rotateX: 0, ease: 'none' },
        0
      );

      // 2. Clouds stream past the window at different parallax speeds (High-speed forward cruising)
      if (cloudFrontRef.current) {
        tl.fromTo(
          cloudFrontRef.current,
          { xPercent: 40, yPercent: 15, scale: 1.1 },
          { xPercent: -70, yPercent: -10, scale: 1.25, ease: 'none' },
          0
        );
      }

      if (cloudBackRef.current) {
        tl.fromTo(
          cloudBackRef.current,
          { xPercent: 20, yPercent: 5, scale: 0.95 },
          { xPercent: -45, yPercent: -5, scale: 1.05, ease: 'none' },
          0
        );
      }

      if (cloudPuff3Ref.current) {
        tl.fromTo(
          cloudPuff3Ref.current,
          { xPercent: 60, yPercent: 30, opacity: 0.4 },
          { xPercent: -90, yPercent: -15, opacity: 0.85, ease: 'none' },
          0
        );
      }

      // 3. Aircraft wing banks gently through the clouds
      if (wingRef.current) {
        tl.fromTo(
          wingRef.current,
          { rotate: -3, yPercent: 4 },
          { rotate: 2, yPercent: -3, ease: 'none' },
          0
        );
      }

      // 4. Sun glare sweeps across the double-pane acrylic window
      if (sunGlareRef.current) {
        tl.fromTo(
          sunGlareRef.current,
          { xPercent: -50, opacity: 0.3 },
          { xPercent: 80, opacity: 0.7, ease: 'none' },
          0
        );
      }

      // 5. Dynamic Telemetry Counter Scrubbing
      const telemetryObj = { alt: 14000, mach: 0.72, temp: -18 };
      tl.to(
        telemetryObj,
        {
          alt: 43000,
          mach: 1.85,
          temp: -56,
          ease: 'none',
          onUpdate: () => {
            if (altValueRef.current) {
              altValueRef.current.textContent = `${Math.round(telemetryObj.alt).toLocaleString()} FT`;
            }
            if (machValueRef.current) {
              const m = telemetryObj.mach.toFixed(2);
              machValueRef.current.textContent = `MACH ${m}`;
            }
            if (tempValueRef.current) {
              tempValueRef.current.textContent = `${Math.round(telemetryObj.temp)}°C`;
            }
          }
        },
        0
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={windowSectionRef}
      id="window-section"
      className="passenger-window-section"
      aria-label="Airplane Passenger Window Stratospheric View"
    >
      <div className="cabin-ambient-lighting" aria-hidden="true" />

      {/* Main Cabin Passenger View Container */}
      <div className="window-experience-wrapper">
        {/* Left Side: Editorial Flight Telemetry Info */}
        <div className="cabin-telemetry-sidebar">
          <div className="telemetry-badge">PASSENGER POV • CABIN SEAT 02A</div>
          <h2 className="telemetry-headline">
            Cruising the <span className="marker-text blue active">Stratosphere</span>
          </h2>
          <p className="telemetry-description">
            Looking out from Seat 02A of the flagship supersonic Overture. As you scroll, the aircraft climbs through the cloud deck into thin, supersonic air at FL430.
          </p>

          <div className="telemetry-gauges-grid">
            <div className="gauge-card">
              <span className="gauge-label">CRUISE ALTITUDE</span>
              <span ref={altValueRef} className="gauge-number">14,000 FT</span>
              <div className="gauge-status">CLIMBING TO FL430</div>
            </div>

            <div className="gauge-card">
              <span className="gauge-label">AIRSPEED</span>
              <span ref={machValueRef} className="gauge-number">MACH 0.72</span>
              <div className="gauge-status">SUPERSONIC CORRIDOR</div>
            </div>

            <div className="gauge-card">
              <span className="gauge-label">OUTSIDE TEMP</span>
              <span ref={tempValueRef} className="gauge-number">-18°C</span>
              <div className="gauge-status">STRATOSPHERIC SINK</div>
            </div>

            <div className="gauge-card">
              <span className="gauge-label">CABIN PRESSURE</span>
              <span className="gauge-number">6,000 FT</span>
              <div className="gauge-status">100% FRESH AIR FLOW</div>
            </div>
          </div>
        </div>

        {/* Center / Right: The Iconic Passenger Window */}
        <div className="passenger-window-rig">
          <div ref={windowFrameRef} className="airplane-window-frame">
            {/* Outer Bevel / Cabin Wall */}
            <div className="window-outer-rim">
              {/* Inner Acrylic Glass Chamber */}
              <div className="window-glass-viewport">
                {/* Stratospheric Sky Gradient */}
                <div className="stratosphere-sky" />

                {/* Aircraft Wing Slicing Through Outside */}
                <div ref={wingRef} className="airplane-wing-silhouette" aria-hidden="true">
                  <div className="wing-body" />
                  <div className="wing-tip-nav-light" />
                </div>

                {/* Cloud Layer 1: Midground Horizon Bed */}
                <img
                  ref={cloudBackRef}
                  src="/cloud-single.png"
                  alt=""
                  className="window-cloud cloud-layer-back"
                  aria-hidden="true"
                />

                {/* Cloud Layer 2: Majestic Foreground Passing Cloud */}
                <img
                  ref={cloudFrontRef}
                  src="/cloud-single.png"
                  alt=""
                  className="window-cloud cloud-layer-front"
                  aria-hidden="true"
                />

                {/* Cloud Layer 3: High-Speed Wisps */}
                <img
                  ref={cloudPuff3Ref}
                  src="/cloud-single.png"
                  alt=""
                  className="window-cloud cloud-layer-wisps"
                  aria-hidden="true"
                />

                {/* Glass Highlights, Glare & Scratches */}
                <div ref={sunGlareRef} className="window-sun-glare" aria-hidden="true" />
                <div className="window-glass-reflection" aria-hidden="true" />
                <div className="window-glass-breather-hole" title="Equalization Valve" />
              </div>
            </div>

            {/* Window Base Shade Slider Tab */}
            <div className="window-shade-slider" aria-hidden="true">
              <span className="shade-handle" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

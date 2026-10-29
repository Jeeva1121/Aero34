import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SupersonicFlyby: A sleek supersonic passenger jet cruising from right to left
 * horizontally across the screen through 4K clouds using GSAP ScrollTrigger scrub.
 */
export default function SupersonicFlyby() {
  const sectionRef = useRef(null);
  const jetRef = useRef(null);
  const cloudForegroundRef = useRef(null);
  const cloudBackgroundRef = useRef(null);
  const shockwaveRef = useRef(null);
  const machBadgeRef = useRef(null);
  const machCounterRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ctx;
    const timer = setTimeout(() => {
      if (!section.parentNode) return;

      ctx = gsap.context(() => {
        // Pinned GSAP ScrollTrigger timeline for supersonic flyby
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=150%', // 150vh of horizontal flight travel
            pin: true,
            pinSpacing: true,
            scrub: 1.2,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          }
        });

        // 1. Supersonic Jet flies horizontally from right to left across the screen
        tl.fromTo(
          jetRef.current,
          {
            x: '110vw',
            y: '6vh',
            rotate: 3,
            scale: 0.95,
          },
          {
            x: '-120vw',
            y: '-8vh',
            rotate: -2,
            scale: 1.05,
            ease: 'none',
          },
          0
        );

        // 2. Foreground pure white 4K cloud banks drift with fast parallax
        if (cloudForegroundRef.current) {
          tl.fromTo(
            cloudForegroundRef.current,
            { xPercent: 40, yPercent: 10, scale: 1 },
            { xPercent: -80, yPercent: -15, scale: 1.25, ease: 'none' },
            0
          );
        }

        // 3. Background pure white cloud layer drifts slower
        if (cloudBackgroundRef.current) {
          tl.fromTo(
            cloudBackgroundRef.current,
            { xPercent: 20, yPercent: 0 },
            { xPercent: -40, yPercent: -5, ease: 'none' },
            0
          );
        }

        // 4. Sonic boom shockwave expands and fades as jet reaches center
        if (shockwaveRef.current) {
          tl.fromTo(
            shockwaveRef.current,
            { scale: 0.2, opacity: 0 },
            { scale: 2.2, opacity: 0.8, duration: 0.4, ease: 'power2.out' },
            0.35
          ).to(
            shockwaveRef.current,
            { scale: 3.5, opacity: 0, duration: 0.35, ease: 'power2.in' },
            0.65
          );
        }

        // 5. Mach speed counter accelerates to Mach 2.2
        const speedObj = { mach: 1.0 };
        tl.to(
          speedObj,
          {
            mach: 2.2,
            ease: 'none',
            onUpdate: () => {
              if (machCounterRef.current) {
                machCounterRef.current.textContent = `MACH ${speedObj.mach.toFixed(2)}`;
              }
            }
          },
          0
        );
      }, section);
    }, 40);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="supersonic-flyby-section" id="flyby-section">
      <div className="flyby-atmosphere-bg" />

      {/* Corridor Header */}
      <div className="flyby-header-wrapper">
        <div className="flyby-badge">SUPERSONIC CORRIDOR • FL600</div>
        <h2 className="flyby-title">
          Transatlantic <span className="marker-text red active">Supersonic</span> Flyby
        </h2>
        <p className="flyby-subtitle">
          Watch the flagship supersonic jet slice through high-altitude cloud banks at Mach 2.2. Powered by sustainable aviation propulsion.
        </p>

        {/* Live Telemetry Display */}
        <div ref={machBadgeRef} className="flyby-telemetry-cluster">
          <div className="telemetry-chip">
            <span className="chip-dim">VELOCITY</span>
            <span ref={machCounterRef} className="chip-bright">MACH 1.00</span>
          </div>

          <div className="telemetry-chip">
            <span className="chip-dim">CRUISING ALTITUDE</span>
            <span className="chip-bright">60,000 FT</span>
          </div>

          <div className="telemetry-chip">
            <span className="chip-dim">PARIS → NYC TIME</span>
            <span className="chip-bright">3H 15M</span>
          </div>
        </div>
      </div>

      {/* Flight Stage */}
      <div className="flight-corridor-stage" aria-hidden="true">
        {/* Background Clouds */}
        <img
          ref={cloudBackgroundRef}
          src="/cloud-4k-fluffy.png"
          alt=""
          className="flyby-cloud cloud-bg"
        />

        {/* The Sleek Jet Flying Right to Left */}
        <div ref={jetRef} className="supersonic-jet-vessel">
          <img
            src="/supersonic-jet.png"
            alt="Sleek Supersonic Jet flying horizontally"
            className="jet-img-render"
          />
          {/* Afterburner Particle Trail */}
          <div className="afterburner-thrust-trail" />
          {/* Sonic Shockwave Cone */}
          <div ref={shockwaveRef} className="shockwave-vapor-ring" />
        </div>

        {/* Foreground Clouds */}
        <img
          ref={cloudForegroundRef}
          src="/cloud-single.png"
          alt=""
          className="flyby-cloud cloud-fg"
        />
      </div>

      {/* Specifications Grid */}
      <div className="flyby-specs-grid">
        <div className="spec-card">
          <span className="spec-num">01</span>
          <h4>Variable Delta Wing</h4>
          <p>Optimized low-drag aerodynamics for whisper-quiet sonic signature over land.</p>
        </div>

        <div className="spec-card">
          <span className="spec-num">02</span>
          <h4>Four Symphony Turbofans</h4>
          <p>Medium-bypass turbofan engines engineered for sustained supersonic ocean transit.</p>
        </div>

        <div className="spec-card">
          <span className="spec-num">03</span>
          <h4>100% Net-Zero SAF</h4>
          <p>Certified for pure drop-in sustainable synthetic fuel with zero fossil dependency.</p>
        </div>
      </div>
    </section>
  );
}

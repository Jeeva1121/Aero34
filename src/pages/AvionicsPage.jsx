import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TELEMETRY_CARDS = [
  {
    label: "CRUISE ALTITUDE",
    value: "39,000 FT",
    numericTarget: 39000,
    unit: "FT",
    subtext: "Flight Level 390 • Transatlantic Oceanic Conformance",
    status: "OPTIMAL"
  },
  {
    label: "MACH VELOCITY",
    value: "MACH 0.85",
    numericTarget: 0.85,
    unit: "MACH",
    subtext: "492 Knots Groundspeed • Low Transonic Drag",
    status: "CRUISE LOCKED"
  },
  {
    label: "HEADING TRACK",
    value: "284° WNW",
    numericTarget: 284,
    unit: "° WNW",
    subtext: "Great Circle Trajectory • Oceanic Track Bravo",
    status: "NAV GPS LOCKED"
  },
  {
    label: "CABIN PRESSURE",
    value: "5,800 FT",
    numericTarget: 5800,
    unit: "FT",
    subtext: "Circadian Oxygenation • 18% Humidity Level",
    status: "RESTFUL CABIN"
  }
];

const FLIGHT_SYSTEMS = [
  {
    id: "hud-guidance",
    title: "Holographic HUD Guidance",
    body: "Collimated dual head-up displays project conformal flight vectors, zero-visibility synthetic terrain elevation contours, and dynamic runway guidance directly in the captain's field of view."
  },
  {
    id: "fly-by-wire",
    title: "Triplex Fly-By-Wire Envelope",
    body: "Triple-redundant primary flight computers continuously calculate aerodynamic load margins, preventing stalls and automatically damping atmospheric wind gusts for silky passenger comfort."
  },
  {
    id: "cpdlc-datalink",
    title: "CPDLC Oceanic Satellite Datalink",
    body: "Direct satellite datalink clearance with Shanwick and Gander Oceanic centers, eliminating HF radio noise and dynamically rerouting around Atlantic jet streams."
  },
  {
    id: "fadec-acoustic",
    title: "FADEC Digital Turbofan Control",
    body: "Dual-channel Full Authority Digital Engine Control precisely regulates high-bypass turbofans, slashing fuel consumption and maintaining a whisper-quiet acoustic footprint."
  }
];

/**
 * AvionicsPage: Flight Command & Avionics Systems.
 * Features 1:1 SQUARE Visual with brand new 4K sunset cockpit photography.
 * Interactive GSAP radar scan sweep, dynamic telemetry counters, 3D tilt, and sharp SQUARE CARDS.
 * Powered by Ceraso for titles and SwilyBright for editorial typography.
 */
export default function AvionicsPage() {
  const sectionRef = useRef(null);
  const squareCockpitRef = useRef(null);
  const cockpitImgRef = useRef(null);
  const radarScanRef = useRef(null);
  const telemetryGridRef = useRef(null);
  const systemsListRef = useRef(null);

  // Counter values for telemetry
  const [counters, setCounters] = useState({
    alt: 0,
    mach: 0,
    hdg: 0,
    press: 0
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // 1. Radar HUD Scan Beam Continuous Sweep
      if (radarScanRef.current) {
        gsap.to(radarScanRef.current, {
          yPercent: 120,
          repeat: -1,
          duration: 3.2,
          ease: 'power1.inOut',
          yoyo: true,
        });
      }

      // 2. Cockpit 1:1 Square Frame: 3D Perspective Tilt on Scroll
      if (squareCockpitRef.current && cockpitImgRef.current) {
        gsap.fromTo(
          squareCockpitRef.current,
          {
            rotateX: 8,
            scale: 0.94,
            opacity: 0.8,
            transformPerspective: 1200,
          },
          {
            rotateX: 0,
            scale: 1.0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: squareCockpitRef.current,
              start: 'top 85%',
              end: 'top 35%',
              scrub: 1,
            }
          }
        );

        // Subtle internal image parallax
        gsap.fromTo(
          cockpitImgRef.current,
          { scale: 1.15, yPercent: -4 },
          {
            scale: 1.0,
            yPercent: 4,
            ease: 'none',
            scrollTrigger: {
              trigger: squareCockpitRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            }
          }
        );
      }

      // 3. Telemetry Square Cards: GSAP Count-Up and Staggered Entrance
      if (telemetryGridRef.current) {
        const counterObj = { alt: 0, mach: 0, hdg: 0, press: 0 };

        gsap.timeline({
          scrollTrigger: {
            trigger: telemetryGridRef.current,
            start: 'top 78%',
            onEnter: () => {
              gsap.to(counterObj, {
                alt: 39000,
                mach: 0.85,
                hdg: 284,
                press: 5800,
                duration: 2.2,
                ease: 'power3.out',
                onUpdate: () => {
                  setCounters({
                    alt: Math.round(counterObj.alt),
                    mach: counterObj.mach.toFixed(2),
                    hdg: Math.round(counterObj.hdg),
                    press: Math.round(counterObj.press)
                  });
                }
              });
            }
          }
        })
        .from('.avionics-square-card', {
          y: 40,
          opacity: 0,
          stagger: 0.12,
          duration: 0.85,
          ease: 'power3.out',
        });
      }

      // 4. Flight Systems Pillars: Staggered Slide In
      if (systemsListRef.current) {
        gsap.from('.flight-system-pillar', {
          scrollTrigger: {
            trigger: systemsListRef.current,
            start: 'top 75%',
          },
          x: 35,
          opacity: 0,
          stagger: 0.15,
          duration: 0.85,
          ease: 'power3.out',
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="avionics-section"
      className="avionics-editorial-section"
      aria-labelledby="avionics-heading"
    >
      <div className="content-wrapper">
        {/* Editorial Header */}
        <header className="avionics-editorial-header">
          <p className="editorial-eyebrow">FLIGHT COMMAND & AVIONICS</p>
          <h2 id="avionics-heading" className="editorial-main-title">
            Flight Deck Systems
          </h2>
          <p className="editorial-lede">
            Modern high-resolution glass flight decks, synthetic vision HUD guidance, and triplex fly-by-wire envelope protection guiding transoceanic airliners through daylight and darkness.
          </p>
        </header>

        {/* 1:1 SQUARE Visual + Systems Pillars Grid */}
        <div className="avionics-editorial-grid">
          {/* 1:1 SQUARE Cockpit Visual with Radar HUD Sweep */}
          <div ref={squareCockpitRef} className="square-cockpit-frame">
            <img
              ref={cockpitImgRef}
              src="/cockpit-command-4k.jpg"
              alt="State-of-the-art commercial passenger airliner glass cockpit flight deck at sunset in 4K"
              className="square-cockpit-img"
            />
            {/* Seamless Vignette Overlay */}
            <div className="square-cockpit-gradient" />

            {/* Glowing Radar HUD Scan Line */}
            <div ref={radarScanRef} className="cockpit-hud-radar-beam" aria-hidden="true" />

            {/* Sharp SQUARE HUD Badges */}
            <div className="square-hud-cluster">
              <span className="square-hud-badge">HUD SYNTHETIC VISION</span>
              <span className="square-hud-badge">CPDLC SATELLITE</span>
              <span className="square-hud-badge">TRIPLEX FLY-BY-WIRE</span>
              <span className="square-hud-badge">FADEC F-LOW ACOUSTIC</span>
            </div>
          </div>

          {/* Systems Pillars Column */}
          <div ref={systemsListRef} className="avionics-pillars-column">
            {FLIGHT_SYSTEMS.map((sys) => (
              <div key={sys.id} className="flight-system-pillar">
                <div className="system-pillar-header">
                  <div className="system-square-indicator" />
                  <h3 className="pillar-heading">{sys.title}</h3>
                </div>
                <p className="pillar-body">{sys.body}</p>
                <div className="pillar-hairline" />
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Telemetry SQUARE Cards Grid (HAVE SQUARE CARDS MAN) */}
        <div ref={telemetryGridRef} className="avionics-telemetry-grid">
          {TELEMETRY_CARDS.map((item, idx) => {
            let displayVal = item.value;
            if (idx === 0 && counters.alt > 0) displayVal = `${counters.alt.toLocaleString()} FT`;
            if (idx === 1 && counters.mach > 0) displayVal = `MACH ${counters.mach}`;
            if (idx === 2 && counters.hdg > 0) displayVal = `${counters.hdg}° WNW`;
            if (idx === 3 && counters.press > 0) displayVal = `${counters.press.toLocaleString()} FT`;

            return (
              <div key={item.label} className="avionics-square-card">
                <div className="square-card-top-row">
                  <span className="square-telemetry-label">{item.label}</span>
                  <span className="square-telemetry-status">{item.status}</span>
                </div>
                <div className="square-telemetry-num">{displayVal}</div>
                <p className="square-telemetry-subtext">{item.subtext}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import React, { useEffect, useRef } from 'react';
import TiltedCard from './ui/TiltedCard';
import BlurText from './ui/BlurText';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    title: 'Acoustic Quietness',
    desc: 'High-bypass turbofans engineered for peaceful, restful journeys across oceans.',
    metric: '48 dB Cabin Sound',
  },
  {
    title: 'Atmospheric Air',
    desc: 'Advanced HEPA filtration providing continuous outdoor atmospheric air renewal.',
    metric: '100% Air Renewal',
  },
  {
    title: 'Aeroelastic Wings',
    desc: 'Lightweight composite wings engineered to flex gently and dampen turbulence.',
    metric: 'Smoothest Flight',
  },
];

/**
 * AirplaneFlyby: Transition to Flight Page (21st.dev & ReactBits Inspired)
 * - Airliner cruising peacefully above billowing cloud layers
 * - BlurText headline in straight ZT Chintzy
 * - 3 interactive TiltedCard feature cards with 3D perspective response
 * - Zero slashes, zero AI rainbow colors
 */
export default function AirplaneFlyby() {
  const sectionRef = useRef(null);
  const airplaneRef = useRef(null);
  const cloudBackgroundRef = useRef(null);
  const cloudMidgroundRef = useRef(null);
  const cloudEndRightRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Active Scroll Parallax: Airliner glides forward across the horizon on scroll
      gsap.fromTo(
        airplaneRef.current,
        { x: '10vw' },
        {
          x: '-18vw',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );

      // Deep cloud parallax on scroll
      if (cloudBackgroundRef.current) {
        gsap.to(cloudBackgroundRef.current, {
          xPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }

      // Midground clouds scroll parallax
      if (cloudMidgroundRef.current) {
        gsap.to(cloudMidgroundRef.current, {
          xPercent: -25,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.3,
          },
        });
      }

      // Right cloud bank scroll parallax
      if (cloudEndRightRef.current) {
        gsap.to(cloudEndRightRef.current, {
          xPercent: 24,
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.3,
          },
        });
      }

      // Staggered 3D entrance for Feature Cards
      gsap.fromTo(
        '.flyby-tilt-col',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 90%',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="airplane-flyby-section" id="flyby-section">
      {/* Daylight Sky Blue Backdrop */}
      <div className="airplane-sky-gradient" aria-hidden="true" />

      <div className="airplane-flyby-content-stage">
        {/* Transition to Flight Editorial Header (ZT Chintzy, Straight Pure White, NO slashes) */}
        <div className="flyby-header-wrapper">
          <span className="flyby-eyebrow">CRUISING ALTITUDE 43,000 FEET</span>
          <h2 className="flyby-title">
            <BlurText text="TRANSITION TO FLIGHT" as="span" animateBy="words" />
          </h2>
          <p className="flyby-subtitle">
            Cruising peacefully above the cloud deck on transoceanic routes.
          </p>
        </div>

        {/* Cinematic Flight Corridor */}
        <div className="flight-corridor-stage" aria-hidden="true">
          {/* Deep Cloud Bank */}
          <img
            ref={cloudBackgroundRef}
            src="/cloud-4k-fluffy.png"
            alt=""
            loading="eager"
            decoding="async"
            className="flyby-cloud cloud-bg"
          />

          {/* Midground Cloud Bank */}
          <img
            ref={cloudMidgroundRef}
            src="/cloud-4k-fluffy.png"
            alt=""
            loading="eager"
            decoding="async"
            className="flyby-cloud cloud-mid"
          />

          {/* Airliner Vessel */}
          <div ref={airplaneRef} className="passenger-airplane-vessel">
            <img
              src="/flight-image.png"
              alt="Commercial passenger airliner cruising above clouds"
              loading="eager"
              decoding="async"
              className="airplane-img-render"
            />
            {/* Aerodynamic Wingtip Vapor */}
            <div className="wingtip-vapor-line vapor-top" />
            <div className="wingtip-vapor-line vapor-bottom" />
          </div>

          {/* Clouds Billowing into the Right Side */}
          <img
            ref={cloudEndRightRef}
            src="/cloud-4k-fluffy.png"
            alt=""
            loading="eager"
            decoding="async"
            className="flyby-cloud cloud-end-right"
          />
        </div>

        {/* 21st.dev / ReactBits 3D TiltedCard Feature Row */}
        <div ref={featuresRef} className="flyby-features-row">
          {FEATURES.map((item, idx) => (
            <div key={idx} className="flyby-tilt-col">
              <TiltedCard maxTilt={9} scale={1.03} className="flyby-feature-card">
                <span className="card-metric-badge">{item.metric}</span>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </TiltedCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

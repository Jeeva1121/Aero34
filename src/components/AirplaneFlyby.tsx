import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    title: 'Acoustic Quietness',
    metric: '48 dBA Quiet Cabin',
    desc: 'High-bypass turbofans engineered for peaceful, restful journeys across oceans.',
  },
  {
    title: 'Atmospheric Air',
    metric: '100% Air Renewal',
    desc: 'Advanced hospital-grade HEPA filtration providing continuous outdoor air renewal every two minutes.',
  },
  {
    title: 'Aeroelastic Wings',
    metric: 'Smooth High Flight',
    desc: 'Lightweight composite wings engineered to flex gently and cruise above weather fronts at 47,000 feet.',
  },
];

export const AirplaneFlyby: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const airplaneRef = useRef<HTMLDivElement>(null);
  const cloudBackgroundRef = useRef<HTMLImageElement>(null);
  const cloudMidgroundRef = useRef<HTMLImageElement>(null);
  const cloudEndRightRef = useRef<HTMLImageElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Commercial airliner glides smoothly across the horizon as you scroll
      if (airplaneRef.current) {
        gsap.fromTo(
          airplaneRef.current,
          { x: '16vw', y: '2vh', rotate: 1.5 },
          {
            x: '-20vw',
            y: '-2vh',
            rotate: -1.2,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      }

      // Deep cloud parallax on scroll
      if (cloudBackgroundRef.current) {
        gsap.to(cloudBackgroundRef.current, {
          xPercent: -22,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }

      // Midground cloud parallax on scroll
      if (cloudMidgroundRef.current) {
        gsap.to(cloudMidgroundRef.current, {
          xPercent: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.3,
          },
        });
      }

      // Right cloud bank parallax on scroll
      if (cloudEndRightRef.current) {
        gsap.to(cloudEndRightRef.current, {
          xPercent: 25,
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.3,
          },
        });
      }

      // Staggered reveal for Feature Cards
      if (featuresRef.current) {
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
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="airplane-flyby-section" id="flyby-section">
      {/* Daylight Sky Blue Backdrop */}
      <div className="airplane-sky-gradient" aria-hidden="true" />

      <div className="airplane-flyby-content-stage">
        {/* Transition to Flight Header — Clean, Straight, Zero Slashes */}
        <div className="flyby-header-wrapper">
          <span className="minimal-eyebrow text-white/80 block mb-2">Cruising Altitude 47,000 Feet</span>
          <h2 className="flyby-title">TRANSITION TO FLIGHT</h2>
          <p className="flyby-subtitle">
            Cruising peacefully above the cloud deck on direct transoceanic routes.
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

          {/* Commercial Airliner Vessel */}
          <div ref={airplaneRef} className="passenger-airplane-vessel">
            <img
              src="/flight-image.png"
              alt="Passenger airliner cruising above clouds"
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

        {/* Feature Cards Row */}
        <div ref={featuresRef} className="flyby-features-row">
          {FEATURES.map((item, idx) => (
            <div key={idx} className="flyby-tilt-col">
              <div className="flyby-feature-card">
                <span className="card-metric-badge">{item.metric}</span>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

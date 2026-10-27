import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const AirplaneFlyby: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const airplaneRef = useRef<HTMLDivElement>(null);
  const cloudBackRef = useRef<HTMLImageElement>(null);
  const cloudMidRef = useRef<HTMLImageElement>(null);
  const cloudFrontRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const airplane = airplaneRef.current;
    if (!section || !airplane) return;

    const ctx = gsap.context(() => {
      // Airliner glides forward across the horizon on scroll
      gsap.fromTo(
        airplane,
        { x: '18vw', y: '4vh' },
        {
          x: '-22vw',
          y: '-6vh',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );

      // Deep cloud layer parallax
      if (cloudBackRef.current) {
        gsap.to(cloudBackRef.current, {
          xPercent: -20,
          yPercent: -5,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }

      // Midground cloud bank
      if (cloudMidRef.current) {
        gsap.to(cloudMidRef.current, {
          xPercent: -35,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.3,
          },
        });
      }

      // Foreground cloud drift
      if (cloudFrontRef.current) {
        gsap.to(cloudFrontRef.current, {
          xPercent: 30,
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.4,
          },
        });
      }

      // Feature cards stagger reveal
      gsap.fromTo(
        '.flyby-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 65%',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      title: 'Acoustic Silence',
      metric: '48 dB Sound Level',
      desc: 'Insulated engine pylons and triple-pane composite windows allow quiet conversation without raised voices.',
    },
    {
      title: 'Pure Cabin Atmosphere',
      metric: '100% Fresh Air',
      desc: 'Hospital-grade HEPA filters refresh the entire cabin atmosphere with fresh outdoor air every two minutes.',
    },
    {
      title: 'Smooth Cruise Altitude',
      metric: '45,000–47,000 Ft',
      desc: 'Cruising far above commercial airline traffic and storm systems for undisturbed rest and sleep.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="flyby-section"
      className="relative min-h-[95vh] w-full overflow-hidden bg-gradient-to-b from-[#87A8C8] via-[#B5CBE0] to-white py-24 flex flex-col justify-between"
    >
      {/* Title & Headline */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-6 text-center pt-8">
        <span className="inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-white/60 backdrop-blur-sm rounded-none border border-black/10 text-[#0A0A09] mb-4">
          Direct High-Altitude Flight
        </span>
        <h2 className="font-display text-4xl sm:text-6xl md:text-7xl text-[#0A0A09] tracking-tight leading-none mb-4">
          Above the Clouds.
        </h2>
        <p className="text-sm md:text-base text-[#0A0A09]/80 max-w-xl mx-auto leading-relaxed">
          Non-stop private air travel connecting major global cities with guaranteed direct departure slots.
        </p>
      </div>

      {/* Cinematic Clouds & Airliner Stage */}
      <div className="relative w-full h-[450px] my-4 pointer-events-none overflow-hidden flex items-center justify-center">
        {/* Background Clouds */}
        <img
          ref={cloudBackRef}
          src="/cloud-4k-fluffy.png"
          alt=""
          className="absolute -top-12 left-[-10%] w-[1100px] opacity-60"
        />

        {/* Midground Billowing Clouds */}
        <img
          ref={cloudMidRef}
          src="/cloud-single.png"
          alt=""
          className="absolute bottom-4 -left-20 w-[950px] opacity-75"
        />

        {/* Gliding Airliner Vessel */}
        <div ref={airplaneRef} className="relative z-10 w-[420px] sm:w-[540px] md:w-[680px]">
          <img
            src="/passenger-airplane.png"
            alt="Private long-haul airliner cruising smoothly"
            className="w-full h-auto drop-shadow-2xl"
          />
          {/* Subtle Wingtip Vapor Accents */}
          <div className="absolute top-[38%] left-[-12%] w-[18%] h-[2px] bg-white/60 blur-[1px] transform -rotate-6" />
          <div className="absolute bottom-[36%] left-[-14%] w-[20%] h-[2px] bg-white/60 blur-[1px] transform rotate-3" />
        </div>

        {/* Foreground Right Cloud */}
        <img
          ref={cloudFrontRef}
          src="/clouds.png"
          alt=""
          className="absolute -bottom-16 -right-24 w-[900px] opacity-80 z-20"
        />
      </div>

      {/* 3 Modern Feature Cards: Crisp Square Corners */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="flyby-card bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-none border border-[rgba(10,10,9,0.12)] shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
            >
              <div className="inline-block px-2.5 py-1 text-[11px] font-bold text-[#E8431A] bg-[#E8431A]/10 rounded-none mb-3">
                {f.metric}
              </div>
              <h3 className="font-display text-2xl text-[#0A0A09] mb-2">{f.title}</h3>
              <p className="text-xs sm:text-sm text-[#0A0A09]/75 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import React, { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const CabinPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stackWrapperRef = useRef<HTMLDivElement>(null);
  const cloudSectionRef = useRef<HTMLDivElement>(null);
  const cloud1Ref = useRef<HTMLImageElement>(null);
  const cloud2Ref = useRef<HTMLImageElement>(null);
  const cloud3Ref = useRef<HTMLImageElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // 1. Stacked Overlapping Cards (Desktop only)
      if (window.innerWidth >= 768 && stackWrapperRef.current) {
        const cards = gsap.utils.toArray<HTMLElement>('.stack-card');
        cards.forEach((card, i) => {
          if (i === cards.length - 1) return; // Last card doesn't scale down

          ScrollTrigger.create({
            trigger: card,
            start: 'top top',
            endTrigger: cards[i + 1],
            end: 'top top',
            pin: true,
            pinSpacing: false,
            scrub: true,
            animation: gsap.to(card, {
              scale: 0.94,
              opacity: 0.6,
              ease: 'none',
            }),
          });
        });
      }

      // 2. Clip-path reveals: inset(100% 0 0 0) to inset(0)
      const clipItems = gsap.utils.toArray<HTMLElement>('.clip-reveal-item');
      clipItems.forEach((item, idx) => {
        const isAlternate = idx % 2 === 1;
        gsap.fromTo(
          item,
          { clipPath: isAlternate ? 'inset(0 100% 0 0)' : 'inset(100% 0 0 0)' },
          {
            clipPath: 'inset(0% 0 0 0)',
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              end: 'top 35%',
              scrub: true,
            },
          }
        );
      });

      // 3. Cloud Parting Scrub: 3 transparent cloud cutouts moving in opposite xPercent directions
      if (cloudSectionRef.current && cloud1Ref.current && cloud2Ref.current && cloud3Ref.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: cloudSectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });

        tl.to(cloud1Ref.current, { xPercent: -50, ease: 'none' }, 0)
          .to(cloud2Ref.current, { xPercent: 60, ease: 'none' }, 0)
          .to(cloud3Ref.current, { xPercent: -30, ease: 'none' }, 0);
      }

      // 4. Marquee with velocity-driven timeScale and skewX
      if (marqueeTrackRef.current) {
        const marqueeTween = gsap.to(marqueeTrackRef.current, {
          xPercent: -50,
          repeat: -1,
          duration: 25,
          ease: 'none',
        });

        ScrollTrigger.create({
          onUpdate: (self) => {
            const velocity = self.getVelocity();
            const skew = Math.min(12, Math.max(-12, velocity / 180));
            const timeScale = 1 + Math.abs(velocity / 300);

            gsap.to(marqueeTween, {
              timeScale: timeScale,
              duration: 0.2,
              overwrite: 'auto',
            });

            gsap.to(marqueeTrackRef.current, {
              skewX: skew,
              duration: 0.3,
              overwrite: 'auto',
            });
          },
        });
      }
    }, container);

    return () => ctx.revert();
  }, []);

  const cabinSpecs = [
    {
      label: 'ACOUSTIC SUPPRESSION',
      headline: 'Sub-48 dBA Ambient Decibels at High Cruise',
      desc: 'Engineered triple-layer acoustic seals and insulated engine pylon dampers reduce interior flight noise to whisper levels. You can converse across the cabin without raising your voice.',
      photo: '/destinations/inside-airplane-luxury.jpg',
      stat: '47.8 dBA',
      statLabel: 'CABIN SOUND MEASUREMENT',
    },
    {
      label: 'ATMOSPHERIC REGULATION',
      headline: '3,800-Foot Equivalent Cabin Pressure',
      desc: 'Typical commercial flights pressurize cabins to 8,000 feet, causing dehydration and fatigue. Aero 34 airframes maintain an equivalent altitude of 3,800 to 4,100 feet, arriving with zero jet lag.',
      photo: '/destinations/first-class-suite.jpg',
      stat: '3,850 FT',
      statLabel: 'MAXIMUM CABIN ALTITUDE',
    },
    {
      label: 'SURGICAL AIR TURNOVER',
      headline: '100% Fresh Air Induction Every 120 Seconds',
      desc: 'Hospital-grade HEPA filters combined with continuous bleed air circulation replace the entire volume of cabin air every two minutes. No stale air recirculation.',
      photo: '/destinations/dreamliner-cabin.jpg',
      stat: '120 SEC',
      statLabel: 'TOTAL AIR RENEWAL CYCLE',
    },
    {
      label: 'ERGONOMIC SLEEP SUITE',
      headline: '82-Inch Lie-Flat Mattresses with Thermal Control',
      desc: 'Custom hand-stitched leather club suites transform into zero-gravity full flat sleeping berths with organic linen bedding and individual zonal climate regulation.',
      photo: '/destinations/sky-dining-luxury.jpg',
      stat: '82.5 IN',
      statLabel: 'FULL EXTENSION LENGTH',
    },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#EEEBE4]">
      {/* Header Section */}
      <section className="pt-20 pb-16 hairline-b">
        <div className="grid-12">
          <div className="col-span-12 md:col-span-8">
            <span className="micro-label text-[#E8431A]">Cabin Specifications</span>
            <h1 className="font-display text-5xl md:text-8xl mt-3 tracking-tight">
              Quiet Space. Pure Fresh Air.
            </h1>
          </div>
          <div className="col-span-12 md:col-span-4 flex flex-col justify-end mt-6 md:mt-0">
            <p className="prose-editorial text-sm">
              Certified for continuous long-haul flight across all oceanic airspaces. Every layout adheres to Gulfstream and Bombardier executive standards.
            </p>
          </div>
        </div>
      </section>

      {/* Marquee with Velocity Skew */}
      <div className="py-6 hairline-b bg-[#0A0A09] text-[#EEEBE4] overflow-hidden whitespace-nowrap">
        <div ref={marqueeTrackRef} className="flex gap-12 text-sm uppercase tracking-widest tabular font-semibold">
          <span>• 48 dBA Quiet Cabin</span>
          <span>• 3,850 FT Cabin Altitude</span>
          <span>• Fresh Air Every 120s</span>
          <span>• 82&quot; Lie-Flat Suites</span>
          <span>• High-Speed Satellite Datalink</span>
          <span>• 48 dBA Quiet Cabin</span>
          <span>• 3,850 FT Cabin Altitude</span>
          <span>• Fresh Air Every 120s</span>
          <span>• 82&quot; Lie-Flat Suites</span>
        </div>
      </div>

      {/* 1. Stacked Overlapping Cards with Scrub Scale & Alternating Clip Reveals */}
      <section ref={stackWrapperRef} className="py-24">
        <div className="grid-12">
          <div className="col-span-12 space-y-16">
            {cabinSpecs.map((spec) => (
              <div
                key={spec.label}
                className="stack-card clip-reveal-item p-8 md:p-14 hairline-all bg-[#F7F5F0] rounded-none"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-6">
                    <span className="micro-label text-[10px] text-[#E8431A]">{spec.label}</span>
                    <h2 className="font-display text-3xl md:text-5xl mt-3 mb-6 leading-tight">
                      {spec.headline}
                    </h2>
                    <p className="prose-editorial text-sm text-[var(--ink-80)] mb-8">
                      {spec.desc}
                    </p>

                    <div className="p-4 hairline-all bg-white inline-block">
                      <div className="font-display text-4xl tabular text-[var(--signal)]">
                        {spec.stat}
                      </div>
                      <div className="micro-label text-[9px] mt-1 text-[var(--ink-60)]">
                        {spec.statLabel}
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-6 photo-frame h-[360px] md:h-[440px]">
                    <img src={spec.photo} alt={spec.headline} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Cloud Parting Scrub Section */}
      <section
        ref={cloudSectionRef}
        className="min-h-[85vh] relative overflow-hidden bg-[#0A0A09] text-[#EEEBE4] flex items-center justify-center p-8 hairline-t"
      >
        {/* Transparent Clouds parting in opposite xPercent directions */}
        <img
          ref={cloud1Ref}
          src="/cloud-4k-fluffy.png"
          alt="Atmospheric clouds"
          className="absolute top-10 left-[-15%] w-[650px] opacity-40 pointer-events-none z-10"
        />
        <img
          ref={cloud2Ref}
          src="/cloud-single.png"
          alt="Stratospheric cloud formation"
          className="absolute bottom-10 right-[-15%] w-[750px] opacity-40 pointer-events-none z-10"
        />
        <img
          ref={cloud3Ref}
          src="/clouds.png"
          alt="High-altitude clouds"
          className="absolute top-1/2 left-[20%] w-[500px] opacity-20 pointer-events-none z-10"
        />

        {/* Revealed Headline in Center */}
        <div className="relative z-0 text-center max-w-3xl">
          <span className="micro-label text-[#E8431A]">High Altitude Clearance</span>
          <h2 className="font-display text-4xl md:text-7xl mt-4 leading-tight">
            Above Atmospheric Turbulence.
          </h2>
          <p className="text-sm md:text-base text-[#EEEBE4]/80 mt-6 max-w-xl mx-auto leading-relaxed">
            By cruising between FL430 and FL490, flights avoid the commercial flight levels (FL300–FL380), bypassing jet streams, weather fronts, and airway bottlenecks.
          </p>
          <div className="mt-8">
            <Link href="/request" className="btn-editorial bg-white text-[#0A0A09] hover:bg-[#E8431A] hover:text-white border-none py-3 px-8 text-xs">
              <span>Request Charter Dispatch</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

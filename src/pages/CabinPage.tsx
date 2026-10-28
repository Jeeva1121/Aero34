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
      // Stacked Overlapping Cards (Desktop only)
      if (window.innerWidth >= 768 && stackWrapperRef.current) {
        const cards = gsap.utils.toArray<HTMLElement>('.stack-card');
        cards.forEach((card, i) => {
          if (i === cards.length - 1) return;

          ScrollTrigger.create({
            trigger: card,
            start: 'top 88px',
            endTrigger: cards[i + 1],
            end: 'top 88px',
            pin: true,
            pinSpacing: false,
            scrub: true,
            animation: gsap.to(card, {
              scale: 0.96,
              opacity: 0.65,
              ease: 'none',
            }),
          });
        });
      }

      // Cloud Parting Scrub: 3 transparent cloud cutouts moving in opposite xPercent directions
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

      // Marquee with velocity-driven timeScale and skewX
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
            const skew = Math.min(10, Math.max(-10, velocity / 200));
            const timeScale = 1 + Math.abs(velocity / 350);

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
      label: 'Quiet Cabin Acoustic Sound',
      headline: 'Whisper-Quiet 48 dB Sound Levels',
      desc: 'Engineered triple-layer acoustic insulation and isolated engine pylons reduce interior sound to library quietness. You can speak across the suite in normal tones.',
      photo: '/inside-airplane-luxury.jpg',
      stat: '47.8 dB',
      statLabel: 'Interior Decibel Reading',
    },
    {
      label: 'Atmospheric Altitude Comfort',
      headline: 'Low 3,850-Foot Equivalent Cabin Pressure',
      desc: 'Typical commercial planes pressurize cabins to 8,000 feet, which leads to fatigue and dehydration. Our airframes maintain an equivalent altitude of 3,850 feet, ensuring you land feeling rested.',
      photo: '/first-class-suite.jpg',
      stat: '3,850 Ft',
      statLabel: 'Maximum Cabin Altitude',
    },
    {
      label: 'Continuous Air Renewal',
      headline: '100% Fresh Air Every Two Minutes',
      desc: 'Hospital-grade HEPA filters combined with continuous fresh bleed-air circulation refresh the entire cabin volume every 120 seconds.',
      photo: '/dreamliner-cabin.jpg',
      stat: '120 Sec',
      statLabel: 'Air Renewal Cycle',
    },
    {
      label: 'Ergonomic Sleeping Berths',
      headline: '82-Inch Lie-Flat Beds with Climate Control',
      desc: 'Handcrafted leather executive seats convert smoothly into fully flat sleeping berths with custom bedding and individual micro-climate temperature settings.',
      photo: '/sky-dining-luxury.jpg',
      stat: '82.5 In',
      statLabel: 'Full Bed Length',
    },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#EEEBE4]">
      {/* Header Section */}
      <section className="pt-20 pb-16 border-b border-black/10">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-3xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8431A]">
              Cabin Architecture
            </span>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl mt-3 tracking-tight text-[#0A0A09] leading-tight">
              Quiet Comfort in the Sky.
            </h1>
            <p className="text-sm sm:text-base text-[#0A0A09]/75 mt-5 leading-relaxed font-light">
              Every cabin is engineered for continuous long-haul flight across oceans. Unmatched acoustic quietness, low cabin altitude, and private lie-flat suites.
            </p>
          </div>
        </div>
      </section>

      {/* Modern Velocity Marquee */}
      <div className="py-4 border-b border-[rgba(10,10,9,0.08)] bg-[#0A0A09] text-[#EEEBE4] overflow-hidden whitespace-nowrap">
        <div ref={marqueeTrackRef} className="flex gap-10 text-xs uppercase tracking-widest font-semibold">
          <span>• 48 dB WHISPER SOUND</span>
          <span>• 3,850 FT CABIN ALTITUDE</span>
          <span>• 100% FRESH AIR RENEWAL</span>
          <span>• 82-INCH LIE-FLAT SUITES</span>
          <span>• HIGH-SPEED SATELLITE INTERNET</span>
          <span>• 48 dB WHISPER SOUND</span>
          <span>• 3,850 FT CABIN ALTITUDE</span>
          <span>• 100% FRESH AIR RENEWAL</span>
          <span>• 82-INCH LIE-FLAT SUITES</span>
        </div>
      </div>

      {/* Stacked Cards Section */}
      <section ref={stackWrapperRef} className="py-20 max-w-[1400px] mx-auto px-6">
        <div className="space-y-12">
          {cabinSpecs.map((spec) => (
            <div
              key={spec.label}
              className="stack-card p-8 sm:p-12 rounded-3xl bg-white border border-[rgba(10,10,9,0.08)] shadow-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8431A]">
                    {spec.label}
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl mt-2 mb-4 text-[#0A0A09] leading-tight">
                    {spec.headline}
                  </h2>
                  <p className="text-sm text-[#0A0A09]/75 leading-relaxed mb-6">
                    {spec.desc}
                  </p>

                  <div className="p-4 rounded-xl bg-[#F7F5F0] border border-[rgba(10,10,9,0.06)] inline-block">
                    <div className="font-display text-3xl sm:text-4xl font-bold text-[#E8431A]">
                      {spec.stat}
                    </div>
                    <div className="text-[10px] uppercase font-semibold text-[#0A0A09]/60 mt-0.5">
                      {spec.statLabel}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-6 h-[320px] sm:h-[400px] rounded-2xl overflow-hidden shadow-inner">
                  <img src={spec.photo} alt={spec.headline} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cloud Parting Section */}
      <section
        ref={cloudSectionRef}
        className="min-h-[75vh] relative overflow-hidden bg-[#0A0A09] text-[#EEEBE4] flex items-center justify-center p-8 rounded-3xl max-w-[1400px] mx-auto my-12"
      >
        <img
          ref={cloud1Ref}
          src="/cloud-4k-fluffy.png"
          alt=""
          className="absolute top-10 left-[-15%] w-[650px] opacity-40 pointer-events-none z-10"
        />
        <img
          ref={cloud2Ref}
          src="/cloud-single.png"
          alt=""
          className="absolute bottom-10 right-[-15%] w-[750px] opacity-40 pointer-events-none z-10"
        />
        <img
          ref={cloud3Ref}
          src="/clouds.png"
          alt=""
          className="absolute top-1/2 left-[20%] w-[500px] opacity-20 pointer-events-none z-10"
        />

        <div className="relative z-20 text-center max-w-2xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8431A]">
            Smooth Cruise
          </span>
          <h2 className="font-display text-4xl sm:text-6xl mt-3 text-white leading-tight">
            Above Atmospheric Turbulence.
          </h2>
          <p className="text-sm sm:text-base text-white/80 mt-4 leading-relaxed">
            Cruising at 47,000 feet places flights far above commercial flight lanes and weather storms for peaceful, smooth sleep.
          </p>
          <div className="mt-8">
            <Link
              href="/request"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#E8431A] text-white hover:bg-white hover:text-[#0A0A09] font-semibold text-xs uppercase tracking-wider transition-all duration-300 no-underline shadow-lg"
            >
              <span>Request a Seat</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

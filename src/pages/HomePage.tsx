import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchRoutes } from '../lib/api.js';
import { Route } from '../../shared/schemas.js';
import { AirplaneFlyby } from '../components/AirplaneFlyby.js';

gsap.registerPlugin(ScrollTrigger);

export const HomePage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroPhotoRef = useRef<HTMLImageElement>(null);
  const heroHeadlineRef = useRef<HTMLHeadingElement>(null);
  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    fetchRoutes().then(setRoutes).catch(() => {});
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const heroPhoto = heroPhotoRef.current;
      const heroHeadline = heroHeadlineRef.current;

      // Clean hero entrance animation
      const tl = gsap.timeline();
      if (heroPhoto) {
        tl.fromTo(
          heroPhoto,
          { scale: 1.08 },
          { scale: 1, duration: 1.2, ease: 'power2.out' }
        );
      }
      if (heroHeadline) {
        const words = heroHeadline.querySelectorAll('.hero-word');
        tl.fromTo(
          words,
          { yPercent: 80, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: 'power3.out' },
          '-=0.8'
        );
      }

      // Parallax on image stack
      const pImages = container.querySelectorAll('.parallax-img');
      pImages.forEach((img, i) => {
        gsap.to(img, {
          yPercent: (i % 2 === 0 ? -15 : 15),
          ease: 'none',
          scrollTrigger: {
            trigger: img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#EEEBE4]">
      {/* 1. Passenger Window Hero Section */}
      <section ref={heroRef} className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between p-6 sm:p-12">
        <div className="absolute inset-0 z-0">
          <img
            ref={heroPhotoRef}
            src="/hero-window-nyc-liberty.png"
            alt="Stratospheric flight window over Lower Manhattan"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0A0A09]/90 via-[#0A0A09]/20 to-[#0A0A09]/10" />
        </div>

        {/* Hero Top Tag */}
        <div className="relative z-10 flex justify-between items-center text-xs tracking-wider uppercase text-white/90">
          <span className="font-semibold bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
            Private Long-Haul Aviation
          </span>
          <span className="tabular font-medium hidden sm:inline-block bg-black/30 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
            New York • London • Tokyo • Paris
          </span>
        </div>

        {/* Hero Headline & Content Card — Gracefully Anchored at Bottom Left */}
        <div className="relative z-10 max-w-2xl mt-auto mb-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/20 shadow-2xl">
            <h1
              ref={heroHeadlineRef}
              className="font-display text-white text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-tight mb-4"
            >
              Direct Private <span className="text-[#E8431A]">Routes.</span>
            </h1>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed mb-6 font-light max-w-lg">
              Twelve direct non-stop routes connecting major global financial centers. Guaranteed block times, private terminals, and certified luxury airframes.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/routes"
                className="px-8 py-3.5 rounded-full bg-[#E8431A] text-white hover:bg-white hover:text-[#0A0A09] font-bold text-xs uppercase tracking-wider transition-all duration-300 no-underline shadow-lg"
              >
                <span>Explore Routes</span>
              </Link>
              <Link
                href="/request"
                className="px-8 py-3.5 rounded-full bg-white/15 text-white hover:bg-white hover:text-[#0A0A09] font-bold text-xs uppercase tracking-wider transition-all duration-300 no-underline border border-white/30 backdrop-blur-md"
              >
                <span>Book Seat</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Bottom Bar */}
        <div className="relative z-10 flex justify-between items-end text-xs text-white/70 tabular pt-4 border-t border-white/15">
          <div>Gulfstream G650ER • Bombardier Global 7500</div>
          <div>Scroll to Discover ↓</div>
        </div>
      </section>

      {/* 2. Transition to Flight: Airplane Flyby & Billowing Clouds */}
      <AirplaneFlyby />

      {/* 3. Atmospheric Perspective Gallery */}
      <section className="py-32 max-w-[1400px] mx-auto px-6 border-t border-black/10">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 border-b border-black/10 pb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8431A]">Perspectives</span>
            <h2 className="font-display text-4xl sm:text-5xl mt-2 text-[#0A0A09] leading-tight">True High-Altitude Views</h2>
          </div>
          <p className="text-sm text-[#0A0A09]/70 max-w-md mt-4 md:mt-0 leading-relaxed font-light">
            True-color photography from 45,000 feet through custom wide oval cabin windows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group overflow-hidden rounded-2xl bg-white border border-[rgba(10,10,9,0.08)] shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="h-64 overflow-hidden">
              <img
                src="/destinations/paris-8k.jpg"
                alt="Paris"
                className="parallax-img w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-5 flex justify-between items-center text-xs">
              <span className="font-semibold text-sm">Paris</span>
              <span className="text-[#0A0A09]/60">06h 30m direct</span>
            </div>
          </div>

          <div className="group overflow-hidden rounded-2xl bg-white border border-[rgba(10,10,9,0.08)] shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="h-64 overflow-hidden">
              <img
                src="/destinations/tokyo-8k.jpg"
                alt="Tokyo"
                className="parallax-img w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-5 flex justify-between items-center text-xs">
              <span className="font-semibold text-sm">Tokyo</span>
              <span className="text-[#0A0A09]/60">13h 40m direct</span>
            </div>
          </div>

          <div className="group overflow-hidden rounded-2xl bg-white border border-[rgba(10,10,9,0.08)] shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="h-64 overflow-hidden">
              <img
                src="/destinations/alps-8k.jpg"
                alt="Swiss Alps"
                className="parallax-img w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-5 flex justify-between items-center text-xs">
              <span className="font-semibold text-sm">Zurich</span>
              <span className="text-[#0A0A09]/60">05h 50m direct</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Active Routes Highlights */}
      <section className="py-32 bg-[#F7F5F0] border-y border-[rgba(10,10,9,0.08)]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex justify-between items-baseline mb-16">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8431A]">Network</span>
              <h2 className="font-display text-4xl sm:text-5xl mt-2 text-[#0A0A09]">Featured Routes</h2>
            </div>
            <Link href="/routes" className="text-xs uppercase font-semibold text-[#0A0A09] hover:text-[#E8431A] transition-colors">
              View All 12 Routes →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {routes.slice(0, 3).map((route) => (
              <div
                key={route.id}
                className="bg-white rounded-2xl p-6 border border-[rgba(10,10,9,0.08)] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center text-xs text-[#0A0A09]/60 mb-3 font-medium">
                    <span>{route.region}</span>
                    <span className="font-bold text-[#E8431A]">{route.blockTime}</span>
                  </div>

                  <h3 className="font-display text-2xl text-[#0A0A09] mb-1">
                    {route.originCity} → {route.destCity}
                  </h3>
                  <p className="text-xs text-[#0A0A09]/60 mb-4">
                    {route.originCode} → {route.destCode} • {route.distanceKm.toLocaleString()} KM
                  </p>

                  <div className="h-48 rounded-xl overflow-hidden mb-5">
                    <img src={route.heroImage} alt="" className="w-full h-full object-cover" />
                  </div>

                  <p className="text-xs text-[#0A0A09]/75 line-clamp-2 leading-relaxed mb-4">
                    {route.overview}
                  </p>
                </div>

                <div className="pt-4 border-t border-[rgba(10,10,9,0.08)] flex justify-between items-center text-xs">
                  <span className="text-[#0A0A09]/70">
                    <strong className="text-[#0A0A09] font-bold">{route.seatsLeftThisMonth}</strong> seats available
                  </span>
                  <Link
                    href={`/routes/${route.slug}`}
                    className="px-4 py-2 rounded-full bg-[#0A0A09] text-white hover:bg-[#E8431A] transition-colors text-[11px] font-semibold no-underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Quiet Cabin Protocol Section */}
      <section className="py-32 max-w-[1400px] mx-auto px-6">
        <div className="bg-[#0A0A09] text-[#EEEBE4] rounded-3xl p-10 sm:p-16 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8431A]">Private Dispatch</span>
            <h2 className="font-display text-3xl sm:text-5xl mt-2 leading-tight">
              Quiet Cabin Comfort. Direct Private Runway Slots.
            </h2>
            <p className="text-sm sm:text-base text-[#EEEBE4]/80 mt-4 leading-relaxed font-light">
              Board exclusively through private VIP terminals with vehicle-to-aircraft transfer in under eight minutes. Acoustic dampening guarantees cabin quietness throughout cruise.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link
              href="/request"
              className="px-8 py-4 rounded-full bg-[#E8431A] text-white hover:bg-white hover:text-[#0A0A09] font-semibold text-xs uppercase tracking-wider text-center transition-all duration-300 no-underline shadow-xl"
            >
              Request a Seat
            </Link>
            <Link
              href="/cabin"
              className="px-8 py-4 rounded-full bg-white/10 text-white hover:bg-white/20 font-semibold text-xs uppercase tracking-wider text-center transition-all duration-300 no-underline border border-white/20"
            >
              Explore Cabin
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

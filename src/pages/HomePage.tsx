import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchRoutes } from '../lib/api.js';
import { Route } from '../../shared/schemas.js';
import { AirplaneFlyby } from '../components/AirplaneFlyby.js';

export const HomePage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroPhotoRef = useRef<HTMLImageElement>(null);
  const heroHeadlineRef = useRef<HTMLHeadingElement>(null);
  const cloudLeftRef = useRef<HTMLImageElement>(null);
  const cloudRightRef = useRef<HTMLImageElement>(null);
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

      // Parting clouds glide sideways on scroll
      if (cloudLeftRef.current && heroRef.current) {
        gsap.to(cloudLeftRef.current, {
          xPercent: -85,
          opacity: 0.1,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }

      if (cloudRightRef.current && heroRef.current) {
        gsap.to(cloudRightRef.current, {
          xPercent: 85,
          opacity: 0.1,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
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
    <div ref={containerRef} className="relative min-h-screen bg-white">
      {/* 1. Passenger Window Hero Section */}
      <section ref={heroRef} className="relative h-[92vh] min-h-[640px] w-full overflow-hidden flex flex-col justify-between p-6 sm:p-12">
        <div className="absolute inset-0 z-0">
          <img
            ref={heroPhotoRef}
            src="/hero-window-nyc-liberty.png"
            alt="Stratospheric flight window over Lower Manhattan"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A09]/80 via-[#0A0A09]/20 to-transparent" />
        </div>

        {/* Two pure white clouds parting sideways at bottom of window */}
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

        {/* Hero Top Tag */}
        <div className="relative z-10 flex justify-between items-center text-xs tracking-wider uppercase text-white/90">
          <span className="font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-none border border-white/20">Private Long-Haul Aviation</span>
          <span className="tabular font-medium hidden sm:inline-block">New York • London • Tokyo • Paris</span>
        </div>

        {/* Hero Headline */}
        <div className="relative z-10 max-w-4xl pb-4">
          <h1
            ref={heroHeadlineRef}
            className="font-display text-white text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-tight mb-6"
          >
            <span className="inline-block overflow-hidden mr-3">
              <span className="hero-word inline-block">Direct</span>
            </span>
            <span className="inline-block overflow-hidden mr-3">
              <span className="hero-word inline-block">Private</span>
            </span>
            <span className="inline-block overflow-hidden mr-3">
              <span className="hero-word inline-block text-[#E8431A]">Routes.</span>
            </span>
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <p className="max-w-lg text-sm sm:text-base text-white/85 leading-relaxed">
              Twelve fixed routes connecting major global financial centers. Guaranteed block times, private terminals, and certified long-range airframes.
            </p>
            <div className="flex items-center gap-3 self-start">
              <Link
                href="/routes"
                className="inline-flex items-center justify-center px-6 py-3 rounded-none bg-[#E8431A] text-white hover:bg-white hover:text-[#0A0A09] font-bold text-xs uppercase tracking-wider transition-all duration-200 no-underline shadow-sm"
              >
                <span>Explore Routes</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  const flyby = document.getElementById('flyby-section');
                  if (flyby) flyby.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-5 py-3 rounded-none bg-white/20 hover:bg-white text-white hover:text-[#0A0A09] backdrop-blur-md font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer border border-white/30"
              >
                <span>Take Flight</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Hero Bottom Bar */}
        <div className="relative z-10 flex justify-between items-end text-xs text-white/70 tabular">
          <div>Gulfstream G650ER • Bombardier Global 7500</div>
          <div>Scroll to Discover ↓</div>
        </div>
      </section>

      {/* 2. Transition to Flight: Airplane Flyby & Billowing Clouds (User's Favorite Section!) */}
      <AirplaneFlyby />

      {/* 3. Atmospheric Perspective Gallery: Crisp Square Cards */}
      <section className="py-24 max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 border-b border-[rgba(10,10,9,0.08)] pb-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8431A]">Perspectives</span>
            <h2 className="font-display text-4xl sm:text-5xl mt-1 text-[#0A0A09]">True High-Altitude Views</h2>
          </div>
          <p className="text-sm text-[#0A0A09]/70 max-w-md mt-3 md:mt-0 leading-relaxed">
            True-color photography from 45,000 feet through custom wide oval cabin windows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group overflow-hidden rounded-none bg-white border border-[rgba(10,10,9,0.12)] shadow-sm hover:shadow-md transition-all">
            <div className="h-64 overflow-hidden rounded-none">
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

          <div className="group overflow-hidden rounded-none bg-white border border-[rgba(10,10,9,0.12)] shadow-sm hover:shadow-md transition-all">
            <div className="h-64 overflow-hidden rounded-none">
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

          <div className="group overflow-hidden rounded-none bg-white border border-[rgba(10,10,9,0.12)] shadow-sm hover:shadow-md transition-all">
            <div className="h-64 overflow-hidden rounded-none">
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

      {/* 4. Active Routes Highlights: Crisp Square Cards */}
      <section className="py-20 bg-white border-y border-[rgba(10,10,9,0.08)]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex justify-between items-baseline mb-12">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8431A]">Network</span>
              <h2 className="font-display text-4xl sm:text-5xl mt-1 text-[#0A0A09]">Featured Routes</h2>
            </div>
            <Link href="/routes" className="text-xs uppercase font-semibold text-[#0A0A09] hover:text-[#E8431A] transition-colors">
              View All 12 Routes →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {routes.slice(0, 3).map((route) => (
              <div
                key={route.id}
                className="bg-white rounded-none p-6 border border-[rgba(10,10,9,0.12)] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center text-xs text-[#0A0A09]/60 mb-3 font-medium">
                    <span className="font-semibold uppercase tracking-wider text-[11px]">{route.region}</span>
                    <span className="font-mono font-bold text-[#E8431A]">{route.blockTime}</span>
                  </div>

                  <h3 className="font-display text-2xl text-[#0A0A09] mb-1">
                    {route.originCity} → {route.destCity}
                  </h3>
                  <p className="text-xs text-[#0A0A09]/60 mb-4 font-mono">
                    {route.originCode} → {route.destCode} • {route.distanceKm.toLocaleString()} KM
                  </p>

                  <div className="h-44 rounded-none overflow-hidden mb-4">
                    <img src={route.heroImage} alt="" className="w-full h-full object-cover rounded-none" />
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
                    className="px-4 py-2 rounded-none bg-[#0A0A09] text-white hover:bg-[#E8431A] transition-colors text-[11px] font-bold uppercase tracking-wider no-underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Quiet Cabin Protocol Section: Crisp Modernist Square Container */}
      <section className="py-24 max-w-[1400px] mx-auto px-6">
        <div className="bg-[#0A0A09] text-white rounded-none p-8 sm:p-14 flex flex-col md:flex-row justify-between items-center gap-8 border border-[#0A0A09]">
          <div className="max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8431A]">Private Dispatch</span>
            <h2 className="font-display text-3xl sm:text-5xl mt-2 leading-tight">
              Quiet Cabin Comfort. Direct Private Runway Slots.
            </h2>
            <p className="text-sm sm:text-base text-white/80 mt-4 leading-relaxed">
              Board exclusively through private VIP terminals with vehicle-to-aircraft transfer in under eight minutes. Acoustic dampening guarantees cabin quietness throughout cruise.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link
              href="/request"
              className="px-6 py-3.5 rounded-none bg-[#E8431A] text-white hover:bg-white hover:text-[#0A0A09] font-bold text-xs uppercase tracking-wider text-center transition-all duration-200 no-underline shadow-sm"
            >
              Request a Seat
            </Link>
            <Link
              href="/cabin"
              className="px-6 py-3.5 rounded-none border border-white/30 text-white hover:bg-white hover:text-[#0A0A09] font-bold text-xs uppercase tracking-wider text-center transition-all duration-200 no-underline"
            >
              Explore Cabin
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

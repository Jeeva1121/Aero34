import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchRoutes } from '../lib/api.js';
import { Route } from '../../shared/schemas.js';

export const HomePage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroPhotoRef = useRef<HTMLImageElement>(null);
  const heroHeadlineRef = useRef<HTMLHeadingElement>(null);
  const introWordsRef = useRef<HTMLParagraphElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const liveStripRef = useRef<HTMLDivElement>(null);
  const darkSectionRef = useRef<HTMLDivElement>(null);

  const [routes, setRoutes] = useState<Route[]>([]);
  const [preloaderDone, setPreloaderDone] = useState(false);

  useEffect(() => {
    fetchRoutes().then(setRoutes).catch(() => {});
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // 1. Preloader: Counter 000 to 100 rolling digits, then clip-path wipe
      const counterEl = document.getElementById('preloader-counter');
      const preloader = preloaderRef.current;
      const heroPhoto = heroPhotoRef.current;
      const heroHeadline = heroHeadlineRef.current;

      const countObj = { val: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          setPreloaderDone(true);
        },
      });

      tl.to(countObj, {
        val: 100,
        duration: 1.1,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (counterEl) {
            counterEl.innerText = String(Math.floor(countObj.val)).padStart(3, '0');
          }
        },
      });

      tl.to(preloader, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.85,
        ease: 'expo.inOut',
      });

      // Hero Entrance
      if (heroPhoto) {
        tl.fromTo(
          heroPhoto,
          { scale: 1.2, filter: 'blur(16px)' },
          { scale: 1, filter: 'blur(0px)', duration: 1.3, ease: 'expo.out' },
          '-=0.6'
        );
      }

      if (heroHeadline) {
        const words = heroHeadline.querySelectorAll('.hero-word');
        tl.fromTo(
          words,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.08, ease: 'expo.out' },
          '-=1.0'
        );
      }

      // 2. Pinned Hero with scrub 1
      if (heroRef.current && heroPhoto) {
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 1,
          animation: gsap.timeline()
            .to(heroPhoto, { scale: 1.12, filter: 'blur(6px)', ease: 'none' }, 0)
            .to(heroHeadline, { yPercent: -40, opacity: 0.2, ease: 'none' }, 0),
        });
      }

      // 3. Intro paragraph word-by-word scroll-fill
      if (introWordsRef.current) {
        const spans = introWordsRef.current.querySelectorAll('.scrub-word');
        gsap.fromTo(
          spans,
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.04,
            ease: 'none',
            scrollTrigger: {
              trigger: introWordsRef.current,
              start: 'top 80%',
              end: 'bottom 40%',
              scrub: true,
            },
          }
        );

        // Marker bar that draws in under key phrase
        const marker = document.getElementById('key-marker');
        if (marker) {
          gsap.fromTo(
            marker,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: marker,
                start: 'top 70%',
                end: 'top 50%',
                scrub: true,
              },
            }
          );
        }
      }

      // 4. Parallax stack: 3 image layers at speeds 0.8 / 1 / 1.25
      if (parallaxRef.current) {
        const layer1 = parallaxRef.current.querySelector('.layer-1');
        const layer2 = parallaxRef.current.querySelector('.layer-2');
        const layer3 = parallaxRef.current.querySelector('.layer-3');

        if (layer1) {
          gsap.to(layer1, {
            yPercent: -20,
            ease: 'none',
            scrollTrigger: {
              trigger: parallaxRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
        if (layer2) {
          gsap.to(layer2, {
            yPercent: -35,
            ease: 'none',
            scrollTrigger: {
              trigger: parallaxRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
        if (layer3) {
          gsap.to(layer3, {
            yPercent: -50,
            ease: 'none',
            scrollTrigger: {
              trigger: parallaxRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
      }

      // 5. Live departures counter snap count up
      if (liveStripRef.current) {
        const statCounters = liveStripRef.current.querySelectorAll('[data-target]');
        statCounters.forEach((el) => {
          const target = parseInt(el.getAttribute('data-target') || '0', 10);
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true,
            },
            onUpdate: () => {
              el.textContent = String(Math.floor(obj.val)).padStart(2, '0');
            },
          });
        });
      }

      // 6. Section background changes Bone to Ink with scrubbed tween
      if (darkSectionRef.current) {
        gsap.to(darkSectionRef.current, {
          backgroundColor: '#0A0A09',
          color: '#EEEBE4',
          ease: 'none',
          scrollTrigger: {
            trigger: darkSectionRef.current,
            start: 'top 70%',
            end: 'top 30%',
            scrub: true,
          },
        });
      }
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* 1. Preloader Overlay */}
      {!preloaderDone && (
        <div
          ref={preloaderRef}
          className="fixed inset-0 z-[100] bg-[#0A0A09] text-[#EEEBE4] flex flex-col justify-between p-8"
        >
          <div className="flex justify-between items-center text-xs tracking-widest text-[#EEEBE4]/60">
            <span>AERO 34 MONOGRAPH</span>
            <span>DISPATCH FL470</span>
          </div>

          <div className="text-center">
            <span className="micro-label text-[10px] text-[#E8431A] block mb-2">SYSTEM INITIALIZATION</span>
            <div
              id="preloader-counter"
              className="font-display tabular text-8xl md:text-9xl tracking-tighter"
            >
              000
            </div>
          </div>

          <div className="flex justify-between items-center text-xs tabular text-[#EEEBE4]/40">
            <span>12 CORRIDORS MAPPED</span>
            <span>ZERO OVERLAYS</span>
          </div>
        </div>
      )}

      {/* 2. Pinned Hero Screen */}
      <section ref={heroRef} className="h-screen w-full relative overflow-hidden flex flex-col justify-between p-6 md:p-12">
        <div className="absolute inset-0 z-0">
          <img
            ref={heroPhotoRef}
            src="/hero-window-nyc-liberty.png"
            alt="Stratospheric flight window over Lower Manhattan"
            className="w-full h-full object-cover"
            width={3840}
            height={2160}
          />
          <div className="absolute inset-0 bg-[#0A0A09]/20" />
        </div>

        {/* Hero Top Monograph Bar */}
        <div className="relative z-10 flex justify-between items-center text-xs uppercase tracking-widest text-white/90">
          <span className="font-semibold">01 / DISPATCH RECORD</span>
          <span className="tabular">LAT 40°38&apos;N • LON 73°46&apos;W</span>
        </div>

        {/* SplitText Headline Rising Words */}
        <div className="relative z-10 max-w-5xl">
          <h1
            ref={heroHeadlineRef}
            className="font-display text-white text-[10vw] md:text-[8vw] leading-[0.92] tracking-tight overflow-hidden mb-6"
          >
            <span className="inline-block overflow-hidden mr-3">
              <span className="hero-word inline-block hover:text-[#E8431A] transition-colors">Stratospheric</span>
            </span>
            <span className="inline-block overflow-hidden mr-3">
              <span className="hero-word inline-block hover:text-[#E8431A] transition-colors">Direct</span>
            </span>
            <span className="inline-block overflow-hidden mr-3">
              <span className="hero-word inline-block hover:text-[#E8431A] transition-colors">Corridors.</span>
            </span>
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6 text-white/90">
            <p className="max-w-md text-sm md:text-base leading-relaxed">
              Twelve fixed long-haul routes allocated to private parties and seat holders. Block times from 05h 50m to 13h 40m.
            </p>
            <Link
              href="/routes"
              className="btn-editorial bg-white text-[#0A0A09] hover:bg-[#E8431A] hover:text-white border-none py-3.5 px-6 self-start"
            >
              <span>Explore Corridors</span>
            </Link>
          </div>
        </div>

        {/* Hero Bottom Bar */}
        <div className="relative z-10 flex justify-between items-end text-xs text-white/80 tabular">
          <div>AIRCRAFT: G650ER • GLOBAL 7500 • FALCON 8X</div>
          <div>SCROLL TO ADVANCE ↓</div>
        </div>
      </section>

      {/* 3. Word-by-Word Intro Scrub */}
      <section className="min-h-[80vh] flex items-center py-32 hairline-b">
        <div className="grid-12">
          <div className="col-span-12 md:col-span-3 mb-8 md:mb-0">
            <span className="micro-label">02 / PLATFORM INTENT</span>
            <p className="tabular text-xs text-[var(--ink-60)] mt-2">SPECIFICATION MONOGRAPH</p>
          </div>

          <div className="col-span-12 md:col-span-9">
            <p
              ref={introWordsRef}
              className="font-display text-3xl md:text-5xl leading-tight text-[var(--ink)]"
            >
              {'AERO 34 operates without marketing embellishment or intermediary charter brokers. Every seat allocation maps to an active flight plan, a certified airframe, and an exact block time. We dispatch flights on twelve dedicated corridors connecting financial and diplomatic centres with direct runway slots and zero refueling delays.'
                .split(' ')
                .map((word, i) => (
                  <span key={i} className="scrub-word inline-block mr-2.5 transition-opacity">
                    {word}
                  </span>
                ))}
            </p>

            <div className="mt-12 pt-6 hairline-t flex items-center justify-between text-xs tabular text-[var(--ink-60)]">
              <span className="relative inline-block">
                <span>VERIFIED RUNWAY APEX CLEARANCE</span>
                <span
                  id="key-marker"
                  className="absolute left-0 bottom-[-4px] w-full h-[2px] bg-[var(--signal)] origin-left"
                />
              </span>
              <span>CERTIFICATION: FAR PART 135</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Parallax Stack: 3 Image Layers */}
      <section ref={parallaxRef} className="py-32 overflow-hidden hairline-b bg-[#F7F5F0]">
        <div className="grid-12 mb-16">
          <div className="col-span-12 md:col-span-4">
            <span className="micro-label">03 / ARTIFACTS IN TRANSIT</span>
            <h2 className="font-display text-4xl mt-3">Atmospheric Perspectives</h2>
          </div>
          <div className="col-span-12 md:col-span-8">
            <p className="prose-editorial text-sm">
              True-color high-altitude photography captured through 19-inch oval windows at FL450. No artificial colorization or grading.
            </p>
          </div>
        </div>

        <div className="grid-12 relative min-h-[550px] items-center">
          {/* Layer 1: Left */}
          <div className="layer-1 col-span-12 sm:col-span-4 photo-frame h-[380px]">
            <img src="/destinations/paris-8k.jpg" alt="Paris and the Seine from flight altitude" className="w-full h-full object-cover" />
            <div className="p-3 text-[11px] tabular text-[var(--ink-60)]">CDG • ELEVATION 392 FT</div>
          </div>

          {/* Layer 2: Center Higher Speed */}
          <div className="layer-2 col-span-12 sm:col-span-5 photo-frame h-[460px] sm:-mt-12 z-10 shadow-lg">
            <img src="/destinations/tokyo-8k.jpg" alt="Mount Fuji at dawn above cloud base" className="w-full h-full object-cover" />
            <div className="p-3 text-[11px] tabular text-[var(--ink-60)]">HND • ELEVATION 35 FT</div>
          </div>

          {/* Layer 3: Right Top Speed */}
          <div className="layer-3 col-span-12 sm:col-span-3 photo-frame h-[340px] sm:mt-16">
            <img src="/destinations/alps-8k.jpg" alt="Swiss Alpine valley in morning haze" className="w-full h-full object-cover" />
            <div className="p-3 text-[11px] tabular text-[var(--ink-60)]">ZRH • ELEVATION 1,416 FT</div>
          </div>
        </div>
      </section>

      {/* 5. Live Departures & API Data Strip */}
      <section ref={liveStripRef} className="py-24 hairline-b">
        <div className="grid-12 mb-12">
          <div className="col-span-12 flex justify-between items-baseline">
            <div>
              <span className="micro-label">04 / LIVE DISPATCH STATUS</span>
              <h2 className="font-display text-3xl mt-2">Active Long-Haul Corridors</h2>
            </div>
            <Link href="/routes" className="editorial-link text-xs uppercase font-semibold">
              View All 12 Corridors →
            </Link>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid-12 mb-16">
          <div className="col-span-6 md:col-span-3 p-6 hairline-all">
            <span className="micro-label text-[10px]">VERIFIED AIRFRAMES</span>
            <div className="font-display text-5xl mt-3 tabular" data-target="12">00</div>
            <div className="text-xs text-[var(--ink-60)] mt-1">Bombardier & Gulfstream</div>
          </div>

          <div className="col-span-6 md:col-span-3 p-6 hairline-all">
            <span className="micro-label text-[10px]">CRUISE CEILING</span>
            <div className="font-display text-5xl mt-3 tabular text-[var(--signal)]">47k</div>
            <div className="text-xs text-[var(--ink-60)] mt-1">Feet Above Mean Sea Level</div>
          </div>

          <div className="col-span-6 md:col-span-3 p-6 hairline-all">
            <span className="micro-label text-[10px]">AVERAGE CABIN ALTITUDE</span>
            <div className="font-display text-5xl mt-3 tabular">3,850</div>
            <div className="text-xs text-[var(--ink-60)] mt-1">Equivalent Atmospheric Pressure</div>
          </div>

          <div className="col-span-6 md:col-span-3 p-6 hairline-all">
            <span className="micro-label text-[10px]">AVAILABLE SEATS THIS MONTH</span>
            <div className="font-display text-5xl mt-3 tabular" data-target="84">00</div>
            <div className="text-xs text-[var(--ink-60)] mt-1">Across 12 Global Routes</div>
          </div>
        </div>

        {/* Quick Route Cards from API */}
        <div className="grid-12">
          {routes.slice(0, 3).map((route) => (
            <div key={route.id} className="col-span-12 md:col-span-4 card-monograph p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-xs tabular text-[var(--ink-60)] mb-3">
                  <span>{route.region}</span>
                  <span className="font-bold text-[var(--ink)]">{route.blockTime}</span>
                </div>
                <h3 className="font-display text-2xl mb-1">
                  {route.originCity} → {route.destCity}
                </h3>
                <p className="text-xs text-[var(--ink-60)] tabular mb-4">
                  {route.originCode} / {route.destCode} • {route.distanceKm.toLocaleString()} KM
                </p>
                <div className="photo-frame h-44 mb-4">
                  <img src={route.heroImage} alt={`${route.originCity} to ${route.destCity}`} />
                </div>
                <p className="text-xs text-[var(--ink-80)] line-clamp-2 leading-relaxed mb-4">
                  {route.overview}
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 hairline-t text-xs">
                <span className="tabular text-[var(--ink-60)]">
                  <strong className="text-[var(--ink)]">{route.seatsLeftThisMonth}</strong> seats open
                </span>
                <Link href={`/routes/${route.slug}`} className="btn-editorial py-1.5 px-3 text-[10px]">
                  <span>Inspect Route</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Section Background Changes Bone to Ink */}
      <section ref={darkSectionRef} className="py-32 transition-colors duration-500">
        <div className="grid-12">
          <div className="col-span-12 md:col-span-6 mb-8 md:mb-0">
            <span className="micro-label text-white/60">05 / PROTOCOL GUARANTEE</span>
            <h2 className="font-display text-4xl md:text-5xl mt-3 leading-tight">
              Quiet Cabin Protocol. Zero Commercial Terminal Routing.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-6 flex flex-col justify-between">
            <p className="text-sm md:text-base leading-relaxed text-white/80 max-w-xl">
              Boarding takes place exclusively through private general aviation terminals. Luggage transfers from vehicle to airframe within 8 minutes. On-board acoustic dampening guarantees interior sound levels under 48 dBA throughout cruise.
            </p>
            <div className="mt-8 pt-8 border-t border-white/20 flex gap-6">
              <Link href="/request" className="btn-editorial bg-white text-[#0A0A09] hover:bg-[#E8431A] hover:text-white border-none">
                <span>Submit Seat Request</span>
              </Link>
              <Link href="/cabin" className="editorial-link text-white text-xs uppercase font-semibold self-center">
                Review Cabin Layouts →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { useRoute, Link } from 'wouter';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchRouteBySlug, fetchAvailability } from '../lib/api.js';
import { Route, AvailabilityResponse } from '../../shared/schemas.js';

export const RouteDetailPage: React.FC = () => {
  const [, params] = useRoute('/routes/:slug');
  const slug = params?.slug || '';

  const [route, setRoute] = useState<Route | null>(null);
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const stickyColRef = useRef<HTMLDivElement>(null);
  const seatMapRef = useRef<SVGSVGElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const telemetryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    fetchRouteBySlug(slug)
      .then((data) => {
        setRoute(data);
        return fetchAvailability(data.id);
      })
      .then((avail) => {
        setAvailability(avail);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [slug]);

  // Motion setup once data is loaded
  useEffect(() => {
    if (loading || !route) return;

    const ctx = gsap.context(() => {
      // 1. Sticky left column facts
      if (stickyColRef.current && window.innerWidth >= 1024) {
        ScrollTrigger.create({
          trigger: stickyColRef.current,
          start: 'top 120px',
          endTrigger: '#right-content-col',
          end: 'bottom bottom',
          pin: true,
          pinSpacing: false,
        });
      }

      // 2. Availability calendar days reveal with ScrollTrigger.batch
      if (calendarRef.current) {
        const days = calendarRef.current.querySelectorAll('.cal-day');
        ScrollTrigger.batch(days, {
          start: 'top 85%',
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { opacity: 0, y: 12 },
              { opacity: 1, y: 0, stagger: 0.02, duration: 0.4, ease: 'power2.out' }
            );
          },
          once: true,
        });
      }

      // 3. Cabin seat map SVG rows reveal with batch
      if (seatMapRef.current) {
        const seatRows = seatMapRef.current.querySelectorAll('.seat-row');
        ScrollTrigger.batch(seatRows, {
          start: 'top 85%',
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { opacity: 0, scale: 0.8 },
              { opacity: 1, scale: 1, stagger: 0.05, duration: 0.5, ease: 'back.out(1.2)' }
            );
          },
          once: true,
        });
      }

      // 4. Pinned canvas image turn scrub with telemetry counter
      const canvas = canvasRef.current;
      const telemetry = telemetryRef.current;
      if (canvas && telemetry && window.innerWidth >= 768) {
        const canvasCtx = canvas.getContext('2d');
        const planeImg = new Image();
        planeImg.src = '/passenger-airplane.png';

        planeImg.onload = () => {
          // Render initial frame
          const renderFrame = (progress: number) => {
            if (!canvasCtx) return;
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            canvasCtx.save();
            canvasCtx.translate(canvas.width / 2, canvas.height / 2);
            // Rotate airframe based on scrub progress (0 to 360 deg)
            canvasCtx.rotate(progress * Math.PI * 2);
            const scale = 0.55;
            canvasCtx.drawImage(
              planeImg,
              (-planeImg.width * scale) / 2,
              (-planeImg.height * scale) / 2,
              planeImg.width * scale,
              planeImg.height * scale
            );
            canvasCtx.restore();

            // Update telemetry
            const heading = Math.round(progress * 360);
            const alt = Math.round(41000 + progress * 6000);
            const mach = (0.85 + progress * 0.07).toFixed(2);
            telemetry.innerText = `HDG ${String(heading).padStart(3, '0')}° • CRUISE FL${Math.round(alt / 1000)}0 • MACH ${mach}`;
          };

          renderFrame(0);

          ScrollTrigger.create({
            trigger: '#airframe-turn-section',
            start: 'top top',
            end: '+=250%',
            pin: true,
            scrub: 0.5,
            onUpdate: (self) => {
              renderFrame(self.progress);
            },
          });
        };
      }
    }, containerRef);

    return () => ctx.revert();
  }, [loading, route]);

  if (loading) {
    return (
      <div className="min-h-screen py-32 grid-12">
        <div className="col-span-12 h-96 skeleton-bone" />
      </div>
    );
  }

  if (!route) {
    return (
      <div className="min-h-screen py-32 text-center">
        <span className="micro-label text-[var(--signal)]">404 DISPATCH EXCEPTION</span>
        <h1 className="font-display text-4xl mt-3 mb-6">Corridor Not Found</h1>
        <Link href="/routes" className="btn-editorial">Return to Corridors</Link>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#EEEBE4]">
      {/* Hero Header: Photo Grows into Page Header */}
      <section className="relative h-[65vh] w-full overflow-hidden hairline-b">
        <img
          src={route.heroImage}
          alt={`${route.originCity} to ${route.destCity}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0A0A09]/30" />

        <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-14 text-white">
          <div className="flex justify-between items-center text-xs tabular uppercase tracking-widest">
            <Link href="/routes" className="hover:text-[#E8431A] transition-colors flex items-center gap-2">
              ← RETURN TO CORRIDORS
            </Link>
            <span>CORRIDOR CODE: {route.id}</span>
          </div>

          <div>
            <span className="micro-label text-white/80">{route.region} CORRIDOR DISPATCH</span>
            <h1 className="font-display text-5xl md:text-8xl mt-2 tracking-tight">
              {route.originCity} <span className="text-white/40">/</span> {route.destCity}
            </h1>
            <div className="flex gap-6 text-sm tabular mt-4 text-white/90">
              <span>{route.originCode} → {route.destCode}</span>
              <span>•</span>
              <span className="font-bold text-[#E8431A]">{route.blockTime} BLOCK</span>
              <span>•</span>
              <span>{route.distanceKm.toLocaleString()} KM</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Two-Column Layout */}
      <div className="grid-12 py-16">
        {/* Sticky Left Column: Telemetry Facts */}
        <div className="col-span-12 lg:col-span-4 mb-12 lg:mb-0">
          <div ref={stickyColRef} className="p-8 hairline-all bg-[#F7F5F0]">
            <span className="micro-label text-[10px]">ROUTE SPECIFICATIONS</span>
            <h2 className="font-display text-2xl mt-2 mb-6">{route.aircraft}</h2>

            <div className="space-y-4 text-xs tabular text-[var(--ink-80)]">
              <div className="flex justify-between py-2 hairline-b">
                <span>FLIGHT TIME</span>
                <span className="font-bold text-[var(--ink)]">{route.blockTime}</span>
              </div>
              <div className="flex justify-between py-2 hairline-b">
                <span>CRUISE ALTITUDE</span>
                <span className="font-bold text-[var(--ink)]">FL{route.altitudeFeet / 1000}0 ({(route.altitudeFeet).toLocaleString()} FT)</span>
              </div>
              <div className="flex justify-between py-2 hairline-b">
                <span>GREAT CIRCLE DISTANCE</span>
                <span className="font-bold text-[var(--ink)]">{route.distanceKm.toLocaleString()} KM</span>
              </div>
              <div className="flex justify-between py-2 hairline-b">
                <span>TOTAL CERTIFIED SEATS</span>
                <span className="font-bold text-[var(--ink)]">{route.totalSeats} SEATS</span>
              </div>
              <div className="flex justify-between py-2 hairline-b">
                <span>CABIN CONFIGURATION</span>
                <span className="font-bold text-[var(--ink)] text-right max-w-[180px]">{route.cabinLayout}</span>
              </div>
            </div>

            <div className="mt-8 pt-6 hairline-t">
              <p className="text-xs text-[var(--ink-80)] leading-relaxed mb-6">
                {route.overview}
              </p>
              <Link
                href={`/request?route=${route.id}`}
                className="btn-editorial btn-signal w-full py-3 text-xs text-center"
              >
                <span>Request Seats on This Route</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Availability Calendar & Seat Map */}
        <div id="right-content-col" className="col-span-12 lg:col-span-8 space-y-16 pl-0 lg:pl-6">
          {/* Availability Calendar */}
          <div className="hairline-all p-8 bg-[#F7F5F0]">
            <div className="flex justify-between items-baseline mb-6">
              <div>
                <span className="micro-label">01 / DISPATCH AVAILABILITY</span>
                <h3 className="font-display text-3xl mt-1">Calendar & Seat Inventory</h3>
              </div>
              <span className="text-xs tabular text-[var(--ink-60)]">NEXT 60 DAYS</span>
            </div>

            <div ref={calendarRef} className="grid grid-cols-7 gap-2">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d) => (
                <div key={d} className="text-center text-[10px] font-bold text-[var(--ink-60)] pb-2">
                  {d}
                </div>
              ))}

              {availability?.days.map((day) => {
                const isFull = day.status === 'full';
                const isLimited = day.status === 'limited';
                const dayNum = day.date.slice(8);
                return (
                  <div
                    key={day.date}
                    className={`cal-day p-3 text-center border transition-colors ${
                      isFull
                        ? 'border-[var(--ink-12)] bg-[#EEEBE4]/40 opacity-40'
                        : isLimited
                        ? 'border-[var(--signal)] bg-[#E8431A]/5'
                        : 'border-[var(--ink-12)] bg-white hover:border-[var(--ink)]'
                    }`}
                  >
                    <div className="text-xs font-bold tabular">{dayNum}</div>
                    <div className="text-[10px] tabular mt-1">
                      {isFull ? (
                        <span className="text-[var(--ink-40)]">FULL</span>
                      ) : (
                        <span className={isLimited ? 'text-[var(--signal)] font-bold' : 'text-[var(--ink-60)]'}>
                          {day.seatsLeft} left
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-6 mt-6 pt-4 hairline-t text-xs tabular text-[var(--ink-60)]">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-white border border-[var(--ink-12)]" /> Available
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#E8431A]/20 border border-[var(--signal)]" /> Limited (≤3)
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#EEEBE4]/60 border border-[var(--ink-12)]" /> Allocated (Full)
              </span>
            </div>
          </div>

          {/* Interactive SVG Cabin Seat Map */}
          <div className="hairline-all p-8 bg-[#F7F5F0]">
            <div className="flex justify-between items-baseline mb-6">
              <div>
                <span className="micro-label">02 / INTERIOR SCHEMATIC</span>
                <h3 className="font-display text-3xl mt-1">Airframe Seat Architecture</h3>
              </div>
              <span className="text-xs tabular text-[var(--ink-60)]">SCALE 1:50</span>
            </div>

            <div className="flex justify-center p-6 bg-white border border-[var(--ink-12)] relative">
              <svg
                ref={seatMapRef}
                viewBox="0 0 320 540"
                className="w-full max-w-sm h-auto"
                aria-label="Cabin seat layout schematic"
              >
                {/* Aircraft Fuselage Outline */}
                <path
                  d="M 60 120 C 60 40 260 40 260 120 L 260 480 C 260 520 60 520 60 480 Z"
                  fill="none"
                  stroke="#0A0A09"
                  strokeWidth="1.5"
                  strokeOpacity="0.3"
                />

                {/* Cockpit divider */}
                <line x1="80" y1="90" x2="240" y2="90" stroke="#0A0A09" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.4" />

                {/* Forward Zone 1 Club Seats */}
                <g className="seat-row">
                  <rect
                    x="85" y="130" width="36" height="42" rx="2"
                    fill={hoveredSeat === '1A' ? '#E8431A' : '#0A0A09'}
                    cursor="pointer"
                    onMouseEnter={() => setHoveredSeat('1A')}
                    onMouseLeave={() => setHoveredSeat(null)}
                  />
                  <rect
                    x="195" y="130" width="36" height="42" rx="2"
                    fill={hoveredSeat === '1F' ? '#E8431A' : '#0A0A09'}
                    cursor="pointer"
                    onMouseEnter={() => setHoveredSeat('1F')}
                    onMouseLeave={() => setHoveredSeat(null)}
                  />
                  <text x="103" y="156" fill="#EEEBE4" fontSize="11" textAnchor="middle" fontWeight="bold">1A</text>
                  <text x="213" y="156" fill="#EEEBE4" fontSize="11" textAnchor="middle" fontWeight="bold">1F</text>
                </g>

                <g className="seat-row">
                  <rect
                    x="85" y="195" width="36" height="42" rx="2"
                    fill={hoveredSeat === '2A' ? '#E8431A' : '#0A0A09'}
                    cursor="pointer"
                    onMouseEnter={() => setHoveredSeat('2A')}
                    onMouseLeave={() => setHoveredSeat(null)}
                  />
                  <rect
                    x="195" y="195" width="36" height="42" rx="2"
                    fill={hoveredSeat === '2F' ? '#E8431A' : '#0A0A09'}
                    cursor="pointer"
                    onMouseEnter={() => setHoveredSeat('2F')}
                    onMouseLeave={() => setHoveredSeat(null)}
                  />
                  <text x="103" y="221" fill="#EEEBE4" fontSize="11" textAnchor="middle" fontWeight="bold">2A</text>
                  <text x="213" y="221" fill="#EEEBE4" fontSize="11" textAnchor="middle" fontWeight="bold">2F</text>
                </g>

                {/* Mid Zone 2 Conference / Dining Table */}
                <rect x="125" y="255" width="70" height="50" rx="1" fill="#EEEBE4" stroke="#0A0A09" strokeWidth="1" strokeOpacity="0.4" />
                <text x="160" y="284" fill="#0A0A09" fontSize="9" textAnchor="middle" letterSpacing="0.1em">TABLE</text>

                <g className="seat-row">
                  <rect
                    x="85" y="260" width="36" height="42" rx="2"
                    fill={hoveredSeat === '3A' ? '#E8431A' : '#0A0A09'}
                    cursor="pointer"
                    onMouseEnter={() => setHoveredSeat('3A')}
                    onMouseLeave={() => setHoveredSeat(null)}
                  />
                  <rect
                    x="195" y="260" width="36" height="42" rx="2"
                    fill={hoveredSeat === '3F' ? '#E8431A' : '#0A0A09'}
                    cursor="pointer"
                    onMouseEnter={() => setHoveredSeat('3F')}
                    onMouseLeave={() => setHoveredSeat(null)}
                  />
                  <text x="103" y="286" fill="#EEEBE4" fontSize="11" textAnchor="middle" fontWeight="bold">3A</text>
                  <text x="213" y="286" fill="#EEEBE4" fontSize="11" textAnchor="middle" fontWeight="bold">3F</text>
                </g>

                {/* Rear Zone 3 Private Stateroom Suite */}
                <g className="seat-row">
                  <rect
                    x="85" y="340" width="146" height="70" rx="2"
                    fill={hoveredSeat === 'MASTER-SUITE' ? '#E8431A' : '#0A0A09'}
                    cursor="pointer"
                    onMouseEnter={() => setHoveredSeat('MASTER-SUITE')}
                    onMouseLeave={() => setHoveredSeat(null)}
                  />
                  <text x="158" y="380" fill="#EEEBE4" fontSize="11" textAnchor="middle" fontWeight="bold">
                    MASTER STATEROOM / LIE-FLAT DOUBLE
                  </text>
                </g>
              </svg>

              {hoveredSeat && (
                <div className="absolute top-4 right-4 bg-[#0A0A09] text-[#EEEBE4] px-3 py-1 text-xs tabular font-bold border border-[#E8431A]">
                  SEAT {hoveredSeat}: CONFIRMED LIE-FLAT 82&quot;
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Pinned Canvas Airframe Turn Section */}
      <section id="airframe-turn-section" className="min-h-screen hairline-t bg-[#0A0A09] text-[#EEEBE4] flex flex-col justify-between p-12 relative overflow-hidden">
        <div className="flex justify-between items-baseline z-10">
          <div>
            <span className="micro-label text-white/60">03 / DYNAMIC AIRFRAME SCRUB</span>
            <h2 className="font-display text-4xl mt-2 text-white">360° Vector Telemetry</h2>
          </div>
          <div ref={telemetryRef} className="tabular text-xs text-[#E8431A] font-bold">
            HDG 000° • CRUISE FL450 • MACH 0.88
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center relative my-8">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full max-w-2xl h-auto object-contain"
          />
        </div>

        <div className="flex justify-between items-center text-xs tabular text-white/50 z-10 pt-4 border-t border-white/10">
          <span>AIRCRAFT: {route.aircraft}</span>
          <span>PINNED SCRUB 250% • ROTATION TIED TO SCROLL</span>
          <Link href={`/request?route=${route.id}`} className="btn-editorial bg-white text-[#0A0A09] hover:bg-[#E8431A] hover:text-white border-none py-2 px-5">
            <span>Reserve Route</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

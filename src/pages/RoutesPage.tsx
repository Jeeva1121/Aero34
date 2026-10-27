import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchRoutes, fetchShortlist, toggleShortlist } from '../lib/api.js';
import { Route } from '../../shared/schemas.js';

export const RoutesPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef<HTMLSpanElement>(null);

  const [routes, setRoutes] = useState<Route[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([]);
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  // Load routes and shortlist from API
  useEffect(() => {
    Promise.all([fetchRoutes(), fetchShortlist()])
      .then(([routesData, shortlistData]) => {
        setRoutes(routesData);
        setFilteredRoutes(routesData);
        setShortlist(shortlistData);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Filter Handling
  const handleFilterChange = (region: string) => {
    setSelectedRegion(region);
    if (region === 'All') {
      setFilteredRoutes(routes);
    } else if (region === 'Shortlist') {
      setFilteredRoutes(routes.filter((r) => shortlist.includes(r.id)));
    } else {
      setFilteredRoutes(routes.filter((r) => r.region === region));
    }
  };

  // Toggle Shortlist with scale punch animation
  const handleShortlistToggle = async (routeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isSaved = shortlist.includes(routeId);
    const btn = e.currentTarget;

    gsap.fromTo(
      btn,
      { scale: 1.35 },
      { scale: 1, duration: 0.45, ease: 'back.out(1.4)' }
    );

    await toggleShortlist(routeId, isSaved);
    const updated = isSaved
      ? shortlist.filter((id) => id !== routeId)
      : [...shortlist, routeId];
    setShortlist(updated);
    window.dispatchEvent(new CustomEvent('shortlist_updated'));
  };

  // Horizontal Scroll Trigger setup
  useEffect(() => {
    if (loading || filteredRoutes.length === 0) return;

    // On mobile (<768px), disable horizontal pinning as per specs
    if (window.innerWidth < 768) return;

    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('.route-panel');
      const totalPanels = panels.length;
      if (totalPanels <= 1) return;

      const trackWidth = track.scrollWidth - window.innerWidth;

      const horizontalTween = gsap.to(panels, {
        xPercent: -100 * (totalPanels - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          snap: 1 / (totalPanels - 1),
          end: () => `+=${trackWidth}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (activeIndexRef.current) {
              const current = Math.min(
                totalPanels,
                Math.max(1, Math.round(self.progress * (totalPanels - 1)) + 1)
              );
              activeIndexRef.current.innerText = String(current).padStart(2, '0');
            }
          },
        },
      });

      // containerAnimation for panel inner flight arcs and photo zoom
      panels.forEach((panel) => {
        const svgPath = panel.querySelector<SVGPathElement>('.flight-arc');
        const photo = panel.querySelector<HTMLImageElement>('.panel-img');

        if (svgPath) {
          const length = svgPath.getTotalLength();
          gsap.set(svgPath, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(svgPath, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: horizontalTween,
              start: 'left center',
              end: 'right center',
              scrub: true,
            },
          });
        }

        if (photo) {
          gsap.fromTo(
            photo,
            { scale: 1.15 },
            {
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: horizontalTween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          );
        }
      });
    }, container);

    return () => ctx.revert();
  }, [loading, filteredRoutes]);

  const regions = ['All', 'Transatlantic', 'Transpacific', 'Eurasia', 'Alpine-Gulf', 'Shortlist'];

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#EEEBE4]">
      {/* Page Header & Fixed Controls */}
      <div className="pt-12 pb-6 hairline-b">
        <div className="grid-12 items-baseline">
          <div className="col-span-12 md:col-span-6">
            <span className="micro-label">02 / LONG-HAUL DIRECT CORRIDORS</span>
            <h1 className="font-display text-4xl md:text-6xl mt-2 tracking-tight">
              Network Schedules
            </h1>
          </div>

          <div className="col-span-12 md:col-span-6 flex flex-col md:items-end justify-between mt-4 md:mt-0">
            <div className="text-xs tabular text-[var(--ink-60)]">
              ACTIVE INDEX: <span ref={activeIndexRef} className="font-bold text-[var(--ink)]">01</span> / {String(filteredRoutes.length).padStart(2, '0')}
            </div>
            <p className="text-xs text-[var(--ink-80)] mt-1 max-w-xs text-right hidden md:block">
              Dedicated Gulfstream & Bombardier airframes with guaranteed block slots.
            </p>
          </div>
        </div>

        {/* Filter Navigation Bar */}
        <div className="grid-12 mt-8">
          <div className="col-span-12 flex flex-wrap gap-2 items-center">
            <span className="micro-label text-[10px] mr-2">REGION FILTER:</span>
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => handleFilterChange(reg)}
                className={`py-1.5 px-3.5 text-xs font-semibold tracking-wider uppercase border transition-all ${
                  selectedRegion === reg
                    ? 'bg-[var(--ink)] text-[var(--bone)] border-[var(--ink)]'
                    : 'bg-transparent text-[var(--ink-80)] border-[var(--ink-12)] hover:border-[var(--ink-60)]'
                }`}
              >
                {reg} {reg === 'Shortlist' && `(${shortlist.length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid-12 py-24">
          {[1, 2, 3].map((n) => (
            <div key={n} className="col-span-12 md:col-span-4 h-96 skeleton-bone" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredRoutes.length === 0 && (
        <div className="py-32 text-center">
          <span className="micro-label text-[var(--signal)]">NO CORRIDORS FOUND</span>
          <h2 className="font-display text-3xl mt-2 mb-4">No Routes In Selected Filter</h2>
          <button
            onClick={() => handleFilterChange('All')}
            className="btn-editorial py-2 px-6 text-xs"
          >
            <span>Reset Filters</span>
          </button>
        </div>
      )}

      {/* Horizontal Scroll Panels Container */}
      {!loading && filteredRoutes.length > 0 && (
        <div
          ref={trackRef}
          className="flex flex-col md:flex-row flex-nowrap w-full md:w-max h-auto md:h-[calc(100vh-140px)]"
        >
          {filteredRoutes.map((route, idx) => {
            const isSaved = shortlist.includes(route.id);
            return (
              <div
                key={route.id}
                className="route-panel w-full md:w-[70vw] lg:w-[50vw] xl:w-[42vw] flex-shrink-0 h-full p-6 md:p-10 hairline-r flex flex-col justify-between bg-[#EEEBE4]"
              >
                {/* Panel Top Meta */}
                <div className="flex justify-between items-center text-xs tabular text-[var(--ink-60)] pb-4 hairline-b">
                  <span>{String(idx + 1).padStart(2, '0')} / {route.region}</span>
                  <button
                    onClick={(e) => handleShortlistToggle(route.id, e)}
                    className={`btn-editorial py-1 px-3 text-[10px] ${
                      isSaved ? 'bg-[var(--signal)] text-white border-[var(--signal)]' : ''
                    }`}
                    title={isSaved ? 'Remove from shortlist' : 'Add to shortlist'}
                  >
                    <span>{isSaved ? '★ Shortlisted' : '+ Shortlist'}</span>
                  </button>
                </div>

                {/* City Pair & Flight Arc */}
                <div className="my-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <h2 className="font-display text-3xl md:text-5xl tracking-tight">
                      {route.originCity}
                    </h2>
                    <span className="font-display text-2xl md:text-3xl text-[var(--ink-40)]">
                      →
                    </span>
                    <h2 className="font-display text-3xl md:text-5xl tracking-tight text-right">
                      {route.destCity}
                    </h2>
                  </div>

                  <div className="flex justify-between text-xs tabular text-[var(--ink-60)] mb-4">
                    <span>{route.originCode}</span>
                    <span className="font-bold text-[var(--signal)]">{route.blockTime} BLOCK</span>
                    <span>{route.destCode}</span>
                  </div>

                  {/* DrawSVG Flight Path Arc */}
                  <svg viewBox="0 0 400 60" fill="none" className="w-full h-12 text-[var(--ink)]">
                    <path
                      className="flight-arc"
                      d="M 10 50 Q 200 5 390 50"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle cx="10" cy="50" r="3" fill="#E8431A" />
                    <circle cx="390" cy="50" r="3" fill="#0A0A09" />
                  </svg>
                </div>

                {/* Panel Image with WebGL/Transform Hover */}
                <div className="photo-frame flex-1 min-h-[220px] max-h-[320px] relative mb-6">
                  <img
                    src={route.heroImage}
                    alt={`${route.originCity} to ${route.destCity}`}
                    className="panel-img w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 left-2 bg-[#0A0A09]/80 text-[#EEEBE4] px-2 py-0.5 text-[10px] tabular">
                    ALTITUDE FL{route.altitudeFeet / 1000}0 • {route.distanceKm.toLocaleString()} KM
                  </div>
                </div>

                {/* Aircraft Specs & Action */}
                <div className="pt-4 hairline-t flex justify-between items-end">
                  <div>
                    <span className="micro-label text-[10px]">CERTIFIED AIRFRAME</span>
                    <div className="text-sm font-semibold text-[var(--ink)]">{route.aircraft}</div>
                    <div className="text-xs text-[var(--ink-60)] tabular mt-0.5">
                      {route.seatsLeftThisMonth} SEATS ALLOCATED THIS MONTH
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/routes/${route.slug}`}
                      className="btn-editorial py-2 px-4 text-xs"
                    >
                      <span>Specifications</span>
                    </Link>
                    <Link
                      href={`/request?route=${route.id}`}
                      className="btn-editorial btn-signal py-2 px-4 text-xs"
                    >
                      <span>Request</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import gsap from 'gsap';
import { fetchRoutes, fetchShortlist, toggleShortlist } from '../lib/api.js';
import { Route } from '../../shared/schemas.js';

export const RoutesPage: React.FC = () => {
  const [location] = useLocation();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([]);
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  // Synchronize URL query param with filter state
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const filterParam = searchParams.get('filter');
    const regionParam = searchParams.get('region');

    if (filterParam === 'shortlist') {
      setSelectedRegion('Shortlist');
      if (routes.length > 0) {
        setFilteredRoutes(routes.filter((r) => shortlist.includes(r.id)));
      }
    } else if (regionParam) {
      setSelectedRegion(regionParam);
      if (routes.length > 0) {
        setFilteredRoutes(routes.filter((r) => r.region.toLowerCase() === regionParam.toLowerCase()));
      }
    } else {
      setSelectedRegion('All');
      if (routes.length > 0) {
        setFilteredRoutes(routes);
      }
    }
  }, [location, routes, shortlist]);

  // Load routes and shortlist from API
  useEffect(() => {
    Promise.all([fetchRoutes(), fetchShortlist()])
      .then(([routesData, shortlistData]) => {
        setRoutes(routesData);
        setShortlist(shortlistData);

        const searchParams = new URLSearchParams(window.location.search);
        const filterParam = searchParams.get('filter');
        const regionParam = searchParams.get('region');

        if (filterParam === 'shortlist') {
          setFilteredRoutes(routesData.filter((r) => shortlistData.includes(r.id)));
          setSelectedRegion('Shortlist');
        } else if (regionParam) {
          setFilteredRoutes(routesData.filter((r) => r.region.toLowerCase() === regionParam.toLowerCase()));
          setSelectedRegion(regionParam);
        } else {
          setFilteredRoutes(routesData);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Filter Handling with browser URL update
  const handleFilterChange = (region: string) => {
    setSelectedRegion(region);
    if (region === 'All') {
      window.history.replaceState(null, '', '/routes');
      setFilteredRoutes(routes);
    } else if (region === 'Shortlist') {
      window.history.replaceState(null, '', '/routes?filter=shortlist');
      setFilteredRoutes(routes.filter((r) => shortlist.includes(r.id)));
    } else {
      window.history.replaceState(null, '', `/routes?region=${encodeURIComponent(region)}`);
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
      { scale: 1.3 },
      { scale: 1, duration: 0.4, ease: 'back.out(1.4)' }
    );

    await toggleShortlist(routeId, isSaved);
    const updated = isSaved
      ? shortlist.filter((id) => id !== routeId)
      : [...shortlist, routeId];
    setShortlist(updated);

    if (selectedRegion === 'Shortlist') {
      setFilteredRoutes(routes.filter((r) => updated.includes(r.id)));
    }

    window.dispatchEvent(new CustomEvent('shortlist_updated'));
  };

  const regions = ['All', 'Transatlantic', 'Transpacific', 'Eurasia', 'Alpine-Gulf', 'Shortlist'];

  return (
    <div className="min-h-screen bg-[#EEEBE4] py-16">
      {/* Page Header */}
      <div className="grid-12 mb-8">
        <div className="col-span-12 md:col-span-8">
          <span className="micro-label text-[#E8431A] block mb-2">Direct Flight Schedules</span>
          <h1 className="font-display text-4xl md:text-6xl text-[#0A0A09] tracking-tight">
            Network Routes
          </h1>
          <p className="prose-editorial text-sm text-[#0A0A09]/70 mt-3">
            Twelve direct long-haul corridors with verified block times, dedicated Gulfstream and Bombardier airframes, and guaranteed private terminal dispatch.
          </p>
        </div>

        <div className="col-span-12 md:col-span-4 flex md:justify-end items-end mt-4 md:mt-0 text-xs tabular text-[#0A0A09]/60">
          <span>Showing {filteredRoutes.length} of {routes.length} Available Corridors</span>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="grid-12 mb-12">
        <div className="col-span-12 flex flex-wrap gap-2 items-center pb-6 hairline-b">
          <span className="micro-label text-[10px] mr-2">Filter Region:</span>
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => handleFilterChange(reg)}
              className={`py-1.5 px-4 text-xs font-semibold tracking-wider uppercase border transition-all cursor-pointer ${
                selectedRegion === reg
                  ? 'bg-[#0A0A09] text-[#EEEBE4] border-[#0A0A09]'
                  : 'bg-white text-[#0A0A09]/80 border-[#0A0A09]/15 hover:border-[#0A0A09]'
              }`}
            >
              {reg} {reg === 'Shortlist' && `(${shortlist.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid-12 py-16">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="col-span-12 md:col-span-6 h-80 skeleton-bone" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredRoutes.length === 0 && (
        <div className="py-24 text-center">
          <h2 className="font-display text-3xl mb-2 text-[#0A0A09]">
            {selectedRegion === 'Shortlist' ? 'Your Shortlist is Empty' : 'No Routes Found'}
          </h2>
          <p className="text-sm text-[#0A0A09]/70 mb-6">
            {selectedRegion === 'Shortlist'
              ? 'Click the "+ Shortlist" button on any route card to save it here for quick access.'
              : 'Try selecting another region filter above.'}
          </p>
          <button
            onClick={() => handleFilterChange('All')}
            className="btn-editorial py-2 px-6 text-xs"
          >
            <span>Show All 12 Routes</span>
          </button>
        </div>
      )}

      {/* Responsive Route Grid — Never collides or overlaps horizontally */}
      {!loading && filteredRoutes.length > 0 && (
        <div className="grid-12">
          {filteredRoutes.map((route) => {
            const isSaved = shortlist.includes(route.id);
            return (
              <div
                key={route.id}
                className="col-span-12 md:col-span-6 card-monograph p-6 md:p-8 flex flex-col justify-between bg-white mb-6"
              >
                <div>
                  {/* Top Meta Bar */}
                  <div className="flex justify-between items-center text-xs tabular text-[#0A0A09]/60 pb-3 hairline-b mb-5">
                    <span className="font-semibold uppercase tracking-wider">{route.region}</span>
                    <button
                      onClick={(e) => handleShortlistToggle(route.id, e)}
                      className={`btn-editorial py-1 px-3 text-[11px] cursor-pointer ${
                        isSaved ? 'bg-[#E8431A] text-white border-[#E8431A]' : ''
                      }`}
                    >
                      <span>{isSaved ? '★ Shortlisted' : '+ Shortlist'}</span>
                    </button>
                  </div>

                  {/* City Pair & Flight Times */}
                  <div className="mb-4">
                    <div className="flex items-baseline justify-between mb-1">
                      <h2 className="font-display text-3xl md:text-4xl text-[#0A0A09] tracking-tight">
                        {route.originCity}
                      </h2>
                      <span className="font-display text-2xl text-[#0A0A09]/30 mx-2">→</span>
                      <h2 className="font-display text-3xl md:text-4xl text-[#0A0A09] tracking-tight text-right">
                        {route.destCity}
                      </h2>
                    </div>

                    <div className="flex justify-between text-xs tabular text-[#0A0A09]/60 mb-3">
                      <span>{route.originCode}</span>
                      <span className="font-bold text-[#E8431A]">{route.blockTime} BLOCK</span>
                      <span>{route.destCode}</span>
                    </div>

                    {/* Flight Path SVG */}
                    <svg viewBox="0 0 400 40" fill="none" className="w-full h-8 text-[#0A0A09]">
                      <path d="M 10 32 Q 200 4 390 32" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="10" cy="32" r="3" fill="#E8431A" />
                      <circle cx="390" cy="32" r="3" fill="#0A0A09" />
                    </svg>
                  </div>

                  {/* High-Res Photo Frame */}
                  <div className="photo-frame h-48 md:h-56 relative mb-5">
                    <img
                      src={route.heroImage}
                      alt={`${route.originCity} to ${route.destCity}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute bottom-2 left-2 bg-[#0A0A09]/85 text-[#EEEBE4] px-2.5 py-0.5 text-[10px] tabular">
                      ALTITUDE FL{route.altitudeFeet / 1000}0 • {route.distanceKm.toLocaleString()} KM
                    </div>
                  </div>

                  {/* Overview description */}
                  <p className="text-xs text-[#0A0A09]/80 leading-relaxed mb-6">
                    {route.overview}
                  </p>
                </div>

                {/* Card Bottom: Specs & Action Links */}
                <div className="pt-4 hairline-t flex flex-wrap justify-between items-center gap-3">
                  <div>
                    <div className="text-xs font-semibold text-[#0A0A09]">{route.aircraft}</div>
                    <div className="text-[11px] text-[#0A0A09]/60 tabular mt-0.5">
                      <strong className="text-[#0A0A09]">{route.seatsLeftThisMonth}</strong> seats available this month
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/routes/${route.slug}`}
                      className="btn-editorial py-2 px-4 text-xs font-semibold"
                    >
                      <span>Specifications</span>
                    </Link>
                    <Link
                      href={`/request?route=${route.id}`}
                      className="btn-editorial btn-signal py-2 px-4 text-xs font-semibold"
                    >
                      <span>Request Seat</span>
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

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
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  // Check URL search params for initial filter (e.g. ?filter=shortlist)
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const filterParam = searchParams.get('filter');
    const regionParam = searchParams.get('region');

    if (filterParam === 'shortlist') {
      setSelectedFilter('Shortlist');
    } else if (regionParam) {
      setSelectedFilter(regionParam);
    }
  }, [location]);

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
          setSelectedFilter('Shortlist');
          setFilteredRoutes(routesData.filter((r) => shortlistData.includes(r.id)));
        } else if (regionParam) {
          setSelectedFilter(regionParam);
          setFilteredRoutes(routesData.filter((r) => r.region === regionParam));
        } else {
          setFilteredRoutes(routesData);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Filter change handler
  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    if (filter === 'All') {
      setFilteredRoutes(routes);
    } else if (filter === 'Shortlist') {
      setFilteredRoutes(routes.filter((r) => shortlist.includes(r.id)));
    } else {
      setFilteredRoutes(routes.filter((r) => r.region === filter));
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
      { scale: 1.25 },
      { scale: 1, duration: 0.35, ease: 'back.out(1.4)' }
    );

    await toggleShortlist(routeId, isSaved);
    const updated = isSaved
      ? shortlist.filter((id) => id !== routeId)
      : [...shortlist, routeId];
    setShortlist(updated);

    if (selectedFilter === 'Shortlist') {
      setFilteredRoutes(routes.filter((r) => updated.includes(r.id)));
    }

    window.dispatchEvent(new CustomEvent('shortlist_updated'));
  };

  const filterTabs = ['All', 'Transatlantic', 'Transpacific', 'Eurasia', 'Alpine-Gulf', 'Shortlist'];

  return (
    <div className="min-h-screen bg-[#EEEBE4] py-12">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Clean Modern Header */}
        <div className="mb-10 pb-6 border-b border-[rgba(10,10,9,0.08)]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8431A]">
            Direct Flight Routes
          </span>
          <h1 className="font-display text-4xl sm:text-6xl text-[#0A0A09] tracking-tight mt-1 mb-3">
            Direct Global Routes
          </h1>
          <p className="text-sm sm:text-base text-[#0A0A09]/75 max-w-2xl leading-relaxed">
            Browse twelve direct nonstop routes connecting major financial centers with verified flight times and private VIP terminal access.
          </p>

          {/* Filter Bar with Sleek Luxury Pills */}
          <div className="flex flex-wrap items-center gap-3 mt-8">
            {filterTabs.map((tab) => {
              const isSelected = selectedFilter === tab;
              const countBadge = tab === 'Shortlist' ? ` (${shortlist.length})` : '';
              return (
                <button
                  key={tab}
                  onClick={() => handleFilterChange(tab)}
                  className={`inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold tracking-wider uppercase rounded-full transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#0A0A09] text-white shadow-md'
                      : 'bg-white text-[#0A0A09]/80 hover:bg-[#0A0A09] hover:text-white border border-black/10 shadow-xs'
                  }`}
                >
                  {tab === 'Shortlist' ? 'Saved' : tab}
                  {countBadge}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 rounded-2xl skeleton-bone" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredRoutes.length === 0 && (
          <div className="py-24 text-center bg-white rounded-3xl border border-[rgba(10,10,9,0.08)] p-12">
            <h3 className="font-display text-3xl text-[#0A0A09] mb-2">No Routes in this Filter</h3>
            <p className="text-sm text-[#0A0A09]/60 max-w-md mx-auto mb-6">
              {selectedFilter === 'Shortlist'
                ? 'You have not saved any routes to your shortlist yet. Click the star on any route to save it.'
                : 'There are no active routes matching the selected region filter.'}
            </p>
            <button
              onClick={() => handleFilterChange('All')}
              className="px-5 py-2.5 rounded-full bg-[#0A0A09] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#E8431A] transition-colors"
            >
              Show All Routes
            </button>
          </div>
        )}

        {/* Route Cards Grid: Clean, Modern, ZERO Text Overlap! */}
        {!loading && filteredRoutes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRoutes.map((route) => {
              const isSaved = shortlist.includes(route.id);
              return (
                <div
                  key={route.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-[rgba(10,10,9,0.08)] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Top Image Stage */}
                  <div className="relative h-56 overflow-hidden bg-[#0A0A09]/5">
                    <img
                      src={route.heroImage}
                      alt={`${route.originCity} to ${route.destCity}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/destinations/tokyo-8k.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                    {/* Region Badge & Save Button */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                      <span className="px-3 py-1 text-[11px] font-semibold tracking-wide uppercase bg-black/50 backdrop-blur-md text-white rounded-full">
                        {route.region}
                      </span>
                      <button
                        onClick={(e) => handleShortlistToggle(route.id, e)}
                        className={`p-2 rounded-full transition-all duration-200 cursor-pointer backdrop-blur-md ${
                          isSaved
                            ? 'bg-[#E8431A] text-white'
                            : 'bg-black/40 text-white hover:bg-white hover:text-[#0A0A09]'
                        }`}
                        title={isSaved ? 'Remove from saved' : 'Save route'}
                        aria-label="Save Route"
                      >
                        <svg viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </button>
                    </div>

                    {/* Flight Duration Badge on Image */}
                    <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-white text-xs z-10">
                      <span className="font-mono font-bold bg-[#E8431A] px-2 py-0.5 rounded text-[11px]">
                        {route.blockTime} DIRECT
                      </span>
                      <span className="text-white/90 text-[11px]">
                        {route.distanceKm.toLocaleString()} KM
                      </span>
                    </div>
                  </div>

                  {/* Card Content Area */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Clear City Pair: Never Collides! */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div>
                          <div className="text-xs font-mono font-bold text-[#E8431A]">{route.originCode}</div>
                          <h3 className="font-display text-2xl text-[#0A0A09] leading-tight">{route.originCity}</h3>
                        </div>

                        <div className="flex flex-col items-center px-2">
                          <span className="text-xs text-[#0A0A09]/40 mb-0.5">non-stop</span>
                          <svg viewBox="0 0 60 12" className="w-14 h-3 text-[#0A0A09]/30 fill-none stroke-current" strokeWidth="1.5">
                            <path d="M 0 6 L 52 6 M 46 1 L 52 6 L 46 11" />
                          </svg>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-[#E8431A]">{route.destCode}</div>
                          <h3 className="font-display text-2xl text-[#0A0A09] leading-tight">{route.destCity}</h3>
                        </div>
                      </div>

                      <p className="text-xs text-[#0A0A09]/70 line-clamp-2 leading-relaxed my-4">
                        {route.overview}
                      </p>

                      <div className="bg-[#F7F5F0] rounded-xl p-3 flex justify-between items-center text-xs text-[#0A0A09]/80 mb-6">
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-[#0A0A09]/50 block">Airframe</span>
                          <span className="font-medium text-[11px]">{route.aircraft}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-semibold text-[#0A0A09]/50 block">Availability</span>
                          <span className="font-bold text-[#E8431A] text-[11px]">{route.seatsLeftThisMonth} seats this month</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-[rgba(10,10,9,0.08)]">
                      <Link
                        href={`/routes/${route.slug}`}
                        className="flex-1 py-2.5 px-4 text-center text-xs font-semibold rounded-full border border-[#0A0A09] text-[#0A0A09] hover:bg-[#0A0A09] hover:text-white transition-all duration-200 no-underline"
                      >
                        Route Details
                      </Link>
                      <Link
                        href={`/request?route=${route.id}`}
                        className="flex-1 py-2.5 px-4 text-center text-xs font-semibold rounded-full bg-[#E8431A] text-white hover:bg-[#0A0A09] transition-all duration-200 no-underline shadow-sm"
                      >
                        Book Seat
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { WindowHero } from '../components/WindowHero.js';
import { AirplaneFlyby } from '../components/AirplaneFlyby.js';
import { fetchRoutes } from '../lib/api.js';
import { Route } from '../../shared/schemas.js';

export const HomePage: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    fetchRoutes().then(setRoutes).catch(() => {});
  }, []);

  return (
    <div className="relative min-h-screen bg-[#EEEBE4]">
      {/* 1. Passenger Window Hero ("Above the Clouds" with Parting Clouds) */}
      <WindowHero />

      {/* 2. Transition to Flight Page (Cruising Airliner & Parallax Moving Clouds) */}
      <AirplaneFlyby />

      {/* 3. Intro Statement: Quiet, spacious, zero slashes or AI buzzwords */}
      <section className="py-24 hairline-b">
        <div className="grid-12">
          <div className="col-span-12 md:col-span-10 md:col-start-2 text-center">
            <span className="micro-label text-[#E8431A] block mb-3">Direct Flight Routes</span>
            <p className="font-display text-3xl md:text-5xl leading-snug text-[#0A0A09]">
              Twelve dedicated long-haul routes connecting major global cities with verified flight times, private terminal boarding, and guaranteed seats.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Live Active Corridors Grid */}
      <section className="py-20 hairline-b">
        <div className="grid-12 mb-10">
          <div className="col-span-12 flex justify-between items-baseline">
            <div>
              <span className="micro-label block mb-1">Direct Long-Haul Corridors</span>
              <h2 className="font-display text-3xl md:text-4xl text-[#0A0A09]">
                Featured Flights
              </h2>
            </div>
            <Link href="/routes" className="editorial-link text-xs uppercase font-semibold">
              View All 12 Routes →
            </Link>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid-12 mb-12">
          <div className="col-span-6 md:col-span-3 p-6 hairline-all bg-[#F7F5F0]">
            <span className="micro-label text-[10px]">Active Airframes</span>
            <div className="font-display text-4xl mt-2 tabular text-[#0A0A09]">12</div>
            <div className="text-xs text-[#0A0A09]/60 mt-1">Gulfstream & Bombardier</div>
          </div>

          <div className="col-span-6 md:col-span-3 p-6 hairline-all bg-[#F7F5F0]">
            <span className="micro-label text-[10px]">Cruise Ceiling</span>
            <div className="font-display text-4xl mt-2 tabular text-[#E8431A]">47,000 FT</div>
            <div className="text-xs text-[#0A0A09]/60 mt-1">Above Weather & Turbulence</div>
          </div>

          <div className="col-span-6 md:col-span-3 p-6 hairline-all bg-[#F7F5F0]">
            <span className="micro-label text-[10px]">Cabin Pressure</span>
            <div className="font-display text-4xl mt-2 tabular text-[#0A0A09]">3,850 FT</div>
            <div className="text-xs text-[#0A0A09]/60 mt-1">Atmospheric Equivalent</div>
          </div>

          <div className="col-span-6 md:col-span-3 p-6 hairline-all bg-[#F7F5F0]">
            <span className="micro-label text-[10px]">Available Seats This Month</span>
            <div className="font-display text-4xl mt-2 tabular text-[#0A0A09]">84</div>
            <div className="text-xs text-[#0A0A09]/60 mt-1">Across 12 Global Corridors</div>
          </div>
        </div>

        {/* 3 Selected Route Cards */}
        <div className="grid-12">
          {routes.slice(0, 3).map((route) => (
            <div key={route.id} className="col-span-12 md:col-span-4 card-monograph p-6 flex flex-col justify-between bg-white">
              <div>
                <div className="flex justify-between items-center text-xs tabular text-[#0A0A09]/60 mb-3">
                  <span>{route.region}</span>
                  <span className="font-bold text-[#E8431A]">{route.blockTime}</span>
                </div>
                <h3 className="font-display text-2xl mb-1 text-[#0A0A09]">
                  {route.originCity} → {route.destCity}
                </h3>
                <p className="text-xs text-[#0A0A09]/60 tabular mb-4">
                  {route.originCode} to {route.destCode} • {route.distanceKm.toLocaleString()} km
                </p>
                <div className="photo-frame h-48 mb-4">
                  <img src={route.heroImage} alt={`${route.originCity} to ${route.destCity}`} />
                </div>
                <p className="text-xs text-[#0A0A09]/80 line-clamp-2 leading-relaxed mb-4">
                  {route.overview}
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 hairline-t text-xs">
                <span className="tabular text-[#0A0A09]/70">
                  <strong className="text-[#0A0A09]">{route.seatsLeftThisMonth}</strong> seats available
                </span>
                <Link href={`/routes/${route.slug}`} className="btn-editorial py-1.5 px-3.5 text-xs">
                  <span>View Details</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Quiet Cabin Guarantee */}
      <section className="py-24 bg-[#0A0A09] text-[#EEEBE4]">
        <div className="grid-12">
          <div className="col-span-12 md:col-span-6 mb-8 md:mb-0">
            <span className="micro-label text-white/60">Quiet Cabin Standards</span>
            <h2 className="font-display text-4xl md:text-5xl mt-3 leading-tight text-white">
              No Commercial Terminal Crowds. Pure Direct Transit.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-6 flex flex-col justify-between">
            <p className="text-sm md:text-base leading-relaxed text-white/80 max-w-xl">
              Boarding takes place directly through private executive aviation terminals. Luggage transfers from vehicle to airframe within eight minutes. On-board acoustic dampening guarantees interior sound levels under 48 dBA throughout cruise.
            </p>
            <div className="mt-8 pt-8 border-t border-white/20 flex flex-wrap gap-4">
              <Link href="/request" className="btn-editorial bg-white text-[#0A0A09] hover:bg-[#E8431A] hover:text-white border-none py-3 px-6 text-xs">
                <span>Request a Seat</span>
              </Link>
              <Link href="/cabin" className="editorial-link text-white text-xs uppercase font-semibold self-center">
                Explore Cabin Layouts →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

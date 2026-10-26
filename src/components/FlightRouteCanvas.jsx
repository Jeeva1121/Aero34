import React, { useState, useRef } from 'react';
import BlurText from './ui/BlurText';

const ROUTES = [
  {
    id: 'paris-tokyo',
    origin: 'Paris',
    originCode: 'CDG',
    dest: 'Tokyo',
    destCode: 'HND',
    flight: 'AERO 34',
    duration: '11h 20m Nonstop',
    distance: '9,715 km',
    altitude: '41,000 FT',
    status: 'BOARDING',
  },
  {
    id: 'london-newyork',
    origin: 'London',
    originCode: 'LHR',
    dest: 'New York',
    destCode: 'JFK',
    flight: 'AERO 01',
    duration: '07h 45m Nonstop',
    distance: '5,570 km',
    altitude: '39,000 FT',
    status: 'SCHEDULED',
  },
  {
    id: 'zurich-dubai',
    origin: 'Zurich',
    originCode: 'ZRH',
    dest: 'Dubai',
    destCode: 'DXB',
    flight: 'AERO 77',
    duration: '06h 15m Nonstop',
    distance: '4,770 km',
    altitude: '38,000 FT',
    status: 'DAILY',
  },
  {
    id: 'alps-horizon',
    origin: 'Swiss Alps',
    originCode: 'ZRH',
    dest: 'Ocean Horizon',
    destCode: 'PAC',
    flight: 'AERO 88',
    duration: '09h 30m Direct',
    distance: '8,400 km',
    altitude: '43,000 FT',
    status: 'TWILIGHT',
  },
];

/**
 * FlightRouteCanvas: Global Flight Corridors with User's 1080p Tourism Video
 * - Powered by user's 7000322_Tourism_Travel_1920x1080.mp4
 * - Full-bleed cinematic 1080p aviation video background
 * - Minimal, elegant live airway telemetries (zero boxes, zero ticks, zero slashes)
 * - Generous top spacing avoiding navbar collision
 */
export default function FlightRouteCanvas() {
  const [activeIdx, setActiveIdx] = useState(0);
  const videoRef = useRef(null);

  const route = ROUTES[activeIdx];

  return (
    <section
      id="route-canvas-section"
      className="route-canvas-section"
      aria-label="Global Flight Corridors"
    >
      <div className="route-canvas-content">
        {/* Section Header with Generous Clearance */}
        <div className="route-header-block">
          <span className="route-eyebrow">TRANSOCEANIC AIRWAYS</span>
          <h2 className="route-main-title">
            <BlurText text="GLOBAL FLIGHT CORRIDORS" as="span" animateBy="words" />
          </h2>
          <p className="route-description">
            Direct nonstop airways linking sovereign capitals across high-altitude transoceanic horizons.
          </p>
        </div>

        {/* Sharp Architectural Route Switcher (Zero round bubble pills) */}
        <div className="route-tab-row" role="tablist" aria-label="Flight Routes">
          {ROUTES.map((r, idx) => (
            <button
              key={r.id}
              role="tab"
              aria-selected={idx === activeIdx}
              onClick={() => setActiveIdx(idx)}
              className={`route-tab-btn ${idx === activeIdx ? 'is-active' : ''}`}
            >
              <span className="tab-route-codes">{r.originCode} → {r.destCode}</span>
              <span className="tab-route-cities">{r.origin} to {r.dest}</span>
            </button>
          ))}
        </div>

        {/* Dedicated Clear Video Card Frame (Sharp architectural edges, crystal-clear 1080p video) */}
        <div className="corridor-video-card-frame">
          {/* Top Video Card Header Bar */}
          <div className="video-card-top-bar">
            <div className="top-bar-left">
              <span className="corridor-status-tag">{route.status}</span>
              <span className="video-card-callsign">{route.flight}</span>
            </div>
          </div>

          {/* Crystal Clear 1080p Video Screen (No dark scrim cover) */}
          <div className="corridor-video-screen">
            <video
              ref={videoRef}
              src="/global-flight-corridors.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="corridor-screen-video"
            />
          </div>

          {/* Integrated Telemetry Dock (Sharp architectural borders, zero round corners) */}
          <div className="corridor-telemetry-dock">
            <div className="telemetry-deck-left">
              <span className="corridor-meta-sub">{route.originCode} TO {route.destCode}</span>
              <h3 className="corridor-headline">
                {route.origin} to {route.dest}
              </h3>
            </div>

            <div className="telemetry-deck-metrics">
              <div className="deck-metric-cell">
                <span className="deck-label">DURATION</span>
                <strong className="deck-val">{route.duration}</strong>
              </div>
              <div className="deck-metric-cell">
                <span className="deck-label">DISTANCE</span>
                <strong className="deck-val">{route.distance}</strong>
              </div>
              <div className="deck-metric-cell">
                <span className="deck-label">CRUISE ALTITUDE</span>
                <strong className="deck-val">{route.altitude}</strong>
              </div>
            </div>

            <div className="telemetry-deck-action">
              <button
                type="button"
                className="corridor-reserve-btn"
                onClick={() => {
                  const el = document.getElementById('boarding-section');
                  if (el && window.__lenis) {
                    window.__lenis.scrollTo(el, { duration: 1.2 });
                  } else if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <span>Reserve Corridor</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

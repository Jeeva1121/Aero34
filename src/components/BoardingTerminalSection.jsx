import React, { useState, useEffect, useRef } from 'react';
import TiltedCard from './ui/TiltedCard';
import BlurText from './ui/BlurText';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TICKET_ROUTES = [
  {
    dest: 'PARIS',
    country: 'France',
    flight: 'AERO 34',
    date: 'OCT 26',
    time: '08h 15m',
    classType: 'FIRST CLASS',
    seat: '01A',
    gate: 'B12',
    desc: 'Nonstop transoceanic corridor to the City of Light. Curated luxury with lie-flat private suites and champagne service at 41,000 feet.',
    code: 'CDG',
    serial: 'AERO 34098 CDG',
  },
  {
    dest: 'NEW YORK',
    country: 'United States',
    flight: 'AERO 01',
    date: 'OCT 28',
    time: '07h 45m',
    classType: 'FIRST CLASS',
    seat: '01F',
    gate: 'A04',
    desc: 'Direct Manhattan connection crossing the Atlantic under twilight sky. Priority terminal clearance and panoramic harbor descent.',
    code: 'JFK',
    serial: 'AERO 01244 JFK',
  },
  {
    dest: 'TOKYO',
    country: 'Japan',
    flight: 'AERO 88',
    date: 'NOV 02',
    time: '11h 20m',
    classType: 'FIRST CLASS',
    seat: '02K',
    gate: 'D18',
    desc: 'Pacific sunrise route direct into Haneda. Wake up to Mount Fuji dawn vistas with bespoke Japanese culinary service onboard.',
    code: 'HND',
    serial: 'AERO 88510 HND',
  },
];

/**
 * BoardingTerminalSection: 21st.dev & Vengeance UI 3D Boarding Pass Experience
 * - Cobalt twilight sky with terminal architecture
 * - 3D Perspective Boarding Pass with authentic perforation and barcode simulation
 * - ReactBits TiltedCard interaction
 * - Strictly NO unnecessary words with slashes
 */
export default function BoardingTerminalSection() {
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [isReserved, setIsReserved] = useState(false);
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background subtle parallax
      gsap.fromTo(
        bgRef.current,
        { y: -20 },
        {
          y: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const route = TICKET_ROUTES[selectedRoute];

  return (
    <section
      ref={sectionRef}
      id="boarding-section"
      className="boarding-terminal-section"
      aria-label="The Boarding Pass Experience"
    >
      {/* 100% Width Background Frame */}
      <div className="boarding-bg-frame">
        <img
          ref={bgRef}
          src="/destinations/boarding-terminal-sky.jpg"
          alt="Cobalt blue sky with modern skyscraper terminal and travelers on clouds"
          className="boarding-backdrop-img"
        />
      </div>

      <div className="boarding-content-container">
        {/* Editorial Heading (Straight ZT Chintzy, stark pure white, NO slashes) */}
        <div ref={headerRef} className="boarding-header-block">
          <span className="boarding-eyebrow">FINAL CLEARANCE</span>
          <h2 className="boarding-main-headline">
            <BlurText text="THE WORLD GOES TO THOSE WHO MOVE FIRST" as="span" animateBy="words" />
          </h2>
          <p className="boarding-subtext">
            Direct transatlantic flights are discovered before they fill the skies. Reserve your first class suite now.
          </p>

          {/* Route Switcher */}
          <div className="boarding-route-selector" role="tablist" aria-label="Ticket Route Switcher">
            {TICKET_ROUTES.map((r, idx) => (
              <button
                key={r.dest}
                role="tab"
                aria-selected={idx === selectedRoute}
                onClick={() => {
                  setSelectedRoute(idx);
                  setIsReserved(false);
                }}
                className={`route-tab-pill ${idx === selectedRoute ? 'active' : ''}`}
              >
                <span>{r.dest}</span>
                <span className="route-tab-code">{r.code}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 21st.dev / ReactBits 3D Perspective Boarding Pass Ticket */}
        <div className="boarding-ticket-tilt-wrapper">
          <TiltedCard maxTilt={6} scale={1.01} className="boarding-pass-card-3d">
            {/* Top Notch Stub */}
            <div className="ticket-header-strip">
              <div className="airline-brand">
                <span className="brand-vector-mark" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                  </svg>
                </span>
                <div className="brand-text-block">
                  <strong className="brand-title">AERO 34</strong>
                  <span className="brand-sub">FIRST CLASS SERVICE</span>
                </div>
              </div>

              <div className="ticket-class-clean">
                <span>{route.classType}</span>
              </div>
            </div>

            {/* Main Boarding Body */}
            <div className="ticket-body-grid">
              <div className="flight-origin-col">
                <span className="station-code">PAR</span>
                <span className="station-city">Paris CDG</span>
                <span className="flight-dep-time">10:45 AM</span>
              </div>

              <div className="flight-route-indicator">
                <span className="route-duration">{route.time}</span>
                <div className="route-visual-line">
                  <span className="line-dot left" />
                  <span className="line-plane">✈</span>
                  <span className="line-dot right" />
                </div>
                <span className="flight-nonstop-label">NONSTOP FLIGHT</span>
              </div>

              <div className="flight-dest-col">
                <span className="station-code">{route.code}</span>
                <span className="station-city">{route.dest}</span>
                <span className="flight-arr-time">02:30 PM</span>
              </div>
            </div>

            {/* Passenger & Flight Details (NO slashes!) */}
            <div className="ticket-meta-grid">
              <div className="meta-cell">
                <span className="meta-label">PASSENGER</span>
                <strong className="meta-val">FIRST CLASS GUEST</strong>
              </div>
              <div className="meta-cell">
                <span className="meta-label">FLIGHT</span>
                <strong className="meta-val">{route.flight}</strong>
              </div>
              <div className="meta-cell">
                <span className="meta-label">DATE</span>
                <strong className="meta-val">{route.date}</strong>
              </div>
              <div className="meta-cell">
                <span className="meta-label">SEAT</span>
                <strong className="meta-val highlight">{route.seat}</strong>
              </div>
              <div className="meta-cell">
                <span className="meta-label">GATE</span>
                <strong className="meta-val">{route.gate}</strong>
              </div>
            </div>

            {/* Perforated Rip Line */}
            <div className="ticket-perforation-line">
              <div className="perforated-cutout left" />
              <div className="dashed-border" />
              <div className="perforated-cutout right" />
            </div>

            {/* Barcode & Booking Action (NO slashes!) */}
            <div className="ticket-footer-action">
              <div className="barcode-simulation" aria-hidden="true">
                <div className="bar-lines" />
                <span className="barcode-num">{route.serial}</span>
              </div>

              <button
                type="button"
                className={`ticket-confirm-btn ${isReserved ? 'is-confirmed' : ''}`}
                onClick={() => setIsReserved(!isReserved)}
                aria-label={isReserved ? 'First class seat reservation confirmed' : 'Confirm first class reservation'}
              >
                <span className="btn-inner-shine" aria-hidden="true" />
                <span className="btn-content-wrap">
                  <span className="btn-vector-icon" aria-hidden="true">
                    {isReserved ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                      </svg>
                    )}
                  </span>
                  <span className="btn-label-text">
                    {isReserved ? 'Reservation Confirmed' : 'Confirm First Class Seat'}
                  </span>
                </span>
              </button>
            </div>
          </TiltedCard>
        </div>
      </div>
    </section>
  );
}

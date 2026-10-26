import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PORTAL_DESTINATIONS = [
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    tag: 'Culture & Romance',
    image: '/destinations/paris-8k.jpg',
    code: 'CDG',
    flightNo: 'AE-704',
    gate: 'E14',
    seat: '01A',
    time: '08:15',
    departure: 'Paris Charles de Gaulle',
    arrival: 'New York JFK',
    aircraft: 'Airbus A350-1000',
  },
  {
    id: 'alps',
    name: 'Swiss Alps',
    country: 'Switzerland',
    tag: 'Glacial Sanctuary',
    image: '/destinations/alps-8k.jpg',
    code: 'ZRH',
    flightNo: 'AE-318',
    gate: 'A08',
    seat: '02K',
    time: '06:40',
    departure: 'Zürich Kloten',
    arrival: 'London Heathrow',
    aircraft: 'Airbus A330-900neo',
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    tag: 'Pacific Horizons',
    image: '/destinations/tokyo-8k.jpg',
    code: 'HND',
    flightNo: 'AE-882',
    gate: 'D22',
    seat: '01F',
    time: '11:20',
    departure: 'Tokyo Haneda',
    arrival: 'Paris CDG',
    aircraft: 'Airbus A350-1000',
  },
  {
    id: 'newyork',
    name: 'New York',
    country: 'United States',
    tag: 'Metropolis Glow',
    image: '/destinations/newyork-8k.jpg',
    code: 'JFK',
    flightNo: 'AE-101',
    gate: 'B04',
    seat: '03A',
    time: '07:45',
    departure: 'New York JFK',
    arrival: 'London LHR',
    aircraft: 'Airbus A350-1000',
  },
];

export default function WorldExpeditionSection() {
  const [selectedPortal, setSelectedPortal] = useState(PORTAL_DESTINATIONS[0]);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const sectionRef = useRef(null);
  const portalsRowRef = useRef(null);
  const ticketRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered reveal of windows
      gsap.fromTo(
        '.aircraft-window-portal',
        { opacity: 0, y: 50, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: portalsRowRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Ticket entrance
      gsap.fromTo(
        ticketRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ticketRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSelect = (dest) => {
    setSelectedPortal(dest);
    setBookingConfirmed(false);
    // Pulse ticket animation
    if (ticketRef.current) {
      gsap.fromTo(
        ticketRef.current,
        { scale: 0.98, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 0.35, ease: 'power2.out' }
      );
    }
  };

  return (
    <section
      ref={sectionRef}
      id="expeditions-section"
      className="world-expeditions-section"
      aria-label="World Expeditions and Boarding Pass Experience"
    >
      {/* Background Cloud Horizon (100% Width) */}
      <div className="world-expedition-backdrop" aria-hidden="true">
        <img
          src="/destinations/world-horizon-8k.jpg"
          alt=""
          className="world-backdrop-img"
        />
        <div className="world-backdrop-gradient" />
      </div>

      <div className="world-expeditions-inner">
        {/* Editorial Heading */}
        <div className="world-expeditions-header">
          <h2 className="expedition-headline">The World is Waiting</h2>
          <p className="expedition-subtext">
            Explore more. Travel deeper. Select an aircraft window portal below to view your luxury transatlantic flight boarding pass.
          </p>
        </div>

        {/* Four Aircraft Window Portals (Inspired by User Reference 1) */}
        <div
          ref={portalsRowRef}
          className="aircraft-portals-grid"
          role="region"
          aria-label="Aircraft Cabin Window Portals"
        >
          {PORTAL_DESTINATIONS.map((dest) => {
            const isSelected = selectedPortal.id === dest.id;
            return (
              <button
                key={dest.id}
                onClick={() => handleSelect(dest)}
                className={`aircraft-window-portal ${isSelected ? 'portal-active' : ''}`}
                aria-pressed={isSelected}
                aria-label={`View ${dest.name} flight portal`}
              >
                {/* Airplane Bezel Frame */}
                <div className="portal-bezel-outer">
                  <div className="portal-bezel-inner">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="portal-vista-img"
                    />
                    <div className="portal-glass-reflection" />
                  </div>
                </div>

                {/* Portal Label */}
                <div className="portal-caption">
                  <span className="portal-code">{dest.code}</span>
                  <strong className="portal-title">{dest.name}</strong>
                  <span className="portal-tag">{dest.tag}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Boarding Pass Experience (Inspired by User Reference 2) */}
        <div ref={ticketRef} className="boarding-pass-wrapper">
          <div className="luxury-boarding-pass" role="article" aria-label="Flight Boarding Pass">
            {/* Left Header / Route */}
            <div className="pass-main-section">
              <div className="pass-top-bar">
                <div className="pass-brand">
                  <span className="pass-brand-name">AERO 34</span>
                  <span className="pass-brand-sub">LUXURY TRANSOCEANIC</span>
                </div>
                <div className="pass-class-badge">IMPERIAL FIRST CLASS</div>
              </div>

              <div className="pass-route-row">
                <div className="pass-station">
                  <span className="station-code">{selectedPortal.code}</span>
                  <span className="station-name">{selectedPortal.departure}</span>
                </div>

                <div className="pass-flight-flightpath" aria-hidden="true">
                  <span className="flightpath-duration">{selectedPortal.time} NONSTOP</span>
                  <div className="flightpath-line">
                    <span className="flightpath-dot start" />
                    <span className="flightpath-plane">✈</span>
                    <span className="flightpath-dot end" />
                  </div>
                  <span className="flightpath-equip">{selectedPortal.aircraft}</span>
                </div>

                <div className="pass-station dest">
                  <span className="station-code">DEST</span>
                  <span className="station-name">{selectedPortal.arrival}</span>
                </div>
              </div>

              {/* Boarding Grid Details */}
              <div className="pass-telemetry-grid">
                <div className="pass-meta-cell">
                  <label>FLIGHT</label>
                  <strong>{selectedPortal.flightNo}</strong>
                </div>
                <div className="pass-meta-cell">
                  <label>GATE</label>
                  <strong>{selectedPortal.gate}</strong>
                </div>
                <div className="pass-meta-cell">
                  <label>SEAT</label>
                  <strong>{selectedPortal.seat}</strong>
                </div>
                <div className="pass-meta-cell">
                  <label>BOARDING</label>
                  <strong>19:40 UTC</strong>
                </div>
                <div className="pass-meta-cell">
                  <label>STATUS</label>
                  <strong style={{ color: '#6de0b0' }}>CONFIRMED</strong>
                </div>
              </div>
            </div>

            {/* Perforated Divider */}
            <div className="pass-tear-divider" aria-hidden="true">
              <div className="tear-notch top" />
              <div className="tear-line" />
              <div className="tear-notch bottom" />
            </div>

            {/* Right Stub & Barcode */}
            <div className="pass-stub-section">
              <div className="stub-top">
                <span className="stub-flight-no">{selectedPortal.flightNo}</span>
                <span className="stub-seat">{selectedPortal.seat}</span>
              </div>

              <div className="stub-destination">
                <span className="stub-dest-label">DESTINATION</span>
                <strong className="stub-dest-name">{selectedPortal.name.toUpperCase()}</strong>
              </div>

              {/* Authentic Optical Boarding Barcode */}
              <div className="stub-barcode-box" aria-hidden="true">
                <div className="barcode-bars" />
                <span className="barcode-num">A34-9982-OCT26</span>
              </div>

              <button
                className={`pass-book-cta ${bookingConfirmed ? 'confirmed' : ''}`}
                onClick={() => setBookingConfirmed(true)}
              >
                {bookingConfirmed ? '✓ Flight Reserved' : 'Reserve Flight'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

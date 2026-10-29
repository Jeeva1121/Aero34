import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from './components/Header';
import WindowHero from './components/WindowHero';
import AirplaneFlyby from './components/AirplaneFlyby';
import DestinationShowcase from './components/DestinationShowcase';
import ExperienceShowcase from './components/ExperienceShowcase';
import FlightRouteCanvas from './components/FlightRouteCanvas';
import CityDioramaSection from './components/CityDioramaSection';
import BoardingTerminalSection from './components/BoardingTerminalSection';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [activeSection, setActiveSection] = useState('window');

  // Initialize Lenis smooth inertia scrolling paired with ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    const rafHandler = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafHandler);
    gsap.ticker.lagSmoothing(500, 33);

    window.__lenis = lenis;

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
      gsap.ticker.remove(rafHandler);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  // Smooth scroll to target section via Lenis
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    let target = 0;
    if (sectionId === 'window') {
      target = 0;
    } else if (sectionId === 'flyby') {
      const el = document.getElementById('flyby-section');
      if (el) target = el;
    } else if (sectionId === 'destinations') {
      const el = document.getElementById('destinations-section');
      if (el) target = el;
    } else if (sectionId === 'experience') {
      const el = document.getElementById('experience-section');
      if (el) target = el;
    } else if (sectionId === 'routes') {
      const el = document.getElementById('route-canvas-section');
      if (el) target = el;
    } else if (sectionId === 'diorama') {
      const el = document.getElementById('diorama-section');
      if (el) target = el;
    } else if (sectionId === 'boarding') {
      const el = document.getElementById('boarding-section');
      if (el) target = el;
    } else {
      const el =
        document.getElementById(`${sectionId}-section`) ||
        document.getElementById(sectionId);
      if (el) target = el;
    }

    if (window.__lenis) {
      window.__lenis.scrollTo(target, { duration: 1.2, offset: 0 });
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } else if (target && target.scrollIntoView) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Track active section efficiently via IntersectionObserver
  useEffect(() => {
    const sectionTargets = [
      { id: 'window-hero', name: 'window' },
      { id: 'flyby-section', name: 'flyby' },
      { id: 'destinations-section', name: 'destinations' },
      { id: 'experience-section', name: 'experience' },
      { id: 'route-canvas-section', name: 'routes' },
      { id: 'diorama-section', name: 'diorama' },
      { id: 'boarding-section', name: 'boarding' },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const found = sectionTargets.find((s) => s.id === entry.target.id);
            if (found) {
              setActiveSection((prev) => (prev !== found.name ? found.name : prev));
            }
          }
        });
      },
      { threshold: 0.25 }
    );

    sectionTargets.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="app-container">
      {/* 21st.dev / ReactBits Floating Glassmorphic Header */}
      <Header
        currentPage={activeSection}
        onNavigate={scrollToSection}
      />

      <main id="main-content">
        {/* 1. Passenger Window Hero Page ("Above the Clouds") */}
        <WindowHero onExploreNext={() => scrollToSection('flyby')} />

        {/* 2. Transition to Flight Page (Airliner & Volumetric Clouds) */}
        <AirplaneFlyby />

        {/* 3. Pinned Vertical Shutter Showcase (Paris, Tokyo, Swiss Alps, Horizon Ocean) */}
        <DestinationShowcase />

        {/* 4. First Class Experience (21st.dev / ReactBits SpotlightCard Grid) */}
        <ExperienceShowcase />

        {/* 5. Global Flight Corridors (21st.dev Interactive Flight Radar Matrix) */}
        <FlightRouteCanvas />

        {/* 6. Aerial Cartography Dioramas (London Miniature Map vs Paris Spherical Planet) */}
        <CityDioramaSection />

        {/* 7. The Boarding Pass Experience (Vengeance UI 3D Obsidian Ticket) */}
        <BoardingTerminalSection />
      </main>

      {/* Editorial Luxury Footer (NO slashes!) */}
      <footer className="site-footer" role="contentinfo">
        <div className="footer-inner">
          <div className="footer-brand-col">
            <strong className="footer-brand-title">
              Aero 34 • Global Transoceanic Aviation
            </strong>
            <p className="footer-tagline">
              Nonstop direct flights to the world's most breathtaking horizons.
            </p>
          </div>

          <div className="footer-meta-col">
            <span className="footer-dest-list">Paris • Tokyo • Swiss Alps • New York • Dubai</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

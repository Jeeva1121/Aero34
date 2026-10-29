import React, { useState, useEffect, useRef } from 'react';
import Magnet from './ui/Magnet';
import { gsap } from 'gsap';

/**
 * Header: 21st.dev & ReactBits Floating Glass Capsule
 * - Transparent & dynamic backdrop blur
 * - GSAP-powered magnetic indicator: smoothly glides between nav items on hover
 * - ReactBits Magnet CTA button
 * - Strictly NO unnecessary words with slashes
 */
export default function Header({
  currentPage = 'window',
  onNavigate,
}) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const navClusterRef = useRef(null);
  const indicatorRef = useRef(null);
  const itemRefs = useRef({});
  const [hoveredNav, setHoveredNav] = useState(null);

  const navItems = [
    { id: 'flyby', label: 'Flight' },
    { id: 'destinations', label: 'Destinations' },
    { id: 'experience', label: 'Experience' },
    { id: 'routes', label: 'Corridors' },
  ];

  useEffect(() => {
    const handleWheel = (e) => {
      if (e.deltaY > 3) {
        setIsVisible(false);
      } else if (e.deltaY < -3) {
        setIsVisible(true);
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        touchStartY = e.touches[0].clientY;
      }
    };
    const handleTouchMove = (e) => {
      if (!e.touches || !e.touches[0]) return;
      const currentTouchY = e.touches[0].clientY;
      const diff = touchStartY - currentTouchY;
      if (diff > 4) {
        setIsVisible(false);
      } else if (diff < -4) {
        setIsVisible(true);
      }
      touchStartY = currentTouchY;
    };

    const handleScroll = (y) => {
      const currentY = Math.max(0, y);
      if (currentY <= 40) {
        setIsVisible(true);
        lastScrollY.current = currentY;
        return;
      }
      const delta = currentY - lastScrollY.current;

      if (delta > 3) {
        setIsVisible(false);
      } else if (delta < -3) {
        setIsVisible(true);
      }

      lastScrollY.current = currentY;
    };

    const onNativeScroll = () => {
      handleScroll(window.scrollY);
    };

    // Reveal navbar when cursor moves within top 55px of the viewport
    const onMouseMove = (e) => {
      if (e.clientY <= 55) {
        setIsVisible(true);
      }
    };

    // Toggle with Escape key
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true, capture: true });
    document.addEventListener('wheel', handleWheel, { passive: true, capture: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true, capture: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true, capture: true });
    window.addEventListener('scroll', onNativeScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    let lenisUnsub = null;
    const hookLenis = () => {
      if (window.__lenis && !lenisUnsub) {
        const handler = (e) => {
          if (e.scroll <= 40) {
            setIsVisible(true);
          } else if (e.direction === 1 || e.velocity > 0.05) {
            setIsVisible(false);
          } else if (e.direction === -1 || e.velocity < -0.05) {
            setIsVisible(true);
          }
          handleScroll(e.scroll);
        };
        window.__lenis.on('scroll', handler);
        lenisUnsub = () => window.__lenis && window.__lenis.off('scroll', handler);
      }
    };
    hookLenis();
    const lenisTimer = setTimeout(hookLenis, 150);

    return () => {
      window.removeEventListener('wheel', handleWheel, { capture: true });
      document.removeEventListener('wheel', handleWheel, { capture: true });
      window.removeEventListener('touchstart', handleTouchStart, { capture: true });
      window.removeEventListener('touchmove', handleTouchMove, { capture: true });
      window.removeEventListener('scroll', onNativeScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('keydown', onKeyDown);
      clearTimeout(lenisTimer);
      if (lenisUnsub) lenisUnsub();
    };
  }, []);

  const handleNavClick = (targetId) => {
    setIsVisible(false); // Hide navbar while moving smoothly to page/section
    onNavigate(targetId);
  };

  const handleLogoClick = () => {
    setIsVisible(true); // Return to top hero with navbar visible
    onNavigate('window');
  };

  const handleReserveClick = () => {
    setIsVisible(false); // Hide navbar while moving down to ticket section
    onNavigate('boarding');
  };

  const moveIndicatorTo = (targetId, immediate = false) => {
    const cluster = navClusterRef.current;
    const indicator = indicatorRef.current;
    const targetEl = itemRefs.current[targetId];
    if (!cluster || !indicator || !targetEl) return;

    const clusterRect = cluster.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    const x = targetRect.left - clusterRect.left;
    const width = targetRect.width;

    if (immediate) {
      gsap.set(indicator, { x, width, opacity: 1 });
    } else {
      gsap.to(indicator, {
        x,
        width,
        opacity: 1,
        duration: 0.35,
        ease: 'power3.out',
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      moveIndicatorTo(hoveredNav || currentPage, false);
    }, 50);
    return () => clearTimeout(timer);
  }, [currentPage, hoveredNav]);

  useEffect(() => {
    const handleResize = () => {
      moveIndicatorTo(hoveredNav || currentPage, true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentPage, hoveredNav]);

  return (
    <header
      className={`site-header ${isVisible ? 'visible' : 'hidden'}`}
      role="banner"
    >
      {/* Brand Mark with User Logo (Text completely removed) */}
      <div
        className="brand-block"
        onClick={handleLogoClick}
        style={{ cursor: 'pointer' }}
        aria-label="Aero 34 Home"
      >
        <img
          src="/logo.png"
          alt="Aero 34"
          className="brand-logo-img"
        />
      </div>

      {/* GSAP Magnetic Floating Navbar */}
      <nav
        ref={navClusterRef}
        className="luxe-nav-cluster"
        aria-label="Flight Navigation"
        onMouseLeave={() => setHoveredNav(null)}
      >
        <span ref={indicatorRef} className="nav-magnetic-indicator" aria-hidden="true">
          <span className="magnetic-glow-line" />
        </span>

        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              ref={(el) => (itemRefs.current[item.id] = el)}
              className={`luxe-nav-item ${isActive ? 'is-active' : ''}`}
              onClick={() => handleNavClick(item.id)}
              onMouseEnter={() => setHoveredNav(item.id)}
            >
              <span className="nav-title">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ReactBits Magnet Reserve Button */}
      <div className="header-action-wrap">
        <Magnet strength={0.3} activeDistance={40}>
          <button
            type="button"
            className="modern-header-reserve-btn"
            onClick={handleReserveClick}
            aria-label="Reserve Flight"
          >
            <span>Reserve Seat</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </button>
        </Magnet>
      </div>
    </header>
  );
}

import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import gsap from 'gsap';
import { fetchShortlist } from '../lib/api.js';

export const Navigation: React.FC = () => {
  const [location] = useLocation();
  const [shortlistCount, setShortlistCount] = useState<number>(0);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    fetchShortlist().then((ids) => {
      setShortlistCount(ids.length);
    }).catch(() => {});

    const handleShortlistUpdate = () => {
      fetchShortlist().then((ids) => {
        setShortlistCount(ids.length);
        if (counterRef.current) {
          gsap.fromTo(
            counterRef.current,
            { scale: 1.4, color: '#E8431A' },
            { scale: 1, color: '#0A0A09', duration: 0.45, ease: 'back.out(1.4)' }
          );
        }
      }).catch(() => {});
    };

    window.addEventListener('shortlist_updated', handleShortlistUpdate);
    return () => window.removeEventListener('shortlist_updated', handleShortlistUpdate);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/routes', label: 'Routes' },
    { href: '/cabin', label: 'Cabin' },
    { href: '/request', label: 'Request' },
    { href: '/journal', label: 'Notes' },
  ];

  return (
    <header className="site-header">
      <div className="grid-12">
        {/* Left: Clean Brand Logo only - no robotic labels */}
        <div className="flex items-center">
          <Link href="/" className="inline-block" aria-label="Aero 34 Home">
            <img src="/logo.png" alt="AERO 34" className="h-8 max-h-8 w-auto object-contain" />
          </Link>
        </div>

        {/* Center: Clean Human Navigation Links */}
        <nav aria-label="Primary Navigation">
          {navLinks.map((link) => {
            const isActive = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors ${
                  isActive ? 'text-[#E8431A] font-semibold' : 'text-[#0A0A09]/80 hover:text-[#0A0A09]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Shortlist & Request Button */}
        <div className="flex items-center gap-4">
          <Link
            href="/routes?filter=shortlist"
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#0A0A09] hover:text-[#E8431A] transition-colors"
            title="View saved routes"
          >
            <span>Shortlist</span>
            <span
              ref={counterRef}
              className="tabular px-1.5 py-0.5 text-[11px] font-bold border border-[#0A0A09]/20"
            >
              {String(shortlistCount).padStart(2, '0')}
            </span>
          </Link>

          <Link
            href="/request"
            className="btn-editorial btn-signal py-2 px-4 text-xs font-semibold"
          >
            <span>Request Seat</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

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
    { href: '/', label: 'Monograph' },
    { href: '/routes', label: 'Corridors' },
    { href: '/cabin', label: 'Specifications' },
    { href: '/request', label: 'Seat Request' },
    { href: '/journal', label: 'Field Notes' },
  ];

  return (
    <header className="hairline-b sticky top-0 z-50 bg-[#EEEBE4]/95 backdrop-blur-none transition-colors duration-300">
      <div className="grid-12 items-center py-4">
        {/* Left: Brand Mark */}
        <div className="col-span-3 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 text-inherit no-underline" aria-label="AERO 34 Platform Home">
            <img src="/logo.png" alt="AERO 34 Emblem" className="h-8 w-auto object-contain" />
          </Link>
          <span className="hidden lg:inline-block h-3 w-[1px] bg-[var(--ink-12)]" />
          <span className="hidden lg:inline-block micro-label text-[10px]">CORRIDOR 34 • FL470</span>
        </div>

        {/* Center: Monograph Navigation Links */}
        <nav className="col-span-6 hidden md:flex items-center justify-center gap-8" aria-label="Primary Navigation">
          {navLinks.map((link) => {
            const isActive = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`editorial-link text-[13px] font-medium tracking-wide uppercase ${
                  isActive ? 'text-[var(--signal)] font-semibold' : 'text-[var(--ink-80)]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Shortlist Counter & Admin Access */}
        <div className="col-span-9 md:col-span-3 flex items-center justify-end gap-5">
          <Link
            href="/routes?filter=shortlist"
            className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-[var(--ink)] no-underline hover:text-[var(--signal)] transition-colors"
            title="View saved route shortlist"
          >
            <span>Shortlist</span>
            <span
              ref={counterRef}
              className="tabular inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold border border-[var(--ink-25)]"
            >
              {String(shortlistCount).padStart(2, '0')}
            </span>
          </Link>

          <Link
            href="/admin"
            className="micro-label hidden sm:inline-block hover:text-[var(--signal)] transition-colors"
          >
            Terminal
          </Link>

          <Link
            href="/request"
            className="btn-editorial py-2 px-4 text-[11px]"
          >
            <span>Request</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

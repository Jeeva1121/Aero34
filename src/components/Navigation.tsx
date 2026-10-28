import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import gsap from 'gsap';
import { fetchShortlist } from '../lib/api.js';

export const Navigation: React.FC = () => {
  const [location] = useLocation();
  const [shortlistCount, setShortlistCount] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
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
            { scale: 1.35, color: '#E8431A' },
            { scale: 1, color: '#FFFFFF', duration: 0.35, ease: 'back.out(1.4)' }
          );
        }
      }).catch(() => {});
    };

    window.addEventListener('shortlist_updated', handleShortlistUpdate);
    return () => window.removeEventListener('shortlist_updated', handleShortlistUpdate);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { href: '/', label: 'Overview' },
    { href: '/routes', label: 'Routes' },
    { href: '/cabin', label: 'Cabin' },
    { href: '/request', label: 'Request' },
    { href: '/journal', label: 'Journal' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#EEEBE4]/95 backdrop-blur-xl border-b border-black/10 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-6 h-18 flex items-center justify-between">
        {/* Brand Typographic Mark */}
        <Link href="/" className="flex items-center gap-2.5 no-underline group" aria-label="AERO 34 Home">
          <span className="font-display text-2xl tracking-widest text-[#0A0A09] font-bold group-hover:text-[#E8431A] transition-colors">
            AERO <span className="text-[#E8431A]">34</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8431A] hidden sm:inline-block" />
        </Link>

        {/* Desktop Navigation Links — Discrete, spaced pill buttons */}
        <nav className="hidden md:flex items-center gap-2 bg-black/5 p-1.5 rounded-full border border-black/5" aria-label="Primary Navigation">
          {navLinks.map((link) => {
            const isActive = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center justify-center px-5 py-2 text-xs font-semibold tracking-wider uppercase rounded-full transition-all duration-200 no-underline ${
                  isActive
                    ? 'bg-[#0A0A09] text-white shadow-md'
                    : 'text-[#0A0A09]/75 hover:text-[#0A0A09] hover:bg-black/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Shortlist & Request Seat */}
        <div className="flex items-center gap-3">
          <Link
            href="/routes?filter=shortlist"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#0A0A09]/80 hover:text-[#E8431A] transition-colors no-underline px-3.5 py-2 rounded-full bg-black/5 hover:bg-black/10 border border-black/5"
          >
            <span>Saved</span>
            <span
              ref={counterRef}
              className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold rounded-full bg-[#E8431A] text-white shadow-xs"
            >
              {shortlistCount}
            </span>
          </Link>

          <Link
            href="/request"
            className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full bg-[#E8431A] text-white hover:bg-[#0A0A09] transition-all duration-300 no-underline shadow-md hover:shadow-lg"
          >
            <span>Book Seat</span>
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-full text-[#0A0A09] hover:bg-black/5 cursor-pointer transition-colors"
            aria-label="Toggle Mobile Menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black/10 bg-[#EEEBE4] px-6 py-5 space-y-3 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-5 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-colors no-underline ${
                location === link.href ? 'bg-[#0A0A09] text-white' : 'text-[#0A0A09]/80 hover:bg-black/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/request"
              className="block w-full py-3.5 text-center text-xs font-bold uppercase tracking-wider rounded-xl bg-[#E8431A] text-white shadow-md no-underline"
            >
              Book Seat
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

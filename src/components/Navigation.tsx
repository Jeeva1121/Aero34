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
            { scale: 1, color: '#0A0A09', duration: 0.35, ease: 'back.out(1.4)' }
          );
        }
      }).catch(() => {});
    };

    window.addEventListener('shortlist_updated', handleShortlistUpdate);
    return () => window.removeEventListener('shortlist_updated', handleShortlistUpdate);
  }, []);

  // Close mobile menu when navigating
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
    <header className="sticky top-0 z-50 w-full transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-[rgba(10,10,9,0.08)]">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 no-underline group" aria-label="AERO 34 Home">
          <img src="/logo.png" alt="AERO 34" className="h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
        </Link>

        {/* Desktop Modern Square Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 border border-[rgba(10,10,9,0.08)] bg-white p-0.5 rounded-none" aria-label="Primary Navigation">
          {navLinks.map((link) => {
            const isActive = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-1.5 text-[12px] font-semibold tracking-wider uppercase transition-all duration-150 rounded-none ${
                  isActive
                    ? 'bg-[#0A0A09] text-white'
                    : 'text-[#0A0A09]/70 hover:text-[#0A0A09] hover:bg-[#0A0A09]/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Shortlist & Request Seat */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/routes?filter=shortlist"
            className="flex items-center gap-2 text-[12px] font-semibold tracking-wider uppercase text-[#0A0A09]/80 hover:text-[#E8431A] transition-colors no-underline px-3 py-1.5 border border-[rgba(10,10,9,0.08)] rounded-none hover:bg-[#0A0A09]/5"
          >
            <span>Saved</span>
            <span
              ref={counterRef}
              className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold bg-[#0A0A09] text-white rounded-none"
            >
              {shortlistCount}
            </span>
          </Link>

          <Link
            href="/request"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2 text-[11px] font-bold uppercase tracking-wider rounded-none bg-[#E8431A] text-white hover:bg-[#0A0A09] transition-colors duration-200 no-underline shadow-sm"
          >
            <span>Book Seat</span>
          </Link>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#0A0A09] hover:text-[#E8431A] transition-colors rounded-none border border-[rgba(10,10,9,0.08)]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 py-4 bg-white border-b border-[rgba(10,10,9,0.08)] flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`py-2 px-3 text-xs uppercase tracking-wider font-semibold rounded-none transition-colors ${
                  isActive
                    ? 'bg-[#0A0A09] text-white'
                    : 'text-[#0A0A09]/80 hover:bg-[#0A0A09]/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-[rgba(10,10,9,0.08)] mt-2">
            <Link
              href="/request"
              className="w-full inline-flex items-center justify-center py-2.5 px-4 text-xs uppercase tracking-wider font-bold rounded-none bg-[#E8431A] text-white text-center no-underline"
            >
              Book Seat
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

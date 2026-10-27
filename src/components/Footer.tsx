import React, { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import gsap from 'gsap';

export const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const mapSvgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const wordmark = wordmarkRef.current;
    const mapSvg = mapSvgRef.current;
    const footer = footerRef.current;
    if (!wordmark || !mapSvg || !footer) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordmark,
        { yPercent: 60, opacity: 0.4 },
        {
          yPercent: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 85%',
            end: 'bottom bottom',
            scrub: 1,
          },
        }
      );

      const paths = mapSvg.querySelectorAll('path');
      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 75%',
            once: true,
          },
        });
      });
    }, footer);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-[#0A0A09] text-white pt-20 pb-12 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Route Corridors Network Map */}
        <div className="mb-14 overflow-hidden border-b border-white/10 pb-10">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8431A]">Global Flight Corridors</span>
            <span className="text-xs text-white/50">12 Direct Routes</span>
          </div>
          <svg
            ref={mapSvgRef}
            viewBox="0 0 1200 240"
            fill="none"
            stroke="currentColor"
            className="w-full h-28 text-white/20"
            aria-hidden="true"
          >
            <path d="M 120 180 Q 350 40 580 140" strokeWidth="1.5" />
            <path d="M 580 140 Q 820 30 1080 150" strokeWidth="1.5" />
            <path d="M 1080 150 Q 600 220 120 180" strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M 580 140 Q 720 180 840 210" strokeWidth="1.5" />

            <circle cx="120" cy="180" r="3" fill="#E8431A" />
            <circle cx="580" cy="140" r="3" fill="#FFFFFF" />
            <circle cx="1080" cy="150" r="3" fill="#E8431A" />
            <circle cx="840" cy="210" r="3" fill="#FFFFFF" />
          </svg>
        </div>

        {/* Directory Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          <div className="md:col-span-5">
            <h3 className="font-display text-2xl text-white mb-2">AERO 34</h3>
            <p className="text-sm text-white/70 leading-relaxed max-w-sm mb-4">
              Direct private seat allocation and dedicated long-haul charter flights. Direct VIP terminal ramp handling.
            </p>
            <div className="space-y-1 text-xs text-white/50">
              <div>Email: concierge@aero34.com</div>
              <div>Phone: +1 (212) 847-0134</div>
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">Routes</p>
            <ul className="space-y-2 text-xs text-white/80 list-none">
              <li><Link href="/routes?region=Transatlantic" className="hover:text-[#E8431A] transition-colors">Transatlantic</Link></li>
              <li><Link href="/routes?region=Transpacific" className="hover:text-[#E8431A] transition-colors">Transpacific</Link></li>
              <li><Link href="/routes?region=Eurasia" className="hover:text-[#E8431A] transition-colors">Eurasia</Link></li>
              <li><Link href="/routes?region=Alpine-Gulf" className="hover:text-[#E8431A] transition-colors">Alpine-Gulf</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">Platform</p>
            <ul className="space-y-2 text-xs text-white/80 list-none">
              <li><Link href="/cabin" className="hover:text-[#E8431A] transition-colors">Cabin</Link></li>
              <li><Link href="/request" className="hover:text-[#E8431A] transition-colors">Request Seat</Link></li>
              <li><Link href="/journal" className="hover:text-[#E8431A] transition-colors">Journal</Link></li>
              <li><Link href="/admin" className="hover:text-[#E8431A] transition-colors">Admin</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">Privacy & Trust</p>
            <p className="text-xs text-white/60 leading-relaxed mb-4">
              We collect minimal data required for your flight manifest. No third-party tracking.
            </p>
            <div className="flex gap-4 text-xs text-white/60">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>

        {/* Wordmark */}
        <div className="overflow-hidden border-t border-white/10 pt-10">
          <div ref={wordmarkRef} className="font-display text-[15vw] leading-none text-white tracking-tighter text-center select-none opacity-90">
            AERO 34
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] text-white/40 pt-6 mt-4 border-t border-white/10">
          <div>© {new Date().getFullYear()} AERO 34. All rights reserved.</div>
          <div className="mt-2 sm:mt-0">Connecting 12 Global Cities Non-Stop</div>
        </div>
      </div>
    </footer>
  );
};

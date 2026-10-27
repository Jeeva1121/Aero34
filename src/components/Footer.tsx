import React, { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
      // Oversized wordmark rises through an overflow-hidden mask
      gsap.fromTo(
        wordmark,
        { yPercent: 100 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: footer,
            start: 'top 85%',
            end: 'bottom bottom',
            scrub: 1,
          },
        }
      );

      // Line-art route map path draws in on enter
      const paths = mapSvg.querySelectorAll('path');
      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.6,
          ease: 'power3.out',
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
    <footer ref={footerRef} className="hairline-t bg-[#0A0A09] text-[#EEEBE4] pt-24 pb-12 relative overflow-hidden">
      <div className="grid-12">
        {/* Line-Art Route Corridors SVG */}
        <div className="col-span-12 mb-16 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <span className="micro-label text-[#EEEBE4]/60">Flight Network Map</span>
            <span className="tabular text-xs text-[#EEEBE4]/40">12 Direct Routes</span>
          </div>
          <svg
            ref={mapSvgRef}
            viewBox="0 0 1200 240"
            fill="none"
            stroke="currentColor"
            className="w-full h-32 text-[#EEEBE4]/30"
            aria-hidden="true"
          >
            {/* North Atlantic Arcs */}
            <path d="M 120 180 Q 350 40 580 140" strokeWidth="1.5" />
            {/* Eurasian Arcs */}
            <path d="M 580 140 Q 820 30 1080 150" strokeWidth="1.5" />
            {/* Transpacific Arcs */}
            <path d="M 1080 150 Q 600 220 120 180" strokeWidth="1.5" strokeDasharray="4 4" />
            {/* Alpine-Gulf Vector */}
            <path d="M 580 140 Q 720 180 840 210" strokeWidth="1.5" />

            {/* Waypoint Coordinates */}
            <circle cx="120" cy="180" r="3" fill="#E8431A" />
            <circle cx="580" cy="140" r="3" fill="#EEEBE4" />
            <circle cx="1080" cy="150" r="3" fill="#E8431A" />
            <circle cx="840" cy="210" r="3" fill="#EEEBE4" />
          </svg>
        </div>

        {/* Monograph Directory Columns */}
        <div className="col-span-12 md:col-span-4 mb-12">
          <p className="micro-label text-[#EEEBE4]/60 mb-4">FLIGHT CONCIERGE</p>
          <p className="text-sm text-[#EEEBE4]/80 leading-relaxed max-w-sm mb-6">
            Private-seat allocation and charter dispatch for transcontinental city pairs. Direct ground handling at private FBOs.
          </p>
          <div className="space-y-1 text-xs tabular text-[#EEEBE4]/60">
            <div>PHONE: +1 (212) 847-0134</div>
            <div>EMAIL: CONCIERGE@AERO34.COM</div>
            <div>ICAO / EASA APPROVED PART 135</div>
          </div>
        </div>

        <div className="col-span-6 md:col-span-2 mb-12">
          <p className="micro-label text-[#EEEBE4]/60 mb-4">ROUTES</p>
          <ul className="space-y-2 text-sm text-[#EEEBE4]/80 list-none">
            <li><Link href="/routes?region=Transatlantic" className="hover:text-[#E8431A] transition-colors">Transatlantic</Link></li>
            <li><Link href="/routes?region=Transpacific" className="hover:text-[#E8431A] transition-colors">Transpacific</Link></li>
            <li><Link href="/routes?region=Eurasia" className="hover:text-[#E8431A] transition-colors">Eurasia</Link></li>
            <li><Link href="/routes?region=Alpine-Gulf" className="hover:text-[#E8431A] transition-colors">Alpine-Gulf</Link></li>
          </ul>
        </div>

        <div className="col-span-6 md:col-span-2 mb-12">
          <p className="micro-label text-[#EEEBE4]/60 mb-4">PLATFORM</p>
          <ul className="space-y-2 text-sm text-[#EEEBE4]/80 list-none">
            <li><Link href="/cabin" className="hover:text-[#E8431A] transition-colors">Specifications</Link></li>
            <li><Link href="/request" className="hover:text-[#E8431A] transition-colors">Seat Request</Link></li>
            <li><Link href="/journal" className="hover:text-[#E8431A] transition-colors">Field Notes</Link></li>
            <li><Link href="/admin" className="hover:text-[#E8431A] transition-colors">Admin Portal</Link></li>
          </ul>
        </div>

        <div className="col-span-12 md:col-span-4 mb-12">
          <p className="micro-label text-[#EEEBE4]/60 mb-4">GOVERNANCE & PRIVACY</p>
          <p className="text-xs text-[#EEEBE4]/70 leading-relaxed mb-4">
            AERO 34 logs no cross-site telemetry and shares zero passenger data. Requests are auto-purged following flight dispatch.
          </p>
          <div className="flex gap-6 text-xs text-[#EEEBE4]/60">
            <Link href="/privacy" className="hover:text-[#EEEBE4] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#EEEBE4] transition-colors">Charter Terms</Link>
          </div>
        </div>

        {/* Masked Oversized Wordmark */}
        <div className="col-span-12 overflow-hidden border-t border-[#EEEBE4]/10 pt-12 mt-8">
          <div ref={wordmarkRef} className="font-display text-[16vw] leading-none text-[#EEEBE4] tracking-tighter text-center select-none">
            AERO 34
          </div>
        </div>

        {/* Base Meta */}
        <div className="col-span-12 flex flex-col md:flex-row justify-between items-center text-[11px] text-[#EEEBE4]/40 pt-8 mt-6 border-t border-[#EEEBE4]/10">
          <div>© {new Date().getFullYear()} AERO 34 PLATFORM INC. ALL RIGHTS RESERVED.</div>
          <div className="tabular tracking-wider mt-2 md:mt-0">COORDINATES: 40°38&apos;28&quot;N 73°46&apos;42&quot;W • SHANWICK OCEANIC 54°N 020°W</div>
        </div>
      </div>
    </footer>
  );
};

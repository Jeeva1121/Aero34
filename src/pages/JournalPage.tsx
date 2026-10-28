import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export interface JournalArticle {
  id: string;
  slug: string;
  number: string;
  date: string;
  category: string;
  readTime: string;
  title: string;
  summary: string;
  image: string;
  pullQuote: string;
  bodyParagraphs: string[];
}

export const ARTICLES: JournalArticle[] = [
  {
    id: '01',
    slug: 'shanwick-oceanic-protocols',
    number: 'NOTE 01',
    date: 'OCTOBER 2026',
    category: 'AVIONICS & AIRSPACE',
    readTime: '06 MIN',
    title: 'The Shanwick Teletype: Oceanic Waypoint Clearances at Mach 0.90',
    summary: 'Traversing 54°N 020°W without ground-radar contact. How CPDLC satellite datalinks and high-altitude separation standards maintain 1,000-foot vertical intervals over the North Atlantic.',
    image: '/destinations/newyork-8k.jpg',
    pullQuote: 'At 45,000 feet, the ocean ceases to be geography and becomes pure mathematical separation.',
    bodyParagraphs: [
      'North Atlantic Organised Track System (NAT-OTS) governs the dense airspace between Europe and North America. Every twelve hours, Shanwick Oceanic Control in Prestwick and Gander Center in Newfoundland publish parallel tracks optimized for upper-level jet streams.',
      'Unlike commercial airliners confined to FL310 through FL380 where wake turbulence and routing delays are frequent, long-haul private airframes ascend directly to FL430 within twenty-two minutes of departure. Here, atmospheric density drops significantly, fuel consumption decreases by 14%, and lateral route deviation is virtually zero.',
      'Future Air Navigation Systems (FANS 1/A) continuously transmit satellite ADS-C position reports every fourteen minutes. Aircraft fly along great-circle arcs with precision GPS guidance accurate to within twelve feet across the entire oceanic crossing.',
    ],
  },
  {
    id: '02',
    slug: 'cabin-altitude-physiology',
    number: 'NOTE 02',
    date: 'SEPTEMBER 2026',
    category: 'PHYSIOLOGY & ATMOSPHERE',
    readTime: '08 MIN',
    title: 'Atmospheric Equivalent: The Physiology of 3,850 Feet',
    summary: 'Why commercial 8,000-foot cabin pressures cause severe cognitive fatigue, and the structural engineering required to maintain 3,850 feet at FL470.',
    image: '/destinations/first-class-suite.jpg',
    pullQuote: 'The human vascular system registers 8,000 feet as high-altitude hypoxia. At 3,800 feet, blood oxygen saturation remains near sea-level baseline.',
    bodyParagraphs: [
      'The primary cause of travel fatigue after a ten-hour flight is not time-zone displacement alone, but prolonged mild hypoxia. In a standard commercial airliner with an aluminum fuselage, differential pressure is limited to approximately 8.6 psi, dictating an 8,000-foot cabin altitude.',
      'At 8,000 feet, arterial oxygen saturation (SpO2) drops from 98% to approximately 91%. Cognitive acuity slows, sleep architecture is fragmented, and dehydration accelerates due to low relative humidity.',
      'By utilizing advanced carbon-composite fuselages and titanium window frames, Aero 34 airframes withstand a differential pressure of 10.2 psi. At a cruising altitude of 45,000 feet, passengers experience an ambient atmospheric pressure of just 3,850 feet, landing fully alert and physiologically refreshed.',
    ],
  },
  {
    id: '03',
    slug: 'g650er-transpacific-range',
    number: 'NOTE 03',
    date: 'AUGUST 2026',
    category: 'AERODYNAMICS',
    readTime: '05 MIN',
    title: 'Great Circle Over the Aleutians: Tokyo to San Francisco Non-Stop',
    summary: 'Navigating sub-zero Siberian air masses and polar jet streams. The aerodynamic wing sweep of the G650ER across 8,280 kilometers.',
    image: '/destinations/tokyo-8k.jpg',
    pullQuote: 'Mach 0.88 over the Aleutian trench cuts ninety minutes from commercial airline schedules.',
    bodyParagraphs: [
      'Flying westbound from Tokyo Haneda to California follows a Great Circle arc sweeping north toward the Bering Sea before descending into the Bay Area. The distance is 8,280 kilometers, requiring an airframe capable of holding Mach 0.88 for nine consecutive hours without refueling.',
      'The Gulfstream G650ER features an advanced transonic wing with a 36-degree sweep angle and no leading-edge slats. This reduces parasite drag substantially, enabling the aircraft to cruise smoothly at 49,000 feet.',
      'Operating at this altitude positions the flight completely above Pacific storm cells, providing smooth flight conditions where passengers can sleep uninterrupted through the night.',
    ],
  },
  {
    id: '04',
    slug: 'quiet-cabin-acoustics',
    number: 'NOTE 04',
    date: 'JULY 2026',
    category: 'INTERIOR ENGINEERING',
    readTime: '07 MIN',
    title: 'Acoustic Decibel Suppression: Engineering the 48 dBA Threshold',
    summary: 'Acoustic attenuation in long-haul flight. How specialized vibration dampers, double-pane glass, and composite insulation eliminate cabin rumble.',
    image: '/destinations/dreamliner-cabin.jpg',
    pullQuote: 'True luxury in aviation is not gold fixtures. It is the absence of 85-decibel engine hum.',
    bodyParagraphs: [
      'Commercial airline cabins typically register between 78 and 86 dBA during cruise, which creates auditory fatigue over flights exceeding six hours. This noise is composed of boundary-layer airflow shear against the fuselage skin and low-frequency engine rotation.',
      'To achieve sub-48 dBA levels, our fleet utilizes tuned elastomeric isolators between engine pylons and the airframe, preventing vibration from propagating into the cabin floorboards.',
      'Furthermore, three layers of acoustic insulation blankets and dual-pane acoustic window assemblies ensure that interior conversations require no vocal strain whatsoever.',
    ],
  },
];

export const JournalPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const floatImgRef = useRef<HTMLDivElement>(null);
  const [activeImg, setActiveImg] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const rows = rowsRef.current;
    const floatImg = floatImgRef.current;
    if (!container || !rows) return;

    const ctx = gsap.context(() => {
      // 1. Large index list reveal with ScrollTrigger.batch
      const articles = rows.querySelectorAll('.journal-row');
      ScrollTrigger.batch(articles, {
        start: 'top 85%',
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, yPercent: 40 },
            { opacity: 1, yPercent: 0, stagger: 0.06, duration: 0.8, ease: 'power3.out' }
          );
        },
        once: true,
      });

      // 2. Floating image cursor follower with quickTo and rotation
      if (floatImg && !window.matchMedia('(pointer: coarse)').matches) {
        const xTo = gsap.quickTo(floatImg, 'x', { duration: 0.35, ease: 'power2.out' });
        const yTo = gsap.quickTo(floatImg, 'y', { duration: 0.35, ease: 'power2.out' });
        const rotateTo = gsap.quickTo(floatImg, 'rotation', { duration: 0.45, ease: 'power2.out' });

        const handleMouseMove = (e: MouseEvent) => {
          xTo(e.clientX + 25);
          yTo(e.clientY - 120);
          const deltaX = e.movementX;
          rotateTo(Math.min(10, Math.max(-10, deltaX * 0.8)));
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
      }
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#EEEBE4] py-20 relative">
      {/* Floating Image Cursor Follower */}
      <div
        ref={floatImgRef}
        className={`fixed top-0 left-0 w-72 h-44 pointer-events-none z-50 overflow-hidden photo-frame border-2 border-(--ink) shadow-2xl transition-opacity duration-300 ${
          activeImg ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ display: activeImg ? 'block' : 'none' }}
      >
        {activeImg && (
          <img src={activeImg} alt="Preview" className="w-full h-full object-cover" />
        )}
      </div>

      <div className="max-w-[1400px] mx-auto px-6">
        <div className="mb-12 pb-6 border-b border-[rgba(10,10,9,0.08)] flex flex-col md:flex-row justify-between items-baseline gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8431A]">Articles & Notes</span>
            <h1 className="font-display text-4xl sm:text-6xl text-[#0A0A09] tracking-tight mt-1">
              Flight Journal
            </h1>
          </div>
          <p className="text-sm text-[#0A0A09]/70 max-w-md">
            Stories on high-altitude aerodynamics, cabin acoustics, and long-range flight.
          </p>
        </div>

        {/* Index Rows List */}
        <div ref={rowsRef} className="col-span-12 space-y-0">
          {ARTICLES.map((art) => (
            <Link
              key={art.id}
              href={`/journal/${art.slug}`}
              onMouseEnter={() => setActiveImg(art.image)}
              onMouseLeave={() => setActiveImg(null)}
              className="journal-row block py-10 px-4 hairline-b text-inherit no-underline hover:bg-[#F7F5F0] transition-colors group"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline">
                <div className="md:col-span-2 text-xs tabular text-(--ink-60) group-hover:text-(--signal) transition-colors">
                  {art.number} • {art.date}
                </div>

                <div className="md:col-span-7">
                  <h2 className="font-display text-2xl md:text-3xl group-hover:translate-x-2 transition-transform duration-300 leading-snug">
                    {art.title}
                  </h2>
                  <p className="text-xs text-(--ink-80) mt-2 line-clamp-2 max-w-2xl leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                <div className="md:col-span-3 flex justify-between md:justify-end items-center gap-6 text-xs tabular text-(--ink-60)">
                  <span>{art.category}</span>
                  <span className="font-semibold">{art.readTime}</span>
                  <span className="font-display text-xl text-(--ink-40) group-hover:text-(--signal) group-hover:translate-x-1 transition-all">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

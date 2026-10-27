import React, { useEffect, useRef } from 'react';
import { Switch, Route, useLocation } from 'wouter';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initLenis, initGlobalScrollProgress, lenis } from './lib/motion.js';
import { Cursor } from './components/Cursor.js';
import { Navigation } from './components/Navigation.js';
import { Footer } from './components/Footer.js';

import { HomePage } from './pages/HomePage.js';
import { RoutesPage } from './pages/RoutesPage.js';
import { RouteDetailPage } from './pages/RouteDetailPage.js';
import { CabinPage } from './pages/CabinPage.js';
import { RequestPage } from './pages/RequestPage.js';
import { JournalPage } from './pages/JournalPage.js';
import { ArticlePage } from './pages/ArticlePage.js';
import { AdminPage } from './pages/AdminPage.js';
import { PrivacyPage, TermsPage, NotFoundPage } from './pages/LegalPages.js';

export default function App() {
  const [location] = useLocation();
  const curtainRef = useRef<HTMLDivElement>(null);
  const routeCodeRef = useRef<HTMLSpanElement>(null);

  // Initialize smooth inertia scroll and global scroll progress bar
  useEffect(() => {
    initLenis();
    initGlobalScrollProgress();

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  // Page Transitions: Curtain wipe with clip-path and route code counting in the corner (0.8s total)
  useEffect(() => {
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });

    const curtain = curtainRef.current;
    const routeCode = routeCodeRef.current;

    if (curtain && routeCode) {
      const codes = ['AR-7K2Q9', 'AR-9X4M1', 'FL470', 'SHANWICK', 'NAT-OTS', 'AR-3B8L5'];
      const randomCode = codes[Math.floor(Math.random() * codes.length)];
      routeCode.innerText = randomCode;

      const tl = gsap.timeline({
        onComplete: () => {
          ScrollTrigger.refresh();
        },
      });

      tl.fromTo(
        curtain,
        { clipPath: 'inset(0% 0 100% 0)' },
        { clipPath: 'inset(0% 0 0% 0)', duration: 0.38, ease: 'power4.inOut' }
      )
        .to(curtain, {
          clipPath: 'inset(100% 0 0% 0)',
          duration: 0.42,
          ease: 'power4.inOut',
          delay: 0.05,
        });
    } else {
      ScrollTrigger.refresh();
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#EEEBE4] text-[#0A0A09] selection:bg-[#E8431A] selection:text-[#EEEBE4]">
      {/* Precision Custom Cursor */}
      <Cursor />

      {/* Global Top Scroll Progress Bar */}
      <div id="global-scroll-bar" />

      {/* Global Page Transition Curtain Wipe */}
      <div
        ref={curtainRef}
        className="fixed inset-0 z-[99999] pointer-events-none bg-[#0A0A09] text-[#EEEBE4] flex flex-col justify-between p-8"
        style={{ clipPath: 'inset(0 0 100% 0)' }}
      >
        <div className="flex justify-between items-center text-xs tracking-widest text-white/50">
          <span>AERO 34 CORRIDOR DISPATCH</span>
          <span ref={routeCodeRef} className="tabular font-bold text-[#E8431A]">AR-7K2Q9</span>
        </div>
        <div className="text-center font-display text-4xl text-white tracking-tighter">
          AERO 34
        </div>
        <div className="flex justify-between items-center text-xs tabular text-white/40">
          <span>ICAO FLIGHT PLAN INITIATED</span>
          <span>FL470 CLEARANCE</span>
        </div>
      </div>

      {/* Monograph Navigation */}
      <Navigation />

      {/* Dynamic Page Router */}
      <main className="flex-1 w-full" id="main-content">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/routes" component={RoutesPage} />
          <Route path="/routes/:slug" component={RouteDetailPage} />
          <Route path="/cabin" component={CabinPage} />
          <Route path="/request" component={RequestPage} />
          <Route path="/journal" component={JournalPage} />
          <Route path="/journal/:slug" component={ArticlePage} />
          <Route path="/admin" component={AdminPage} />
          <Route path="/privacy" component={PrivacyPage} />
          <Route path="/terms" component={TermsPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </main>

      {/* Curtain Footer */}
      <Footer />
    </div>
  );
}

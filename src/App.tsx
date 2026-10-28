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

  // Initialize smooth inertia scroll and global scroll progress bar
  useEffect(() => {
    initLenis();
    initGlobalScrollProgress();

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  // Page Navigation: Reset scroll and refresh ScrollTrigger smoothly
  useEffect(() => {
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
    ScrollTrigger.refresh();
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#EEEBE4] text-[#0A0A09] selection:bg-[#E8431A] selection:text-[#EEEBE4]">
      {/* Precision Custom Cursor */}
      <Cursor />

      {/* Global Top Scroll Progress Bar */}
      <div id="global-scroll-bar" />

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

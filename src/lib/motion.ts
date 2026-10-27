import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// Global Lenis Instance
export let lenis: Lenis | null = null;

export function initLenis(): Lenis {
  if (typeof window === 'undefined') return null as any;

  // Check prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    return null as any;
  }

  if (!lenis) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis?.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  return lenis;
}

// Global Custom Eases Constants
export const EASE = {
  enter: 'expo.out',
  move: 'power4.inOut',
  settle: 'back.out(1.4)',
  hover: 'power2.out',
};

// Global ScrollTrigger defaults
ScrollTrigger.defaults({
  anticipatePin: 1,
  invalidateOnRefresh: true,
});

// Setup Global Top Progress Bar
export function initGlobalScrollProgress() {
  const progressBar = document.getElementById('global-scroll-bar');
  if (!progressBar) return;

  ScrollTrigger.create({
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      gsap.to(progressBar, {
        scaleX: self.progress,
        duration: 0.1,
        ease: 'none',
        overwrite: 'auto',
      });
    },
  });
}

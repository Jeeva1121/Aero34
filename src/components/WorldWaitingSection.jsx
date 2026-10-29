import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * WorldWaitingSection: Full-Bleed Luxury Travel & Vacation Showcase
 * Uses user's high-resolution travel image (image copy 8.png / /destinations/travel-luggage-vacation.png)
 * Animated editorial headline & subtext floating in the azure sky with GSAP ScrollTrigger motion
 */
export default function WorldWaitingSection() {
  const sectionRef = useRef(null);
  const bgImgRef = useRef(null);
  const textContainerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  const titleWords = ['THE', 'WORLD', 'IS', 'WAITING'];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      // 1. Cinematic Zoom & Scroll Parallax on vacation visual
      gsap.fromTo(
        bgImgRef.current,
        { scale: 1.12, yPercent: 6 },
        {
          scale: 1.0,
          yPercent: -6,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.3,
          },
        }
      );

      if (prefersReducedMotion) {
        gsap.set(
          [textContainerRef.current, titleRef.current, subtitleRef.current],
          { opacity: 1, y: 0 }
        );
        return;
      }

      // 2. Parallax scrub on the sky text block (glides upward as you scroll down)
      gsap.to(textContainerRef.current, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.3,
        },
      });

      // 3. Editorial Entrance Motion for the Title Words & Subtitle
      const words = titleRef.current.querySelectorAll('.waiting-word-inner');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });

      // Reveal headline words from behind masked overflow with subtle 3D lift
      tl.fromTo(
        words,
        {
          yPercent: 125,
          rotateX: -45,
          opacity: 0,
        },
        {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          duration: 1.15,
          stagger: 0.08,
          ease: 'power3.out',
        }
      )
        // Reveal subtitle with elegant smooth fade and upward float
        .fromTo(
          subtitleRef.current,
          {
            y: 26,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.95,
            ease: 'power2.out',
          },
          '-=0.6'
        );

      // 4. Interactive 3D Cursor Parallax
      if (window.matchMedia('(pointer: fine)').matches) {
        const xToImg = gsap.quickTo(bgImgRef.current, 'x', { duration: 0.8, ease: 'power2.out' });
        const yToImg = gsap.quickTo(bgImgRef.current, 'y', { duration: 0.8, ease: 'power2.out' });
        const xToText = gsap.quickTo(textContainerRef.current, 'x', { duration: 0.6, ease: 'power2.out' });
        const yToText = gsap.quickTo(textContainerRef.current, 'y', { duration: 0.6, ease: 'power2.out' });

        const handleMouseMove = (e) => {
          const rect = sectionRef.current.getBoundingClientRect();
          if (rect.top > window.innerHeight || rect.bottom < 0) return;

          const relX = (e.clientX - rect.left) / rect.width - 0.5;
          const relY = (e.clientY - rect.top) / rect.height - 0.5;

          xToImg(relX * 18);
          yToImg(relY * 12);
          xToText(-relX * 22);
          yToText(-relY * 14);
        };

        const handleMouseLeave = () => {
          xToImg(0);
          yToImg(0);
          xToText(0);
          yToText(0);
        };

        const sec = sectionRef.current;
        sec.addEventListener('mousemove', handleMouseMove);
        sec.addEventListener('mouseleave', handleMouseLeave);

        return () => {
          sec.removeEventListener('mousemove', handleMouseMove);
          sec.removeEventListener('mouseleave', handleMouseLeave);
        };
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="waiting-section"
      className="world-waiting-section"
      aria-label="The World is Waiting"
    >
      {/* 100% Width 8K Travel Visual (Suitcases, Luggage, Vacation Essentials) */}
      <div className="waiting-backdrop-frame">
        <img
          ref={bgImgRef}
          src="/destinations/travel-luggage-vacation.png"
          alt="Luxury travel suitcases, guitar, camera, hat, and vacation essentials against blue sky"
          loading="eager"
          decoding="async"
          className="waiting-backdrop-img"
        />
      </div>

      {/* Floating Sky Editorial Text Block (Positioned in marked sky area) */}
      <div
        ref={textContainerRef}
        className="waiting-sky-content"
      >
        <h2
          ref={titleRef}
          className="waiting-title"
          aria-label="The World is Waiting"
        >
          {titleWords.map((word, idx) => (
            <span key={idx} className="waiting-word-wrap">
              <span className="waiting-word-inner">{word}</span>
            </span>
          ))}
        </h2>

        <p ref={subtitleRef} className="waiting-subline">
          Explore more. Travel deeper. Create memories above the clouds.
        </p>
      </div>
    </section>
  );
}


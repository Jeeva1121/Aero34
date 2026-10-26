import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function GlobalGlobeSection() {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);
  const auraRef = useRef(null);
  const textBlockRef = useRef(null);
  const titleRef = useRef(null);
  const sublineRef = useRef(null);

  const titleWords = ['SIMPLY', 'DECIDE', 'TO', 'GO'];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      // 1. Orbital Camera Flight Scrub on the Globe & Jet Image
      gsap.fromTo(
        imgRef.current,
        {
          scale: 1.16,
          yPercent: 7,
          rotate: -1.2,
        },
        {
          scale: 1.02,
          yPercent: -7,
          rotate: 1.2,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.3,
          },
        }
      );

      // 2. Atmospheric Horizon Aura Glow (intensifies as globe enters viewport)
      if (auraRef.current) {
        gsap.fromTo(
          auraRef.current,
          { opacity: 0.25, scaleY: 0.8 },
          {
            opacity: 0.8,
            scaleY: 1.15,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              end: 'center center',
              scrub: 1.2,
            },
          }
        );
      }

      if (prefersReducedMotion) {
        gsap.set([textBlockRef.current, titleRef.current, sublineRef.current], {
          opacity: 1,
          y: 0,
        });
        return;
      }

      // 3. Text Scrub Parallax (Floats forward and upward faster than the planet)
      gsap.to(textBlockRef.current, {
        yPercent: -22,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      // 4. Kinetic 3D Word-by-Word Reveal for "Simply Decide to Go"
      const words = titleRef.current.querySelectorAll('.globe-word-inner');
      const phrases = sublineRef.current.querySelectorAll('.globe-phrase');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 68%',
          toggleActions: 'play none none none',
        },
      });

      // Words lift from behind masked overflow with 3D roll and focal clear
      tl.fromTo(
        words,
        {
          yPercent: 130,
          rotateX: -60,
          scale: 0.85,
          opacity: 0,
          filter: 'blur(8px)',
        },
        {
          yPercent: 0,
          rotateX: 0,
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          clearProps: 'filter',
          duration: 1.2,
          stagger: 0.1,
          ease: 'power4.out',
        }
      )
        // Subtitle phrases glide in smoothly with soft focal reveal
        .fromTo(
          phrases,
          {
            y: 22,
            opacity: 0,
            filter: 'blur(4px)',
          },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            clearProps: 'filter',
            duration: 0.9,
            stagger: 0.14,
            ease: 'power3.out',
          },
          '-=0.7'
        );

      // 5. Interactive 3D Cursor Parallax (Creates real spatial depth on desktop)
      if (window.matchMedia('(pointer: fine)').matches) {
        const xToImg = gsap.quickTo(imgRef.current, 'x', { duration: 0.8, ease: 'power2.out' });
        const yToImg = gsap.quickTo(imgRef.current, 'y', { duration: 0.8, ease: 'power2.out' });
        const rotYImg = gsap.quickTo(imgRef.current, 'rotationY', { duration: 1.0, ease: 'power2.out' });
        const rotXImg = gsap.quickTo(imgRef.current, 'rotationX', { duration: 1.0, ease: 'power2.out' });

        const xToText = gsap.quickTo(textBlockRef.current, 'x', { duration: 0.6, ease: 'power2.out' });
        const yToText = gsap.quickTo(textBlockRef.current, 'y', { duration: 0.6, ease: 'power2.out' });

        const handleMouseMove = (e) => {
          const rect = sectionRef.current.getBoundingClientRect();
          if (rect.top > window.innerHeight || rect.bottom < 0) return;

          const relX = (e.clientX - rect.left) / rect.width - 0.5;
          const relY = (e.clientY - rect.top) / rect.height - 0.5;

          // Background image tilts and pans subtly
          xToImg(relX * 20);
          yToImg(relY * 12);
          rotYImg(relX * 3);
          rotXImg(-relY * 2);

          // Text counter-shifts for genuine 3D separation
          xToText(-relX * 24);
          yToText(-relY * 16);
        };

        const handleMouseLeave = () => {
          xToImg(0);
          yToImg(0);
          rotYImg(0);
          rotXImg(0);
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
      id="globe-section"
      className="global-globe-section"
      aria-label="Simply Decide to Go Globe Landmarks"
    >
      {/* 100% Width 8K Visual with Orbital Camera Movement */}
      <div className="globe-backdrop-frame">
        <img
          ref={imgRef}
          src="/simply-decide-to-go.png"
          alt="Curved Earth globe with iconic world landmarks and airliner flying in sky"
          className="globe-backdrop-img"
        />
        {/* Atmospheric Blue Rim Glow */}
        <div ref={auraRef} className="globe-horizon-aura" aria-hidden="true" />
      </div>

      {/* Floating 3D Editorial Content */}
      <div className="globe-content-container">
        <div ref={textBlockRef} className="globe-headline-block">
          <h2
            ref={titleRef}
            className="globe-title"
            aria-label="Simply Decide to Go"
          >
            {titleWords.map((word, idx) => (
              <span key={idx} className="globe-word-mask">
                <span className="globe-word-inner">{word}</span>
              </span>
            ))}
          </h2>

          <p ref={sublineRef} className="globe-subline">
            <span className="globe-phrase">
              Leave the navigation to us. The horizon is yours.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

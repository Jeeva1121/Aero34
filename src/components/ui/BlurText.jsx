import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * BlurText (Inspired by ReactBits BlurText)
 * Splits text into words or characters and reveals them with a smooth blur-to-focus animation.
 * Respects prefers-reduced-motion.
 */
export default function BlurText({
  text = '',
  as: Component = 'span',
  className = '',
  delay = 0,
  stagger = 0.05,
  duration = 0.9,
  animateBy = 'words', // 'words' | 'letters'
  triggerOnce = true,
  ...props
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el.querySelectorAll('.blur-token'), {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
      });
      return;
    }

    const tokens = el.querySelectorAll('.blur-token');

    const ctx = gsap.context(() => {
      gsap.fromTo(
        tokens,
        {
          opacity: 0,
          filter: 'blur(14px)',
          y: 28,
          scale: 0.98,
        },
        {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          scale: 1,
          stagger,
          duration,
          delay,
          ease: 'power3.out',
          clearProps: 'filter',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: triggerOnce ? 'play none none none' : 'play reverse play reverse',
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [text, delay, stagger, duration, animateBy, triggerOnce]);

  const items = animateBy === 'letters' ? text.split('') : text.split(' ');

  return (
    <Component ref={containerRef} className={`blur-text-root ${className}`} {...props}>
      {items.map((token, index) => (
        <span
          key={index}
          className="blur-token"
          style={{
            display: 'inline-block',
            whiteSpace: token === ' ' ? 'pre' : 'normal',
            marginRight: animateBy === 'words' ? '0.28em' : '0',
          }}
        >
          {token}
        </span>
      ))}
    </Component>
  );
}

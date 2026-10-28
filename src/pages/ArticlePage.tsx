import React, { useEffect, useRef } from 'react';
import { useRoute, Link } from 'wouter';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ARTICLES, JournalArticle } from './JournalPage.js';

export const ArticlePage: React.FC = () => {
  const [, params] = useRoute('/journal/:slug');
  const slug = params?.slug || '';
  const article: JournalArticle | undefined = ARTICLES.find((a) => a.slug === slug);

  const containerRef = useRef<HTMLDivElement>(null);
  const readingBarRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const pullQuoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!article) return;

    const ctx = gsap.context(() => {
      // 1. Reading progress bar scaleX scrubbed across the article
      if (readingBarRef.current) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          animation: gsap.to(readingBarRef.current, {
            scaleX: 1,
            ease: 'none',
          }),
        });
      }

      // 2. Headline lines drop in
      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.0, ease: 'expo.out', delay: 0.2 }
        );
      }

      // 3. Pull quote pins briefly while paragraphs scroll past
      if (pullQuoteRef.current && window.innerWidth >= 1024) {
        ScrollTrigger.create({
          trigger: pullQuoteRef.current,
          start: 'top 35%',
          end: '+=120%',
          pin: true,
          pinSpacing: true,
          scrub: 1,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen py-32 text-center bg-[#EEEBE4]">
        <span className="micro-label text-(--signal)">ARTICLE NOT FOUND</span>
        <h1 className="font-display text-4xl mt-2 mb-6">Article Not Found</h1>
        <Link href="/journal" className="btn-editorial">Return to Journal</Link>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#EEEBE4] relative">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-(--ink-12) z-50 pointer-events-none">
        <div
          ref={readingBarRef}
          className="h-full bg-(--signal) origin-left w-full"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* Header Monograph */}
      <div className="pt-20 pb-12 hairline-b">
        <div className="grid-12">
          <div className="col-span-12 mb-6">
            <Link href="/journal" className="editorial-link text-xs uppercase font-semibold text-(--ink-60)">
              ← Return to Journal
            </Link>
          </div>

          <div className="col-span-12 md:col-span-10">
            <span className="micro-label text-(--signal)">{article.category} • {article.number}</span>
            <h1
              ref={headlineRef}
              className="font-display text-4xl md:text-7xl mt-4 mb-6 tracking-tight leading-[1.05]"
            >
              {article.title}
            </h1>
            <div className="flex gap-6 text-xs tabular text-(--ink-60)">
              <span>PUBLISHED: {article.date}</span>
              <span>•</span>
              <span>READING TIME: {article.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Photo */}
      <div className="grid-12 py-12">
        <div className="col-span-12 photo-frame h-[50vh] max-h-[550px]">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Article Body with Pinned Pull Quote */}
      <div className="grid-12 py-16">
        {/* Left Column: Pinned Pull Quote */}
        <div className="col-span-12 lg:col-span-4 mb-12 lg:mb-0 pr-0 lg:pr-8">
          <div ref={pullQuoteRef} className="p-8 hairline-all bg-[#F7F5F0]">
            <span className="micro-label text-[10px]">CORE PRINCIPLE</span>
            <p className="font-display text-2xl md:text-3xl text-(--ink) mt-3 leading-snug">
              &ldquo;{article.pullQuote}&rdquo;
            </p>
            <div className="mt-4 pt-4 hairline-t text-xs tabular text-(--ink-60)">
              AERO 34 FLIGHT JOURNAL
            </div>
          </div>
        </div>

        {/* Right Column: Paragraph Content */}
        <div className="col-span-12 lg:col-span-8 space-y-8 pl-0 lg:pl-4">
          <p className="font-display text-2xl text-(--ink) leading-relaxed">
            {article.summary}
          </p>

          {article.bodyParagraphs.map((para, i) => (
            <p key={i} className="prose-editorial text-base md:text-lg text-(--ink-80) leading-relaxed">
              {para}
            </p>
          ))}

          <div className="pt-12 mt-12 hairline-t flex justify-between items-center text-xs tabular">
            <span className="text-(--ink-60)">FILED UNDER: {article.category}</span>
            <Link href="/request" className="btn-editorial py-2 px-5 text-xs">
              <span>Request Route Allocation →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

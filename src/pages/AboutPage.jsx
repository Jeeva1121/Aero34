import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Text highlight markers trigger on scroll
      gsap.utils.toArray('.marker-text').forEach((marker) => {
        ScrollTrigger.create({
          trigger: marker,
          start: 'top 85%',
          onEnter: () => marker.classList.add('active'),
          once: true
        });
      });

      // 2. Staggered jury cards entrance
      gsap.from('.jury-member-card', {
        scrollTrigger: {
          trigger: '.jury-grid',
          start: 'top 80%'
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out'
      });

      // 3. Awards cards entrance
      gsap.from('.award-box', {
        scrollTrigger: {
          trigger: '.awards-section',
          start: 'top 85%'
        },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power2.out'
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const JURY = [
    {
      name: "Claire Denis",
      role: "Jury President • Filmmaker",
      country: "France",
      bio: "Acclaimed auteur behind 'Beau Travail' and 'White Material'. Renowned for physical, sensory cinema and mastery of spatial geography."
    },
    {
      name: "Roger Deakins, ASC",
      role: "Honorary Chair • Director of Photography",
      country: "United Kingdom",
      bio: "Two-time Academy Award-winning cinematographer ('1917', 'Blade Runner 2049'). Pioneer of atmospheric practical lighting."
    },
    {
      name: "Ryusuke Hamaguchi",
      role: "Jury Member • Writer & Director",
      country: "Japan",
      bio: "Academy Award winner for 'Drive My Car'. Celebrated for intimate dialogue rhythms and contemplative temporal pacing."
    },
    {
      name: "Lucrecia Martel",
      role: "Jury Member • Director & Sound Designer",
      country: "Argentina",
      bio: "Director of 'La Ciénaga' and 'Zama'. Master of dense acoustic architecture and elliptical narrative structures."
    }
  ];

  return (
    <section ref={pageRef} className="page-container" aria-labelledby="manifesto-heading">
      <div className="content-wrapper">
        <header className="page-hero-header">
          <p className="page-eyebrow">BIENNALE MANIFESTO & MISSION</p>
          <h1 id="manifesto-heading" className="page-main-heading">
            Spatial Cinema & The Vertical Frame
          </h1>
        </header>

        {/* Manifesto with GSAP Kinetic Marker Highlights */}
        <div className="manifesto-body">
          <p style={{ marginBottom: '24px' }}>
            For over a century, cinema was dictated by the horizontal horizon—the panoramic vista of wide-screen celluloid.
            The 34th Biennale celebrates a historic rupture: the ascension of{' '}
            <span className="marker-text red">spatial 9:16 vertical storytelling</span> as a rigorous, autonomous artistic discipline.
          </p>

          <p style={{ marginBottom: '24px' }}>
            Across <span className="marker-text gold">1,840 international submissions</span> from 78 nations, the selected thirty-four works
            abandon commercial spectacle in pursuit of{' '}
            <span className="marker-text blue">unadorned light, tactile human presence</span>, and architectural momentum.
          </p>

          <p>
            Here, the screen ceases to be a static window. Through pure browser transforms, each reel sits on a continuous wheel—an
            archive that never ends, orbiting forever on the rim of human memory.
          </p>
        </div>

        {/* International Jury */}
        <section style={{ marginTop: 'var(--space-10)' }} aria-labelledby="jury-heading">
          <h2
            id="jury-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              borderBottom: '2px solid var(--color-border-dark)',
              paddingBottom: '10px'
            }}
          >
            The 34th International Competition Jury
          </h2>

          <div className="jury-grid">
            {JURY.map((member, i) => (
              <article key={i} className="jury-member-card">
                <h3 className="jury-name">{member.name}</h3>
                <p className="jury-role">{member.role} ({member.country})</p>
                <p className="jury-bio">{member.bio}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Festival Awards with Motion Graphics */}
        <section className="awards-section" style={{ marginTop: 'var(--space-10)', borderTop: '1px solid var(--color-border-medium)', paddingTop: 'var(--space-6)' }} aria-labelledby="awards-heading">
          <h2
            id="awards-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '24px',
              marginBottom: 'var(--space-3)'
            }}
          >
            Official Festival Honours
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div className="award-box" style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border-medium)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
              <div style={{ color: 'var(--color-accent-vermillion)', fontWeight: '700', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>GRAND PRIX DU JURY</div>
              <div style={{ fontWeight: '800', fontSize: '18px', marginTop: '6px', fontFamily: 'var(--font-display)' }}>The Concrete Monolith</div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Dir. Hélène de Saint-Germain (France)</div>
            </div>

            <div className="award-box" style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border-medium)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
              <div style={{ color: 'var(--color-accent-vermillion)', fontWeight: '700', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>PRIX DE LA MISE EN SCÈNE</div>
              <div style={{ fontWeight: '800', fontSize: '18px', marginTop: '6px', fontFamily: 'var(--font-display)' }}>Past Lives of Kyoto</div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Dir. Kenji Mizushima (Japan)</div>
            </div>

            <div className="award-box" style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border-medium)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
              <div style={{ color: 'var(--color-accent-blue)', fontWeight: '700', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>INNOVATION IN ASPECT RATIO</div>
              <div style={{ fontWeight: '800', fontSize: '18px', marginTop: '6px', fontFamily: 'var(--font-display)' }}>The Glass Pavilion</div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Dir. Julian Vance (United Kingdom)</div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

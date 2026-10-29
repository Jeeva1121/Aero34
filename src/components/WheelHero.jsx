import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CARDS_DATA, TOTAL_CARDS } from '../data/cardsData';
import CloudBank from './CloudBank';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Helpers
function wrap(angle) {
  return ((((angle + 180) % 360) + 360) % 360) - 180;
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function span(val, min, max) {
  return clamp((val - min) / (max - min), 0, 1);
}

function outCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Cubic bezier .5, 0, .15, 1 approximation
function liftEase(t) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const sq = t * t;
  return sq * (3.5 - 2.5 * t);
}

export default function WheelHero({
  onSelectCard,
  onActiveCardChange,
  isDrifting = true,
  replayTrigger = 0
}) {
  const containerRef = useRef(null);
  const cameraRigRef = useRef(null);
  const headlineRef = useRef(null);
  const leftCloudRef = useRef(null);
  const rightCloudRef = useRef(null);
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const videoRefs = useRef([]);

  // Cache last transforms to prevent redundant DOM writes
  const lastTransforms = useRef(new Array(TOTAL_CARDS).fill(''));
  const lastVisibilities = useRef(new Array(TOTAL_CARDS).fill(''));

  // Motion state
  const [dealProgress, setDealProgress] = useState(0);
  const [liftProgress, setLiftProgress] = useState(0);

  // Keep callback refs stable so rAF never restarts
  const onActiveCardChangeRef = useRef(onActiveCardChange);
  onActiveCardChangeRef.current = onActiveCardChange;

  const isDriftingRef = useRef(isDrifting);
  isDriftingRef.current = isDrifting;

  const lastActiveIndexRef = useRef(-1);

  // Animation values stored in refs for the 120/60fps loop
  const dealRef = useRef(0);
  const liftRef = useRef(0);
  const targetAngleRef = useRef(0);
  const currentAngleRef = useRef(0);
  const velocityRef = useRef(0);

  // Gesture state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const lastMoveTimeRef = useRef(0);
  const dragDistanceRef = useRef(0);

  // Check reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // Unified Pinned Hero ScrollTrigger Timeline (Curtain Reveal + 3D Camera Dolly)
  useEffect(() => {
    const heroEl = containerRef.current;
    if (!heroEl) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroEl,
          start: 'top top',
          end: '+=100%', // 100vh pinned scroll distance
          pin: true,
          pinSpacing: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      // Mirror right cloud so both clouds face inwards symmetrically
      if (rightCloudRef.current) {
        gsap.set(rightCloudRef.current, { scaleX: -1 });
      }

      // 1. Two Clouds part cleanly to the sides (Image curtain reveal)
      if (leftCloudRef.current) {
        tl.to(
          leftCloudRef.current,
          {
            xPercent: -110,
            yPercent: 25,
            rotate: -10,
            opacity: 0,
            ease: 'power1.inOut',
          },
          0
        );
      }

      if (rightCloudRef.current) {
        tl.to(
          rightCloudRef.current,
          {
            xPercent: 110,
            yPercent: 25,
            rotate: 10,
            scaleX: -1,
            opacity: 0,
            ease: 'power1.inOut',
          },
          0
        );
      }

      // 2. 3D Camera Rig dolly-zoom and depth fade
      if (cameraRigRef.current) {
        tl.to(
          cameraRigRef.current,
          {
            z: -340,
            rotateX: 18,
            scale: 0.86,
            opacity: 0,
            y: 40,
            ease: 'power1.inOut',
          },
          0
        );
      }

      // 3. Hero headline dissolves gracefully
      if (headlineRef.current) {
        tl.to(
          headlineRef.current,
          {
            opacity: 0,
            y: -30,
            ease: 'power1.inOut',
          },
          0
        );
      }

      // Ensure pin-spacing calculation is accurate
      ScrollTrigger.refresh();
    }, heroEl);

    return () => ctx.revert();
  }, []);

  // Skip entrance handler
  const handleSkip = useCallback(() => {
    dealRef.current = 1;
    liftRef.current = 1;
    setDealProgress(1);
    setLiftProgress(1);
  }, []);

  // Keyboard shortcut for Escape / Tab skip
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Tab') {
        if (dealRef.current < 1 || liftRef.current < 1) {
          handleSkip();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSkip]);

  // Reset/Replay animation trigger
  useEffect(() => {
    if (replayTrigger > 0) {
      dealRef.current = 0;
      liftRef.current = 0;
      targetAngleRef.current = 0;
      currentAngleRef.current = 0;
      velocityRef.current = 0;
      setDealProgress(0);
      setLiftProgress(0);
    }
  }, [replayTrigger]);

  // Main RAF Loop: drives deal, lift, idle drift, gesture follow, and video playback
  useEffect(() => {
    let animationFrameId;
    let lastTime = performance.now();
    let dealStartTime = performance.now();
    let liftStartTime = null;

    const DEAL_DURATION = 2600; // 2.6 seconds linear
    const LIFT_DURATION = 1900; // 1.9 seconds cubic-bezier

    if (prefersReducedMotion) {
      dealRef.current = 1;
      liftRef.current = 1;
      setDealProgress(1);
      setLiftProgress(1);
    }

    const step = 360 / TOTAL_CARDS;

    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // 1. Advance DEAL (0 to 1) - Monotonic
      if (!prefersReducedMotion && dealRef.current < 1) {
        const dealElapsed = now - dealStartTime;
        const dealVal = Math.min(1, dealElapsed / DEAL_DURATION);
        dealRef.current = dealVal;
        setDealProgress(dealVal);
      }

      // 2. Advance LIFT (Starts when deal completes)
      if (
        !prefersReducedMotion &&
        dealRef.current >= 1 &&
        liftRef.current < 1
      ) {
        if (liftStartTime === null) {
          liftStartTime = now;
        }
        const liftElapsed = now - liftStartTime;
        const liftNorm = Math.min(1, liftElapsed / LIFT_DURATION);
        const liftVal = liftEase(liftNorm);
        liftRef.current = liftVal;
        setLiftProgress(liftVal);
      }

      const dealVal = dealRef.current;
      const liftVal = liftRef.current;

      // 3. Wheel Physics & Gestures
      if (!isDraggingRef.current) {
        if (Math.abs(velocityRef.current) > 0.001) {
          targetAngleRef.current += velocityRef.current * dt;
          velocityRef.current *= Math.exp(-dt * 3.2); // Glide decay
        } else {
          velocityRef.current = 0;
          // Continuous 7 deg/sec drift scaled by lift
          if (isDriftingRef.current && !prefersReducedMotion) {
            targetAngleRef.current += 7 * liftVal * dt;
          }
        }
      }

      // Exponential follow: 1 - exp(-dt * 9)
      currentAngleRef.current +=
        (targetAngleRef.current - currentAngleRef.current) *
        (1 - Math.exp(-dt * 9));

      // 4. Calculate Responsive Scale (Fit hero frame)
      const container = containerRef.current;
      const width = container ? container.clientWidth : window.innerWidth;
      const height = container ? container.clientHeight : window.innerHeight;
      const baseScale = Math.min(1, Math.min(width / 1150, height / 880));

      // 5. Stage Transform (Elevated slightly for optimal optical balance)
      if (stageRef.current) {
        const stageY = 270 - 30 * liftVal;
        const stageRotX = 12 * liftVal;
        const stageScale = baseScale * (1 + 0.14 * liftVal);
        stageRef.current.style.transform = `translateY(${stageY.toFixed(1)}px) rotateX(${stageRotX.toFixed(2)}deg) scale(${stageScale.toFixed(4)})`;
      }

      // 6. Geometry Parameters (Pivot for optimal card visibility)
      const radius = 580 + 430 * liftVal;
      const pivot = 600 + 380 * liftVal;
      const grow = 1 + 0.35 * liftVal;
      const kick = -28 * liftVal;

      let closestAway = 999;
      let topCardIndex = 0;

      // 7. Render 34 Cards
      for (let i = 0; i < TOTAL_CARDS; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;

        const home = wrap(i * step - currentAngleRef.current + kick);
        const away = Math.abs(home);

        if (away < closestAway) {
          closestAway = away;
          topCardIndex = i;
        }

        const order = Math.min(away, 100) / 100;
        const p = outCubic(span(dealVal, order * 0.6, order * 0.6 + 0.4));
        const isVisible = p > 0 && away < 105;

        const visStr = isVisible ? 'visible' : 'hidden';
        if (lastVisibilities.current[i] !== visStr) {
          el.style.visibility = visStr;
          lastVisibilities.current[i] = visStr;
        }

        if (isVisible) {
          const transformStr =
            `translate3d(0, ${pivot.toFixed(1)}px, ${(-away * 0.5).toFixed(1)}px)` +
            ` rotateZ(${(home + (1 - p) * 70).toFixed(2)}deg)` +
            ` translate3d(0, ${(-radius * p + (1 - p) * 140).toFixed(1)}px, 0)` +
            ` rotateY(${((1 - p) * 180).toFixed(2)}deg)` +
            ` scale(${((0.7 + 0.3 * p) * grow).toFixed(4)})`;

          if (lastTransforms.current[i] !== transformStr) {
            el.style.transform = transformStr;
            lastTransforms.current[i] = transformStr;
          }
        }

        // 8. Video Playback Control (within 40° of apex)
        const video = videoRefs.current[i];
        if (video) {
          if (liftVal > 0.6 && away < 40) {
            if (video.paused) {
              const promise = video.play();
              if (promise !== undefined) {
                promise.catch(() => {});
              }
            }
          } else {
            if (!video.paused) {
              video.pause();
            }
          }
        }
      }

      // Only notify React state when active top card index changes
      if (lastActiveIndexRef.current !== topCardIndex) {
        lastActiveIndexRef.current = topCardIndex;
        setActiveCard(topCardIndex);
        if (onActiveCardChangeRef.current) {
          onActiveCardChangeRef.current(topCardIndex);
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [prefersReducedMotion, replayTrigger]);

  // Pointer Drag Handling
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    lastMoveTimeRef.current = performance.now();
    dragDistanceRef.current = 0;
    velocityRef.current = 0;

    if (containerRef.current) {
      containerRef.current.setPointerCapture?.(e.pointerId);
    }
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;

    const now = performance.now();
    const dt = (now - lastMoveTimeRef.current) / 1000;
    const dx = e.clientX - lastXRef.current;

    dragDistanceRef.current += Math.abs(dx);

    const sensitivity = 0.22;
    targetAngleRef.current += -dx * sensitivity;

    if (dt > 0.002) {
      velocityRef.current = (-dx * sensitivity) / dt;
    }

    lastXRef.current = e.clientX;
    lastMoveTimeRef.current = now;
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current) return;
    const now = performance.now();

    // Cancel flick if held still for > 80ms before release
    if (now - lastMoveTimeRef.current > 80) {
      velocityRef.current = 0;
    }

    isDraggingRef.current = false;
    if (containerRef.current) {
      containerRef.current.releasePointerCapture?.(e.pointerId);
    }
  };

  // Wheel Gesture
  const handleWheel = (e) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    targetAngleRef.current += delta * 0.06;
  };

  // Card click (suppressed on drag)
  const handleCardClick = (e, card) => {
    if (dragDistanceRef.current > 6) {
      e.preventDefault();
      return;
    }
    if (onSelectCard) {
      onSelectCard(card);
    }
  };

  const showLoader = dealProgress < 1 || (dealProgress >= 1 && liftProgress < 0.1);
  const showHeader = liftProgress > 0.45;

  return (
    <section
      ref={containerRef}
      className="hero-wrapper"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      aria-label="34th Biennale 3D Kinetic Film Wheel"
      id="hero-wheel-section"
    >
      {/* 1. Architectural Gallery Sky */}
      <div
        className={`painted-sky ${liftProgress > 0.05 ? 'active' : ''}`}
        style={{ opacity: prefersReducedMotion ? 1 : liftProgress }}
      >
        <div className="sky-grid" />
      </div>

      {/* 2. Linear Deal Loader */}
      {showLoader && !prefersReducedMotion && (
        <div
          className={`loader-overlay ${dealProgress >= 1 ? 'fade-out' : ''}`}
          aria-live="polite"
        >
          <div className="loader-center">
            <div className="loader-counter">
              {Math.round(dealProgress * 100)}
              <span>%</span>
            </div>
            <div className="loader-bar-bg">
              <div
                className="loader-bar-fill"
                style={{ width: `${dealProgress * 100}%` }}
              />
            </div>
            <div className="loader-status">
              INITIALIZING 34 SUPERSONIC FLEETS • PRE-FLIGHT TELEMETRY
            </div>
          </div>
        </div>
      )}

      {/* 3. Skip Button */}
      {dealProgress < 1 && !prefersReducedMotion && (
        <button
          className="skip-button"
          onClick={handleSkip}
          aria-label="Skip pre-flight entrance animation"
          id="skip-entrance-btn"
        >
          <span>SKIP PRE-FLIGHT</span>
          <kbd className="skip-kbd">ESC</kbd>
        </button>
      )}

      {/* 4. Editorial Headline Overlay */}
      <div
        ref={headlineRef}
        className={`hero-content ${showHeader ? 'visible' : ''}`}
        style={{
          transform: `translateX(-50%) translateY(${showHeader ? '0' : '20px'})`,
          opacity: prefersReducedMotion ? 1 : showHeader ? 1 : 0
        }}
      >
        <h1 className="hero-title">
          Thirty-Four <span className="marker-text blue active">Supersonic</span> Fleets
        </h1>
        <p className="hero-subtitle">
          An infinite 3D kinetic wheel of supersonic passenger flagships and stratospheric aerospace engineering. Drag or scroll to inspect.
        </p>
      </div>

      {/* 5. 3D Camera Rig & 34 Competition Film Cards */}
      <div ref={cameraRigRef} className="hero-camera-rig">
        <div ref={stageRef} className="stage">
          <div className="deck-container">
          {CARDS_DATA.map((card, i) => {
            return (
              <div
                key={card.id}
                ref={(el) => (cardRefs.current[i] = el)}
                className="card-item"
                id={`aircraft-card-${i}`}
                style={{
                  opacity: 1,
                  transition: 'opacity 0.4s ease'
                }}
              >
                <a
                  href={`#aircraft-${card.id}`}
                  className="card-link"
                  onClick={(e) => handleCardClick(e, card)}
                  aria-label={`Aircraft ${i + 1}: ${card.model} by ${card.manufacturer}`}
                >
                  <div className="card-inner">
                    {/* Back Face: Swiss Aerospace Telemetry Jacket */}
                    <div className="card-face card-back" aria-hidden="true">
                      <div className="back-header">
                        <div className="back-biennale-label">
                          AERO 34 FLEET<br />
                          STRATOSPHERE
                        </div>
                        <div className="back-reel-id">#{card.reelNumber}</div>
                      </div>

                      <div className="back-center-motif">
                        <svg className="laurel-icon" viewBox="0 0 40 40" fill="none">
                          <path d="M20 4L24 16L36 20L24 24L20 36L16 24L4 20L16 16L20 4Z" fill="currentColor" opacity="0.8" />
                          <circle cx="20" cy="20" r="3" fill="var(--color-accent-blue)" />
                        </svg>
                        <div className="back-selection-title">{card.route}</div>
                      </div>

                      <div className="back-specs">
                        {card.specs}
                      </div>

                      <div className="back-barcode">
                        <span>{card.timecode}</span>
                        <span>[{card.tailNumber}]</span>
                      </div>
                    </div>

                    {/* Front Face: High-Res Aerospace Still + Flight Clip */}
                    <div className="card-face card-front">
                      <div className="card-top-laurel">
                        <span>★</span>
                        <span>{card.speed} • {card.category}</span>
                      </div>

                      <img
                        src={card.cover}
                        alt={card.model}
                        className="card-cover"
                        loading="eager"
                        draggable={false}
                      />

                      <video
                        ref={(el) => (videoRefs.current[i] = el)}
                        src={card.video}
                        className="preview"
                        playsInline
                        muted
                        loop
                        preload="none"
                        onPlaying={(e) => e.currentTarget.setAttribute('data-playing', 'true')}
                        onPause={(e) => e.currentTarget.removeAttribute('data-playing')}
                        onWaiting={(e) => e.currentTarget.removeAttribute('data-playing')}
                      />

                      <div className="card-overlay">
                        <span className="card-badge">{card.category}</span>
                        <h3 className="card-title">{card.model}</h3>
                        <p className="card-meta">{card.manufacturer} • Range {card.range}</p>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>

      {/* 6. Realistic Two-Cloud Curtain Reveal Bank */}
      <CloudBank
        leftCloudRef={leftCloudRef}
        rightCloudRef={rightCloudRef}
        lift={liftProgress}
      />

    </section>
  );
}

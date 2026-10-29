import React from 'react';

/**
 * CloudBank: Two majestic clouds framing the bottom corners.
 * Controlled by the pinned GSAP ScrollTrigger timeline in WheelHero.
 * As user scrolls, Left Cloud glides to the left and Right Cloud glides to the right,
 * creating an authentic theatrical curtain reveal.
 */
export default function CloudBank({ leftCloudRef, rightCloudRef, lift = 0 }) {
  // Entrance lift offset (softly rises when page loads)
  const liftY = (1 - lift) * 140;

  return (
    <div
      className="two-clouds-curtain-bank"
      style={{
        transform: `translate3d(0, ${liftY}px, 0)`,
      }}
      aria-hidden="true"
    >
      {/* 1. Left Cloud: Frames bottom-left, parts leftwards on scroll */}
      <img
        ref={leftCloudRef}
        src="/cloud-single.png"
        alt=""
        className="curtain-cloud cloud-curtain-left"
        loading="eager"
      />

      {/* 2. Right Cloud: Frames bottom-right, mirrored, parts rightwards on scroll */}
      <img
        ref={rightCloudRef}
        src="/cloud-single.png"
        alt=""
        className="curtain-cloud cloud-curtain-right"
        loading="eager"
      />
    </div>
  );
}

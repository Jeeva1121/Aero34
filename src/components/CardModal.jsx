import React, { useEffect, useRef } from 'react';

export default function CardModal({ card, onClose }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!card) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [card, onClose]);

  useEffect(() => {
    if (card && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [card]);

  if (!card) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Flight telemetry preview of ${card.model}`}
    >
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal preview"
        >
          ✕
        </button>

        <div className="modal-media-wrapper">
          <video
            ref={videoRef}
            src={card.video}
            poster={card.cover}
            className="modal-video"
            autoPlay
            loop
            playsInline
            controls
          />
        </div>

        <div className="modal-info">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="card-badge">AIRCRAFT #{card.reelNumber} • {card.category}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-accent-blue)', fontWeight: '700' }}>
              {card.speed} • {card.altitude}
            </span>
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)', fontSize: '22px', fontWeight: '800', marginTop: '2px' }}>
            {card.model}
          </h2>

          <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>
            Manufactured by {card.manufacturer} • Route: {card.route}
          </p>

          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginTop: '4px' }}>
            {card.logline}
          </p>

          <div style={{ marginTop: '10px', padding: '8px 12px', background: 'var(--color-bg-subtle)', borderRadius: '6px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', display: 'flex', justifyContent: 'space-between' }}>
            <span>{card.specs}</span>
            <span style={{ color: 'var(--color-accent-blue)', fontWeight: '700' }}>★ {card.award.split('//')[0]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

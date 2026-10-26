import React from 'react';

/**
 * LiquidButton: Hyper-Realistic Liquid Glass Tactile Button
 * Features @property rotating caustic highlights, 3D press rotation,
 * dynamic refractive outline, and multi-layer optical blur shadows.
 */
export default function LiquidButton({
  children,
  onClick,
  className = '',
  variant = 'light', // 'light' | 'dark' | 'nav' | 'cobalt' | 'emerald'
  size = 'default',   // 'default' | 'compact'
  icon = null,
  style = {},
  ariaLabel,
  type = 'button',
  ...props
}) {
  return (
    <div
      className={`button-wrap liquid-btn-wrap liquid-btn-${variant} liquid-btn-${size} ${className}`}
      style={style}
    >
      <button
        type={type}
        className="liquid-btn"
        onClick={onClick}
        aria-label={ariaLabel}
        {...props}
      >
        <span className="liquid-btn-content btn-label">
          {icon && <span className="liquid-btn-icon">{icon}</span>}
          <span className="liquid-btn-text">{children}</span>
        </span>
      </button>
      <div className="button-shadow liquid-btn-shadow" aria-hidden="true" />
    </div>
  );
}

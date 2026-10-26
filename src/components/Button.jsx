import React from 'react';
import LiquidButton from './LiquidButton';

/**
 * Button: Hyper-realistic Liquid Glass Tactile Button Component
 * Drop-in implementation of user's custom tactile glass button specification.
 * Supports children, custom label, click handler, variants, and icons.
 */
export default function Button({
  children = 'Generate',
  onClick,
  variant = 'light',
  size = 'default',
  icon = null,
  className = '',
  ariaLabel,
  ...props
}) {
  return (
    <LiquidButton
      variant={variant}
      size={size}
      onClick={onClick}
      icon={icon}
      className={className}
      ariaLabel={ariaLabel}
      {...props}
    >
      {children}
    </LiquidButton>
  );
}

export { LiquidButton };

// Z:\MCN\mvp-mcn-crm\app\components\LandingPage\components\NavigationBar.tsx
import React, { useState } from 'react';
import { NavigationBarProps } from '../LandingPage.types';
import { DESIGN_TOKENS } from '../LandingPage.constants';
import { createExtendedGlassStyles } from '../LandingPage.styles';

const NavigationBar: React.FC<NavigationBarProps> = ({ 
  language, 
  content, 
  scrollProgress, 
  onNavigateToSystem 
}) => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const isVisible = scrollProgress > 0.5;

  const buttonStyle = (buttonName: string) => ({
    padding: '8px 24px',
    borderRadius: '9999px',
    border: 'none',
    cursor: 'pointer',
    fontSize: DESIGN_TOKENS.typography.fontSize.small,
    fontWeight: DESIGN_TOKENS.typography.fontWeight.regular,
    color: DESIGN_TOKENS.colors.text.primary,
    backgroundColor: hoveredButton === buttonName 
      ? 'color-mix(in srgb, var(--glass-base) 20%, transparent)' 
      : 'transparent',
    transform: hoveredButton === buttonName ? 'scale(1.05)' : 'scale(1)',
    transition: `all ${DESIGN_TOKENS.animation.duration.fast} ${DESIGN_TOKENS.animation.easing.default}`,
  });

  return (
    <div 
      className="navigation-bar"
      style={{
        position: 'fixed',
        bottom: '32px',
        left: '50%',
        transform: `translateX(-50%) translateY(${isVisible ? '0' : '20px'})`,
        zIndex: 50,
        pointerEvents: 'auto',
        opacity: isVisible ? 1 : 0,
        transition: `all ${DESIGN_TOKENS.animation.duration.slow} ${DESIGN_TOKENS.animation.easing.default}`,
      }}
    >
      <nav 
        className="navigation-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
          padding: '16px 32px',
          borderRadius: '9999px',
          ...createExtendedGlassStyles(),
        }}
      >
        <button
          className="nav-button nav-button-system"
          onClick={onNavigateToSystem}
          onMouseEnter={() => setHoveredButton('system')}
          onMouseLeave={() => setHoveredButton(null)}
          style={buttonStyle('system')}
        >
          {content.system}
        </button>

        <div 
          className="nav-divider"
          style={{
            width: '1px',
            height: '24px',
            backgroundColor: 'color-mix(in srgb, var(--glass-light) 20%, transparent)',
          }}
        />

        <button
          className="nav-button nav-button-contact"
          onMouseEnter={() => setHoveredButton('contact')}
          onMouseLeave={() => setHoveredButton(null)}
          style={buttonStyle('contact')}
        >
          {content.contact}
        </button>
      </nav>
    </div>
  );
};

export default NavigationBar;
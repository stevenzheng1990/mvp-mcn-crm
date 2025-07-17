import React, { useState } from 'react';
import { NavigationBarProps } from '../LandingPage.types';
import { DESIGN_TOKENS, SCROLL_CONFIG } from '../LandingPage.config';
import { createButtonGlassStyles } from '../LandingPage.styles';

const NavigationButtons: React.FC<NavigationBarProps> = ({ 
  language, 
  content, 
  scrollProgress, 
  onNavigateToSystem 
}) => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const isVisible = scrollProgress > SCROLL_CONFIG.visibility.navigationButtons;

  const buttonStyle = (buttonName: string) => {
    const isHovered = hoveredButton === buttonName;
    
    return {
      padding: DESIGN_TOKENS.spacing.component.navigationPadding,
      borderRadius: isHovered ? '24px' : '9999px',
      border: 'none',
      cursor: 'pointer',
      fontSize: DESIGN_TOKENS.typography.fontSize.small,
      fontWeight: DESIGN_TOKENS.typography.fontWeight.regular,
      color: DESIGN_TOKENS.colors.text.primary,
      transform: isHovered ? 'scale(1.08)' : 'scale(1)',
      transition: `all ${DESIGN_TOKENS.animation.duration.liquidTransition} ${DESIGN_TOKENS.animation.easing.liquid}`,
      ...createButtonGlassStyles(isHovered),
    };
  };

  return (
    <div 
      className="navigation-buttons"
      style={{
        position: 'fixed',
        bottom: DESIGN_TOKENS.layout.fixedElements.navigationButtons.bottom,
        left: '50%',
        transform: `translateX(-50%) translateY(${isVisible ? '0' : '20px'})`,
        zIndex: 50,
        pointerEvents: 'auto',
        opacity: isVisible ? 1 : 0,
        transition: `all ${DESIGN_TOKENS.animation.duration.slow} ${DESIGN_TOKENS.animation.easing.default}`,
        display: 'flex',
        gap: DESIGN_TOKENS.spacing.component.buttonGap,
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

      <button
        className="nav-button nav-button-contact"
        onMouseEnter={() => setHoveredButton('contact')}
        onMouseLeave={() => setHoveredButton(null)}
        style={buttonStyle('contact')}
      >
        {content.contact}
      </button>
    </div>
  );
};

export default NavigationButtons;
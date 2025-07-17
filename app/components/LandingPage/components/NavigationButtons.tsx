// Z:\MCN\mvp-mcn-crm\app\components\LandingPage\components\NavigationButtons.tsx
import React, { useState } from 'react';
import { NavigationBarProps } from '../LandingPage.types';
import { DESIGN_TOKENS } from '../LandingPage.constants';
import { createButtonGlassStyles } from '../LandingPage.styles';

const NavigationButtons: React.FC<NavigationBarProps> = ({ 
  language, 
  content, 
  scrollProgress, 
  onNavigateToSystem 
}) => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const isVisible = scrollProgress > 0.5;

  const buttonStyle = (buttonName: string) => {
    const isHovered = hoveredButton === buttonName;
    
    return {
      padding: '12px 24px',
      // 液体感的圆角变化
      borderRadius: isHovered ? '24px' : '9999px',
      border: 'none',
      cursor: 'pointer',
      fontSize: DESIGN_TOKENS.typography.fontSize.small,
      fontWeight: DESIGN_TOKENS.typography.fontWeight.regular,
      color: DESIGN_TOKENS.colors.text.primary,
      backgroundColor: 'transparent',
      // 液体感的缩放效果
      transform: isHovered ? 'scale(1.08)' : 'scale(1)',
      transition: `all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
      // 应用玻璃效果
      ...createButtonGlassStyles(isHovered),
    };
  };

  return (
    <div 
      className="navigation-buttons"
      style={{
        position: 'fixed',
        bottom: '32px',
        left: '50%',
        transform: `translateX(-50%) translateY(${isVisible ? '0' : '20px'})`,
        zIndex: 50,
        pointerEvents: 'auto',
        opacity: isVisible ? 1 : 0,
        transition: `all ${DESIGN_TOKENS.animation.duration.slow} ${DESIGN_TOKENS.animation.easing.default}`,
        display: 'flex',
        gap: '16px',
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
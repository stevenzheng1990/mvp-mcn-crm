import React, { useState } from 'react';
import { BackToTopButtonProps } from '../LandingPage.types';
import { DESIGN_TOKENS, SCROLL_CONFIG } from '../LandingPage.config';
import { createButtonGlassStyles } from '../LandingPage.styles';

const BackToTopButton: React.FC<BackToTopButtonProps> = ({ scrollProgress, content }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const isVisible = scrollProgress > SCROLL_CONFIG.visibility.backToTopButton;

  const handleBackToTop = () => {
    const targetPosition = window.innerHeight;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  };

  return (
    <button
      className="back-to-top-button"
      onClick={handleBackToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        bottom: DESIGN_TOKENS.layout.fixedElements.backToTop.bottom,
        right: DESIGN_TOKENS.layout.fixedElements.backToTop.right,
        zIndex: 50,
        pointerEvents: 'auto',
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
        transition: `all ${DESIGN_TOKENS.animation.duration.slow} ${DESIGN_TOKENS.animation.easing.default}`,
        
        width: '48px',
        height: '48px',
        borderRadius: isHovered ? '16px' : '50%',
        border: 'none',
        cursor: 'pointer',
        color: DESIGN_TOKENS.colors.text.primary,
        
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        
        ...createButtonGlassStyles(isHovered),
        
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
      }}
      title={content.tooltips.backToTop}
    >
      ↑
    </button>
  );
};

export default BackToTopButton;
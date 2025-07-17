import React from 'react';
import { ScrollIndicatorProps } from '../LandingPage.types';
import { DESIGN_TOKENS } from '../LandingPage.config';

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ scrollProgress }) => {
  const isVisible = scrollProgress <= 0.1;

  return (
    <div 
      className="scroll-indicator"
      style={{
        position: 'fixed',
        bottom: '48px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        pointerEvents: 'none',
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${DESIGN_TOKENS.animation.duration.slow} ease`,
      }}
    >
      <div 
        className="scroll-indicator-track"
        style={{
          width: '1px',
          height: '60px',
          backgroundColor: DESIGN_TOKENS.colors.text.tertiary,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div 
          className="scroll-indicator-thumb"
          style={{
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '20px',
            backgroundColor: DESIGN_TOKENS.colors.text.primary,
            animation: 'scrollIndicatorAnimation 2s ease-in-out infinite',
          }}
        />
      </div>
    </div>
  );
};

export default ScrollIndicator;
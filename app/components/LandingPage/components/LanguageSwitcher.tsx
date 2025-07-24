import React, { useState } from 'react';
import { LanguageSwitcherProps } from '../LandingPage.types';
import { DESIGN_TOKENS } from '../LandingPage.config';
import { createButtonGlassStyles } from '../LandingPage.styles';

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  language, 
  onLanguageChange, 
  scrollProgress 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="language-switcher"
      style={{
        position: 'fixed',
        top: DESIGN_TOKENS.layout.fixedElements.languageSwitcher.top,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        pointerEvents: 'auto',
      }}
    >
      <button
        className="language-switcher-button"
        onClick={() => onLanguageChange(language === 'zh' ? 'en' : 'zh')}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          padding: DESIGN_TOKENS.spacing.component.navigationPadding,
          borderRadius: isHovered ? '20px' : '9999px',
          border: 'none',
          cursor: 'pointer',
          fontSize: DESIGN_TOKENS.typography.fontSize.small,
          fontWeight: DESIGN_TOKENS.typography.level4.fontWeight,
          color: DESIGN_TOKENS.colors.text.primary,
          transform: isHovered ? 'scale(1.08)' : 'scale(1)',
          transition: `all ${DESIGN_TOKENS.animation.duration.liquidTransition} ${DESIGN_TOKENS.animation.easing.liquid}`,
          ...createButtonGlassStyles(isHovered),
        }}
      >
        {language === 'zh' ? 'EN' : '中文'}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
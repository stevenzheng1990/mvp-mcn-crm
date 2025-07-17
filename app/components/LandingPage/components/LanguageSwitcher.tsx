// Z:\MCN\mvp-mcn-crm\app\components\LandingPage\components\LanguageSwitcher.tsx
import React, { useState } from 'react';
import { LanguageSwitcherProps } from '../LandingPage.types';
import { DESIGN_TOKENS } from '../LandingPage.constants';
import { createGlassStyles } from '../LandingPage.styles';

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
        top: '32px',
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
          padding: '12px 24px',
          borderRadius: '9999px',
          border: 'none',
          cursor: 'pointer',
          fontSize: DESIGN_TOKENS.typography.fontSize.small,
          fontWeight: DESIGN_TOKENS.typography.fontWeight.regular,
          color: scrollProgress > 0.5 ? DESIGN_TOKENS.colors.text.primary : '#fff',
          transition: `all ${DESIGN_TOKENS.animation.duration.normal} ${DESIGN_TOKENS.animation.easing.default}`,
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          ...createGlassStyles(isHovered),
        }}
      >
        {language === 'zh' ? 'EN' : '中文'}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
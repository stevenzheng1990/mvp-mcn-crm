// Z:\MCN\mvp-mcn-crm\app\components\LandingPage\components\LanguageSwitcher.tsx
import React, { useState } from 'react';
import { LanguageSwitcherProps } from '../LandingPage.types';
import { DESIGN_TOKENS } from '../LandingPage.constants';
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
          // 液体感的圆角变化
          borderRadius: isHovered ? '20px' : '9999px',
          border: 'none',
          cursor: 'pointer',
          fontSize: DESIGN_TOKENS.typography.fontSize.small,
          fontWeight: DESIGN_TOKENS.typography.fontWeight.regular,
          color: DESIGN_TOKENS.colors.text.primary,
          // 液体感的缩放和过渡
          transform: isHovered ? 'scale(1.08)' : 'scale(1)',
          transition: `all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
          // 应用玻璃效果
          ...createButtonGlassStyles(isHovered),
        }}
      >
        {language === 'zh' ? 'EN' : '中文'}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
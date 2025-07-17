// Z:\MCN\mvp-mcn-crm\app\components\LandingPage\components\BackToTopButton.tsx
import React, { useState } from 'react';
import { DESIGN_TOKENS } from '../LandingPage.constants';
import { createButtonGlassStyles } from '../LandingPage.styles';

interface BackToTopButtonProps {
  scrollProgress: number;
}

const BackToTopButton: React.FC<BackToTopButtonProps> = ({ scrollProgress }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // 当滚动超过第一个section时显示
  const isVisible = scrollProgress > 0.3;

  const handleBackToTop = () => {
    // 滚动到第二个section的位置（遮罩结束后的第一个内容section）
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
        bottom: '32px',
        right: '32px',
        zIndex: 50,
        pointerEvents: 'auto',
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
        transition: `all ${DESIGN_TOKENS.animation.duration.slow} ${DESIGN_TOKENS.animation.easing.default}`,
        
        // 按钮样式
        width: '48px',
        height: '48px',
        borderRadius: isHovered ? '16px' : '50%',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        color: DESIGN_TOKENS.colors.text.primary,
        
        // 液体感效果
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        
        // 玻璃效果
        ...createButtonGlassStyles(isHovered),
        
        // 图标居中
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
      }}
      title="返回内容顶部"
    >
      ↑
    </button>
  );
};

export default BackToTopButton;
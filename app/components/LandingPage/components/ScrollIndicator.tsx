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
        bottom: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        pointerEvents: 'none',
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${DESIGN_TOKENS.animation.duration.slow} ease`,
      }}
    >
      {/* 极简现代设计 - 三条垂直线动画 */}
      <div 
        className="scroll-indicator-modern"
        style={{
          width: '40px',
          height: '60px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          margin: '0 auto', // 确保居中
        }}
      >
        {/* 三条动画线 */}
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            style={{
              width: '2px',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '2px',
              background: 'rgba(214, 188, 250, 0.1)', // 淡粉紫色背景
            }}
          >
            {/* 流动的渐变条 */}
            <div
              style={{
                position: 'absolute',
                top: '-100%',
                left: 0,
                width: '100%',
                height: '100%',
                background: `linear-gradient(to bottom, 
                  transparent 0%,
                  rgba(214, 188, 250, 0.3) 20%,
                  rgba(214, 188, 250, 0.8) 50%,
                  rgba(233, 168, 219, 0.8) 80%,
                  transparent 100%
                )`, // 纯粉紫色渐变
                animation: `flowDown ${2 + index * 0.3}s ease-in-out infinite`,
                animationDelay: `${index * 0.2}s`,
              }}
            />
          </div>
        ))}
      </div>
      
      {/* 底部文字提示 */}
      <div style={{
        marginTop: '12px',
        fontSize: DESIGN_TOKENS.typography.level6.fontSize,
        fontWeight: DESIGN_TOKENS.typography.level6.fontWeight,
        lineHeight: DESIGN_TOKENS.typography.level6.lineHeight,
        letterSpacing: DESIGN_TOKENS.typography.level6.letterSpacing,
        color: DESIGN_TOKENS.colors.text.secondary, // 使用页面常用黑灰色
        textAlign: 'center',
        fontFamily: DESIGN_TOKENS.typography.fontFamily,
        width: '100%', // 确保文字容器全宽
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        SCROLL
      </div>

      <style jsx>{`
        @keyframes flowDown {
          0% {
            transform: translateY(-100%);
          }
          50% {
            transform: translateY(100%);
          }
          100% {
            transform: translateY(200%);
          }
        }
      `}</style>
    </div>
  );
};

export default ScrollIndicator;
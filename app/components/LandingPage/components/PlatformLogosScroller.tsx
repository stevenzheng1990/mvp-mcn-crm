import React, { useEffect, useState, useRef } from 'react';

interface PlatformLogosScrollerProps {
  inView: boolean;
  delay?: number;
}

const PlatformLogosScroller: React.FC<PlatformLogosScrollerProps> = ({ inView, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setIsVisible(true), delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [inView, delay]);

  // 使用CSS遮罩创建无缝的渐变效果
  const maskGradient = `
    linear-gradient(
      to right,
      transparent,
      rgba(0,0,0,0.05) 5%,
      rgba(0,0,0,0.2) 10%,
      rgba(0,0,0,0.6) 15%,
      rgba(0,0,0,1) 25%,
      rgba(0,0,0,1) 75%,
      rgba(0,0,0,0.6) 85%,
      rgba(0,0,0,0.2) 90%,
      rgba(0,0,0,0.05) 95%,
      transparent
    )
  `;

  return (
    <div 
      ref={scrollerRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '180px',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        overflow: 'hidden',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        backgroundColor: 'transparent',
        WebkitMaskImage: maskGradient,
        maskImage: maskGradient,
        WebkitMaskSize: '100% 100%',
        maskSize: '100% 100%',
      }}
    >
      {/* 滚动容器 */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          animationName: isVisible ? 'scrollPlatforms' : 'none',
          animationDuration: '30s',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationFillMode: 'both',
          animationPlayState: isVisible ? 'running' : 'paused',
          willChange: 'transform',
        }}
      >
        {/* 四份图片以确保无缝滚动 */}
        {[0, 1, 2, 3].map((index) => (
          <img 
            key={index}
            src="/platforms.png" 
            alt="Platform Logos" 
            style={{
              height: '160px', // 适合容器高度的尺寸
              width: 'auto',
              objectFit: 'contain',
              marginRight: '40px',
              userSelect: 'none',
              pointerEvents: 'none',
              flexShrink: 0,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes scrollPlatforms {
          from {
            transform: translateX(0) translateY(-50%);
          }
          to {
            transform: translateX(-25%) translateY(-50%);
          }
        }

        /* 优化动画性能 */
        @media (prefers-reduced-motion: reduce) {
          @keyframes scrollPlatforms {
            from {
              transform: translateX(0) translateY(-50%);
            }
            to {
              transform: translateX(-25%) translateY(-50%);
            }
          }
        }
      `}</style>
    </div>
  );
};

export default PlatformLogosScroller;
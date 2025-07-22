// app/components/LandingPage/components/ScrollingTags.tsx
import React, { useRef, useEffect, useState } from 'react';

interface ScrollingTagsProps {
  tags: string[];
  direction?: 'left' | 'right';
  speed?: number;
  inView?: boolean;
  delay?: number;
  className?: string;
}

const ScrollingTags: React.FC<ScrollingTagsProps> = ({
  tags,
  direction = 'left',
  speed = 40, // 减慢滚动速度
  inView = false,
  delay = 0,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportCenter, setViewportCenter] = useState({ x: 0, y: 0 });

  // 分为3行，创建更丰富的视差效果
  const rows = [
    tags.filter((_, i) => i % 3 === 0),
    tags.filter((_, i) => i % 3 === 1),
    tags.filter((_, i) => i % 3 === 2),
  ];

  // 创建足够多的重复以确保真正无缝循环
  const duplicatedRows = rows.map(row => {
    const repeats = Math.max(8, Math.ceil(20 / row.length)); // 确保足够的重复
    return Array(repeats).fill(row).flat();
  });

  // 更新视口中心点
  useEffect(() => {
    const updateViewportCenter = () => {
      setViewportCenter({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
    };

    updateViewportCenter();
    window.addEventListener('resize', updateViewportCenter);
    return () => window.removeEventListener('resize', updateViewportCenter);
  }, []);

  // 使用CSS遮罩代替JavaScript动态效果，大幅提升性能
  const maskGradient = `
    linear-gradient(
      to right,
      transparent,
      rgba(0,0,0,0.1) 10%,
      rgba(0,0,0,0.5) 20%,
      rgba(0,0,0,1) 35%,
      rgba(0,0,0,1) 65%,
      rgba(0,0,0,0.5) 80%,
      rgba(0,0,0,0.1) 90%,
      transparent
    )
  `;

  return (
    <div 
      ref={containerRef}
      className={`infinite-scrolling-tags ${className}`}
      style={{
        width: '100vw',
        height: '400px',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        overflow: 'hidden',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay * 0.5}s, transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay * 0.5}s`,
        willChange: 'opacity, transform',
        backgroundColor: 'transparent',
        WebkitMaskImage: maskGradient,
        maskImage: maskGradient,
        WebkitMaskSize: '100% 100%',
        maskSize: '100% 100%',
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '1.5rem',
        backgroundColor: 'transparent', // 确保背景透明
      }}>
        {duplicatedRows.map((row, rowIndex) => {
          // 3行的方向模式：右，左，右
          const rowDirection = rowIndex % 2 === 0 ? 'right' : 'left';
          const rowSpeed = speed + (rowIndex * 8); // 适度的速度差异
          
          return (
            <div
              key={rowIndex}
              className="scroll-row"
              style={{
                height: '60px',
                position: 'relative',
                overflow: 'visible',
                backgroundColor: 'transparent', // 确保背景透明
              }}
            >
              <div
                className={`scroll-track scroll-${rowDirection}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem', // 缩小标签之间的间距
                  paddingLeft: '2rem',
                  paddingRight: '2rem',
                  whiteSpace: 'nowrap',
                  willChange: 'transform',
                  animation: inView ? `scroll-${rowDirection} ${rowSpeed}s linear infinite` : 'none',
                  animationDelay: inView ? `${delay * 0.5 + rowIndex * 0.1}s` : '0s',
                  animationFillMode: 'both',
                  animationPlayState: inView ? 'running' : 'paused',
                }}
              >
                {row.map((tag, tagIndex) => (
                  <div
                    key={`${rowIndex}-${tagIndex}-${tag}`}
                    data-tag
                    className="scroll-tag"
                    style={{
                      padding: '0.5rem 1rem', // 缩小padding
                      fontSize: '0.9rem',
                      fontWeight: '400',
                      color: 'rgba(80, 80, 80, 0.8)',
                      cursor: 'pointer',
                      position: 'relative',
                      letterSpacing: '0.01em',
                      flexShrink: 0,
                      userSelect: 'none',
                      transition: 'none', // 移除过渡效果
                    }}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      

      <style jsx>{`
        /* 完美的无缝循环动画 */
        @keyframes scroll-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-right {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }

        .infinite-scrolling-tags {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .scroll-track {
          transform-origin: center center;
        }

        .scroll-tag {
          transform-origin: center center;
        }

        /* 优化动画性能 */
        @media (prefers-reduced-motion: reduce) {
          .scroll-track {
            animation-duration: 120s !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ScrollingTags;
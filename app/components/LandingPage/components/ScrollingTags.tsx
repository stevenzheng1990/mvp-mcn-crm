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
  speed = 21, // 再降低30%：30 * 0.7 = 21
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

  // 动态计算每个标签的失焦效果
  useEffect(() => {
    if (!inView || !containerRef.current) return;

    let animationFrame: number;

    const updateTagStyles = () => {
      const container = containerRef.current;
      if (!container) return;

      const tags = container.querySelectorAll('[data-tag]');
      const containerRect = container.getBoundingClientRect();
      const containerCenterX = containerRect.left + containerRect.width / 2;

      tags.forEach((tag) => {
        const tagRect = tag.getBoundingClientRect();
        const tagCenterX = tagRect.left + tagRect.width / 2;
        
        // 计算标签到视口中心的距离（只考虑X轴）
        const distanceFromCenter = Math.abs(tagCenterX - viewportCenter.x);
        const maxDistance = window.innerWidth * 0.6; // 最大影响距离
        
        // 将距离归一化到0-1范围
        const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);
        
        // 使用平滑的缓动函数计算效果强度
        const easedDistance = Math.pow(normalizedDistance, 1.5);
        
        // 计算各种效果值
        const blur = easedDistance * 3; // 最大3px模糊
        const opacity = 1 - (easedDistance * 0.6); // 最多减少60%透明度
        const scale = 1 - (easedDistance * 0.2); // 最多缩小20%
        
        // 应用样式
        const element = tag as HTMLElement;
        element.style.filter = `blur(${blur}px)`;
        element.style.opacity = `${Math.max(opacity, 0.2)}`; // 最小保持20%透明度
        element.style.transform = `scale(${Math.max(scale, 0.8)})`; // 最小保持80%尺寸
      });

      animationFrame = requestAnimationFrame(updateTagStyles);
    };

    // 延迟启动以确保DOM已渲染
    const timer = setTimeout(() => {
      updateTagStyles();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [inView, viewportCenter]);

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
        transition: `all 1.2s cubic-bezier(0.23, 1, 0.32, 1) ${delay}s`,
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '2.4rem', // 缩短20%：3rem * 0.8 = 2.4rem
      }}>
        {duplicatedRows.map((row, rowIndex) => {
          // 3行的方向模式：右，左，右
          const rowDirection = rowIndex % 2 === 0 ? 'right' : 'left';
          const rowSpeed = speed + (rowIndex * 5.6); // 适度的速度差异（8 * 0.7 = 5.6）
          
          return (
            <div
              key={rowIndex}
              className="scroll-row"
              style={{
                height: '100px', // 稍微减小高度以适应3行
                position: 'relative',
                overflow: 'visible', // 改为visible以便观察边缘效果
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
                  gap: '3rem',
                  paddingLeft: '2rem',
                  paddingRight: '2rem',
                  whiteSpace: 'nowrap',
                  willChange: 'transform',
                  animation: inView ? `scroll-${rowDirection} ${rowSpeed}s linear infinite` : 'none',
                  animationDelay: `${delay + rowIndex * 0.2}s`,
                  animationFillMode: 'both',
                }}
              >
                {row.map((tag, tagIndex) => (
                  <div
                    key={`${rowIndex}-${tagIndex}-${tag}`}
                    data-tag
                    className="scroll-tag"
                    style={{
                      padding: '1rem 2rem', // 稍微缩小标签以适应3行布局
                      borderRadius: '25px',
                      fontSize: '1rem',
                      fontWeight: '500',
                      color: 'rgba(80, 80, 80, 0.9)',
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(12px)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                      cursor: 'pointer',
                      position: 'relative',
                      letterSpacing: '0.02em',
                      flexShrink: 0,
                      transition: 'background 0.3s ease, box-shadow 0.3s ease',
                      userSelect: 'none',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.background = 'rgba(255, 255, 255, 0.25)';
                      el.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      el.style.background = 'rgba(255, 255, 255, 0.15)';
                      el.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
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
          will-change: transform, filter, opacity;
        }

        /* 优化动画性能 */
        @media (prefers-reduced-motion: reduce) {
          .scroll-track {
            animation-duration: 120s !important;
          }
        }

        /* 确保在低端设备上的性能 */
        @supports not (backdrop-filter: blur(12px)) {
          .scroll-tag {
            background: rgba(255, 255, 255, 0.25);
            backdrop-filter: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ScrollingTags;
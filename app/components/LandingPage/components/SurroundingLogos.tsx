// app/components/LandingPage/components/SurroundingLogos.tsx
import React, { useRef, useEffect } from 'react';
import { DESIGN_TOKENS } from '../LandingPage.config';

interface SurroundingLogosProps {
  inView?: boolean;
  className?: string;
}

const SurroundingLogos: React.FC<SurroundingLogosProps> = ({ 
  inView = false, 
  className = '' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const logosRef = useRef<(HTMLDivElement | null)[]>([]);

  // 社媒平台logo列表 - 包含所有14个logo，统一尺寸用于网格布局
  const socialLogos = [
    { src: '/icons/icons8-facebook.svg', name: 'Facebook', size: 84 },
    { src: '/icons/icons8-instagram.svg', name: 'Instagram', size: 84 },
    { src: '/icons/icons8-tiktok.svg', name: 'TikTok', size: 84 },
    { src: '/icons/icons8-youtube.svg', name: 'YouTube', size: 84 },
    { src: '/icons/icons8-twitch.svg', name: 'Twitch', size: 84 },
    { src: '/icons/Bilibili_logo.svg', name: 'Bilibili', size: 84 },
    { src: '/icons/Xiaohongshu--Streamline-Simple-Icons.svg', name: 'Xiaohongshu', size: 84 },
    { src: '/icons/WeChat-Logo.wine.svg', name: 'WeChat', size: 68 },
    { src: '/icons/Toutiao_logo.svg', name: 'Toutiao', size: 96 },
    { src: '/icons/kuaishou-seeklogo.svg', name: 'Kuaishou', size: 96 },
    { src: '/icons/sina-weibo.svg', name: 'Weibo', size: 96 },
    { src: '/icons/x-2.svg', name: 'Twitter', size: 68 },
    { src: '/icons/Zhihu_logo.svg', name: 'Zhihu', size: 84 },
    { src: '/icons/douyin-seeklogo.svg', name: 'Douyin', size: 96 },
  ];


  useEffect(() => {
    const container = containerRef.current;
    const grid = gridRef.current;
    if (!container || !grid || !inView) return; // 只在组件可见时激活

    let animationFrame: number;
    let isActive = false;

    const handleMouseMove = (e: MouseEvent) => {
      // 检查鼠标是否在容器内
      const containerRect = container.getBoundingClientRect();
      const isInContainer = e.clientX >= containerRect.left && 
                           e.clientX <= containerRect.right && 
                           e.clientY >= containerRect.top && 
                           e.clientY <= containerRect.bottom;
      
      if (!isInContainer) {
        if (isActive) {
          isActive = false;
          handleMouseLeave();
        }
        return;
      }
      
      isActive = true;
      if (animationFrame) cancelAnimationFrame(animationFrame);
      
      animationFrame = requestAnimationFrame(() => {
        // 使用网格的位置来计算logo相对位置
        const gridRect = grid.getBoundingClientRect();
        
        // 鼠标位置相对于viewport
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        logosRef.current.forEach((logo) => {
          if (!logo) return;
          
          const logoRect = logo.getBoundingClientRect();
          const logoX = logoRect.left + logoRect.width / 2;
          const logoY = logoRect.top + logoRect.height / 2;
          
          const deltaX = mouseX - logoX;
          const deltaY = mouseY - logoY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          
          // 使用整个视口的对角线作为最大距离
          const maxDistance = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
          
          // 所有logo都会被影响，但影响力随距离衰减
          const force = Math.max(0, 1 - (distance / maxDistance) * 2);
          
          // 使用平方函数让近距离效果更明显
          const adjustedForce = Math.pow(force, 2);
          
          // 移动效果
          const moveX = deltaX * adjustedForce * 0.2;
          const moveY = deltaY * adjustedForce * 0.2;
          
          // 缩放效果
          const scale = 1 + adjustedForce * 0.32;
          
          // 旋转效果
          const rotation = adjustedForce * 6 * Math.sign(deltaX);
          
          logo.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale}) rotate(${rotation}deg)`;
        });
      });
    };

    const handleMouseLeave = () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      
      logosRef.current.forEach((logo) => {
        if (logo) {
          logo.style.transform = 'translate(0px, 0px) scale(1) rotate(0deg)';
        }
      });
    };

    // 在整个窗口上监听鼠标事件
    window.addEventListener('mousemove', handleMouseMove);
    
    // 当鼠标离开窗口时重置
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [inView]);

  return (
    <div 
      ref={containerRef}
      className={`magnetic-social-logos ${className}`}
      style={{
        width: '100%',
        padding: '3rem 1rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div 
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 120px)', // 固定列宽确保居中对齐
          gridTemplateRows: 'repeat(2, 120px)', // 固定行高
          gap: '2rem',
          justifyContent: 'center',
          alignContent: 'center',
          justifyItems: 'center',
          alignItems: 'center',
        }}
      >
        {socialLogos.map((logo, index) => (
          <div
            key={logo.name}
            ref={(el) => { logosRef.current[index] = el; }}
            className="magnetic-logo-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '120px', // 固定宽度确保对齐
              height: '120px', // 固定高度确保对齐
              cursor: 'pointer',
              transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              willChange: 'transform',
              transform: 'translate(0px, 0px) scale(1) rotate(0deg)',
            }}
          >
            <img
              src={logo.src}
              alt={logo.name}
              style={{
                width: `${logo.size}px`,
                height: `${logo.size}px`,
                objectFit: 'contain',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
              draggable={false}
              onError={(e) => {
                console.error(`Failed to load logo: ${logo.src}`);
                const img = e.currentTarget;
                img.style.display = 'none';
              }}
            />
          </div>
        ))}</div>

      <style jsx>{`
        .magnetic-logo-item {
          transform-origin: center center;
          position: relative;
        }
        
        .magnetic-logo-item img {
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          user-drag: none;
        }
        
        .magnetic-logo-item:hover::after {
          opacity: 1;
        }
        
        /* 悬停时的额外效果 */
        .magnetic-logo-item:hover {
          filter: brightness(1.3) drop-shadow(0 0 25px rgba(124, 58, 237, 0.4));
        }
      `}</style>
    </div>
  );
};

export default SurroundingLogos;
// app/components/LandingPage/components/MagneticSocialLogos.tsx
import React, { useRef, useEffect } from 'react';
import { DESIGN_TOKENS } from '../LandingPage.config';

interface MagneticSocialLogosProps {
  inView?: boolean;
  className?: string;
}

const MagneticSocialLogos: React.FC<MagneticSocialLogosProps> = ({ 
  inView = false, 
  className = '' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const logosRef = useRef<(HTMLDivElement | null)[]>([]);

  // 社媒平台logo列表 - 更新为12个，缩小尺寸
  const socialLogos = [
    { src: '/icons/icons8-facebook.svg', name: 'Facebook', size: 84 },
    { src: '/icons/icons8-instagram.svg', name: 'Instagram', size: 84 },
    { src: '/icons/icons8-tiktok.svg', name: 'TikTok', size: 84 },
    { src: '/icons/icons8-youtube.svg', name: 'YouTube', size: 84 },
    { src: '/icons/icons8-twitch.svg', name: 'Twitch', size: 84 },
    { src: '/icons/Bilibili_logo.svg', name: 'Bilibili', size: 84 },
    { src: '/icons/Xiaohongshu--Streamline-Simple-Icons.svg', name: 'Xiaohongshu', size: 84 },
    { src: '/icons/WeChat-Logo.wine.svg', name: 'WeChat', size: 108 },
    { src: '/icons/Toutiao_logo.svg', name: 'Toutiao', size: 84 },
    { src: '/icons/kuaishou-seeklogo.svg', name: 'Kuaishou', size: 84 },
    { src: '/icons/sina-weibo.svg', name: 'Weibo', size: 84 },
    { src: '/icons/x-2.svg', name: 'Twitter', size: 72 },
  ];

  useEffect(() => {
    const container = containerRef.current;
    const grid = gridRef.current;
    if (!container || !grid) return;

    let animationFrame: number;

    const handleMouseMove = (e: MouseEvent) => {
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
          const adjustedForce = Math.pow(force, 1.8);
          
          // 移动效果
          const moveX = deltaX * adjustedForce * 0.15;
          const moveY = deltaY * adjustedForce * 0.15;
          
          // 缩放效果
          const scale = 1 + adjustedForce * 0.3;
          
          // 旋转效果
          const rotation = adjustedForce * 8 * Math.sign(deltaX);
          
          logo.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale}) rotate(${rotation}deg)`;
          
          // 透明度效果
          logo.style.opacity = `${0.6 + adjustedForce * 0.4}`;
        });
      });
    };

    const handleMouseLeave = () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      
      logosRef.current.forEach((logo) => {
        if (logo) {
          logo.style.transform = 'translate(0px, 0px) scale(1) rotate(0deg)';
          logo.style.opacity = '1';
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
        position: 'relative',
        width: '100%',
        maxWidth: '800px', // 减小最大宽度
        margin: '0 auto',
        padding: '3rem 2rem', // 减小padding
      }}
    >
      <div 
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)', // 改为4列
          gridTemplateRows: 'repeat(3, 1fr)', // 3行
          gap: '3rem', // 减小间距
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
              width: `${logo.size + 40}px`,
              height: `${logo.size + 40}px`,
              cursor: 'pointer',
              transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease',
              willChange: 'transform, opacity',
              transform: 'translate(0px, 0px) scale(1) rotate(0deg)',
              opacity: 1,
            }}
          >
            <img
              src={logo.src}
              alt={logo.name}
              style={{
                width: `${logo.size}px`,
                height: `${logo.size}px`,
                objectFit: 'contain',
                opacity: 1, // 移除初始透明度，始终保持完全不透明
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
        ))}
      </div>

      <style>{`
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
          filter: brightness(1.3) drop-shadow(0 0 25px rgba(37, 99, 235, 0.4));
        }
      `}</style>
    </div>
  );
};

export default MagneticSocialLogos;
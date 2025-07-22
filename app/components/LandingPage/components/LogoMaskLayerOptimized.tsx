// app/components/LandingPage/components/LogoMaskLayerOptimized.tsx
import React, { useEffect, useRef, useState } from 'react';
import { MVP_LOGO_PATH } from './LogoPaths';

interface LogoMaskLayerOptimizedProps {
  scrollProgress: number;
  maskOpacity: number;
}

const LogoMaskLayerOptimized: React.FC<LogoMaskLayerOptimizedProps> = ({ 
  scrollProgress, 
  maskOpacity 
}) => {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 更新尺寸
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // 使用CSS动画的简化版本
  const scale = 0.3 + (scrollProgress * 9.7); // 从0.3到10
  const opacity = maskOpacity;

  const svgContent = `<svg viewBox="48.992 144.527 402.007 210.947" xmlns="http://www.w3.org/2000/svg"><path d="${MVP_LOGO_PATH}" fill="black"/></svg>`;
  const maskUrl = `url("data:image/svg+xml,${encodeURIComponent(svgContent)}")`;

  const maskStyle: React.CSSProperties & Record<string, any> = {
    position: 'fixed',
    inset: 0,
    zIndex: 40,
    opacity: opacity,
    pointerEvents: 'none',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    // 使用CSS mask 替代 SVG mask
    WebkitMaskImage: maskUrl,
    WebkitMaskPosition: 'center',
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskSize: `${scale * 100}%`,
    maskImage: maskUrl,
    maskPosition: 'center',
    maskRepeat: 'no-repeat',
    maskSize: `${scale * 100}%`,
    backgroundColor: 'white',
    transition: 'none', // 移除过渡效果，依赖滚动平滑
    willChange: 'mask-size, opacity',
    transform: 'translateZ(0)', // GPU加速
  };

  return (
    <div 
      ref={containerRef}
      className="logo-mask-layer-optimized"
      style={maskStyle}
    />
  );
};

export default LogoMaskLayerOptimized;
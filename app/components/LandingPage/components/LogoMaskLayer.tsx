// app/components/LandingPage/components/LogoMaskLayer.tsx
import React, { useRef, useEffect, useState } from 'react';
import { DESIGN_TOKENS, SCROLL_CONFIG } from '../LandingPage.config';

interface LogoMaskLayerProps {
  scrollProgress: number;
  maskOpacity: number;
}

const LogoMaskLayer: React.FC<LogoMaskLayerProps> = ({ scrollProgress, maskOpacity }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1, height: 1 });
  
  // MVP Logo SVG路径
  const MVP_LOGO_PATH = "M 48.992 355.474 L 111.692 223.38 L 144.552 317.395 L 205.352 191.549 L 247.054 313.073 L 310.248 180.498 L 321.887 185.926 L 244.007 348.011 L 202.012 228.027 L 141.802 353.252 L 108.642 259.89 L 63.212 355.152 L 48.992 355.474 Z M 333.193 345.321 L 333.407 144.527 L 450.999 211.799 L 347.857 272.063 L 347.857 345.321 L 333.193 345.321 Z M 348.236 256.205 L 424.687 212.957 L 348.591 168.582 L 348.236 256.205 Z";
  
  // 获取SVG viewBox尺寸
  const SVG_VIEWBOX = {
    minX: 48.992,
    minY: 144.527,
    width: 450.999 - 48.992,
    height: 355.474 - 144.527
  };

  // 计算缩放参数
  const calculateScale = () => {
    if (!dimensions.width || !dimensions.height) return 1;
    
    // 基础缩放 - 让logo初始时占据屏幕的合适比例
    const baseScale = Math.min(
      dimensions.width / SVG_VIEWBOX.width,
      dimensions.height / SVG_VIEWBOX.height
    ) * 0.3; // 
    // 根据滚动进度计算缩放
    // 使用更平滑的缓动函数
    const easeInOutQuad = (t: number): number => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };
    
    const easedProgress = easeInOutQuad(scrollProgress);
    
    // 从初始大小放大到超出屏幕 - 放大倍数增加
    const maxScale = Math.max(
      dimensions.width / SVG_VIEWBOX.width,
      dimensions.height / SVG_VIEWBOX.height
    ) * 13; // 最终放大到屏幕的10倍，营造穿梭感
    
    return baseScale + (maxScale - baseScale) * easedProgress;
  };

  // 计算焦点偏移 - 让放大朝向路径内部
  const calculateFocusOffset = () => {
    // MVP logo 的 "V" 字底部交叉处
    // 根据SVG路径分析，V字底部的交叉点大约在
    const focusTargetX = 215;
    const focusTargetY = 353;
    
    // 随着滚动进度，逐渐偏移中心点
    const offsetProgress = Math.pow(scrollProgress, 2); // 使用平方让后期偏移更明显
    
    // 计算当前偏移
    const currentFocusX = svgCenterX + (focusTargetX - svgCenterX) * offsetProgress;
    const currentFocusY = svgCenterY + (focusTargetY - svgCenterY) * offsetProgress;
    
    return { x: currentFocusX, y: currentFocusY };
  };

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

  // 计算SVG的实际中心（用于基础定位）
  const svgCenterX = SVG_VIEWBOX.minX + SVG_VIEWBOX.width / 2;
  const svgCenterY = SVG_VIEWBOX.minY + SVG_VIEWBOX.height / 2;

  const scale = calculateScale();
  const focusOffset = calculateFocusOffset();
  
  // 计算中心点
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  
  // 使用偏移后的焦点

  return (
    <div 
      ref={containerRef}
      className="logo-mask-layer"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 40,
        opacity: maskOpacity,
        pointerEvents: 'none',
        willChange: 'opacity',
      }}
    >
      <svg 
        style={{ 
          position: 'absolute',
          width: '100%', 
          height: '100%',
          overflow: 'visible', // 允许SVG内容超出边界
        }}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="none"
      >
        <defs>
          <mask id="logoRevealMask">
            {/* 白色背景 - 默认遮挡所有内容 */}
            <rect 
              x="0" 
              y="0" 
              width={dimensions.width} 
              height={dimensions.height} 
              fill="white" 
            />
            
            {/* Logo路径 - 黑色，作为透视窗口 */}
            <g transform={`translate(${centerX}, ${centerY})`}>
              <g transform={`scale(${scale}) translate(${-focusOffset.x}, ${-focusOffset.y})`}>
                <path
                  d={MVP_LOGO_PATH}
                  fill="black"
                  style={{
                    transition: 'none', // 移除过渡效果，让变换更即时
                  }}
                />
              </g>
            </g>
          </mask>
        </defs>
        
        {/* 应用遮罩的白色矩形 */}
        <rect
          x="0"
          y="0"
          width={dimensions.width}
          height={dimensions.height}
          fill="white"
          mask="url(#logoRevealMask)"
        />
      </svg>
      
      {/* 可选：添加淡出边缘效果和深度感 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(
              circle at ${focusOffset.x / SVG_VIEWBOX.width * 100}% ${focusOffset.y / SVG_VIEWBOX.height * 100}%, 
              transparent 20%, 
              rgba(255,255,255,${0.3 * (1 - scrollProgress)}) 60%
            )
          `,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default LogoMaskLayer;
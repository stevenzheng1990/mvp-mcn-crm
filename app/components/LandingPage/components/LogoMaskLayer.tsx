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
    ) * 0.3;
    
    // 根据滚动进度计算缩放
    const easeInOutQuad = (t: number): number => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };
    
    const easedProgress = easeInOutQuad(scrollProgress);
    
    // 从初始大小放大到超出屏幕
    const maxScale = Math.max(
      dimensions.width / SVG_VIEWBOX.width,
      dimensions.height / SVG_VIEWBOX.height
    ) * 13;
    
    return baseScale + (maxScale - baseScale) * easedProgress;
  };

  // 计算焦点偏移
  const calculateFocusOffset = () => {
    const focusTargetX = 215;
    const focusTargetY = 353;
    
    const offsetProgress = Math.pow(scrollProgress, 2);
    
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

  // 计算SVG的实际中心
  const svgCenterX = SVG_VIEWBOX.minX + SVG_VIEWBOX.width / 2;
  const svgCenterY = SVG_VIEWBOX.minY + SVG_VIEWBOX.height / 2;

  const scale = calculateScale();
  const focusOffset = calculateFocusOffset();
  
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;

  // 🔧 关键修复：扩大 viewBox 边界，确保遮罩完全覆盖
  const padding = 100; // 添加额外的边距
  const expandedViewBox = `${-padding} ${-padding} ${dimensions.width + padding * 2} ${dimensions.height + padding * 2}`;

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
        // 🔧 添加：确保容器完全覆盖视口
        width: '100vw',
        height: '100vh',
        overflow: 'hidden', // 🔧 改为 hidden，防止内容溢出
      }}
    >
      <svg 
        style={{ 
          position: 'absolute',
          // 🔧 使 SVG 略大于视口
          width: 'calc(100% + 200px)', 
          height: 'calc(100% + 200px)',
          // 🔧 居中定位
          left: '-100px',
          top: '-100px',
        }}
        viewBox={expandedViewBox}
        preserveAspectRatio="xMidYMid slice" // 🔧 改为 slice，确保覆盖整个视口
      >
        <defs>
          <mask id="logoRevealMask">
            {/* 🔧 扩大白色背景，确保完全覆盖 */}
            <rect 
              x={-padding} 
              y={-padding} 
              width={dimensions.width + padding * 2} 
              height={dimensions.height + padding * 2} 
              fill="white" 
            />
            
            {/* Logo路径 - 黑色，作为透视窗口 */}
            <g transform={`translate(${centerX}, ${centerY})`}>
              <g transform={`scale(${scale}) translate(${-focusOffset.x}, ${-focusOffset.y})`}>
                <path
                  d={MVP_LOGO_PATH}
                  fill="black"
                  // 🔧 添加描边，确保路径边缘平滑
                  stroke="black"
                  strokeWidth="1"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </g>
            </g>
          </mask>
        </defs>
        
        {/* 🔧 应用遮罩的白色矩形，也要扩大 */}
        <rect
          x={-padding}
          y={-padding}
          width={dimensions.width + padding * 2}
          height={dimensions.height + padding * 2}
          fill="white"
          mask="url(#logoRevealMask)"
        />
      </svg>
      
      {/* 🔧 优化：淡出边缘效果 */}
      <div
        style={{
          position: 'absolute',
          inset: '-50px', // 🔧 扩大边缘效果范围
          background: `
            radial-gradient(
              circle at ${(focusOffset.x / SVG_VIEWBOX.width * 100).toFixed(2)}% ${(focusOffset.y / SVG_VIEWBOX.height * 100).toFixed(2)}%, 
              transparent 20%, 
              rgba(255,255,255,${(0.3 * (1 - scrollProgress)).toFixed(3)}) 60%
            )
          `,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default LogoMaskLayer;
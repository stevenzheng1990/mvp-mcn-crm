// app/components/LandingPage/components/LogoMaskLayer.tsx
import React, { useRef, useEffect, useState } from 'react';
import { DESIGN_TOKENS, SCROLL_CONFIG } from '../LandingPage.config';

interface LogoMaskLayerProps {
  scrollProgress: number;
  maskOpacity: number;
  onLogoClick?: () => void;
}

const LogoMaskLayer: React.FC<LogoMaskLayerProps> = ({ scrollProgress, maskOpacity, onLogoClick }) => {
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

  // 计算SVG的实际中心 - 移到前面
  const svgCenterX = SVG_VIEWBOX.minX + SVG_VIEWBOX.width / 2;
  const svgCenterY = SVG_VIEWBOX.minY + SVG_VIEWBOX.height / 2;

  // 缓动函数提取到组件外 - 调整为更快的缓动曲线
  const easeInOutQuad = (t: number): number => {
    // 加快20%的进度
    const adjustedT = Math.min(1, t * 1.2);
    return adjustedT < 0.5 ? 2 * adjustedT * adjustedT : -1 + (4 - 2 * adjustedT) * adjustedT;
  };

  // 使用 useMemo 优化缩放计算
  const scale = React.useMemo(() => {
    if (!dimensions.width || !dimensions.height) return 1;
    
    // 基础缩放 - 让logo初始时占据屏幕的合适比例
    const baseScale = Math.min(
      dimensions.width / SVG_VIEWBOX.width,
      dimensions.height / SVG_VIEWBOX.height
    ) * 0.25; // 减小初始大小，让动画行程更长
    
    const easedProgress = easeInOutQuad(scrollProgress);
    
    // 降低最大缩放倍数以提升性能
    const maxScale = Math.max(
      dimensions.width / SVG_VIEWBOX.width,
      dimensions.height / SVG_VIEWBOX.height
    ) * 12; // 增加最大缩放倍数，加快视觉速度
    
    return baseScale + (maxScale - baseScale) * easedProgress;
  }, [dimensions.width, dimensions.height, scrollProgress]);

  // 使用 useMemo 优化焦点偏移计算
  const focusOffset = React.useMemo(() => {
    const focusTargetX = 215;
    const focusTargetY = 353;
    
    // 加快焦点偏移速度
    const offsetProgress = Math.pow(Math.min(1, scrollProgress * 1.2), 1.8);
    
    const currentFocusX = svgCenterX + (focusTargetX - svgCenterX) * offsetProgress;
    const currentFocusY = svgCenterY + (focusTargetY - svgCenterY) * offsetProgress;
    
    return { x: currentFocusX, y: currentFocusY };
  }, [scrollProgress, svgCenterX, svgCenterY]);

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

  // scale 和 focusOffset 已经通过 useMemo 计算
  
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;

  // 🔧 关键修复：扩大 viewBox 边界，确保遮罩完全覆盖
  const padding = 200; // 增加额外的边距以完全消除黑边
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
        pointerEvents: 'none', // 整体不可点击，让背景交互正常工作
        willChange: 'opacity, transform',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        transform: 'translateZ(0)', // 开启GPU加速
      }}
    >
      <svg 
        style={{ 
          position: 'absolute',
          // 🔧 使 SVG 略大于视口，匹配新的padding
          width: 'calc(100% + 400px)', 
          height: 'calc(100% + 400px)',
          // 🔧 居中定位，匹配新的padding
          left: '-200px',
          top: '-200px',
        }}
        viewBox={expandedViewBox}
        preserveAspectRatio="xMidYMid slice"
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
            <g 
              transform={`translate(${centerX}, ${centerY})`}
              style={{ willChange: 'transform' }}
            >
              <g 
                transform={`scale(${scale}) translate(${-focusOffset.x}, ${-focusOffset.y})`}
                style={{ willChange: 'transform' }}
              >
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
          inset: '-100px', // 🔧 进一步扩大边缘效果范围
          background: `
            radial-gradient(
              circle at ${(focusOffset.x / SVG_VIEWBOX.width * 100).toFixed(2)}% ${(focusOffset.y / SVG_VIEWBOX.height * 100).toFixed(2)}%, 
              transparent 30%, 
              rgba(255,255,255,${Math.max(0.1, 0.3 * (1 - scrollProgress)).toFixed(3)}) 70%
            )
          `,
          pointerEvents: 'none',
        }}
      />
      
      {/* 只在Logo区域添加点击热区 */}
      {scrollProgress < 0.5 && onLogoClick && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${200 * scale}px`,
            height: `${100 * scale}px`,
            cursor: 'pointer',
            pointerEvents: 'auto',
            // 调试时可以添加背景色查看热区
            // background: 'rgba(255, 0, 0, 0.1)',
          }}
          onClick={onLogoClick}
        />
      )}
    </div>
  );
};

export default LogoMaskLayer;
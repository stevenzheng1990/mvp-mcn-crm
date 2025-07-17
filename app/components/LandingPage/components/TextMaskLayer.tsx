// Z:\MCN\mvp-mcn-crm\app\components\LandingPage\components\TextMaskLayer.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { TextMaskLayerProps } from '../LandingPage.types';
import { DESIGN_TOKENS, SCROLL_CONFIG } from '../LandingPage.constants';
import { easeInOutQuart } from '../LandingPage.styles';

const TextMaskLayer: React.FC<TextMaskLayerProps> = ({ 
  language, 
  content, 
  scrollProgress, 
  maskOpacity 
}) => {
  const maskRef = useRef<SVGTextElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusPoint, setFocusPoint] = useState({ x: 50, y: 50 });
  const [isCalculating, setIsCalculating] = useState(false);
  
  // 稳定的焦点计算函数
  const calculateTextFocus = useCallback(() => {
    if (!maskRef.current || !containerRef.current || isCalculating) return;
    
    setIsCalculating(true);
    
    try {
      // 等待DOM稳定
      requestAnimationFrame(() => {
        if (!maskRef.current || !containerRef.current) {
          setIsCalculating(false);
          return;
        }
        
        const textBBox = maskRef.current.getBBox();
        const containerRect = containerRef.current.getBoundingClientRect();
        
        if (textBBox.width === 0 || containerRect.width === 0) {
          setIsCalculating(false);
          return;
        }
        
        // 计算文字在视口中的中心位置
        let targetX = 50; // 默认居中
        const targetY = 50; // 垂直居中
        
        if (language === 'zh') {
          // 对于中文，计算"十"字的位置（第一个字符）
          const charWidth = textBBox.width / content.title.length;
          const firstCharCenterX = textBBox.x + charWidth / 2;
          targetX = (firstCharCenterX / containerRect.width) * 100 + 50; // 相对于SVG中心的偏移
        }
        
        // 限制在合理范围内
        targetX = Math.max(20, Math.min(80, targetX));
        
        setFocusPoint({ x: targetX, y: targetY });
        console.log(`Focus calculated for ${language}:`, { x: targetX, y: targetY });
        
        setIsCalculating(false);
      });
    } catch (error) {
      console.error('Error calculating focus point:', error);
      setFocusPoint(language === 'zh' ? { x: 45, y: 50 } : { x: 50, y: 50 });
      setIsCalculating(false);
    }
  }, [language, content.title, isCalculating]);

  // 重置和重新计算的函数
  const resetAndRecalculate = useCallback(() => {
    // 重置状态
    setFocusPoint({ x: 50, y: 50 });
    setIsCalculating(false);
    
    // 延迟重新计算，确保DOM更新完成
    setTimeout(() => {
      calculateTextFocus();
    }, 300);
  }, [calculateTextFocus]);

  // 语言切换时重新计算
  useEffect(() => {
    resetAndRecalculate();
  }, [language, content.title, resetAndRecalculate]);

  // 窗口大小变化时重新计算
  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        calculateTextFocus();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateTextFocus]);

  // 添加边界保护，防止异常缩放
  const safeScrollProgress = Math.max(0, Math.min(1, scrollProgress));
  const zoomScale = safeScrollProgress === 0 ? 1 : 1 + (easeInOutQuart(safeScrollProgress) * SCROLL_CONFIG.zoomScale);
  
  // Z轴旋转效果（纵深感）
  const zRotation = safeScrollProgress * 15; // 15度的Z轴旋转
  const perspective = 1000; // 透视距离
  
  // 使用计算出的焦点作为变换原点
  const transformOrigin = `${focusPoint.x}% ${focusPoint.y}%`;
  const fontSize = language === 'zh' ? '20vw' : '12vw';

  return (
    <div 
      ref={containerRef}
      className="text-mask-layer"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 30,
        opacity: maskOpacity,
        perspective: `${perspective}px`,
        transformOrigin,
        willChange: 'transform, opacity',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          // Z轴旋转 + 缩放，移除原来的Y轴旋转
          transform: `scale(${zoomScale}) rotateZ(${zRotation}deg)`,
          transformOrigin: 'inherit',
          transition: 'transform 0.1s ease-out',
        }}
      >
        <svg 
          className="text-mask-svg"
          style={{ 
            position: 'absolute',
            inset: 0,
            width: '100vw', 
            height: '100vh' 
          }}
        >
          <defs>
            <mask id="textCutoutMask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <text
                ref={maskRef}
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="black"
                fontSize={fontSize}
                fontWeight={DESIGN_TOKENS.typography.fontWeight.bold}
                fontFamily={DESIGN_TOKENS.typography.fontFamily}
                style={{ letterSpacing: DESIGN_TOKENS.typography.letterSpacing }}
              >
                {content.title}
              </text>
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="black"
            mask="url(#textCutoutMask)"
          />
        </svg>
      </div>
      
      {/* 调试用的焦点指示器 */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            position: 'absolute',
            left: `${focusPoint.x}%`,
            top: `${focusPoint.y}%`,
            width: '8px',
            height: '8px',
            backgroundColor: 'red',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 100,
            border: '2px solid white',
          }}
        />
      )}
    </div>
  );
};

export default TextMaskLayer;
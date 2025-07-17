// Z:\MCN\mvp-mcn-crm\app\components\LandingPage\components\TextMaskLayer.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { TextMaskLayerProps, FocusPoint } from '../LandingPage.types';
import { DESIGN_TOKENS, SCROLL_CONFIG, MASK_CONFIG } from '../LandingPage.config';
import { easeInOutQuart } from '../LandingPage.styles';

const TextMaskLayer: React.FC<TextMaskLayerProps> = ({ 
  language, 
  content, 
  scrollProgress, 
  maskOpacity 
}) => {
  const maskRef = useRef<SVGTextElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusPoint, setFocusPoint] = useState<FocusPoint>(MASK_CONFIG.focus.default);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // 稳定的焦点计算函数
  const calculateTextFocus = useCallback(() => {
    if (!maskRef.current || !containerRef.current || isCalculating) return;
    
    setIsCalculating(true);
    
    try {
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
        
        // 使用配置文件中的焦点设置
        const languageFocus = MASK_CONFIG.focus[language];
        let targetX: number = languageFocus ? Number(languageFocus.x) : Number(MASK_CONFIG.focus.default.x);
        const targetY: number = languageFocus ? Number(languageFocus.y) : Number(MASK_CONFIG.focus.default.y);
        
        if (language === 'zh') {
          const charWidth = textBBox.width / content.title.length;
          const firstCharCenterX = textBBox.x + charWidth / 2;
          targetX = (firstCharCenterX / containerRect.width) * 100 + 50;
        }
        
        // 限制在配置的边界内
        targetX = Math.max(MASK_CONFIG.focus.bounds.min, Math.min(MASK_CONFIG.focus.bounds.max, targetX));
        
        setFocusPoint({ x: targetX, y: targetY });
        console.log(`Focus calculated for ${language}:`, { x: targetX, y: targetY });
        
        setIsCalculating(false);
      });
    } catch (error) {
      console.error('Error calculating focus point:', error);
      const fallbackFocus = MASK_CONFIG.focus[language] || MASK_CONFIG.focus.default;
      setFocusPoint({ ...fallbackFocus });
      setIsCalculating(false);
    }
  }, [language, content.title, isCalculating]);

  // 重置和重新计算的函数
  const resetAndRecalculate = useCallback(() => {
    setFocusPoint({ ...MASK_CONFIG.focus.default });
    setIsCalculating(false);
    
    setTimeout(() => {
      calculateTextFocus();
    }, MASK_CONFIG.recalculateDelay);
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
      }, MASK_CONFIG.resizeDelay);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateTextFocus]);

  // 添加边界保护，防止异常缩放
  const safeScrollProgress = Math.max(0, Math.min(1, scrollProgress));
  const zoomScale = safeScrollProgress === 0 ? 1 : 1 + (easeInOutQuart(safeScrollProgress) * SCROLL_CONFIG.zoomScale);
  
  // Z轴旋转效果（纵深感）
  const zRotation = safeScrollProgress * SCROLL_CONFIG.effects3D.maxZRotation;
  
  // 使用计算出的焦点作为变换原点
  const transformOrigin = `${focusPoint.x}% ${focusPoint.y}%`;
  const fontSize = DESIGN_TOKENS.typography.maskFontSize[language];

  return (
    <div 
      ref={containerRef}
      className="text-mask-layer"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 30,
        opacity: maskOpacity,
        perspective: `${SCROLL_CONFIG.effects3D.perspective}px`,
        transformOrigin,
        willChange: 'transform, opacity',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
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
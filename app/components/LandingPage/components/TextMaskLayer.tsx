// Z:\MCN\mvp-mcn-crm\app\components\LandingPage\components\TextMaskLayer.tsx
import React, { useRef } from 'react';
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
  
  const zoomScale = scrollProgress === 0 ? 1 : 1 + (easeInOutQuart(scrollProgress) * SCROLL_CONFIG.zoomScale);
  const transformOrigin = language === 'zh' ? '50% 50%' : '45% 50%';
  const fontSize = language === 'zh' ? '20vw' : '12vw';

  return (
    <div 
      className="text-mask-layer"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 30,
        opacity: maskOpacity,
        transform: `scale(${zoomScale}) rotate(${scrollProgress * SCROLL_CONFIG.rotationFactor}deg)`,
        transformOrigin,
        willChange: 'transform, opacity',
        pointerEvents: 'none',
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
  );
};

export default TextMaskLayer;
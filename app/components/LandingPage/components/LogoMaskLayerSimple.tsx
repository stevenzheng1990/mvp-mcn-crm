// app/components/LandingPage/components/LogoMaskLayerSimple.tsx
import React from 'react';
import { MVP_LOGO_PATH } from './LogoPaths';

interface LogoMaskLayerSimpleProps {
  scrollProgress: number;
  maskOpacity: number;
}

const LogoMaskLayerSimple: React.FC<LogoMaskLayerSimpleProps> = ({ 
  scrollProgress, 
  maskOpacity 
}) => {
  // 简化的缩放计算
  const scale = 0.3 + (scrollProgress * 9.7);
  
  return (
    <div 
      className="logo-mask-layer-simple"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 40,
        opacity: maskOpacity,
        pointerEvents: 'none',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        willChange: 'opacity',
      }}
    >
      <svg 
        style={{ 
          position: 'absolute',
          width: '100%',
          height: '100%',
          transform: 'translateZ(0)', // GPU加速
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <mask id="logoRevealMaskSimple">
            <rect x="0" y="0" width="1920" height="1080" fill="white" />
            <g transform="translate(960, 540)">
              <path
                d={MVP_LOGO_PATH}
                fill="black"
                transform={`scale(${scale}) translate(-250, -250)`}
              />
            </g>
          </mask>
        </defs>
        
        <rect
          x="0"
          y="0"
          width="1920"
          height="1080"
          fill="white"
          mask="url(#logoRevealMaskSimple)"
        />
      </svg>
    </div>
  );
};

export default LogoMaskLayerSimple;
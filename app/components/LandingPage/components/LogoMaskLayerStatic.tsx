// app/components/LandingPage/components/LogoMaskLayerStatic.tsx
import React from 'react';
import { MVP_LOGO_PATH } from './LogoPaths';

interface LogoMaskLayerStaticProps {
  isScrolling: boolean;
  shouldHideMask: boolean;
}

const LogoMaskLayerStatic: React.FC<LogoMaskLayerStaticProps> = ({ 
  isScrolling, 
  shouldHideMask 
}) => {
  return (
    <div 
      className="logo-mask-static"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 40,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        opacity: shouldHideMask ? 0 : 1,
        transition: 'opacity 0.6s ease-out',
        pointerEvents: 'none',
      }}
    >
      <style jsx>{`
        @keyframes maskExpand {
          0% {
            transform: scale(0.3);
          }
          100% {
            transform: scale(10);
          }
        }
        
        .mask-svg {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        
        .mask-path {
          animation: maskExpand 60s ease-out forwards;
          animation-play-state: ${isScrolling ? 'paused' : 'running'};
          transform-origin: center;
          will-change: transform;
        }
      `}</style>
      
      <svg 
        className="mask-svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <mask id="logoRevealMaskStatic">
            {/* 白色背景 */}
            <rect 
              x="0" 
              y="0" 
              width="1920" 
              height="1080" 
              fill="white" 
            />
            
            {/* Logo路径 - 黑色，作为透视窗口 */}
            <g transform="translate(960, 540)">
              <g className="mask-path">
                <path
                  d={MVP_LOGO_PATH}
                  fill="black"
                  transform="translate(-250, -250)"
                />
              </g>
            </g>
          </mask>
        </defs>
        
        {/* 应用遮罩的白色矩形 */}
        <rect
          x="0"
          y="0"
          width="1920"
          height="1080"
          fill="white"
          mask="url(#logoRevealMaskStatic)"
        />
      </svg>
    </div>
  );
};

export default LogoMaskLayerStatic;
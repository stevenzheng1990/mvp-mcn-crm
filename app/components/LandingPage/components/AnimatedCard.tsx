// app/components/LandingPage/components/AnimatedCard.tsx
import React, { useEffect, useState } from 'react';
import { AnimatedCardProps } from '../LandingPage.types';
import { useResponsive } from '../hooks/useResponsive';
import { getMobileOptimizedAnimationDuration } from '../LandingPage.styles';
import { DESIGN_TOKENS } from '../LandingPage.config';

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  delay = 0, 
  inView = true 
}) => {
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const { isMobile } = useResponsive();
  const animationDuration = getMobileOptimizedAnimationDuration(isMobile);

  useEffect(() => {
    if (inView && !hasAnimatedIn) {
      setHasAnimatedIn(true);
    }
  }, [inView, hasAnimatedIn]);

  const translateDistance = isMobile ? '20px' : '40px';
  const blurAmount = isMobile ? '2px' : '4px';
  const scaleAmount = isMobile ? '0.98' : '0.95';

  return (
    <div
      className="animated-card"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView 
          ? 'translateY(0) scale(1)' 
          : hasAnimatedIn 
            ? `translateY(-${translateDistance}) scale(${scaleAmount})`  // 向上消失
            : `translateY(${translateDistance}) scale(${scaleAmount})`,   // 向下出现
        filter: inView ? 'blur(0)' : `blur(${blurAmount})`,
        transition: `all ${animationDuration.slower} ${DESIGN_TOKENS.animation.easing.default}`,
        transitionDelay: inView ? `${delay}s` : '0s',  // 消失时无延迟
        willChange: 'transform, opacity, filter',
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;
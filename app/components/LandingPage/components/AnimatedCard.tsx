// app/components/LandingPage/components/AnimatedCard.tsx
import React, { useEffect, useState } from 'react';
import { AnimatedCardProps } from '../LandingPage.types';
import { DESIGN_TOKENS } from '../LandingPage.config';

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  delay = 0, 
  inView = true 
}) => {
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);

  useEffect(() => {
    if (inView && !hasAnimatedIn) {
      setHasAnimatedIn(true);
    }
  }, [inView, hasAnimatedIn]);

  return (
    <div
      className="animated-card"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView 
          ? 'translateY(0) scale(1)' 
          : hasAnimatedIn 
            ? 'translateY(-40px) scale(0.95)'  // 向上消失
            : 'translateY(40px) scale(0.95)',   // 向下出现
        filter: inView ? 'blur(0)' : 'blur(4px)',
        transition: `all ${DESIGN_TOKENS.animation.duration.slower} ${DESIGN_TOKENS.animation.easing.default}`,
        transitionDelay: inView ? `${delay}s` : '0s',  // 消失时无延迟
        willChange: 'transform, opacity, filter',
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;
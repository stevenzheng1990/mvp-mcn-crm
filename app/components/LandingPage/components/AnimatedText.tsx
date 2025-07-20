// app/components/LandingPage/components/AnimatedText.tsx
import React, { useEffect, useState } from 'react';
import { AnimatedTextProps } from '../LandingPage.types';
import { DESIGN_TOKENS } from '../LandingPage.config';

const AnimatedText: React.FC<AnimatedTextProps> = ({ 
  text, 
  className = '', 
  delay = 0, 
  inView = true 
}) => {
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const chars = text.split('');

  useEffect(() => {
    if (inView && !hasAnimatedIn) {
      setHasAnimatedIn(true);
    }
  }, [inView, hasAnimatedIn]);

  return (
    <span className={`animated-text ${className}`} style={{ display: 'inline-block' }}>
      {chars.map((char, index) => (
        <span
          key={index}
          className="animated-char"
          style={{
            display: 'inline-block',
            opacity: inView ? 1 : 0,
            transform: inView 
              ? 'translateX(0)' 
              : hasAnimatedIn 
                ? `translateX(-${20 + index * 2}px)`  // 向左消失
                : `translateX(${20 + index * 2}px)`,   // 从右出现
            filter: inView ? 'blur(0)' : 'blur(4px)',
            transition: `all ${DESIGN_TOKENS.animation.text.baseDuration + index * DESIGN_TOKENS.animation.text.charDurationIncrement}s ${DESIGN_TOKENS.animation.easing.default}`,
            transitionDelay: inView 
              ? `${delay + index * DESIGN_TOKENS.animation.text.charDelay}s`
              : `${index * DESIGN_TOKENS.animation.text.charDelay * 0.5}s`,  // 消失时延迟减半
            willChange: 'transform, opacity, filter',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

export default AnimatedText;
// app/components/LandingPage/components/FastAnimatedText.tsx
import React, { useEffect, useState } from 'react';
import { AnimatedTextProps } from '../LandingPage.types';
import { DESIGN_TOKENS } from '../LandingPage.config';

const FastAnimatedText: React.FC<AnimatedTextProps> = ({ 
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
    <span className={`fast-animated-text ${className}`} style={{ display: 'inline-block' }}>
      {chars.map((char, index) => (
        <span
          key={index}
          className="fast-animated-char"
          style={{
            display: 'inline-block',
            opacity: inView ? 1 : 0,
            transform: inView 
              ? 'translateX(0)' 
              : hasAnimatedIn 
                ? `translateX(-${20 + index * 2}px)`  // 向左消失
                : `translateX(${20 + index * 2}px)`,   // 从右出现
            filter: inView ? 'blur(0)' : 'blur(4px)',
            // 加快3倍：将原本的时间参数都除以3
            transition: `all ${(DESIGN_TOKENS.animation.text.baseDuration + index * DESIGN_TOKENS.animation.text.charDurationIncrement) / 3}s ${DESIGN_TOKENS.animation.easing.default}`,
            transitionDelay: inView 
              ? `${(delay + index * DESIGN_TOKENS.animation.text.charDelay) / 3}s`  // 延迟也除以3
              : `${(index * DESIGN_TOKENS.animation.text.charDelay * 0.5) / 3}s`,  // 消失时延迟减半再除以3
            willChange: 'transform, opacity, filter',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

export default FastAnimatedText;
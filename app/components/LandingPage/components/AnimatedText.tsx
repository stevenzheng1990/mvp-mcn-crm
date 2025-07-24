// app/components/LandingPage/components/AnimatedText.tsx
import React, { useEffect, useState } from 'react';
import { AnimatedTextProps } from '../LandingPage.types';
import { useResponsive } from '../hooks/useResponsive';
import { DESIGN_TOKENS } from '../LandingPage.config';

const AnimatedText: React.FC<AnimatedTextProps> = ({ 
  text, 
  className = '', 
  delay = 0, 
  inView = true 
}) => {
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const { isMobile } = useResponsive();
  
  // 移动端简化动画，减少字符数量以提升性能
  const shouldSimplifyAnimation = isMobile && text.length > 20;
  const chars = shouldSimplifyAnimation ? text.split(' ') : text.split('');

  useEffect(() => {
    if (inView && !hasAnimatedIn) {
      setHasAnimatedIn(true);
    }
  }, [inView, hasAnimatedIn]);

  // 移动端使用更简单的动画参数
  const getAnimationParams = () => {
    if (isMobile) {
      return {
        translateDistance: 15,
        blurAmount: 2,
        baseDuration: 0.6,
        charDurationIncrement: 0.03,
        charDelay: shouldSimplifyAnimation ? 0.08 : 0.03,
      };
    }
    return {
      translateDistance: 20,
      blurAmount: 4,
      baseDuration: DESIGN_TOKENS.animation.text.baseDuration,
      charDurationIncrement: DESIGN_TOKENS.animation.text.charDurationIncrement,
      charDelay: DESIGN_TOKENS.animation.text.charDelay,
    };
  };

  const animationParams = getAnimationParams();

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
                ? `translateX(-${animationParams.translateDistance + index * 2}px)`  // 向左消失
                : `translateX(${animationParams.translateDistance + index * 2}px)`,   // 从右出现
            filter: inView ? 'blur(0)' : `blur(${animationParams.blurAmount}px)`,
            transition: `all ${animationParams.baseDuration + index * animationParams.charDurationIncrement}s ${DESIGN_TOKENS.animation.easing.default}`,
            transitionDelay: inView 
              ? `${delay + index * animationParams.charDelay}s`
              : `${index * animationParams.charDelay * 0.5}s`,  // 消失时延迟减半
            willChange: isMobile ? 'transform, opacity' : 'transform, opacity, filter',
            marginRight: shouldSimplifyAnimation && char !== chars[chars.length - 1] ? '0.3em' : '0',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

export default AnimatedText;
// app/components/LandingPage/components/FastAnimatedText.tsx
import React, { useEffect, useState } from 'react';
import { AnimatedTextProps } from '../LandingPage.types';
import { useResponsive } from '../hooks/useResponsive';
import { DESIGN_TOKENS } from '../LandingPage.config';

const FastAnimatedText: React.FC<AnimatedTextProps> = ({ 
  text, 
  className = '', 
  delay = 0, 
  inView = true 
}) => {
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const { isMobile } = useResponsive();
  
  // 处理换行符：将文本按换行符分割，然后为每行分别处理字符
  const lines = text.split('\n');

  useEffect(() => {
    if (inView && !hasAnimatedIn) {
      setHasAnimatedIn(true);
    }
  }, [inView, hasAnimatedIn]);

  // 移动端使用更简单的动画参数
  const getAnimationParams = () => {
    const speedMultiplier = isMobile ? 3 : 2; // 移动端更快
    return {
      translateDistance: isMobile ? 15 : 20,
      blurAmount: isMobile ? 2 : 4,
      baseDuration: DESIGN_TOKENS.animation.text.baseDuration / speedMultiplier,
      charDurationIncrement: DESIGN_TOKENS.animation.text.charDurationIncrement / speedMultiplier,
      charDelay: DESIGN_TOKENS.animation.text.charDelay / speedMultiplier,
    };
  };

  const animationParams = getAnimationParams();
  let charIndex = 0; // 全局字符索引，用于计算动画延迟

  return (
    <span className={`fast-animated-text ${className}`} style={{ display: 'inline-block' }}>
      {lines.map((line, lineIndex) => {
        // 移动端简化长文本动画
        const shouldSimplifyLine = isMobile && line.length > 30;
        const chars = shouldSimplifyLine ? line.split(' ') : line.split('');
        
        const lineElement = (
          <span key={lineIndex} style={{ display: 'inline-block' }}>
            {chars.map((char, index) => {
              const currentCharIndex = charIndex++;
              return (
                <span
                  key={`${lineIndex}-${index}`}
                  className="fast-animated-char"
                  style={{
                    display: 'inline-block',
                    opacity: inView ? 1 : 0,
                    transform: inView 
                      ? 'translateX(0)' 
                      : hasAnimatedIn 
                        ? `translateX(-${animationParams.translateDistance + currentCharIndex * 2}px)`  // 向左消失
                        : `translateX(${animationParams.translateDistance + currentCharIndex * 2}px)`,   // 从右出现
                    filter: inView ? 'blur(0)' : `blur(${animationParams.blurAmount}px)`,
                    transition: `all ${animationParams.baseDuration + currentCharIndex * animationParams.charDurationIncrement}s ${DESIGN_TOKENS.animation.easing.default}`,
                    transitionDelay: inView 
                      ? `${delay + currentCharIndex * animationParams.charDelay}s`
                      : `${currentCharIndex * animationParams.charDelay * 0.5}s`,  // 消失时延迟减半
                    willChange: isMobile ? 'transform, opacity' : 'transform, opacity, filter',
                    marginRight: shouldSimplifyLine && char !== chars[chars.length - 1] ? '0.3em' : '0',
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </span>
        );
        
        // 如果不是最后一行，添加换行符
        if (lineIndex < lines.length - 1) {
          return (
            <React.Fragment key={lineIndex}>
              {lineElement}
              <br />
            </React.Fragment>
          );
        }
        
        return lineElement;
      })}
    </span>
  );
};

export default FastAnimatedText;
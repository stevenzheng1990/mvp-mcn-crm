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
  
  // 处理换行符：将文本按换行符分割，然后为每行分别处理字符
  const lines = text.split('\n');

  useEffect(() => {
    if (inView && !hasAnimatedIn) {
      setHasAnimatedIn(true);
    }
  }, [inView, hasAnimatedIn]);

  let charIndex = 0; // 全局字符索引，用于计算动画延迟

  return (
    <span className={`fast-animated-text ${className}`} style={{ display: 'inline-block' }}>
      {lines.map((line, lineIndex) => {
        const chars = line.split('');
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
                        ? `translateX(-${20 + currentCharIndex * 2}px)`  // 向左消失
                        : `translateX(${20 + currentCharIndex * 2}px)`,   // 从右出现
                    filter: inView ? 'blur(0)' : 'blur(4px)',
                    // 加快2倍：将原本的时间参数都除以2
                    transition: `all ${(DESIGN_TOKENS.animation.text.baseDuration + currentCharIndex * DESIGN_TOKENS.animation.text.charDurationIncrement) / 2}s ${DESIGN_TOKENS.animation.easing.default}`,
                    transitionDelay: inView 
                      ? `${(delay + currentCharIndex * DESIGN_TOKENS.animation.text.charDelay) / 2}s`  // 延迟也除以2
                      : `${(currentCharIndex * DESIGN_TOKENS.animation.text.charDelay * 0.5) / 2}s`,  // 消失时延迟减半再除以2
                    willChange: 'transform, opacity, filter',
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
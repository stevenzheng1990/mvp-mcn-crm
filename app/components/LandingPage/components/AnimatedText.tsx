// Z:\MCN\mvp-mcn-crm\app\components\LandingPage\components\AnimatedText.tsx
import React from 'react';
import { AnimatedTextProps } from '../LandingPage.types';
import { DESIGN_TOKENS } from '../LandingPage.constants';

const AnimatedText: React.FC<AnimatedTextProps> = ({ 
  text, 
  className = '', 
  delay = 0, 
  inView = true 
}) => {
  const chars = text.split('');

  return (
    <span className={`animated-text ${className}`} style={{ display: 'inline-block' }}>
      {chars.map((char, index) => (
        <span
          key={index}
          className="animated-char"
          style={{
            display: 'inline-block',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateX(0)' : `translateX(${20 + index * 2}px)`,
            filter: inView ? 'blur(0)' : 'blur(4px)',
            transition: `all ${0.8 + index * 0.05}s ${DESIGN_TOKENS.animation.easing.default}`,
            transitionDelay: `${delay + index * 0.05}s`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

export default AnimatedText;
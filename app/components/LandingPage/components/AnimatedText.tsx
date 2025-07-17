import React from 'react';
import { AnimatedTextProps } from '../LandingPage.types';
import { DESIGN_TOKENS } from '../LandingPage.config';

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
            transition: `all ${DESIGN_TOKENS.animation.text.baseDuration + index * DESIGN_TOKENS.animation.text.charDurationIncrement}s ${DESIGN_TOKENS.animation.easing.default}`,
            transitionDelay: `${delay + index * DESIGN_TOKENS.animation.text.charDelay}s`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

export default AnimatedText;
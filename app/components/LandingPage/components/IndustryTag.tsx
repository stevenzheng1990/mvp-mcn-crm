// app/components/LandingPage/components/IndustryTag.tsx
import React, { useState } from 'react';
import { IndustryTagProps } from '../LandingPage.types';
import { DESIGN_TOKENS } from '../LandingPage.config';

const IndustryTag: React.FC<IndustryTagProps> = ({ industry, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const tagStyle = {
    display: 'inline-block',
    padding: '10px 20px',
    borderRadius: '12px',
    fontSize: DESIGN_TOKENS.typography.fontSize.small,
    fontWeight: DESIGN_TOKENS.typography.fontWeight.regular,
    color: DESIGN_TOKENS.colors.text.secondary,
    backgroundColor: isHovered 
      ? 'rgba(150,150,150,0.08)' 
      : 'rgba(150,150,150,0.03)',
    border: `1px solid ${isHovered ? 'rgba(150,150,150,0.2)' : 'rgba(150,150,150,0.1)'}`,
    opacity: isVisible ? 1 : 0,
    transform: isVisible 
      ? `translateX(0) rotate(${isHovered ? '-2deg' : '0deg'})` 
      : `translateX(-20px)`,
    transition: `all ${DESIGN_TOKENS.animation.duration.normal} ${DESIGN_TOKENS.animation.easing.default}`,
    transitionDelay: `${index * 0.05}s`,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  };
  
  return (
    <span 
      className="industry-tag"
      style={tagStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {industry}
    </span>
  );
};

export default IndustryTag;
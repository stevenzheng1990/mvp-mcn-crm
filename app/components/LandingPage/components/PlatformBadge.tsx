// app/components/LandingPage/components/PlatformBadge.tsx
import React, { useState } from 'react';
import { PlatformBadgeProps } from '../LandingPage.types';
import { DESIGN_TOKENS } from '../LandingPage.config';
import { createButtonGlassStyles } from '../LandingPage.styles';

const PlatformBadge: React.FC<PlatformBadgeProps> = ({ platform, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '12px 24px',
    borderRadius: isHovered ? '20px' : '999px',
    fontSize: DESIGN_TOKENS.typography.fontSize.small,
    fontWeight: DESIGN_TOKENS.typography.fontWeight.medium,
    color: DESIGN_TOKENS.colors.text.primary,
    opacity: isVisible ? 1 : 0,
    transform: isVisible 
      ? `translateY(0) scale(${isHovered ? 1.05 : 1})` 
      : `translateY(20px) scale(0.9)`,
    transition: `all ${DESIGN_TOKENS.animation.duration.liquidTransition} ${DESIGN_TOKENS.animation.easing.liquid}`,
    transitionDelay: `${index * 0.08}s`,
    cursor: 'pointer',
    position: 'relative' as const,
    overflow: 'hidden',
    ...createButtonGlassStyles(isHovered),
  };
  
  // 认证标记动画
  const certifiedMarkStyle = {
    display: 'inline-block',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: DESIGN_TOKENS.colors.text.accent,
    marginRight: '8px',
    opacity: isHovered ? 0.9 : 0.6,
    transform: isHovered ? 'scale(1.2)' : 'scale(1)',
    transition: `all ${DESIGN_TOKENS.animation.duration.normal} ease`,
  };
  
  // 波纹效果
  const rippleStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '10%',
    width: isHovered ? '150%' : '0%',
    height: isHovered ? '150%' : '0%',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    transform: 'translate(-50%, -50%)',
    transition: `all ${DESIGN_TOKENS.animation.duration.slow} ${DESIGN_TOKENS.animation.easing.liquid}`,
    pointerEvents: 'none' as const,
  };
  
  return (
    <div 
      className="platform-badge"
      style={badgeStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={rippleStyle} />
      <span style={certifiedMarkStyle} />
      <span style={{ position: 'relative', zIndex: 1 }}>{platform}</span>
    </div>
  );
};

export default PlatformBadge;
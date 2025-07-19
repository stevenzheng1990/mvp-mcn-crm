// app/components/LandingPage/components/AdvantageCard.tsx
import React, { useState } from 'react';
import { AdvantageCardProps } from '../LandingPage.types';
import { DESIGN_TOKENS } from '../LandingPage.config';
import AnimatedText from './AnimatedText';
import { iconMap } from './IconSystem';

const AdvantageCard: React.FC<AdvantageCardProps> = ({ item, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const cardStyle = {
    textAlign: 'center' as const,
    padding: DESIGN_TOKENS.spacing.component.cardPadding,
    opacity: isVisible ? 1 : 0,
    transform: isVisible 
      ? `translateY(0) scale(${isHovered ? 1.05 : 1})` 
      : `translateY(30px) scale(0.95)`,
    transition: `all ${DESIGN_TOKENS.animation.duration.slow} ${DESIGN_TOKENS.animation.easing.default}`,
    transitionDelay: `${index * 0.15}s`,
    cursor: 'pointer',
    position: 'relative' as const,
  };
  
  // 图标容器样式
  const iconContainerStyle = {
    marginBottom: DESIGN_TOKENS.spacing.gap.small,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80px',
    position: 'relative' as const,
  };
  
  // 图标背景动画
  const iconBackgroundStyle = {
    position: 'absolute' as const,
    inset: '-10px',
    borderRadius: '50%',
    background: `radial-gradient(circle at center, 
      ${isHovered ? 'rgba(150,150,150,0.1)' : 'rgba(150,150,150,0.05)'} 0%, 
      transparent 70%)`,
    transform: isHovered ? 'scale(1.2)' : 'scale(1)',
    transition: `all ${DESIGN_TOKENS.animation.duration.liquidTransition} ${DESIGN_TOKENS.animation.easing.liquid}`,
  };
  
  // 图标样式
  const iconStyle = {
    position: 'relative' as const,
    zIndex: 1,
    transform: isHovered ? 'rotate(10deg)' : 'rotate(0deg)',
    transition: `transform ${DESIGN_TOKENS.animation.duration.liquidTransition} ${DESIGN_TOKENS.animation.easing.liquid}`,
    display: 'inline-block',
  };
  
  const IconComponent = iconMap[item.icon as keyof typeof iconMap] || iconMap.service;
  
  return (
    <div 
      className="advantage-card"
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={iconContainerStyle}>
        <div style={iconBackgroundStyle} />
        <span style={iconStyle}>
          <IconComponent 
            size={48} 
            color={DESIGN_TOKENS.colors.text.primary}
            strokeWidth={1.5}
          />
        </span>
      </div>
      
      <h3 style={{
        fontSize: DESIGN_TOKENS.typography.fontSize.subheading,
        fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
        color: DESIGN_TOKENS.colors.text.primary,
        marginBottom: DESIGN_TOKENS.spacing.gap.tiny,
      }}>
        <AnimatedText
          text={item.title}
          delay={index * 0.15}
          inView={isVisible}
        />
      </h3>
      
      <p style={{
        fontSize: DESIGN_TOKENS.typography.fontSize.small,
        color: DESIGN_TOKENS.colors.text.secondary,
        lineHeight: DESIGN_TOKENS.typography.lineHeight.relaxed,
      }}>
        <AnimatedText
          text={item.description}
          delay={index * 0.15 + 0.1}
          inView={isVisible}
        />
      </p>
    </div>
  );
};

export default AdvantageCard;
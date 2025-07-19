// app/components/LandingPage/components/ServiceCard.tsx
import React, { useState } from 'react';
import { ServiceCardProps } from '../LandingPage.types';
import { DESIGN_TOKENS } from '../LandingPage.config';
import { createGlassStyles } from '../LandingPage.styles';
import AnimatedText from './AnimatedText';
import { iconMap } from './IconSystem';

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const cardStyle = {
    ...createGlassStyles(),
    padding: DESIGN_TOKENS.spacing.component.cardPadding,
    borderRadius: '24px',
    transition: `all ${DESIGN_TOKENS.animation.duration.liquidTransition} ${DESIGN_TOKENS.animation.easing.liquid}`,
    transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
    opacity: isVisible ? 1 : 0,
    position: 'relative' as const,
    overflow: 'hidden',
    cursor: 'pointer',
  };
  
  // 液体光效
  const liquidEffectStyle = {
    position: 'absolute' as const,
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: `radial-gradient(circle at ${isHovered ? '50% 50%' : '0% 0%'}, 
      rgba(255,255,255,0.1) 0%, 
      transparent 70%)`,
    transition: `all ${DESIGN_TOKENS.animation.duration.liquidTransition} ${DESIGN_TOKENS.animation.easing.liquid}`,
    pointerEvents: 'none' as const,
  };
  
  const IconComponent = iconMap[service.icon as keyof typeof iconMap] || iconMap.service;
  
  return (
    <div 
      className="service-card"
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={liquidEffectStyle} />
      
      <div style={{
        marginBottom: DESIGN_TOKENS.spacing.gap.small,
        opacity: 0.7,
      }}>
        <IconComponent 
          size={32} 
          color={DESIGN_TOKENS.colors.text.primary}
          strokeWidth={1.5}
        />
      </div>
      
      <h3 style={{
        fontSize: DESIGN_TOKENS.typography.fontSize.subheading,
        fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
        color: DESIGN_TOKENS.colors.text.primary,
        marginBottom: DESIGN_TOKENS.spacing.gap.small,
        position: 'relative',
        zIndex: 1,
      }}>
        <AnimatedText 
          text={service.title} 
          delay={index * 0.1}
          inView={isVisible}
        />
      </h3>
      
      <p style={{
        fontSize: DESIGN_TOKENS.typography.fontSize.body,
        color: DESIGN_TOKENS.colors.text.secondary,
        marginBottom: DESIGN_TOKENS.spacing.gap.small,
        position: 'relative',
        zIndex: 1,
      }}>
        <AnimatedText 
          text={service.description} 
          delay={index * 0.1 + 0.1}
          inView={isVisible}
        />
      </p>
      
      <ul style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        position: 'relative',
        zIndex: 1,
      }}>
        {service.features.map((feature, featureIndex) => (
          <li 
            key={featureIndex}
            style={{
              fontSize: DESIGN_TOKENS.typography.fontSize.small,
              color: DESIGN_TOKENS.colors.text.tertiary,
              marginBottom: DESIGN_TOKENS.spacing.gap.tiny,
              paddingLeft: '1.5rem',
              position: 'relative',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(20px)',
              transition: `all ${DESIGN_TOKENS.animation.duration.slow} ${DESIGN_TOKENS.animation.easing.default}`,
              transitionDelay: `${(index * 0.1 + 0.2 + featureIndex * 0.05)}s`,
            }}
          >
            <span style={{
              position: 'absolute',
              left: 0,
              top: '0.25rem',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: DESIGN_TOKENS.colors.text.accent,
              opacity: 0.7,
            }} />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceCard;
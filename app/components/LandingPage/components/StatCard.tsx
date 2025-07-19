// app/components/LandingPage/components/StatCard.tsx
import React, { useState } from 'react';
import { StatCardProps } from '../LandingPage.types';
import { DESIGN_TOKENS } from '../LandingPage.config';
import AnimatedNumber from './AnimatedNumber';
import AnimatedText from './AnimatedText';

const StatCard: React.FC<StatCardProps> = ({ stat, index, isVisible, large = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const isEcosystemStat = 'number' in stat;
  const value = isEcosystemStat ? stat.number : stat.value;
  const label = stat.label;
  const suffix = isEcosystemStat ? stat.suffix : '';
  const shouldAnimateNumber = !isEcosystemStat || stat.animation !== 'none';
  
  return (
    <div 
      className="stat-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        textAlign: 'center',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        transition: `transform ${DESIGN_TOKENS.animation.duration.liquidTransition} ${DESIGN_TOKENS.animation.easing.liquid}`,
        opacity: isVisible ? 1 : 0,
        position: 'relative',
      }}
    >
      {/* 动态背景效果 */}
      <div
        style={{
          position: 'absolute',
          inset: '-20px',
          background: `radial-gradient(circle at center, 
            ${isHovered ? 'rgba(150,150,150,0.08)' : 'transparent'} 0%, 
            transparent 70%)`,
          transition: `all ${DESIGN_TOKENS.animation.duration.slow} ease`,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />
      
      <div style={{
        fontSize: large ? DESIGN_TOKENS.typography.fontSize.hero : DESIGN_TOKENS.typography.fontSize.subtitle,
        fontWeight: DESIGN_TOKENS.typography.fontWeight.bold,
        color: DESIGN_TOKENS.colors.text.primary,
        marginBottom: DESIGN_TOKENS.spacing.gap.tiny,
        lineHeight: DESIGN_TOKENS.typography.lineHeight.tight,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
        gap: '0.2em',
      }}>
        {shouldAnimateNumber ? (
          <>
            <AnimatedNumber
              value={value}
              delay={index * 200}
              duration={2000}
              inView={isVisible}
            />
            {suffix && (
              <span style={{
                fontSize: '0.6em',
                fontWeight: DESIGN_TOKENS.typography.fontWeight.regular,
                opacity: 0.8,
              }}>
                {suffix}
              </span>
            )}
          </>
        ) : (
          <AnimatedText
            text={value + suffix}
            delay={index * 0.1}
            inView={isVisible}
          />
        )}
      </div>
      
      <div style={{
        fontSize: DESIGN_TOKENS.typography.fontSize.small,
        color: DESIGN_TOKENS.colors.text.secondary,
        fontWeight: DESIGN_TOKENS.typography.fontWeight.regular,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
        transition: `all ${DESIGN_TOKENS.animation.duration.slow} ${DESIGN_TOKENS.animation.easing.default}`,
        transitionDelay: `${index * 0.1 + 0.3}s`,
      }}>
        {label}
      </div>
    </div>
  );
};

export default StatCard;
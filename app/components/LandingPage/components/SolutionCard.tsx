// app/components/LandingPage/components/SolutionCard.tsx
import React, { useState } from 'react';
import { SolutionCardProps } from '../LandingPage.types';
import { DESIGN_TOKENS } from '../LandingPage.config';
import AnimatedText from './AnimatedText';

const SolutionCard: React.FC<SolutionCardProps> = ({ solution, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const cardStyle = {
    padding: DESIGN_TOKENS.spacing.component.cardPadding,
    borderRadius: '16px',
    background: isHovered 
      ? DESIGN_TOKENS.colors.gradient.primary
      : 'transparent',
    border: `1px solid ${isHovered ? 'rgba(150,150,150,0.2)' : 'rgba(150,150,150,0.1)'}`,
    transition: `all ${DESIGN_TOKENS.animation.duration.normal} ${DESIGN_TOKENS.animation.easing.default}`,
    cursor: 'pointer',
    position: 'relative' as const,
    overflow: 'hidden',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    transitionDelay: `${index * 0.15}s`,
  };
  
  return (
    <div 
      className="solution-card"
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 style={{
        fontSize: DESIGN_TOKENS.typography.fontSize.subheading,
        fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
        color: DESIGN_TOKENS.colors.text.primary,
        marginBottom: DESIGN_TOKENS.spacing.gap.small,
      }}>
        <AnimatedText
          text={solution.title}
          delay={index * 0.1}
          inView={isVisible}
        />
      </h3>
      
      <p style={{
        fontSize: DESIGN_TOKENS.typography.fontSize.body,
        color: DESIGN_TOKENS.colors.text.secondary,
        lineHeight: DESIGN_TOKENS.typography.lineHeight.relaxed,
        marginBottom: DESIGN_TOKENS.spacing.gap.small,
      }}>
        <AnimatedText
          text={solution.description}
          delay={index * 0.1 + 0.1}
          inView={isVisible}
        />
      </p>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: DESIGN_TOKENS.spacing.gap.tiny,
        marginTop: DESIGN_TOKENS.spacing.gap.small,
      }}>
        {solution.highlights.map((highlight, highlightIndex) => (
          <span
            key={highlightIndex}
            style={{
              fontSize: DESIGN_TOKENS.typography.fontSize.small,
              color: DESIGN_TOKENS.colors.text.accent,
              padding: '4px 12px',
              borderRadius: '12px',
              backgroundColor: 'rgba(150,150,150,0.08)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'scale(1)' : 'scale(0.9)',
              transition: `all ${DESIGN_TOKENS.animation.duration.normal} ${DESIGN_TOKENS.animation.easing.default}`,
              transitionDelay: `${(index * 0.1 + 0.2 + highlightIndex * 0.05)}s`,
            }}
          >
            {highlight}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SolutionCard;
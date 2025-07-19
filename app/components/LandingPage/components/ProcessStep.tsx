// app/components/LandingPage/components/ProcessStep.tsx
import React, { useState } from 'react';
import { ProcessStepProps } from '../LandingPage.types';
import { DESIGN_TOKENS } from '../LandingPage.config';
import AnimatedText from './AnimatedText';

const ProcessStep: React.FC<ProcessStepProps> = ({ step, index, isVisible, totalSteps }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const stepStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const,
    position: 'relative' as const,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: `all ${DESIGN_TOKENS.animation.duration.slow} ${DESIGN_TOKENS.animation.easing.default}`,
    transitionDelay: `${index * 0.1}s`,
  };
  
  // 步骤编号样式
  const numberStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: isHovered ? `${DESIGN_TOKENS.colors.text.primary}10` : 'transparent',
    border: `2px solid ${DESIGN_TOKENS.colors.text.tertiary}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: DESIGN_TOKENS.typography.fontSize.heading,
    fontWeight: DESIGN_TOKENS.typography.fontWeight.bold,
    color: DESIGN_TOKENS.colors.text.primary,
    marginBottom: DESIGN_TOKENS.spacing.gap.small,
    position: 'relative' as const,
    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
    transition: `all ${DESIGN_TOKENS.animation.duration.normal} ease`,
  };
  
  // 连接线样式
  const connectorStyle = {
    position: 'absolute' as const,
    top: '30px',
    left: '60px',
    width: 'calc(100% - 60px)',
    height: '2px',
    backgroundColor: `${DESIGN_TOKENS.colors.text.tertiary}20`,
    zIndex: -1,
    display: index < totalSteps - 1 ? 'block' : 'none',
  };
  
  // 进度条样式
  const progressStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    height: '100%',
    width: isVisible ? '100%' : '0%',
    backgroundColor: `${DESIGN_TOKENS.colors.text.accent}40`,
    transition: `width ${DESIGN_TOKENS.animation.duration.slower} ${DESIGN_TOKENS.animation.easing.default}`,
    transitionDelay: `${(index + 1) * 0.2}s`,
  };
  
  return (
    <div 
      className="process-step"
      style={stepStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={numberStyle}>
        {index + 1}
      </div>
      
      <div style={connectorStyle}>
        <div style={progressStyle} />
      </div>
      
      <h4 style={{
        fontSize: DESIGN_TOKENS.typography.fontSize.body,
        fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
        color: DESIGN_TOKENS.colors.text.primary,
        marginBottom: DESIGN_TOKENS.spacing.gap.tiny,
      }}>
        <AnimatedText
          text={step.title}
          delay={index * 0.1}
          inView={isVisible}
        />
      </h4>
      
      <p style={{
        fontSize: DESIGN_TOKENS.typography.fontSize.small,
        color: DESIGN_TOKENS.colors.text.secondary,
        maxWidth: '200px',
      }}>
        <AnimatedText
          text={step.description}
          delay={index * 0.1 + 0.1}
          inView={isVisible}
        />
      </p>
    </div>
  );
};

export default ProcessStep;
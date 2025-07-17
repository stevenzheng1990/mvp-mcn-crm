// Z:\MCN\mvp-mcn-crm\app\components\LandingPage\components\PageSection.tsx
import React from 'react';
import { PageSectionProps } from '../LandingPage.types';
import { DESIGN_TOKENS } from '../LandingPage.config';

const PageSection: React.FC<PageSectionProps> = ({ 
  sectionRef, 
  isVisible, 
  children, 
  className = '', 
  style = {} 
}) => {
  return (
    <section
      ref={sectionRef}
      className={`page-section ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: DESIGN_TOKENS.spacing.section.minHeight,
        padding: DESIGN_TOKENS.spacing.section.padding,
        ...style,
      }}
    >
      {children}
    </section>
  );
};

export default PageSection;
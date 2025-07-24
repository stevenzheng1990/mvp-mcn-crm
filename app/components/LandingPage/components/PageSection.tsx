// Z:\MCN\mvp-mcn-crm\app\components\LandingPage\components\PageSection.tsx
import React from 'react';
import { PageSectionProps } from '../LandingPage.types';
import { useResponsive } from '../hooks/useResponsive';
import { getResponsiveSpacing } from '../LandingPage.styles';

const PageSection: React.FC<PageSectionProps> = ({ 
  sectionRef, 
  isVisible, 
  children, 
  className = '', 
  style = {} 
}) => {
  const { device } = useResponsive();
  const spacing = getResponsiveSpacing(device);

  return (
    <section
      ref={sectionRef}
      className={`page-section ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: spacing.section,
        ...style,
      }}
    >
      {children}
    </section>
  );
};

export default PageSection;
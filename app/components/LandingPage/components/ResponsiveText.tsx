import React from 'react';
import { useResponsiveTypography, TypographyLevel } from '../hooks/useResponsiveTypography';
import { DESIGN_TOKENS } from '../LandingPage.config';

interface ResponsiveTextProps {
  level: TypographyLevel;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  color?: 'primary' | 'secondary' | 'tertiary' | string;
  align?: 'left' | 'center' | 'right' | 'justify';
  weight?: number;
}

const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  level,
  children,
  className = '',
  style = {},
  as: Component = 'div',
  color = 'primary',
  align = 'left',
  weight,
}) => {
  const typography = useResponsiveTypography(level);
  
  const getTextColor = () => {
    switch (color) {
      case 'primary':
        return DESIGN_TOKENS.colors.text.primary;
      case 'secondary':
        return DESIGN_TOKENS.colors.text.secondary;
      case 'tertiary':
        return DESIGN_TOKENS.colors.text.tertiary;
      default:
        return color;
    }
  };

  const textStyle: React.CSSProperties = {
    fontFamily: DESIGN_TOKENS.typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: weight || typography.fontWeight,
    lineHeight: typography.lineHeight,
    letterSpacing: typography.letterSpacing,
    color: getTextColor(),
    textAlign: align,
    margin: 0,
    padding: 0,
    ...style,
  };

  return (
    <Component
      className={`responsive-text responsive-text--${level} ${className}`}
      style={textStyle}
    >
      {children}
    </Component>
  );
};

export default ResponsiveText;
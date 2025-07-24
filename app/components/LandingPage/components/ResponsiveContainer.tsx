import React from 'react';
import { useResponsive, getResponsiveContainer } from '../hooks/useResponsive';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  fullWidth?: boolean;
  centerContent?: boolean;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  style = {},
  fullWidth = false,
  centerContent = true,
}) => {
  const { device } = useResponsive();
  const containerConfig = getResponsiveContainer(device);

  const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: fullWidth ? '100%' : containerConfig.maxWidth,
    padding: containerConfig.padding,
    margin: centerContent ? '0 auto' : '0',
    ...style,
  };

  return (
    <div
      className={`responsive-container ${className}`}
      style={containerStyle}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer;
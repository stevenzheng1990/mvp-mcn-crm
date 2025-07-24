import React from 'react';
import { useResponsive, getResponsiveGrid } from '../hooks/useResponsive';

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  customColumns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    large?: number;
  };
  customGap?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    large?: string;
  };
  alignItems?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justifyItems?: 'start' | 'center' | 'end' | 'stretch';
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className = '',
  style = {},
  customColumns,
  customGap,
  alignItems = 'stretch',
  justifyItems = 'stretch',
}) => {
  const { device } = useResponsive();
  const defaultGridConfig = getResponsiveGrid(device);

  const getColumnCount = () => {
    if (customColumns) {
      return customColumns[device] ?? customColumns.desktop ?? customColumns.tablet ?? customColumns.mobile ?? defaultGridConfig.columns;
    }
    return defaultGridConfig.columns;
  };

  const getGap = () => {
    if (customGap) {
      return customGap[device] ?? customGap.desktop ?? customGap.tablet ?? customGap.mobile ?? defaultGridConfig.gap;
    }
    return defaultGridConfig.gap;
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${getColumnCount()}, 1fr)`,
    gap: getGap(),
    alignItems,
    justifyItems,
    width: '100%',
    ...style,
  };

  return (
    <div
      className={`responsive-grid ${className}`}
      style={gridStyle}
    >
      {children}
    </div>
  );
};

export default ResponsiveGrid;
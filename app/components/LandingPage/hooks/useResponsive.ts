import { useState, useEffect } from 'react';
import { DESIGN_TOKENS } from '../LandingPage.config';

export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'large';

export interface ResponsiveConfig {
  device: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLarge: boolean;
  width: number;
  height: number;
}

export const useResponsive = (): ResponsiveConfig => {
  const [config, setConfig] = useState<ResponsiveConfig>({
    device: 'desktop',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isLarge: false,
    width: 1200,
    height: 800,
  });

  useEffect(() => {
    const updateConfig = () => {
      if (typeof window === 'undefined') return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const breakpoints = DESIGN_TOKENS.layout.breakpoints;

      let device: DeviceType = 'desktop';
      
      if (width < breakpoints.mobile) {
        device = 'mobile';
      } else if (width < breakpoints.tablet) {
        device = 'tablet';
      } else if (width < breakpoints.desktop) {
        device = 'desktop';
      } else {
        device = 'large';
      }

      setConfig({
        device,
        isMobile: device === 'mobile',
        isTablet: device === 'tablet',
        isDesktop: device === 'desktop',
        isLarge: device === 'large',
        width,
        height,
      });
    };

    updateConfig();
    window.addEventListener('resize', updateConfig);
    
    return () => window.removeEventListener('resize', updateConfig);
  }, []);

  return config;
};

export const getResponsiveValue = <T>(
  values: {
    mobile?: T;
    tablet?: T;
    desktop?: T;
    large?: T;
  },
  device: DeviceType,
  fallback: T
): T => {
  return values[device] ?? values.desktop ?? values.tablet ?? values.mobile ?? fallback;
};

export const getResponsiveGrid = (device: DeviceType) => {
  const gridConfig = DESIGN_TOKENS.layout.grid;
  return getResponsiveValue(gridConfig, device, gridConfig.desktop);
};

export const getResponsiveContainer = (device: DeviceType) => {
  const containerConfig = DESIGN_TOKENS.layout.container;
  return getResponsiveValue(containerConfig, device, containerConfig.desktop);
};
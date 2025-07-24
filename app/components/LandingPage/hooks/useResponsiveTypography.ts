import { useResponsive, DeviceType } from './useResponsive';
import { DESIGN_TOKENS } from '../LandingPage.config';

export type TypographyLevel = 'level1' | 'level2' | 'level3' | 'level4' | 'level5' | 'level6';

export interface ResponsiveTypographyStyle {
  fontSize: string;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: string;
}

export const useResponsiveTypography = (level: TypographyLevel): ResponsiveTypographyStyle => {
  const { device } = useResponsive();
  
  const typographyConfig = DESIGN_TOKENS.typography[level];
  
  const getResponsiveTypographyValue = <T>(
    values: {
      mobile?: T;
      tablet?: T;
      desktop?: T;
      large?: T;
    },
    fallback: T
  ): T => {
    return values[device] ?? values.desktop ?? values.tablet ?? values.mobile ?? fallback;
  };

  // 如果有响应式配置，使用响应式配置，否则使用默认配置
  if (typographyConfig.responsive) {
    return {
      fontSize: getResponsiveTypographyValue(typographyConfig.responsive.fontSize, typographyConfig.fontSize as string),
      fontWeight: getResponsiveTypographyValue(typographyConfig.responsive.fontWeight, typographyConfig.fontWeight as number),
      lineHeight: getResponsiveTypographyValue(typographyConfig.responsive.lineHeight, typographyConfig.lineHeight as number),
      letterSpacing: getResponsiveTypographyValue(typographyConfig.responsive.letterSpacing, typographyConfig.letterSpacing as string),
    };
  }

  // 使用默认配置
  return {
    fontSize: typographyConfig.fontSize as string,
    fontWeight: typographyConfig.fontWeight as number,
    lineHeight: typographyConfig.lineHeight as number,
    letterSpacing: typographyConfig.letterSpacing as string,
  };
};

export const getResponsiveTypographyStyle = (level: TypographyLevel, device: DeviceType): ResponsiveTypographyStyle => {
  const typographyConfig = DESIGN_TOKENS.typography[level];
  
  const getResponsiveTypographyValue = <T>(
    values: {
      mobile?: T;
      tablet?: T;
      desktop?: T;
      large?: T;
    },
    fallback: T
  ): T => {
    return values[device] ?? values.desktop ?? values.tablet ?? values.mobile ?? fallback;
  };

  // 如果有响应式配置，使用响应式配置，否则使用默认配置
  if (typographyConfig.responsive) {
    return {
      fontSize: getResponsiveTypographyValue(typographyConfig.responsive.fontSize, typographyConfig.fontSize as string),
      fontWeight: getResponsiveTypographyValue(typographyConfig.responsive.fontWeight, typographyConfig.fontWeight as number),
      lineHeight: getResponsiveTypographyValue(typographyConfig.responsive.lineHeight, typographyConfig.lineHeight as number),
      letterSpacing: getResponsiveTypographyValue(typographyConfig.responsive.letterSpacing, typographyConfig.letterSpacing as string),
    };
  }

  // 使用默认配置
  return {
    fontSize: typographyConfig.fontSize as string,
    fontWeight: typographyConfig.fontWeight as number,
    lineHeight: typographyConfig.lineHeight as number,
    letterSpacing: typographyConfig.letterSpacing as string,
  };
};
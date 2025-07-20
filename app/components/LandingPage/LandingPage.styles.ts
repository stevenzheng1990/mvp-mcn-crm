// app/components/LandingPage/LandingPage.styles.ts
import { DESIGN_TOKENS } from './LandingPage.config';

// CSS 变量生成函数
export const getCssVariables = () => ({
  '--glass-base': DESIGN_TOKENS.colors.glass.base,
  '--glass-light': DESIGN_TOKENS.colors.glass.light,
  '--glass-dark': DESIGN_TOKENS.colors.glass.dark,
  '--glass-reflex-dark': 1,
  '--glass-reflex-light': 1,
  '--glass-saturation': DESIGN_TOKENS.glassEffect.saturation,
  '--glass-blur': DESIGN_TOKENS.glassEffect.blur.medium,
} as React.CSSProperties);

// 统一的玻璃效果基础样式
const createUnifiedGlassStyles = (
  isHovered: boolean = false,
  variant: 'button' | 'card' = 'card'
) => {
  // 统一的基础参数
  const baseOpacity = variant === 'button' ? 8 : 10;
  const hoveredOpacity = variant === 'button' ? 12 : 15;
  const currentOpacity = isHovered ? hoveredOpacity : baseOpacity;
  
  // 统一的反射强度
  const lightReflex = isHovered ? 15 : 10;
  const darkReflex = isHovered ? 15 : 12;

  return {
    backgroundColor: `color-mix(in srgb, var(--glass-base) ${currentOpacity}%, transparent)`,
    backdropFilter: `blur(${DESIGN_TOKENS.glassEffect.blur.medium}) saturate(var(--glass-saturation))`,
    WebkitBackdropFilter: `blur(${DESIGN_TOKENS.glassEffect.blur.medium}) saturate(var(--glass-saturation))`,
    boxShadow: `
      inset 0 0 0 1px color-mix(in srgb, var(--glass-light) ${lightReflex}%, transparent),
      inset 1.8px 3px 0px -2px color-mix(in srgb, var(--glass-light) ${lightReflex + 80}%, transparent),
      inset -2px -2px 0px -2px color-mix(in srgb, var(--glass-light) ${lightReflex + 70}%, transparent),
      inset -0.3px -1px 4px 0px color-mix(in srgb, var(--glass-dark) ${darkReflex}%, transparent),
      0px 1px 5px 0px color-mix(in srgb, var(--glass-dark) ${darkReflex - 2}%, transparent),
      0px 6px 16px 0px color-mix(in srgb, var(--glass-dark) ${darkReflex - 4}%, transparent)
    `,
  };
};

// 按钮玻璃效果 - 使用统一样式
export const createButtonGlassStyles = (isHovered: boolean = false) => {
  return createUnifiedGlassStyles(isHovered, 'button');
};

// 卡片玻璃效果 - 使用统一样式
export const createGlassStyles = (isHovered: boolean = false) => {
  return createUnifiedGlassStyles(isHovered, 'card');
};

// 导航栏玻璃效果 - 特殊版本，保持现有逻辑
export const createExtendedGlassStyles = () => ({
  backgroundColor: `color-mix(in srgb, var(--glass-base) 10%, transparent)`,
  backdropFilter: `blur(${DESIGN_TOKENS.glassEffect.blur.medium}) saturate(var(--glass-saturation))`,
  WebkitBackdropFilter: `blur(${DESIGN_TOKENS.glassEffect.blur.medium}) saturate(var(--glass-saturation))`,
  boxShadow: `
    inset 0 0 0 1px color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 10%), transparent),
    inset 1.8px 3px 0px -2px color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 90%), transparent),
    inset -2px -2px 0px -2px color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 80%), transparent),
    inset -3px -8px 1px -6px color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 60%), transparent),
    inset -0.3px -1px 4px 0px color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 12%), transparent),
    inset -1.5px 2.5px 0px -2px color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 20%), transparent),
    0px 1px 5px 0px color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 10%), transparent),
    0px 6px 16px 0px color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 8%), transparent)
  `,
});

// 缓动函数
export const easeInOutQuart = (t: number): number => {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
};
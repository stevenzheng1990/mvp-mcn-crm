// app/components/LandingPage/LandingPage.styles.ts
// 只保留样式生成函数，所有配置从 config 文件导入

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

// 玻璃效果样式生成函数 - 降低模糊度，增加透明度
export const createGlassStyles = (isDarkMode: boolean = false) => ({
  backgroundColor: `color-mix(in srgb, var(--glass-base) ${isDarkMode ? '15%' : '8%'}, transparent)`,
  backdropFilter: `blur(${DESIGN_TOKENS.glassEffect.blur.medium}) saturate(var(--glass-saturation))`,
  WebkitBackdropFilter: `blur(${DESIGN_TOKENS.glassEffect.blur.medium}) saturate(var(--glass-saturation))`,
  boxShadow: `
    inset 0 0 0 1px color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 10%), transparent),
    inset 1.8px 3px 0px -2px color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 90%), transparent),
    inset -2px -2px 0px -2px color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 80%), transparent),
    inset -0.3px -1px 4px 0px color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 12%), transparent),
    0px 1px 5px 0px color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 10%), transparent),
    0px 6px 16px 0px color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 8%), transparent)
  `,
});

// 增强的按钮玻璃效果（带液体感的悬停动画）- 更透明
export const createButtonGlassStyles = (isHovered: boolean = false) => {
  const normalIntensity = DESIGN_TOKENS.glassEffect.intensity.button.normal;
  const hoveredIntensity = DESIGN_TOKENS.glassEffect.intensity.button.hovered;
  const intensity = isHovered ? hoveredIntensity : normalIntensity;
  
  return {
    backgroundColor: `color-mix(in srgb, var(--glass-base) ${isHovered ? '10%' : '8%'}, transparent)`,
    backdropFilter: `blur(${DESIGN_TOKENS.glassEffect.blur.medium}) saturate(var(--glass-saturation))`,
    WebkitBackdropFilter: `blur(${DESIGN_TOKENS.glassEffect.blur.medium}) saturate(var(--glass-saturation))`,
    boxShadow: `
      inset 0 0 0 1px color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * ${intensity.lightReflex}%), transparent),
      inset 1.8px 3px 0px -2px color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * ${intensity.lightReflex + 80}%), transparent),
      inset -2px -2px 0px -2px color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * ${intensity.lightReflex + 70}%), transparent),
      inset -0.3px -1px 4px 0px color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * ${intensity.darkReflex}%), transparent),
      0px 1px 5px 0px color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * ${intensity.darkReflex - 2}%), transparent),
      0px 6px 16px 0px color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * ${intensity.darkReflex - 4}%), transparent)
    `,
  };
};

// 扩展的玻璃效果（用于导航栏）- 更透明
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
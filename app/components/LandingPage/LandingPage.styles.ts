// Z:\MCN\mvp-mcn-crm\app\components\LandingPage\LandingPage.styles.ts
import { DESIGN_TOKENS } from './LandingPage.constants';

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

// 玻璃效果样式生成函数
export const createGlassStyles = (isDarkMode: boolean = false) => ({
  backgroundColor: `color-mix(in srgb, var(--glass-base) ${isDarkMode ? '20%' : '12%'}, transparent)`,
  backdropFilter: `blur(var(--glass-blur)) saturate(var(--glass-saturation))`,
  WebkitBackdropFilter: `blur(var(--glass-blur)) saturate(var(--glass-saturation))`,
  boxShadow: `
    inset 0 0 0 1px color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 10%), transparent),
    inset 1.8px 3px 0px -2px color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 90%), transparent),
    inset -2px -2px 0px -2px color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 80%), transparent),
    inset -0.3px -1px 4px 0px color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 12%), transparent),
    0px 1px 5px 0px color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 10%), transparent),
    0px 6px 16px 0px color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 8%), transparent)
  `,
});

// 扩展的玻璃效果（用于导航栏）
export const createExtendedGlassStyles = () => ({
  ...createGlassStyles(),
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
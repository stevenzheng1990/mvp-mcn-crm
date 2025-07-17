// Z:\MCN\mvp-mcn-crm\app\components\LandingPage\LandingPage.styles.ts
// 设计令牌系统
export const DESIGN_TOKENS = {
  // 字体系统
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Arial", sans-serif',
    fontWeight: {
      light: 300,
      regular: 400,
      bold: 900,
    },
    fontSize: {
      hero: 'clamp(2.8rem, 8.4vw, 7rem)',
      subtitle: 'clamp(1.75rem, 5.6vw, 4.2rem)',
      heading: 'clamp(1.4rem, 3.5vw, 2.45rem)',
      body: 'clamp(0.84rem, 1.75vw, 1.26rem)',
      small: 'clamp(0.7rem, 1.4vw, 0.84rem)',
    },
    lineHeight: {
      tight: 0.9,
      normal: 1.2,
      relaxed: 1.3,
    },
    letterSpacing: '0.02em',
  },
  
  // 颜色系统
  colors: {
    text: {
      primary: 'rgba(80, 80, 80, 0.95)',
      secondary: 'rgba(80, 80, 80, 0.7)',
      tertiary: 'rgba(80, 80, 80, 0.5)',
    },
    glass: {
      base: '#bbbbbc',
      light: '#fff',
      dark: '#000',
    },
  },
  
  // 间距系统
  spacing: {
    section: {
      minHeight: '100vh',
      padding: '5vh 5vw',
    },
    gap: {
      hero: 'clamp(2rem, 4vh, 4rem)',
      content: 'clamp(3rem, 6vh, 6rem)',
      item: 'clamp(2rem, 4vh, 4rem)',
    },
  },
  
  // 动画系统
  animation: {
    duration: {
      fast: '200ms',
      normal: '300ms',
      slow: '500ms',
      slower: '800ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
  
  // 玻璃效果
  glassEffect: {
    blur: {
      light: '8px',
      medium: '12px',
    },
    saturation: '150%',
  },
} as const;

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

// 增强的按钮玻璃效果（带液体感的悬停动画）
export const createButtonGlassStyles = (isHovered: boolean = false) => ({
  backgroundColor: 'transparent', // 移除灰色背景
  backdropFilter: `blur(var(--glass-blur)) saturate(var(--glass-saturation))`,
  WebkitBackdropFilter: `blur(var(--glass-blur)) saturate(var(--glass-saturation))`,
  boxShadow: `
    inset 0 0 0 1px color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * ${isHovered ? '15%' : '10%'}), transparent),
    inset 1.8px 3px 0px -2px color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * ${isHovered ? '95%' : '90%'}), transparent),
    inset -2px -2px 0px -2px color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * ${isHovered ? '85%' : '80%'}), transparent),
    inset -0.3px -1px 4px 0px color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * ${isHovered ? '15%' : '12%'}), transparent),
    0px 1px 5px 0px color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * ${isHovered ? '12%' : '10%'}), transparent),
    0px 6px 16px 0px color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * ${isHovered ? '10%' : '8%'}), transparent)
  `,
});

// 扩展的玻璃效果（用于导航栏）
export const createExtendedGlassStyles = () => ({
  backgroundColor: `color-mix(in srgb, var(--glass-base) 12%, transparent)`,
  backdropFilter: `blur(var(--glass-blur)) saturate(var(--glass-saturation))`,
  WebkitBackdropFilter: `blur(var(--glass-blur)) saturate(var(--glass-saturation))`,
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
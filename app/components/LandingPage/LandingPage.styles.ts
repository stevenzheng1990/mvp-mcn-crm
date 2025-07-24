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


// 玻璃长条容器样式
export const getGlassBarContainerStyles = (visibleSections: Set<number>, isExpanded: boolean, isMobile: boolean) => {
  const hasSeenAbout = visibleSections.has(1); // about section is index 1
  const isFirstTime = !hasSeenAbout;
  
  return {
    position: 'fixed' as const,
    top: isFirstTime ? '-100px' : '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    opacity: isFirstTime ? 0 : 1,
    transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    pointerEvents: isFirstTime ? 'none' : 'auto',
  };
};

// 玻璃长条内容样式
export const getGlassBarContentStyles = (isExpanded: boolean, isMobile: boolean) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: (isMobile && isExpanded) ? 'column' as const : 'row' as const,
  width: '100%',
  padding: isMobile ? '1rem' : '0 2rem',
  gap: isMobile ? (isExpanded ? '1rem' : '1.8rem') : '1.8rem',
  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
});

// 玻璃长条导航项样式
export const getGlassBarNavItemStyles = (language?: string) => ({
  color: 'rgba(60, 60, 60, 0.8)',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'color 0.2s ease',
  whiteSpace: 'nowrap' as const,
});

// 玻璃长条导航项hover样式
export const getGlassBarNavItemHoverStyles = () => ({
  color: 'rgba(220, 220, 220, 0.9)',
});

// 玻璃长条分隔线样式
export const getGlassBarDividerStyles = (isMobile: boolean, isExpanded: boolean) => ({
  width: (isMobile && isExpanded) ? '80%' : '1px',
  height: (isMobile && isExpanded) ? '1px' : '20px',
  background: 'rgba(100, 100, 100, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
});

// 玻璃长条特殊项样式（联系我们、数据后台）
export const getGlassBarSpecialItemStyles = (language?: string) => ({
  color: 'rgba(80, 80, 80, 0.9)',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'color 0.2s ease',
  whiteSpace: 'nowrap' as const,
});

// 玻璃长条特殊项hover样式
export const getGlassBarSpecialItemHoverStyles = () => ({
  color: 'rgba(240, 240, 240, 0.95)',
});

// 玻璃长条隐藏元素样式
export const getGlassBarHiddenItemStyles = (isExpanded: boolean) => ({
  opacity: isExpanded ? 1 : 0,
  transform: isExpanded ? 'translateY(0)' : 'translateY(-10px)',
  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  pointerEvents: isExpanded ? ('auto' as const) : ('none' as const),
});

// 语言切换按钮样式
export const getLanguageToggleStyles = (isActive: boolean) => ({
  color: isActive ? 'rgba(40, 40, 40, 1)' : 'rgba(80, 80, 80, 0.8)',
  fontSize: DESIGN_TOKENS.typography.level6.fontSize,
  fontWeight: DESIGN_TOKENS.typography.level6.fontWeight,
  lineHeight: DESIGN_TOKENS.typography.level6.lineHeight,
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'color 0.2s ease',
  whiteSpace: 'nowrap' as const,
  padding: '4px 8px',
  borderRadius: '4px',
});

// 语言切换按钮hover样式
export const getLanguageToggleHoverStyles = () => ({
  color: 'rgba(200, 200, 200, 0.9)',
});

// 缓动函数
export const easeInOutQuart = (t: number): number => {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
};

// 响应式间距系统
export const getResponsiveSpacing = (device: 'mobile' | 'tablet' | 'desktop' | 'large') => {
  const spacingMap = {
    mobile: {
      section: '3vh 4vw',
      hero: '2rem',
      content: '3rem',
      item: '2rem',
      largeSections: '12vh',
      mediumSections: '8vh',
      smallSections: '6vh',
      subsections: '3rem',
      elements: '2rem',
    },
    tablet: {
      section: '4vh 4vw',
      hero: '2.5rem',
      content: '4rem',
      item: '2.5rem',
      largeSections: '14vh',
      mediumSections: '10vh',
      smallSections: '7vh',
      subsections: '4rem',
      elements: '2.5rem',
    },
    desktop: {
      section: '5vh 5vw',
      hero: '3rem',
      content: '5rem',
      item: '3rem',
      largeSections: '17vh',
      mediumSections: '13vh',
      smallSections: '9vh',
      subsections: '5rem',
      elements: '3rem',
    },
    large: {
      section: '6vh 4vw',
      hero: '4rem',
      content: '6rem',
      item: '4rem',
      largeSections: '20vh',
      mediumSections: '15vh',
      smallSections: '11vh',
      subsections: '6rem',
      elements: '4rem',
    },
  };

  return spacingMap[device] || spacingMap.desktop;
};

// 移动端优化的玻璃效果
export const createMobileOptimizedGlassStyles = (
  isHovered: boolean = false,
  isMobile: boolean = false
) => {
  if (isMobile) {
    // 移动端使用更简单的玻璃效果，减少GPU负担
    return {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(8px) saturate(180%)',
      WebkitBackdropFilter: 'blur(8px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: isHovered 
        ? '0 8px 32px rgba(0, 0, 0, 0.1)' 
        : '0 4px 16px rgba(0, 0, 0, 0.05)',
    };
  }
  
  return createUnifiedGlassStyles(isHovered, 'card');
};

// 移动端动画优化
export const getMobileOptimizedAnimationDuration = (isMobile: boolean) => ({
  fast: isMobile ? '150ms' : '200ms',
  normal: isMobile ? '250ms' : '300ms',
  slow: isMobile ? '400ms' : '500ms',
  slower: isMobile ? '600ms' : '800ms',
});

// 触摸友好的交互样式
export const getTouchFriendlyStyles = (isMobile: boolean) => ({
  minHeight: isMobile ? '44px' : 'auto',
  minWidth: isMobile ? '44px' : 'auto',
  cursor: isMobile ? 'default' : 'pointer',
  userSelect: 'none' as const,
  WebkitTapHighlightColor: 'transparent',
  touchAction: isMobile ? 'manipulation' : 'auto',
});

// 移动端导航栏样式优化
export const getMobileNavigationStyles = (isMobile: boolean, isExpanded: boolean = false) => ({
  position: 'fixed' as const,
  top: isMobile ? (isExpanded ? '20px' : '20px') : '30px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: isMobile ? (isExpanded ? '95vw' : '90vw') : 'auto',
  maxWidth: isMobile ? '95vw' : 'none',
  zIndex: 1000,
  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
});
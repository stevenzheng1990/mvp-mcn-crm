// Z:\MCN\mvp-mcn-crm\app\components\LandingPage\LandingPage.config.ts
// 集中的配置文件 - 移除了旧遮罩系统相关配置

import { ContentData } from './LandingPage.types';

// ===== 设计令牌系统 =====
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
  
  // 颜色系统 - 统一管理所有颜色
  colors: {
    text: {
      primary: 'rgba(80, 80, 80, 0.95)',      // 主要文字颜色
      secondary: 'rgba(80, 80, 80, 0.7)',     // 次要文字颜色
      tertiary: 'rgba(80, 80, 80, 0.5)',      // 第三级文字颜色
    },
    // 玻璃效果颜色
    glass: {
      base: '#bbbbbc',
      light: '#fff',
      dark: '#000',
      // 玻璃效果透明度
      opacity: {
        button: 0,        // 按钮背景透明度（0=完全透明）
        navigation: 12,   // 导航栏背景透明度
      },
    },
    // 页脚颜色
    footer: {
      text: 'rgba(80, 80, 80, 0.5)',
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
    // 组件间距
    component: {
      buttonGap: '16px',
      navigationPadding: '12px 24px',
    },
  },
  
  // 动画系统
  animation: {
    duration: {
      fast: '200ms',
      normal: '300ms',
      slow: '500ms',
      slower: '800ms',
      liquidTransition: '0.4s', // 液体感动画时长
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      liquid: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // 液体感缓动
    },
    // 文字动画配置
    text: {
      baseDelay: 0,
      charDelay: 0.05,
      baseDuration: 0.8,
      charDurationIncrement: 0.05,
    },
  },
  
  // 玻璃效果
  glassEffect: {
    blur: {
      light: '8px',
      medium: '12px',
    },
    saturation: '150%',
    // 玻璃效果强度
    intensity: {
      button: {
        normal: {
          lightReflex: 10,
          darkReflex: 12,
        },
        hovered: {
          lightReflex: 15,
          darkReflex: 15,
        },
      },
    },
  },
  
  // 布局配置
  layout: {
    // 固定元素位置
    fixedElements: {
      languageSwitcher: {
        top: '32px',
        position: 'center', // center | left | right
      },
      navigationButtons: {
        bottom: '32px',
        position: 'center',
      },
      backToTop: {
        bottom: '32px',
        right: '32px',
      },
      scrollIndicator: {
        bottom: '48px',
        position: 'center',
      },
    },
    // 响应式断点
    breakpoints: {
      mobile: '768px',
      tablet: '1024px',
      desktop: '1200px',
    },
  },
} as const;

// ===== 内容数据 - 统一管理所有文案 =====
export const CONTENT_DATA: ContentData = {
  zh: {
    title: '十方众声',
    subtitle: '声动十方',
    tagline: '跨境内容营销的未来',
    description: '业界唯一在北美和中国同时建立完整内容营销生态的MCN机构',
    stats: ['100+ KOL', '600+ 创作者', '30+ 城市'],
    features: [
      '跨境双向通道',
      '直联资源对接',
      '全链条生态闭环'
    ],
    metrics: [
      { value: '3.2x', label: '互动率提升' },
      { value: '45%', label: '获客成本降低' },
      { value: '825B', label: '市场价值' }
    ],
    contact: '开启合作',
    system: '数据系统',
    readyToStart: '准备好了吗？',
    // 新增：页脚文案
    footer: {
      copyright: '© 2024 Mega Volume Production Inc.',
    },
    // 新增：按钮提示文案
    tooltips: {
      backToTop: '返回内容顶部',
      languageSwitch: '切换语言',
    },
  },
  en: {
    title: 'MEGA VOLUME',
    subtitle: 'PRODUCTION',
    tagline: 'The Future of Cross-Border Content',
    description: 'The only MCN with complete ecosystems in both North America and China',
    stats: ['100+ KOLs', '600+ Creators', '30+ Cities'],
    features: [
      'Cross-Border Gateway',
      'Direct Resource Access',
      'Full-Chain Ecosystem'
    ],
    metrics: [
      { value: '3.2x', label: 'Engagement Boost' },
      { value: '45%', label: 'CAC Reduction' },
      { value: '825B', label: 'Market Value' }
    ],
    contact: 'Start Collaboration',
    system: 'Data System',
    readyToStart: 'Ready to Start?',
    footer: {
      copyright: '© 2024 Mega Volume Production Inc.',
    },
    tooltips: {
      backToTop: 'Back to Content Top',
      languageSwitch: 'Switch Language',
    },
  }
};

// ===== 滚动配置 =====
export const SCROLL_CONFIG = {
  animationDelay: 2.9, // 动画时长系数 - 大幅增加，让滚动更慢
  fadeOutThreshold: 0.95, // 遮罩开始淡出的滚动进度 - 延后淡出
  fadeOutDuration: 0.05,  // 遮罩淡出持续时间 - 更快的淡出
  // 可见性阈值
  visibility: {
    heroSection: 0.9,     // 英雄区块显示的滚动进度 - 延后显示
    navigationButtons: 0.8, // 导航按钮显示的滚动进度 - 延后显示
    backToTopButton: 0.8,  // 返回顶部按钮显示的滚动进度
  },
} as const;

// ===== 观察器配置 =====
export const OBSERVER_CONFIG = {
  root: null,
  rootMargin: '-20% 0px',
  threshold: 0.1,
} as const;

// ===== 导出所有配置的快捷方式 =====
export const CONFIG = {
  DESIGN_TOKENS,
  CONTENT_DATA,
  SCROLL_CONFIG,
  OBSERVER_CONFIG,
} as const;

// ===== 便捷的访问函数 =====
export const getContent = (language: 'zh' | 'en') => CONTENT_DATA[language];
export const getColors = () => DESIGN_TOKENS.colors;
export const getTypography = () => DESIGN_TOKENS.typography;
export const getSpacing = () => DESIGN_TOKENS.spacing;
export const getAnimation = () => DESIGN_TOKENS.animation;
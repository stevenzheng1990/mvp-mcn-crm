// Z:\MCN\mvp-mcn-crm\app\components\LandingPage\LandingPage.constants.ts
import { ContentData } from './LandingPage.types';

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
      primary: 'rgba(255, 255, 255, 0.95)',
      secondary: 'rgba(255, 255, 255, 0.7)',
      tertiary: 'rgba(255, 255, 255, 0.5)',
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

// 内容数据
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
    readyToStart: '准备好了吗？'
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
    readyToStart: 'Ready to Start?'
  }
};

// 滚动配置
export const SCROLL_CONFIG = {
  animationDelay: 1.3, // 延长动画时长系数
  fadeOutThreshold: 0.8,
  fadeOutDuration: 0.2,
  zoomScale: 25,
  rotationFactor: 2,
} as const;

// 观察器配置
export const OBSERVER_CONFIG = {
  root: null,
  rootMargin: '-20% 0px',
  threshold: 0.1,
} as const;
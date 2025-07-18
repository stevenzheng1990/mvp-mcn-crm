// Z:\MCN\mvp-mcn-crm\app\components\LandingPage\LandingPage.types.ts

export interface LandingPageProps {
  onNavigateToSystem: () => void;
}

export interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  inView?: boolean;
}

export interface MetricItem {
  value: string;
  label: string;
}

// 页脚类型
export interface FooterContent {
  copyright: string;
}

// 提示文案类型
export interface TooltipContent {
  backToTop: string;
  languageSwitch: string;
}

export interface ContentLanguage {
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  stats: string[];
  features: string[];
  metrics: MetricItem[];
  contact: string;
  system: string;
  readyToStart: string;
  footer: FooterContent;
  tooltips: TooltipContent;
}

export interface ContentData {
  zh: ContentLanguage;
  en: ContentLanguage;
}

export type Language = 'zh' | 'en';

export interface LanguageSwitcherProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  scrollProgress: number;
}

export interface NavigationBarProps {
  language: Language;
  content: ContentLanguage;
  scrollProgress: number;
  onNavigateToSystem: () => void;
}

export interface ScrollIndicatorProps {
  scrollProgress: number;
}

// 新的Logo遮罩层类型
export interface LogoMaskLayerProps {
  scrollProgress: number;
  maskOpacity: number;
}

export interface PageSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
  isVisible: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// 返回顶部按钮类型
export interface BackToTopButtonProps {
  scrollProgress: number;
  content: ContentLanguage;
}
// app/components/LandingPage/LandingPage.types.ts

export interface LandingPageProps {
  onNavigateToSystem: () => void;
}

export interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  inView?: boolean;
}

export interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  inView?: boolean;
}

export interface MetricItem {
  value: string;
  label: string;
}

// 英雄区块内容
export interface HeroContent {
  title: string;
  subtitle: string;
  tagline: string;
}

// 关于我们内容
export interface AboutContent {
  title: string;
  description: string[];
  stats: MetricItem[];
}

// 优势内容
export interface AdvantageItem {
  title: string;
  description: string;
  metric?: string;
}

export interface AdvantagesContent {
  title: string;
  items: AdvantageItem[];
}

// 创作者内容
export interface CreatorBenefit {
  title: string;
  description: string;
  highlight?: string;
}

export interface ForCreatorsContent {
  title: string;
  subtitle: string;
  benefits: CreatorBenefit[];
  testimonial: {
    quote: string;
    author: string;
  };
}

// 品牌服务内容
export interface BrandService {
  title: string;
  description: string;
  results?: string;
}

export interface ForBrandsContent {
  title: string;
  subtitle: string;
  services: BrandService[];
}

// 流程内容
export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface ProcessContent {
  title: string;
  steps: ProcessStep[];
}

// 结语内容
export interface ConclusionContent {
  title: string;
  message: string;
}

// CTA内容
export interface CTAContent {
  title: string;
  buttons: {
    brands: string;
    creators: string;
  };
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

// 增强版内容语言类型
export interface ContentLanguage {
  // 新增的分区内容
  hero: HeroContent;
  about: AboutContent;
  advantages: AdvantagesContent;
  forCreators: ForCreatorsContent;
  forBrands: ForBrandsContent;
  process: ProcessContent;
  conclusion: ConclusionContent;
  cta: CTAContent;
  
  // 原有内容（保持兼容）
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
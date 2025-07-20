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

export interface StatItem {
  value: string;
  label: string;
  subtitle: string;
}

// 内容结构定义
export interface HeroContent {
  title: string;
  subtitle: string;
  tagline: string;
}

export interface AboutContent {
  title: string;
  description: string[];
  stats: StatItem[];
}

export interface AdvantageItem {
  title: string;
  description: string;
  metric?: string;
}

export interface AdvantagesContent {
  title: string;
  items: AdvantageItem[];
}

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

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface ProcessContent {
  title: string;
  steps: ProcessStep[];
}

export interface ConclusionContent {
  title: string;
  message: string;
}

export interface CTAContent {
  title: string;
  buttons: {
    brands: string;
    creators: string;
  };
}

export interface FooterContent {
  copyright: string;
}

export interface TooltipContent {
  backToTop: string;
  languageSwitch: string;
}

// 完整语言内容结构
export interface ContentLanguage {
  hero: HeroContent;
  about: AboutContent;
  advantages: AdvantagesContent;
  forCreators: ForCreatorsContent;
  forBrands: ForBrandsContent;
  process: ProcessContent;
  conclusion: ConclusionContent;
  cta: CTAContent;
  
  // 保留原有字段以保持兼容性
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

// 组件Props定义
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

export interface BackToTopButtonProps {
  scrollProgress: number;
  content: ContentLanguage;
}
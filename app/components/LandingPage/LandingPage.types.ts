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

// 页脚类型
export interface FooterContent {
  copyright: string;
  address?: string;
  phone?: string;
}

// 提示文案类型
export interface TooltipContent {
  backToTop: string;
  languageSwitch: string;
}

// 核心能力项
export interface CoreCapabilityItem {
  value: string;
  label: string;
  description: string;
}

// 生态系统内容
export interface EcosystemContent {
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
}

// 平台内容
export interface PlatformsContent {
  title: string;
  subtitle: string;
  list: string[];
}

// 创作者服务项
export interface CreatorServiceItem {
  title: string;
  description: string;
  features: string[];
  icon: string;
}

// 创作者服务内容
export interface CreatorServicesContent {
  title: string;
  subtitle: string;
  services: CreatorServiceItem[];
}

// 解决方案项
export interface SolutionItem {
  title: string;
  description: string;
  highlights: string[];
}

// 解决方案内容
export interface SolutionsContent {
  title: string;
  subtitle: string;
  items: SolutionItem[];
}

// 行业内容
export interface IndustriesContent {
  title: string;
  subtitle: string;
  list: string[];
}

// 优势项
export interface AdvantageItem {
  title: string;
  description: string;
  icon: string;
}

// 优势内容
export interface AdvantagesContent {
  title: string;
  subtitle: string;
  items: AdvantageItem[];
}

// 案例统计项
export interface CaseStudyStat {
  value: string;
  label: string;
}

// 案例内容
export interface CaseStudiesContent {
  title: string;
  subtitle: string;
  description: string;
  stats: CaseStudyStat[];
}

// 流程步骤
export interface ProcessStep {
  title: string;
  description: string;
}

// 流程内容
export interface ProcessContent {
  title: string;
  subtitle: string;
  steps: ProcessStep[];
}

// 完整的语言内容
export interface ContentLanguage {
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  coreCapabilities: CoreCapabilityItem[];
  ecosystem: EcosystemContent;
  platforms: PlatformsContent;
  creatorServices: CreatorServicesContent;
  solutions: SolutionsContent;
  industries: IndustriesContent;
  advantages: AdvantagesContent;
  caseStudies: CaseStudiesContent;
  process: ProcessContent;
  readyToStart: string;
  contact: string;
  system: string;
  footer: FooterContent;
  tooltips: TooltipContent;
}

export interface ContentData {
  zh: ContentLanguage;
  en: ContentLanguage;
}

export type Language = 'zh' | 'en';

// 组件Props类型
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

export interface AnimatedNumberProps {
  value: string;
  delay?: number;
  duration?: number;
  inView?: boolean;
}

export interface ServiceCardProps {
  service: CreatorServiceItem;
  index: number;
  isVisible: boolean;
}

export interface AdvantageCardProps {
  item: AdvantageItem;
  index: number;
  isVisible: boolean;
}

export interface PlatformBadgeProps {
  platform: string;
  index: number;
  isVisible: boolean;
}

export interface IndustryTagProps {
  industry: string;
  index: number;
  isVisible: boolean;
}

export interface StatCardProps {
  stat: CoreCapabilityItem | CaseStudyStat;
  index: number;
  isVisible: boolean;
  large?: boolean;
}

export interface SolutionCardProps {
  solution: SolutionItem;
  index: number;
  isVisible: boolean;
}

export interface ProcessStepProps {
  step: ProcessStep;
  index: number;
  isVisible: boolean;
  totalSteps: number;
}

// 新增：视差揭示组件
export interface ParallaxRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}
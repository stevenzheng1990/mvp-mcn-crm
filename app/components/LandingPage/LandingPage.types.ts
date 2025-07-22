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

export interface CreatorGrowthData {
  label: string;
  value: number;
}

export interface CreatorGrowthContent {
  title: string;
  subtitle: string;
  metrics: {
    followerGrowth: string;
    engagementRate: string;
    viralPosts: string;
    interactionBoost: string;
  };
  data: {
    followers: CreatorGrowthData[];
    engagement: CreatorGrowthData[];
    avgViews: CreatorGrowthData[];
    monthlyIncome: CreatorGrowthData[];
  };
}

export interface ForCreatorsContent {
  title: string;
  subtitle: string;
  benefits: CreatorBenefit[];
  testimonial?: {
    quote: string;
    author: string;
  };
  creatorGrowth?: CreatorGrowthContent;
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

// 新增内容结构
export interface ContentTagsContent {
  title: string;
  subtitle: string;
  tags: string[];
}

export interface ChartLabels {
  before: string;
  month1: string;
  month2: string;
  month3: string;
  month4: string;
  month6: string;
  month8: string;
  month12: string;
}

export interface ChartSeries {
  mvp: string;
  industry: string;
  independent: string;
}

export interface ChartMetrics {
  brandAwareness: string;
  engagement: string;
  roi: string;
  conversion: string;
  retention: string;
  reputation: string;
}

export interface CreatorIncomeChart {
  title: string;
  subtitle: string;
  series: ChartSeries;
  timeLabels: ChartLabels;
}

export interface SatisfactionChart {
  title: string;
  subtitle: string;
  label: string;
}

export interface ComparisonChart {
  title: string;
  subtitle: string;
  series: Omit<ChartSeries, 'independent'>;
  metrics: ChartMetrics;
}

export interface ChartsContent {
  creatorIncome: CreatorIncomeChart;
  satisfaction: SatisfactionChart;
  comparison: ComparisonChart;
}

export interface PlatformRegion {
  title: string;
  platforms: string[];
}

export interface PlatformSummary {
  platforms: string;
  platformsLabel: string;
  successRate: string;
  successLabel: string;
  monitoring: string;
  monitoringLabel: string;
}

export interface PlatformsContent {
  title: string;
  subtitle: string;
  china: PlatformRegion;
  overseas: PlatformRegion;
  summary: PlatformSummary;
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
  contentTags: ContentTagsContent;
  charts: ChartsContent;
  platforms: PlatformsContent;
  
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

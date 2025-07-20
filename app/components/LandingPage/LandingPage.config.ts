// app/components/LandingPage/LandingPage.config.ts
import { ContentData } from './LandingPage.types';

// 设计令牌系统
export const DESIGN_TOKENS = {
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
      opacity: {
        button: 0,
        navigation: 12,
      },
    },
    footer: {
      text: 'rgba(80, 80, 80, 0.5)',
    },
  },
  
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
    component: {
      buttonGap: '16px',
      navigationPadding: '12px 24px',
    },
  },
  
  animation: {
    duration: {
      fast: '200ms',
      normal: '300ms',
      slow: '500ms',
      slower: '800ms',
      liquidTransition: '0.4s',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      liquid: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
    text: {
      baseDelay: 0,
      charDelay: 0.05,
      baseDuration: 0.8,
      charDurationIncrement: 0.05,
    },
  },
  
  glassEffect: {
    blur: {
      light: '7px',
      medium: '9px',
    },
    saturation: '210%',
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
  
  layout: {
    fixedElements: {
      languageSwitcher: {
        top: '32px',
        position: 'center',
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
    breakpoints: {
      mobile: '768px',
      tablet: '1024px',
      desktop: '1200px',
    },
  },
} as const;

// 内容数据
export const CONTENT_DATA: ContentData = {
  zh: {
    hero: {
      title: '十方众声',
      subtitle: '从十方而来，聚众声之势',
      tagline: '新一代内容营销生态构建者'
    },
    about: {
      title: '关于我们',
      description: [
        '在内容驱动商业增长的时代，十方众声凭借专业的内容营销能力和丰富的创作者资源，为品牌构建与消费者的深度连接。',
        '作为业界唯一在北美和中国同时建立完整生态的MCN机构，我们不仅是内容的生产者和传播者，更是品牌数字化转型的战略伙伴。'
      ],
      stats: [
        { value: '70+', label: '签约创作者', subtitle: '全平台覆盖' },
        { value: '600+', label: '合作达人', subtitle: '深度合作网络' },
        { value: '15+', label: '覆盖行业', subtitle: '多元化赛道' },
        { value: '2000万+', label: '覆盖粉丝数', subtitle: '精准触达用户' },
        { value: '8+', label: '投放平台', subtitle: '全渠道布局' },
        { value: '30+', label: '内容赛道', subtitle: '垂直领域专精' }
      ]
    },
    advantages: {
      title: '核心优势',
      items: [
        {
          title: '一手资源对接',
          description: '直接对接创作者，避免多层中介，提升沟通效率和内容质量',
          metric: '35%成本降低'
        },
        {
          title: '数据驱动决策',
          description: '实时追踪内容表现，28个核心指标分析，智能预警系统',
          metric: '3.2倍效果提升'
        },
        {
          title: '跨文化运营',
          description: '深度理解东西方市场，提供精准洞察和本地化解决方案',
          metric: '85%客户留存'
        }
      ]
    },
    forCreators: {
      title: '创作者赋能',
      subtitle: '共创价值，共享成长',
      benefits: [
        {
          title: '收益最大化',
          description: '平均月收入提升42%，单次合作报价5千-5万',
          highlight: '80%收益分成'
        },
        {
          title: '专业成长',
          description: '定期培训、免费设备、一对一指导、流量策略支持'
        },
        {
          title: '品质商务',
          description: '月均3-5个优质机会，92%创作者满意度，长期合作培养'
        }
      ],
      testimonial: {
        quote: '加入十方众声半年，我的粉丝从8万增长到18万，月收入从几千提升到5万+',
        author: '美妆博主 小艾'
      }
    },
    forBrands: {
      title: '品牌服务',
      subtitle: '精准触达，高效转化',
      services: [
        {
          title: '内容营销策略',
          description: '基于数据分析的定制化策略，目标受众精准定位',
          results: '品牌声量提升280%'
        },
        {
          title: '达人营销执行',
          description: '全流程服务，从创意到落地，确保内容质量和执行效果',
          results: '互动率6.8%（行业2.1%）'
        },
        {
          title: '程序化投放',
          description: '多平台广告优化，实时监控调整，ROI最大化',
          results: 'ROAS平均3.5:1'
        }
      ]
    },
    process: {
      title: '合作流程',
      steps: [
        {
          number: '01',
          title: '需求分析',
          description: '深入了解品牌定位和营销目标，制定个性化方案'
        },
        {
          number: '02',
          title: '策略制定',
          description: '基于数据洞察，设计内容矩阵和传播节奏'
        },
        {
          number: '03',
          title: '创作者匹配',
          description: '精准匹配适合的创作者，确保内容调性一致'
        },
        {
          number: '04',
          title: '内容创作',
          description: '专业团队全程把控，确保内容质量和品牌安全'
        },
        {
          number: '05',
          title: '数据优化',
          description: '实时监测效果，持续优化提升ROI'
        }
      ]
    },
    conclusion: {
      title: '携手共创',
      message: '在这个内容为王的时代，让我们一起用专业的能力和真诚的态度，让每一个声音都被听见。'
    },
    cta: {
      title: '齐聚十方众声，唱响无限可能',
      buttons: {
        brands: '品牌合作',
        creators: '创作者加入'
      }
    },
    title: '十方众声',
    subtitle: '从十方而来，聚众声之势',
    tagline: '一站式互联网营销机构',
    description: '业界唯一在北美和中国同时建立完整生态的MCN机构',
    stats: ['50+ KOL', '500+ 创作者', '30+ 城市'],
    features: [
      '多渠道全网覆盖',
      '直联达人资源对接',
      '官方投放全链条闭环'
    ],
    metrics: [
      { value: '3.2x', label: '互动率提升' },
      { value: '45%', label: '获客成本降低' },
      { value: '825B', label: '市场价值' }
    ],
    contact: '联系我们',
    system: '数据后台',
    readyToStart: '齐聚十方众声，唱响无限可能',
    footer: {
      copyright: '© 2024 Mega Volume Production Inc.',
    },
    tooltips: {
      backToTop: '返回内容顶部',
      languageSwitch: '切换语言',
    },
  },
  en: {
    hero: {
      title: 'MEGA VOLUME',
      subtitle: 'Amplifying Voices, Multiplying Impact',
      tagline: 'Next-Gen Content Marketing Ecosystem'
    },
    about: {
      title: 'About Us',
      description: [
        'In an era where authentic storytelling drives consumer decisions, Mega Volume Production stands at the forefront of content marketing evolution.',
        'As the only MCN agency with operational excellence in both North American and Asian markets, we craft campaigns that resonate across cultural boundaries.'
      ],
      stats: [
        { value: '70+', label: 'Exclusive Creators', subtitle: 'Cross-Platform Coverage' },
        { value: '600+', label: 'Partner Influencers', subtitle: 'Deep Collaboration Network' },
        { value: '15+', label: 'Industries Served', subtitle: 'Diversified Verticals' },
        { value: '20M+', label: 'Follower Reach', subtitle: 'Precision Audience Targeting' },
        { value: '8+', label: 'Media Platforms', subtitle: 'Omnichannel Strategy' },
        { value: '30+', label: 'Content Verticals', subtitle: 'Specialized Expertise' }
      ]
    },
    advantages: {
      title: 'Our Advantages',
      items: [
        {
          title: 'Direct Creator Network',
          description: 'Direct relationships ensure better communication and cost efficiency',
          metric: '35% Cost Reduction'
        },
        {
          title: 'Data-Driven Approach',
          description: 'Real-time analytics with 28 core metrics and smart alerts',
          metric: '3.2x Performance Boost'
        },
        {
          title: 'Cross-Cultural Expertise',
          description: 'Deep understanding of both Western and Asian markets',
          metric: '85% Client Retention'
        }
      ]
    },
    forCreators: {
      title: 'For Creators',
      subtitle: 'Your Growth Partner',
      benefits: [
        {
          title: 'Revenue Maximization',
          description: '45% average monthly income increase, $2.5K-$15K per campaign',
          highlight: '80/20 Creator Split'
        },
        {
          title: 'Professional Development',
          description: 'Monthly workshops, free equipment access, personal coaching'
        },
        {
          title: 'Quality Partnerships',
          description: '3-5 monthly opportunities, 92% creator satisfaction rate'
        }
      ],
      testimonial: {
        quote: 'Within 4 months, I\'ve completed 12 brand campaigns and grown from 50K to 120K followers',
        author: 'Fashion Creator'
      }
    },
    forBrands: {
      title: 'For Brands',
      subtitle: 'Strategic Content Marketing',
      services: [
        {
          title: 'Content Strategy',
          description: 'Data-driven strategies with precise audience targeting',
          results: '280% Brand Awareness Lift'
        },
        {
          title: 'Creator Campaigns',
          description: 'End-to-end campaign management with quality control',
          results: '6.8% Engagement (vs 2.1%)'
        },
        {
          title: 'Programmatic Media',
          description: 'Multi-platform optimization for maximum ROI',
          results: '3.5:1 Average ROAS'
        }
      ]
    },
    process: {
      title: 'How We Work',
      steps: [
        {
          number: '01',
          title: 'Discovery',
          description: 'Understanding your brand positioning and marketing objectives'
        },
        {
          number: '02',
          title: 'Strategy',
          description: 'Data-informed content matrix and distribution planning'
        },
        {
          number: '03',
          title: 'Matching',
          description: 'Precise creator selection for authentic brand alignment'
        },
        {
          number: '04',
          title: 'Creation',
          description: 'Professional oversight ensuring quality and brand safety'
        },
        {
          number: '05',
          title: 'Optimization',
          description: 'Real-time monitoring and continuous improvement'
        }
      ]
    },
    conclusion: {
      title: 'Let\'s Create Together',
      message: 'In a world where attention is currency and authenticity is paramount, let\'s amplify your voice and accelerate your success.'
    },
    cta: {
      title: 'Unite Voices, Unleash Possibilities',
      buttons: {
        brands: 'Brand Partnership',
        creators: 'Join as Creator'
      }
    },
    title: 'MEGA VOLUME',
    subtitle: 'Amplifying Voices, Multiplying Impact',
    tagline: 'Your Full-Service Digital Marketing Partner',
    description: 'The only MCN agency with complete ecosystems in both North America and China',
    stats: ['50+ Influencers', '500+ Creators', '30+ Cities'],
    features: [
      'Omnichannel Coverage',
      'Direct Creator Network',
      'End-to-End Campaign Management'
    ],
    metrics: [
      { value: '3.2x', label: 'Engagement Growth' },
      { value: '45%', label: 'Lower Acquisition Cost' },
      { value: '$825B', label: 'Market Reach' }
    ],
    contact: 'Get in Touch',
    system: 'Analytics Dashboard',
    readyToStart: 'Unite Voices, Unleash Possibilities',
    footer: {
      copyright: '© 2024 Mega Volume Production Inc.',
    },
    tooltips: {
      backToTop: 'Back to Content Top',
      languageSwitch: 'Switch Language',
    },
  }
};

// 滚动配置
export const SCROLL_CONFIG = {
  animationDelay: 3,
  fadeOutThreshold: 0.8,
  fadeOutDuration: 0.2,
  visibility: {
    navigationButtons: 0.8,
    backToTopButton: 0.8,
  },
} as const;

// 观察器配置
export const OBSERVER_CONFIG = {
  root: null,
  rootMargin: '20% 0px -20% 0px',
  threshold: 0.1,
} as const;

// 便捷访问函数
export const getContent = (language: 'zh' | 'en') => CONTENT_DATA[language];
export const getColors = () => DESIGN_TOKENS.colors;
export const getTypography = () => DESIGN_TOKENS.typography;
export const getSpacing = () => DESIGN_TOKENS.spacing;
export const getAnimation = () => DESIGN_TOKENS.animation;
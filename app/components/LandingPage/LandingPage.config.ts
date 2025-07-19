import { ContentData } from './LandingPage.types';

// ===== 设计令牌系统 =====
export const DESIGN_TOKENS = {
  // 字体系统
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Arial", sans-serif',
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 900,
    },
    fontSize: {
      hero: 'clamp(2.8rem, 8.4vw, 7rem)',
      subtitle: 'clamp(1.75rem, 5.6vw, 4.2rem)',
      heading: 'clamp(1.4rem, 3.5vw, 2.45rem)',
      subheading: 'clamp(1.1rem, 2.8vw, 1.96rem)',
      body: 'clamp(0.84rem, 1.75vw, 1.26rem)',
      small: 'clamp(0.7rem, 1.4vw, 0.84rem)',
      tiny: 'clamp(0.6rem, 1.2vw, 0.7rem)',
    },
    lineHeight: {
      tight: 0.9,
      normal: 1.2,
      relaxed: 1.3,
      loose: 1.5,
    },
    letterSpacing: '0.02em',
  },
  
  // 颜色系统 - 统一管理所有颜色
  colors: {
    text: {
      primary: 'rgba(80, 80, 80, 0.95)',      // 主要文字颜色
      secondary: 'rgba(80, 80, 80, 0.7)',     // 次要文字颜色
      tertiary: 'rgba(80, 80, 80, 0.5)',      // 第三级文字颜色
      accent: 'rgba(100, 100, 100, 0.9)',     // 强调色
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
        card: 8,          // 卡片背景透明度
        section: 5,       // 区块背景透明度
      },
    },
    // 页脚颜色
    footer: {
      text: 'rgba(80, 80, 80, 0.5)',
    },
    // 渐变色
    gradient: {
      primary: 'linear-gradient(135deg, rgba(120,120,120,0.1) 0%, rgba(200,200,200,0.05) 100%)',
      secondary: 'linear-gradient(135deg, rgba(150,150,150,0.08) 0%, rgba(100,100,100,0.03) 100%)',
    },
  },
  
  // 间距系统
  spacing: {
    section: {
      minHeight: '100vh',
      padding: '5vh 5vw',
      paddingMobile: '5vh 3vw',
    },
    gap: {
      hero: 'clamp(2rem, 4vh, 4rem)',
      content: 'clamp(3rem, 6vh, 6rem)',
      item: 'clamp(2rem, 4vh, 4rem)',
      small: 'clamp(1rem, 2vh, 2rem)',
      tiny: 'clamp(0.5rem, 1vh, 1rem)',
    },
    // 组件间距
    component: {
      buttonGap: '16px',
      navigationPadding: '12px 24px',
      cardPadding: '2rem',
      cardGap: '2rem',
    },
  },
  
  // 动画系统
  animation: {
    duration: {
      fast: '200ms',
      normal: '300ms',
      slow: '500ms',
      slower: '800ms',
      slowest: '1200ms',
      liquidTransition: '0.4s', // 液体感动画时长
      numberRoll: '2s', // 数字滚动动画
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      liquid: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // 液体感缓动
      smooth: 'cubic-bezier(0.45, 0, 0.55, 1)', // 平滑缓动
      elastic: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)', // 弹性缓动
    },
    // 文字动画配置
    text: {
      baseDelay: 0,
      charDelay: 0.05,
      baseDuration: 0.8,
      charDurationIncrement: 0.05,
    },
    // 交错动画配置
    stagger: {
      baseDelay: 0.1,
      increment: 0.08,
    },
  },
  
  // 玻璃效果
  glassEffect: {
    blur: {
      light: '8px',
      medium: '12px',
      heavy: '20px',
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
      card: {
        normal: {
          lightReflex: 8,
          darkReflex: 10,
        },
        hovered: {
          lightReflex: 12,
          darkReflex: 14,
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
    // 响应式断点
    breakpoints: {
      mobile: '768px',
      tablet: '1024px',
      desktop: '1200px',
      wide: '1600px',
    },
    // 网格系统
    grid: {
      columns: {
        mobile: 1,
        tablet: 2,
        desktop: 3,
        wide: 4,
      },
    },
  },
} as const;

// ===== 内容数据 - 统一管理所有文案 =====
export const CONTENT_DATA: ContentData = {
  zh: {
    title: '十方众声',
    subtitle: '从十方而来，聚众声之势',
    tagline: '新一代内容营销引领者',
    description: '在内容驱动商业增长的时代，十方众声凭借专业的内容营销能力和丰富的创作者资源，为品牌构建与消费者的深度连接。作为业界唯一在北美和中国同时建立完整生态的MCN机构，我们不仅是内容的生产者和传播者，更是品牌数字化转型的战略伙伴。',
    // 核心能力展示 - 整合原stats和metrics
    coreCapabilities: [
      { value: '70+', label: '签约达人', description: '深度合作的专业创作者' },
      { value: '600+', label: '合作创作者', description: '覆盖全领域的内容生态' },
      { value: '3.2x', label: '互动率提升', description: '远超行业平均水平' },
      { value: '45%', label: '获客成本降低', description: '精准投放优化效果' }
    ],
    // 创作者生态系统 - 充实内容
    ecosystem: {
      title: '构建创作者共赢生态',
      subtitle: '不只是MCN，更是创作者的事业合伙人',
      description: '我们深知每一位创作者都是独特的个体，拥有独特的创作风格和成长诉求。通过专业的运营能力、丰富的品牌资源和完善的服务体系，我们帮助创作者实现商业价值最大化，让创作成为可持续的事业。从内容策划到商业变现，从个人品牌建设到长期职业规划，我们提供全方位的成长支持。',
      highlights: [
        '平均月收入提升42%，单次合作报价5千-5万',
        '月均3-5个优质商务机会，长期合作率达80%',
        '专属团队一对一服务，24小时响应机制',
        '免费使用价值20万+专业设备和拍摄场地'
      ]
    },
    // 平台合作 - 精简展示
    platforms: {
      title: '全平台战略布局',
      subtitle: '官方认证，深度合作',
      list: [
        'TikTok Marketing Partner',
        'Meta Business Partner',
        'YouTube Content Partner',
        '抖音认证服务商',
        '小红书官方合作伙伴',
        'B站认证MCN机构'
      ]
    },
    // 创作者服务 - 使用图标系统
    creatorServices: {
      title: '四大核心服务体系',
      subtitle: '专业赋能，助力成长',
      services: [
        {
          title: '收益保障体系',
          description: '透明高效的商业化运营',
          features: ['80/20创作者优先分成', '月结月清快速到账', '多元化变现渠道'],
          icon: 'growth'
        },
        {
          title: '专业成长支持',
          description: '全方位能力提升计划',
          features: ['定期创作培训', '算法趋势解读', '一对一内容指导'],
          icon: 'support'
        },
        {
          title: '品牌资源对接',
          description: '精选优质商务合作',
          features: ['品牌精准匹配', '创意自主把控', '长期关系维护'],
          icon: 'brand'
        },
        {
          title: '专属服务团队',
          description: '360度全程护航',
          features: ['专属经纪人', '法务财务支持', '危机公关处理'],
          icon: 'team'
        }
      ]
    },
    // 服务方案 - 新增详细内容
    solutions: {
      title: '定制化营销解决方案',
      subtitle: '从策略到执行，全链路专业服务',
      items: [
        {
          title: '内容营销策略',
          description: '基于数据洞察和市场分析，我们为品牌制定精准的内容营销策略。从目标受众画像、竞品分析到内容矩阵规划，确保每一分投入都产生最大价值。',
          highlights: ['用户洞察分析', '内容策略规划', 'KPI体系设计']
        },
        {
          title: '达人营销执行',
          description: '凭借丰富的创作者资源和专业的执行能力，我们确保每个campaign都能达到预期效果。从创作者匹配到内容产出，全程把控质量。',
          highlights: ['精准达人匹配', '创意内容把控', '效果数据追踪']
        },
        {
          title: '整合传播管理',
          description: '多平台、多触点的整合传播策略，最大化品牌曝光和用户触达。结合付费推广和自然流量，实现品效合一。',
          highlights: ['全渠道投放', '流量优化', 'ROI持续提升']
        }
      ]
    },
    // 服务行业
    industries: {
      title: '深耕多元产业赛道',
      subtitle: '行业专家，懂你所需',
      list: [
        '消费品与零售',
        '美妆个护',
        '3C数码',
        '教育培训',
        '金融科技',
        '医疗健康',
        '文旅生活',
        '跨境电商'
      ]
    },
    // 差异化优势 - 使用新图标
    advantages: {
      title: '为什么选择十方众声',
      subtitle: '四大核心优势，创造卓越价值',
      items: [
        {
          title: '一手资源直连',
          description: '去除中间环节，直接对接创作者，确保沟通效率和执行质量',
          icon: 'direct'
        },
        {
          title: '数据驱动决策',
          description: '实时数据监测，AI智能分析，让每个决策都有据可依',
          icon: 'data'
        },
        {
          title: '双语文化通达',
          description: '深谙东西方文化差异，助力品牌跨境营销无障碍',
          icon: 'global'
        },
        {
          title: '全案整合服务',
          description: '从策略制定到执行落地，一站式解决方案省心高效',
          icon: 'service'
        }
      ]
    },
    // 成功案例数据
    caseStudies: {
      title: '实力见证成长',
      subtitle: '真实数据说话，效果看得见',
      description: '我们服务过的品牌平均实现了品牌声量280%的提升，用户互动率达到6.8%，远超行业平均水平2.1%。通过精准的内容策略和高效的执行，我们帮助客户实现了品牌价值的跨越式增长。',
      stats: [
        { value: '280%', label: '品牌声量提升' },
        { value: '6.8%', label: '平均互动率' },
        { value: '3.5:1', label: 'ROAS' },
        { value: '85%', label: '客户留存率' }
      ]
    },
    // 合作流程 - 新增
    process: {
      title: '专业服务流程',
      subtitle: '标准化流程，确保项目成功',
      steps: [
        { title: '需求洞察', description: '深入了解品牌需求和目标' },
        { title: '策略制定', description: '定制化营销策略方案' },
        { title: '资源匹配', description: '精准匹配创作者资源' },
        { title: '内容创作', description: '高质量内容生产' },
        { title: '投放执行', description: '多平台协同推广' },
        { title: '数据复盘', description: '效果分析与优化建议' }
      ]
    },
    // CTA
    readyToStart: '让每一个声音都被听见，让每一份创意都有价值',
    contact: '联系我们',
    system: '数据后台',
    // 页脚
    footer: {
      copyright: '© 2024 十方众声传媒 Mega Volume Production Inc.',
      address: '商务合作：info@mvpdata.net | 创作者合作：creators@mvpdata.net',
      phone: '热线：647-688-8118 | 办公：647-600-0655'
    },
    tooltips: {
      backToTop: '返回顶部',
      languageSwitch: '切换语言',
    },
  },
  en: {
    title: 'MEGA VOLUME',
    subtitle: 'Amplifying Voices, Creating Impact',
    tagline: 'Next-Gen Content Marketing Leader',
    description: 'In an era where content drives business growth, Mega Volume Production stands at the forefront with professional content marketing capabilities and extensive creator resources. As the only MCN agency with complete ecosystems in both North America and China, we are not just content producers and distributors, but strategic partners in brands\' digital transformation journey.',
    // Core Capabilities
    coreCapabilities: [
      { value: '70+', label: 'Exclusive Creators', description: 'Deep partnerships with professionals' },
      { value: '600+', label: 'Partner Creators', description: 'Full-spectrum content ecosystem' },
      { value: '3.2x', label: 'Engagement Boost', description: 'Far exceeding industry average' },
      { value: '45%', label: 'Lower CAC', description: 'Optimized targeting efficiency' }
    ],
    // Creator Ecosystem
    ecosystem: {
      title: 'Building Win-Win Creator Ecosystem',
      subtitle: 'Not just an MCN, but your business partner',
      description: 'We understand that every creator is unique, with distinct creative styles and growth aspirations. Through professional operations, rich brand resources, and comprehensive service systems, we help creators maximize their commercial value and turn creation into a sustainable career. From content planning to monetization, from personal branding to long-term career planning, we provide all-around growth support.',
      highlights: [
        '42% average monthly income increase, $800-$8000 per campaign',
        '3-5 quality opportunities monthly, 80% long-term partnership rate',
        'Dedicated team with 1-on-1 service, 24-hour response',
        'Free access to $30,000+ professional equipment and studios'
      ]
    },
    // Platform Partners
    platforms: {
      title: 'Full Platform Strategic Layout',
      subtitle: 'Official Certification, Deep Partnership',
      list: [
        'TikTok Marketing Partner',
        'Meta Business Partner',
        'YouTube Content Partner',
        'Douyin Certified Partner',
        'RED Official Partner',
        'Bilibili Certified MCN'
      ]
    },
    // Creator Services
    creatorServices: {
      title: 'Four Core Service Systems',
      subtitle: 'Professional Empowerment for Growth',
      services: [
        {
          title: 'Revenue Guarantee',
          description: 'Transparent and efficient monetization',
          features: ['80/20 creator-first split', 'Net-15 fast payment', 'Multiple revenue streams'],
          icon: 'growth'
        },
        {
          title: 'Professional Support',
          description: 'Comprehensive capability enhancement',
          features: ['Regular creative training', 'Algorithm trend insights', '1-on-1 content guidance'],
          icon: 'support'
        },
        {
          title: 'Brand Resources',
          description: 'Curated quality partnerships',
          features: ['Precise brand matching', 'Creative autonomy', 'Long-term relationship'],
          icon: 'brand'
        },
        {
          title: 'Dedicated Team',
          description: '360-degree full support',
          features: ['Personal manager', 'Legal & finance support', 'Crisis management'],
          icon: 'team'
        }
      ]
    },
    // Solutions
    solutions: {
      title: 'Customized Marketing Solutions',
      subtitle: 'From strategy to execution, full-service expertise',
      items: [
        {
          title: 'Content Marketing Strategy',
          description: 'Based on data insights and market analysis, we develop precise content marketing strategies for brands. From target audience profiling and competitive analysis to content matrix planning, we ensure maximum value from every investment.',
          highlights: ['User insight analysis', 'Content strategy planning', 'KPI system design']
        },
        {
          title: 'Influencer Marketing',
          description: 'With rich creator resources and professional execution capabilities, we ensure every campaign achieves expected results. From creator matching to content production, we control quality throughout.',
          highlights: ['Precise creator matching', 'Creative content control', 'Performance tracking']
        },
        {
          title: 'Integrated Communication',
          description: 'Multi-platform, multi-touchpoint integrated communication strategy maximizes brand exposure and user reach. Combining paid promotion with organic traffic for unified brand effectiveness.',
          highlights: ['Omnichannel distribution', 'Traffic optimization', 'Continuous ROI improvement']
        }
      ]
    },
    // Industries
    industries: {
      title: 'Deep Industry Expertise',
      subtitle: 'Industry Experts Who Understand Your Needs',
      list: [
        'Consumer & Retail',
        'Beauty & Personal Care',
        'Consumer Electronics',
        'Education & Training',
        'FinTech',
        'Healthcare',
        'Travel & Lifestyle',
        'Cross-border E-commerce'
      ]
    },
    // Advantages
    advantages: {
      title: 'Why Choose Mega Volume',
      subtitle: 'Four Core Advantages Creating Exceptional Value',
      items: [
        {
          title: 'Direct Resource Access',
          description: 'Eliminating intermediaries for direct creator connections ensuring efficiency and quality',
          icon: 'direct'
        },
        {
          title: 'Data-Driven Decisions',
          description: 'Real-time monitoring with AI analysis making every decision evidence-based',
          icon: 'data'
        },
        {
          title: 'Bilingual Cultural Fluency',
          description: 'Deep understanding of East-West cultural differences enabling seamless cross-border marketing',
          icon: 'global'
        },
        {
          title: 'Full-Service Integration',
          description: 'From strategy to execution, one-stop solutions for efficiency and peace of mind',
          icon: 'service'
        }
      ]
    },
    // Case Studies
    caseStudies: {
      title: 'Proven Track Record',
      subtitle: 'Real data speaks, visible results',
      description: 'Brands we\'ve served achieve an average 280% increase in brand awareness, with engagement rates reaching 6.8%, far exceeding the industry average of 2.1%. Through precise content strategies and efficient execution, we help clients achieve exponential brand value growth.',
      stats: [
        { value: '280%', label: 'Brand Awareness Lift' },
        { value: '6.8%', label: 'Average Engagement' },
        { value: '3.5:1', label: 'ROAS' },
        { value: '85%', label: 'Client Retention' }
      ]
    },
    // Process
    process: {
      title: 'Professional Service Process',
      subtitle: 'Standardized workflow ensuring project success',
      steps: [
        { title: 'Needs Analysis', description: 'Deep understanding of brand needs and goals' },
        { title: 'Strategy Development', description: 'Customized marketing strategy' },
        { title: 'Resource Matching', description: 'Precise creator resource allocation' },
        { title: 'Content Creation', description: 'High-quality content production' },
        { title: 'Campaign Execution', description: 'Multi-platform coordinated promotion' },
        { title: 'Data Review', description: 'Performance analysis and optimization' }
      ]
    },
    // CTA
    readyToStart: 'Let Every Voice Be Heard, Let Every Idea Create Value',
    contact: 'Get in Touch',
    system: 'Analytics Dashboard',
    // Footer
    footer: {
      copyright: '© 2024 Mega Volume Production Inc.',
      address: 'Business: info@mvpdata.net | Creators: creators@mvpdata.net',
      phone: 'Hotline: 647-688-8118 | Office: 647-600-0655'
    },
    tooltips: {
      backToTop: 'Back to Top',
      languageSwitch: 'Switch Language',
    },
  }
};

// ===== 滚动配置 =====
export const SCROLL_CONFIG = {
  animationDelay: 3,
  fadeOutThreshold: 0.8,
  fadeOutDuration: 0.2,
  visibility: {
    navigationButtons: 0.8,
    backToTopButton: 0.8,
  },
} as const;

// ===== 观察器配置 =====
export const OBSERVER_CONFIG = {
  root: null,
  rootMargin: '-20% 0px',
  threshold: 0.1,
} as const;

// ===== 导出配置 =====
export const CONFIG = {
  DESIGN_TOKENS,
  CONTENT_DATA,
  SCROLL_CONFIG,
  OBSERVER_CONFIG,
} as const;

// ===== 便捷函数 =====
export const getContent = (language: 'zh' | 'en') => CONTENT_DATA[language];
export const getColors = () => DESIGN_TOKENS.colors;
export const getTypography = () => DESIGN_TOKENS.typography;
export const getSpacing = () => DESIGN_TOKENS.spacing;
export const getAnimation = () => DESIGN_TOKENS.animation;
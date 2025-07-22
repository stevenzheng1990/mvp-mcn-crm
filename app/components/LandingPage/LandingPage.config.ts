// app/components/LandingPage/LandingPage.config.ts
import { ContentData } from './LandingPage.types';

// 设计令牌系统
export const DESIGN_TOKENS = {
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Arial", sans-serif',
    fontWeight: {
      light: 300,
      regular: 400,
      semibold: 600,  // 新增半粗体
      bold: 700,      // 调整粗体
      black: 900,     // 重命名原来的bold为black
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
    contentTags: {
      title: '内容垂类全覆盖',
      subtitle: '30+全领域专业赛道覆盖，保证您的声音精准触达理想目标受众。',
      tags: ['美妆护肤', '时尚穿搭', '生活方式', '美食探店', '科技数码', '旅行度假', '健身运动', '母婴亲子', '家居装修', '汽车评测', '教育培训', '宠物生活', '金融理财', '游戏娱乐', '艺术文化', '音乐舞蹈', '影视娱乐', '体育运动', '职场商务', '心理健康', '环保生活', '手工DIY', '摄影创作', '书籍阅读', '数字藏品', '元宇宙', '人工智能', '区块链', '新能源', '可持续发展']
    },
    charts: {
      creatorIncome: {
        title: '创作者收益增长对比分析',
        subtitle: '十方众声 vs 行业平均 vs 独立创作者收益轨迹',
        series: {
          mvp: '十方众声创作者',
          industry: '行业平均水平',
          independent: '独立创作者'
        },
        timeLabels: {
          before: '入驻前',
          month1: '第1月',
          month2: '第2月',
          month3: '第3月',
          month4: '第4月',
          month6: '第6月',
          month8: '第8月',
          month12: '第12月'
        }
      },
      satisfaction: {
        title: '客户满意度指标',
        subtitle: '基于200+品牌合作伙伴真实反馈',
        label: '综合满意度评分'
      },
      comparison: {
        title: '营销效果提升对比分析',
        subtitle: '十方众声 vs 行业平均水平 - 关键指标表现',
        series: {
          mvp: '十方众声',
          industry: '行业平均'
        },
        metrics: {
          brandAwareness: '品牌声量',
          engagement: '互动率',
          roi: 'ROI回报',
          conversion: '转化率',
          retention: '用户留存',
          reputation: '口碑指数'
        }
      }
    },
    platforms: {
      title: '全球投放平台生态',
      subtitle: '深度整合全球主流投放平台，一站式投流服务覆盖全渠道',
      china: {
        title: '中国市场',
        platforms: ['蒲公英', '巨量星图', '微博易', '小红书蒲公英', '视频号推广', '快手磁力引擎', 'B站花火', '知乎商业化']
      },
      overseas: {
        title: '海外市场',
        platforms: ['Facebook Ads', 'Google Ads', 'TikTok Ads', 'Instagram Ads', 'YouTube Ads', 'Twitter Ads', 'LinkedIn Ads', 'Snapchat Ads']
      },
      summary: {
        platforms: '16+',
        platformsLabel: '主流投放平台深度合作',
        successRate: '98%',
        successLabel: '投放成功率',
        monitoring: '24/7',
        monitoringLabel: '实时监控优化'
      }
    },
    about: {
      title: '聚势十方，声动全球',
      description: [
        '在这个注意力稀缺的时代，真正的价值不在于声音的大小，而在于共鸣的深度。十方众声作为业界唯一在北美和中国同时建立完整生态的MCN机构，用专业的内容营销能力和丰富的创作者资源，为品牌构建与消费者的深度连接。我们跨越太平洋两岸，连接东西方文化，让每个品牌都能找到属于自己的那群人，在全球化的内容营销浪潮中占得先机。'
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
          description: '平均月收入提升42%，单次合作报价5千-5万'
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
      creatorGrowth: {
        title: '创作者成长数据分析',
        subtitle: '基于60+签约创作者真实数据统计',
        metrics: {
          followerGrowth: '平均粉丝增长率',
          engagementRate: '平均赞藏比提升',
          viralPosts: '平均爆贴数量',
          interactionBoost: '平均互动率提升'
        },
        data: {
          followers: [
            { label: '入驻前', value: 8.2 },
            { label: '1月', value: 10.1 },
            { label: '2月', value: 12.8 },
            { label: '3月', value: 16.4 },
            { label: '4月', value: 20.7 },
            { label: '5月', value: 24.9 },
            { label: '6月', value: 29.8 },
            { label: '7月', value: 34.2 },
            { label: '8月', value: 38.2 },
            { label: '9月', value: 42.1 },
            { label: '10月', value: 45.6 },
            { label: '11月', value: 49.2 },
            { label: '12月', value: 52.3 },
            { label: '13月', value: 55.8 },
            { label: '14月', value: 58.9 },
            { label: '15月', value: 61.8 },
            { label: '16月', value: 64.2 },
            { label: '17月', value: 66.8 },
            { label: '18月', value: 68.9 },
            { label: '19月', value: 71.2 },
            { label: '20月', value: 73.8 },
            { label: '21月', value: 76.1 },
            { label: '22月', value: 78.9 },
            { label: '23月', value: 81.2 },
            { label: '24月', value: 84.6 }
          ],
          engagement: [
            { label: '入驻前', value: 2.8 },
            { label: '1月', value: 3.4 },
            { label: '2月', value: 4.2 },
            { label: '3月', value: 5.1 },
            { label: '4月', value: 6.3 },
            { label: '5月', value: 7.2 },
            { label: '6月', value: 8.5 },
            { label: '7月', value: 9.3 },
            { label: '8月', value: 10.2 },
            { label: '9月', value: 11.0 },
            { label: '10月', value: 11.8 },
            { label: '11月', value: 12.6 },
            { label: '12月', value: 13.4 },
            { label: '13月', value: 14.0 },
            { label: '14月', value: 14.6 },
            { label: '15月', value: 15.1 },
            { label: '16月', value: 15.7 },
            { label: '17月', value: 16.2 },
            { label: '18月', value: 16.7 },
            { label: '19月', value: 17.3 },
            { label: '20月', value: 17.8 },
            { label: '21月', value: 18.2 },
            { label: '22月', value: 18.7 },
            { label: '23月', value: 19.1 },
            { label: '24月', value: 19.6 }
          ],
          avgViews: [
            { label: '入驻前', value: 3.5 },
            { label: '1月', value: 5.2 },
            { label: '2月', value: 7.8 },
            { label: '3月', value: 10.6 },
            { label: '4月', value: 14.2 },
            { label: '5月', value: 18.5 },
            { label: '6月', value: 23.4 },
            { label: '7月', value: 28.1 },
            { label: '8月', value: 32.7 },
            { label: '9月', value: 37.9 },
            { label: '10月', value: 42.3 },
            { label: '11月', value: 47.2 },
            { label: '12月', value: 51.8 },
            { label: '13月', value: 56.4 },
            { label: '14月', value: 60.8 },
            { label: '15月', value: 65.2 },
            { label: '16月', value: 69.7 },
            { label: '17月', value: 73.9 },
            { label: '18月', value: 78.4 },
            { label: '19月', value: 82.6 },
            { label: '20月', value: 87.1 },
            { label: '21月', value: 91.3 },
            { label: '22月', value: 95.8 },
            { label: '23月', value: 99.7 },
            { label: '24月', value: 104.2 }
          ],
          monthlyIncome: [
            { label: '入驻前', value: 8.5 },
            { label: '1月', value: 12.3 },
            { label: '2月', value: 18.7 },
            { label: '3月', value: 26.4 },
            { label: '4月', value: 35.2 },
            { label: '5月', value: 42.8 },
            { label: '6月', value: 51.6 },
            { label: '7月', value: 58.9 },
            { label: '8月', value: 67.2 },
            { label: '9月', value: 74.8 },
            { label: '10月', value: 82.1 },
            { label: '11月', value: 89.7 },
            { label: '12月', value: 96.8 },
            { label: '13月', value: 103.4 },
            { label: '14月', value: 109.6 },
            { label: '15月', value: 115.2 },
            { label: '16月', value: 120.8 },
            { label: '17月', value: 126.1 },
            { label: '18月', value: 131.7 },
            { label: '19月', value: 136.9 },
            { label: '20月', value: 142.4 },
            { label: '21月', value: 147.5 },
            { label: '22月', value: 152.9 },
            { label: '23月', value: 157.8 },
            { label: '24月', value: 163.2 }
          ]
        }
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
    contentTags: {
      title: 'Complete Content Vertical Coverage',
      subtitle: '30+ specialized sectors for precise audience targeting',
      tags: ['Beauty & Skincare', 'Fashion & Style', 'Lifestyle', 'Food & Dining', 'Tech & Digital', 'Travel & Vacation', 'Fitness & Sports', 'Parenting & Family', 'Home & Decor', 'Automotive', 'Education & Training', 'Pets & Animals', 'Finance & Investment', 'Gaming & Entertainment', 'Arts & Culture', 'Music & Dance', 'Film & TV', 'Sports & Athletics', 'Business & Career', 'Mental Health', 'Sustainable Living', 'DIY & Crafts', 'Photography', 'Books & Reading', 'Digital Collectibles', 'Metaverse', 'Artificial Intelligence', 'Blockchain', 'Clean Energy', 'Sustainability']
    },
    charts: {
      creatorIncome: {
        title: 'Creator Revenue Growth Comparison',
        subtitle: 'Mega Volume vs Industry Average vs Independent Creators',
        series: {
          mvp: 'Mega Volume Creators',
          industry: 'Industry Average',
          independent: 'Independent Creators'
        },
        timeLabels: {
          before: 'Pre-Join',
          month1: 'Month 1',
          month2: 'Month 2',
          month3: 'Month 3',
          month4: 'Month 4',
          month6: 'Month 6',
          month8: 'Month 8',
          month12: 'Month 12'
        }
      },
      satisfaction: {
        title: 'Client Satisfaction Deep Analytics',
        subtitle: 'Multi-dimensional satisfaction evaluation based on quarterly reviews',
        label: 'Overall Satisfaction Score'
      },
      comparison: {
        title: 'Marketing Effectiveness Comprehensive Analysis',
        subtitle: 'Professional data science approach to performance measurement',
        series: {
          mvp: 'Mega Volume',
          industry: 'Industry Average'
        },
        metrics: {
          brandAwareness: 'Brand Awareness',
          engagement: 'Engagement Rate',
          roi: 'ROI Returns',
          conversion: 'Conversion Rate',
          retention: 'User Retention',
          reputation: 'Brand Reputation'
        }
      }
    },
    platforms: {
      title: 'Global Advertising Platform Ecosystem',
      subtitle: 'Deep integration with leading global platforms for comprehensive omnichannel advertising services',
      china: {
        title: 'China Market',
        platforms: ['Dandelion', 'Ocean Engine', 'Weibo Yi', 'Xiaohongshu Dandelion', 'WeChat Channels', 'Kuaishou Magnetic Engine', 'Bilibili Spark', 'Zhihu Commercial']
      },
      overseas: {
        title: 'Global Markets',
        platforms: ['Facebook Ads', 'Google Ads', 'TikTok Ads', 'Instagram Ads', 'YouTube Ads', 'Twitter Ads', 'LinkedIn Ads', 'Snapchat Ads']
      },
      summary: {
        platforms: '16+',
        platformsLabel: 'Leading Platform Partnerships',
        successRate: '98%',
        successLabel: 'Campaign Success Rate',
        monitoring: '24/7',
        monitoringLabel: 'Real-time Monitoring & Optimization'
      }
    },
    about: {
      title: 'Voices United, Impact Amplified',
      description: [
        'In this attention-scarce era, true value lies not in volume, but in the depth of connection. As the only MCN agency with operational excellence in both North American and Asian markets, Mega Volume Production leverages professional content marketing capabilities and rich creator resources to build deep connections between brands and consumers. We bridge continents and cultures, helping every brand find their tribe and gain the upper hand in the global content marketing revolution.'
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
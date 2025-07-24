// app/components/LandingPage/LandingPage.config.ts
import { ContentData } from './LandingPage.types';

// 设计令牌系统
export const DESIGN_TOKENS = {
  typography: {
    fontFamily: '"Outfit", "OPPO Sans", -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Arial", sans-serif',
    
    // 统一的字体规范系统 - 6种组合
    // 参考 Apple.com 和现代设计规范重新设计
    
    // Level 1: Hero和大型数字 - 最大最粗
    level1: {
      fontSize: 'clamp(3rem, 5vw, 4rem)',      // 保持 Hero 的视觉冲击力
      fontWeight: 900,                            // 略微降低，更现代
      lineHeight: 1.2,                           // 更紧凑的行高
      letterSpacing: '-0.01em',                   // 负字间距，更紧凑
      usage: 'Hero标题、结束字块、大型数字展示'
    },
    
    // Level 2: Section主标题 - 第二大第二粗
    level2: {
      fontSize: 'clamp(2.1rem, 3.25vw, 2.8rem)', 
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
      usage: 'Section主标题'
    },
    
    // Level 3: Section副标题和卡片标题 - 第三大
    level3: {
      fontSize: 'clamp(1.8rem, 3vw, 2.3rem)', 
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '0',
      usage: 'Section副标题、卡片标题、表格主标题'
    },
    
    // Level 4: Section正文 - 中等
    level4: {
      fontSize: 'clamp(0.95rem, 1.25vw, 1.2rem)', // 18px max (原 20px)
      fontWeight: 300,
      lineHeight: 1.5,                              // 提高行高保证可读性
      letterSpacing: '0',
      usage: '正文内容、段落文字'
    },
    
    // Level 5: 表格正文、导航菜单 - 较小
    level5: {
      fontSize: 'clamp(0.7rem, 0.9vw, 0.95rem)',        // 16px max (原 17.6px)
      fontWeight: 300,
      lineHeight: 1.5,
      letterSpacing: '0',
      usage: '表格内容、导航菜单、按钮文字'
    },
    
    // Level 6: 解释类文档、备注 - 最细最小
    level6: {
      fontSize: 'clamp(0.5rem, 0.75vw, 0.8rem)', // 14px max (原 15.2px)
      fontWeight: 300,                                // 提高到 400，保证可读性
      lineHeight: 1.5,
      letterSpacing: '0.01em',                        // 轻微增加字间距
      usage: '注释、备注、辅助说明文字'
    },
    
    // 保留原有letterSpacing
    letterSpacing: '0.02em',
  },
  
  colors: {
    text: {
      primary: 'rgba(80, 80, 80, 0.95)',
      secondary: 'rgba(80, 80, 80, 0.7)',
      tertiary: 'rgba(80, 80, 80, 0.5)',
    },
    brand: {
      primary: '#1e40af',
      secondary: '#7c3aed',
    },
    // 统一的组件配色方案
    component: {
      primary: 'rgb(76, 113, 224)',   // 蓝色
      secondary: '#6b7280',           // 黑灰色
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
      // 新增：统一的区块宽度
      maxWidth: {
        wide: '1400px',     // 宽幅内容（图表、数据展示）
        normal: '1200px',   // 标准内容
        narrow: '800px',    // 窄幅内容（结语、CTA）
      },
    },
    gap: {
      hero: 'clamp(2rem, 4vh, 4rem)',
      content: 'clamp(3rem, 6vh, 6rem)',
      item: 'clamp(2rem, 4vh, 4rem)',
      // 新增：统一的区块间隔
      largeSections: '17vh', // 大区块之间的间隔（如Hero到About）
      mediumSections: '13vh', // 中等区块之间的间隔
      smallSections: '9vh', // 小区块之间的间隔（如表格之间）
      subsections: '6rem', // 子区块之间的间隔
      elements: '4rem', // 元素之间的间隔
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
    navigation: {
      about: '关于我们',
      creators: '创作者服务', 
      brands: '品牌服务',
      process: '合作流程',
      system: '数据后台',
      contact: '联系我们'
    },
    hero: {
      title: '十方众声',
      subtitle: '从十方而来 聚众声之势',
      tagline: '新一代内容营销生态构建者'
    },
    contentTags: {
      title: '内容垂类全覆盖',
      subtitle: '30+全领域专业赛道覆盖\n保证您的声音精准触达理想目标受众',
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
      title: '全渠道投放资质\n专业交叉覆盖',
      subtitle: '拥有16+主流平台官方认证资质\n专业团队确保多渠道协同效应最大化',
      sections: [
        {
          title: '官方认证 实力保障',
          description: '作为各大平台官方认证服务商 我们拥有完整的投放资质和优先资源权限。不仅能单独操作各平台 更能实现多渠道智能协同 让您的品牌信息在不同平台间形成有效呼应。',
          points: [
            '全平台官方认证：抖音、小红书、B站等16+平台官方授权',
            '优先资源权限：享有平台方技术支持和流量扶持政策',
            '合规保障体系：严格遵循各平台规范，确保投放安全稳定'
          ]
        },
        {
          title: '专业团队 精准执行',
          description: '每个平台都有专门的运营团队 深度理解平台特性和用户行为 确保内容与渠道的完美匹配',
          advantages: [
            {
              title: '平台专家团队',
              desc: '每个渠道配备3年以上经验的专业投放师'
            },
            {
              title: '跨平台协同能力',
              desc: '统一策略下的差异化执行，实现1+1>2的效果'
            },
            {
              title: '算法洞察优势',
              desc: '实时掌握各平台算法变化，快速调整投放策略'
            },
            {
              title: '数据整合分析',
              desc: '多平台数据统一分析，优化整体投放效果'
            }
          ]
        },
        {
          title: '交叉覆盖策略',
          description: '基于用户行为路径设计多触点营销方案 实现品效合一',
          categories: [
            {
              name: '认知构建阶段',
              platforms: '知乎问答 + B站深度内容 + 小红书种草',
              feature: '多角度建立品牌认知，形成初步信任'
            },
            {
              name: '兴趣激发阶段',
              platforms: '抖音短视频 + 快手直播 + 微博话题',
              feature: '高频曝光激发兴趣，引导深度了解'
            },
            {
              name: '决策转化阶段',
              platforms: '视频号私域 + 淘宝直播 + 京东种草',
              feature: '临门一脚促进转化，完成购买闭环'
            }
          ]
        }
      ],
      stats: {
        title: '资质认证与投放实力',
        items: [
          { value: '16+', label: '官方认证平台', desc: '全渠道投放资质' },
          { value: '200+', label: '专业投放团队', desc: '平台专家配置' },
          { value: '5000+', label: '成功投放案例', desc: '跨平台协同经验' },
          { value: '99.8%', label: '投放稳定性', desc: '合规安全保障' }
        ]
      }
    },
    about: {
      title: '聚势十方 声动全球',
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
          description: '直接对接创作者 避免多层中介 提升沟通效率和内容质量',
          metric: '35%成本降低'
        },
        {
          title: '数据驱动决策',
          description: '实时追踪内容表现 28个核心指标分析 智能预警系统',
          metric: '3.2倍效果提升'
        },
        {
          title: '跨文化运营',
          description: '深度理解东西方市场 提供精准洞察和本地化解决方案',
          metric: '85%客户留存'
        }
      ]
    },
    forCreators: {
      title: '创作者赋能',
      subtitle: '共创价值 共享成长',
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
      subtitle: '精准触达 高效转化',
      services: [
        {
          title: '内容营销策略',
          description: '基于数据分析的定制化策略 目标受众精准定位',
          results: '品牌声量提升280%'
        },
        {
          title: '达人营销执行',
          description: '全流程服务 从创意到落地 确保内容质量和执行效果',
          results: '互动率6.8%（行业2.1%）'
        },
        {
          title: '程序化投放',
          description: '多平台广告优化 实时监控调整 ROI最大化',
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
      message: '在这个内容为王的时代 让我们一起用专业的能力和真诚的态度 让每一个声音都被听见。'
    },
    cta: {
      title: '齐聚十方众声\n唱响无限可能',
      buttons: {
        brands: '品牌合作',
        creators: '创作者加入'
      }
    },
    title: '十方众声',
    subtitle: '从十方而来 聚众声之势',
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
    footer: {
      copyright: '© 2024 Mega Volume Production Inc.',
    },
  },
  en: {
    navigation: {
      about: 'About Us',
      creators: 'Creator Services', 
      brands: 'Brand Services',
      process: 'Workflow',
      system: 'Dashboard',
      contact: 'Contact Us'
    },
    hero: {
      title: 'MEGA VOLUME',
      subtitle: 'Amplifying Voices\nMultiplying Impact',
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
      title: 'Omnichannel Certification\nProfessional Cross-Coverage',
      subtitle: 'Official certifications across 16+ major platforms with expert teams maximizing multi-channel synergy',
      sections: [
        {
          title: 'Official Certification\nProven Capability',
          description: 'As an officially certified partner across all major platforms we possess complete distribution credentials and priority resource access. Beyond individual platform expertise we excel at intelligent multi-channel orchestration for cohesive brand messaging.',
          points: [
            'Full Platform Certification: Official authorization from TikTok, RED, Bilibili and 16+ platforms',
            'Priority Resource Access: Technical support and traffic boost privileges from platform partners',
            'Compliance Assurance: Strict adherence to platform guidelines ensuring stable, secure campaigns'
          ]
        },
        {
          title: 'Expert Teams\nPrecision Execution',
          description: 'Dedicated specialist teams for each platform deeply understanding platform nuances and user behavior to ensure perfect content-channel alignment',
          advantages: [
            {
              title: 'Platform Specialists',
              desc: '3+ years experienced media buyers dedicated to each channel'
            },
            {
              title: 'Cross-Platform Synergy',
              desc: 'Unified strategy with differentiated execution for amplified results'
            },
            {
              title: 'Algorithm Expertise',
              desc: 'Real-time algorithm insights enabling rapid strategy adjustments'
            },
            {
              title: 'Integrated Analytics',
              desc: 'Multi-platform data consolidation for holistic optimization'
            }
          ]
        },
        {
          title: 'Cross-Coverage Strategy',
          description: 'Multi-touchpoint marketing designed around user journey\nfor unified brand and performance outcomes',
          categories: [
            {
              name: 'Awareness Building',
              platforms: 'Zhihu Q&A + Bilibili Deep Content + RED Seeding',
              feature: 'Multi-angle brand awareness building initial trust'
            },
            {
              name: 'Interest Generation',
              platforms: 'Douyin Short Videos + Kuaishou Live + Weibo Topics',
              feature: 'High-frequency exposure sparking interest and engagement'
            },
            {
              name: 'Conversion Phase',
              platforms: 'WeChat Private Domain + Taobao Live + JD Seeding',
              feature: 'Final push for conversion completing purchase journey'
            }
          ]
        }
      ],
      stats: {
        title: 'Certifications & Distribution Strength',
        items: [
          { value: '16+', label: 'Certified Platforms', desc: 'Full channel credentials' },
          { value: '200+', label: 'Media Specialists', desc: 'Platform expert allocation' },
          { value: '5000+', label: 'Successful Campaigns', desc: 'Cross-platform experience' },
          { value: '99.8%', label: 'Campaign Stability', desc: 'Compliance guarantee' }
        ]
      }
    },
    about: {
      title: 'Voices United\nImpact Amplified',
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
      title: 'Unite Voices\nUnleash Possibilities',
      buttons: {
        brands: 'Brand Partnership',
        creators: 'Join as Creator'
      }
    },
    title: 'MEGA VOLUME',
    subtitle: 'Amplifying Voices\nMultiplying Impact',
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
    footer: {
      copyright: '© 2024 Mega Volume Production Inc.',
    },
  }
};

// 滚动配置
export const SCROLL_CONFIG = {
  animationDelay: 3,
  fadeOutThreshold: 0.8,
  fadeOutDuration: 0.2,
  visibility: {},
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
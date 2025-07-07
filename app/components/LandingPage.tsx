'use client';

import React, { useEffect, useState } from 'react';
import { ChevronRight, Users, Globe, TrendingUp, Zap, Award, BarChart3, ArrowUp, Play, Star, Target, Briefcase } from 'lucide-react';
import AudioWaveAnimation from './AudioWaveAnimation';

interface LandingPageProps {
  onNavigateToSystem: () => void;
}

// =================== 配置参数区域 - 可自定义 ===================

const CONFIG = {
  // 🎨 颜色配置
  colors: {
    primary: {
      black: '#000000',
      white: '#ffffff',
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827'
      }
    },
    gradients: {
      gold: {
        primary: 'linear-gradient(135deg, #8B6845 0%, #A07B52 20%, #9C7848 40%, #765A3A 60%, #8B6845 80%, #A07B52 100%)',
        dark: 'linear-gradient(135deg, #765A3A 0%, #9C7848 40%, #A07B52 80%, #8B6845 100%)',
        size: {
          primary: '300% 300%',
          dark: '250% 250%'
        }
      },
      hero: 'linear-gradient(to right, #000000, #4b5563)',
      hover: {
        black: '#374151',
        gray: '#f3f4f6'
      }
    },
    shadow: {
      gold: 'rgba(139, 104, 69, 0.2)',
      goldDark: 'rgba(118, 88, 58, 0.18)'
    }
  },

  // 📝 字体配置
  typography: {
    families: {
      zh: "'PingFang SC', 'Noto Sans SC', 'SF Pro Text', system-ui, sans-serif",
      en: "'Inter', 'SF Pro Display', 'Segoe UI', system-ui, sans-serif"
    },
    sizes: {
      xs: 'text-xs',      // 12px
      sm: 'text-sm',      // 14px
      base: 'text-base',  // 16px
      lg: 'text-lg',      // 18px
      xl: 'text-xl',      // 20px
      '2xl': 'text-2xl',  // 24px
      '3xl': 'text-3xl',  // 30px
      '4xl': 'text-4xl',  // 36px
      '5xl': 'text-5xl',  // 48px
      '6xl': 'text-6xl',  // 60px
      '7xl': 'text-7xl'   // 72px
    },
    weights: {
      light: 'font-light',    // 300
      normal: 'font-normal',  // 400
      medium: 'font-medium',  // 500
      semibold: 'font-semibold', // 600
      bold: 'font-bold'       // 700
    },
    tracking: {
      tight: 'tracking-tight',
      wide: 'tracking-wide'
    },
    leading: {
      tight: 'leading-tight',
      snug: 'leading-snug',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
      loose: 'leading-loose'
    }
  },

  // 📏 间距配置
  spacing: {
    sections: {
      padding: 'py-24 px-6',
      hero: 'px-6 py-20',
      footer: 'py-16 px-6'
    },
    containers: {
      maxWidth: {
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        '7xl': 'max-w-7xl'
      },
      margin: 'mx-auto'
    },
    margins: {
      mb: {
        2: 'mb-2',
        3: 'mb-3',
        4: 'mb-4',
        6: 'mb-6',
        8: 'mb-8',
        10: 'mb-10',
        12: 'mb-12',
        16: 'mb-16',
        20: 'mb-20'
      },
      mt: {
        2: 'mt-2',
        3: 'mt-3',
        16: 'mt-16'
      }
    },
    padding: {
      p: {
        6: 'p-6',
        8: 'p-8'
      },
      px: {
        1: 'px-1',
        2: 'px-2',
        4: 'px-4',
        6: 'px-6',
        10: 'px-10'
      },
      py: {
        2: 'py-2',
        3: 'py-3',
        4: 'py-4',
        6: 'py-6',
        8: 'py-8'
      }
    },
    gaps: {
      2: 'gap-2',
      6: 'gap-6',
      8: 'gap-8',
      12: 'gap-12'
    }
  },

  // 🎯 布局配置
  layout: {
    grids: {
      cols: {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        'md-2': 'md:grid-cols-2',
        'md-3': 'md:grid-cols-3',
        'md-4': 'md:grid-cols-4',
        'md-6': 'md:grid-cols-6',
        'lg-3': 'lg:grid-cols-3',
        'lg-4': 'lg:grid-cols-4',
        'lg-6': 'lg:grid-cols-6'
      },
      justifyItems: 'justify-items-center'
    },
    flex: {
      center: 'flex items-center justify-center',
      col: 'flex flex-col',
      rowReverse: 'flex flex-col sm:flex-row'
    },
    positions: {
      relative: 'relative',
      absolute: 'absolute',
      fixed: 'fixed'
    }
  },

  // 🎭 动画配置
  animations: {
    durations: {
      fast: '0.3s',
      normal: '0.5s',
      slow: '1.4s',
      slower: '1.6s',
      slowest: '1.8s',
      shimmer: '12s',
      shimmerDark: '15s',
      float: '6s'
    },
    easings: {
      smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      elastic: 'cubic-bezier(0.23, 1, 0.32, 1)',
      standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
      custom: 'cubic-bezier(0.16, 1, 0.3, 1)'
    },
    delays: {
      base: '0s',
      short: '0.1s',
      medium: '0.15s',
      long: '0.2s'
    },
    transforms: {
      fadeIn: {
        from: 'translateY(12px)',
        to: 'translateY(0)'
      },
      gentleRise: {
        from: 'translateY(16px) scale(0.98)',
        to: 'translateY(0) scale(1)'
      },
      float: {
        from: 'translateY(0px)',
        mid: 'translateY(-8px)',
        to: 'translateY(0px)'
      },
      platformHover: 'translateY(-4px) scale(1.05)',
      scrollElement: 'translateY(20px)',
      hoverScale: {
        small: 'scale(1.05)',
        medium: 'scale(1.1)'
      }
    },
    filters: {
      blur: {
        light: 'blur(1px)',
        none: 'blur(0)'
      }
    }
  },

  // 🔘 组件尺寸配置
  components: {
    buttons: {
      sizes: {
        small: 'px-4 py-2',
        medium: 'px-6 py-3',
        large: 'px-10 py-4'
      },
      radius: {
        full: 'rounded-full',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl'
      }
    },
    cards: {
      radius: '2xl',
      padding: {
        small: 'p-6',
        large: 'p-8'
      },
      shadow: 'shadow-sm',
      border: 'border border-gray-100',
      hoverShadow: 'hover:shadow-md'
    },
    icons: {
      sizes: {
        small: 18,
        medium: 20,
        large: 24,
        xl: 32
      },
      containers: {
        small: 'w-12 h-12',
        medium: 'w-14 h-14',
        large: 'w-16 h-16',
        xl: 'w-20 h-20'
      }
    },
    platforms: {
      logo: {
        size: 'w-10 h-10',
        sizeLarge: 'w-12 h-12',
        container: 'w-16 h-16',
        containerLarge: 'w-20 h-20'
      }
    }
  },

  // 📍 定位配置
  positioning: {
    fixed: {
      languageToggle: 'fixed top-6 left-1/2 transform -translate-x-1/2 z-50',
      dataManagement: 'fixed bottom-8 right-8 z-50',
      scrollTop: 'fixed bottom-8 right-52 z-50'
    },
    absolute: {
      heroScroll: 'absolute bottom-8 left-1/2 transform -translate-x-1/2'
    },
    zIndexes: {
      50: 'z-50'
    }
  },

  // 🎚️ 过渡效果配置
  transitions: {
    all: 'transition-all',
    durations: {
      300: 'duration-300',
      500: 'duration-500'
    },
    properties: {
      transform: 'transition-transform'
    }
  },

  // 📊 滚动配置
  scroll: {
    trigger: {
      threshold: 0.75,
      minScroll: 1000
    },
    visibility: {
      opacity: {
        hidden: 0,
        visible: 1
      },
      transform: {
        hidden: 'translateY(20px)',
        visible: 'translateY(0)'
      },
      filter: {
        hidden: 'blur(1px)',
        visible: 'blur(0)'
      }
    },
    indicator: {
      size: 'w-5 h-8',
      innerSize: 'w-0.5 h-2',
      border: 'border border-black/20',
      radius: 'rounded-full',
      padding: 'p-0.5'
    }
  },

  // 🎯 响应式断点配置
  breakpoints: {
    screens: {
      md: 'md:',
      lg: 'lg:'
    }
  }
};

// =================== 配置参数区域结束 ===================

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToSystem }) => {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [scrollY, setScrollY] = useState(0);
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');

  // 社媒平台数据
  const socialPlatforms = [
    { name: 'TikTok', logo: 'https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg', color: '#000000' },
    { name: 'YouTube', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg', color: '#FF0000' },
    { name: 'Instagram', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png', color: '#E4405F' },
    { name: 'Facebook', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg', color: '#1877F2' },
    { name: '小红书', logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMjAiIGZpbGw9IiNGRjJEOTIiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIiBmaWxsPSJub25lIj4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDMwIDMwIiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTE1IDVMMjUgMTVIMTVWMjVMNSAxNUgxNVY1WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo8L3N2Zz4=', color: '#FF2D92' },
    { name: 'B站', logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMjAiIGZpbGw9IiMwMEE1RkYiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEwIDIwSDUwVjQwSDEwVjIwWk0yMCAzMEgzMFYzNUgyMFYzMFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4=', color: '#00A5FF' }
  ];

  // 文本内容
  const content = {
    zh: {
      hero: {
        title: "十方众声 声动十方",
        subtitle: "业界唯一在北美和中国同时建立完整内容营销生态的MCN机构",
        description: "100+签约KOL × 600+北美创作者 × 全平台官方授权 = 真正的跨境营销一站式解决方案"
      },
      advantages: {
        title: "达人资源+投放渠道 独家生态优势",
        subtitle: "完整生态的全站推广解决方案",
        items: [
          {
            title: "独家跨境双向通道",
            description: "业界唯一同时在北美和中国拥有深度运营资源的MCN机构，成功打破传统跨境营销的地域壁垒和文化隔阂",
            highlight: "业界唯一"
          },
          {
            title: "一手达人资源直采",
            description: "所有KOL合作均为直联资源对接，彻底避免传统多层代理模式带来的信息衰减和成本层层加码",
            highlight: "直联资源对接"
          },
          {
            title: "全链条生态闭环",
            description: "从商业洞察、策略制定、媒体投放到达人执行全链条整合，市场上唯一实现完整生态闭环的专业MCN",
            highlight: "全链条整合"
          }
        ]
      },
      creators: {
        title: "矩阵化达人资源 全域精准触达",
        subtitle: "超过100名深度孵化的签约KOL + 北美地区超过600名长期合作的优质达人",
        stats: [
          { number: "100+", label: "签约KOL", desc: "深度孵化签约达人" },
          { number: "600+", label: "合作创作者", desc: "北美长期合作伙伴" },
          { number: "30+", label: "核心城市", desc: "覆盖美加中主要市场" },
          { number: "$825B", label: "市场价值", desc: "北美亚裔消费力" }
        ]
      },
      platforms: {
        title: "全平台官方授权 受众精准覆盖",
        subtitle: "同时获得中外主流媒体平台官方认证的专业MCN机构",
        description: "拥有完整的程序化广告投放资质和专业的媒介采购能力，支持CPC、CPM、CPA等多种计费模式的精准投放"
      },
      services: {
        title: "专业化服务矩阵 全方位营销赋能",
        subtitle: "覆盖内容营销的完整价值链条，从达人孵化培养到商业化变现",
        items: [
          {
            title: "跨境市场进入",
            description: "为品牌提供专业的跨境营销策略咨询、合规管理和本土化执行服务",
            icon: Globe
          },
          {
            title: "KOL营销管理",
            description: "通过AI算法精准匹配最适合的KOL组合，确保内容质量和品牌调性完美契合",
            icon: Users
          },
          {
            title: "数据驱动优化",
            description: "实时监控内容表现数据和转化效果，通过数据回流不断优化投放策略",
            icon: BarChart3
          },
          {
            title: "内容创意策略",
            description: "基于大数据分析的市场洞察和用户行为分析，提供专业的内容营销策略",
            icon: Briefcase
          }
        ]
      },
      performance: {
        title: "数据驱动成果 ROI可衡量",
        subtitle: "通过专业数据分析系统，确保每一分营销预算都能产生最佳的投入产出比",
        stats: [
          { metric: "3.2x", label: "互动率提升", desc: "亚裔受众互动率" },
          { metric: "45%", label: "获客成本降低", desc: "帮助商家最大化营销收益" },
          { metric: "2.8x", label: "转化率提升", desc: "文化对齐传播" },
          { metric: "500+", label: "成功案例", desc: "累计Campaign数量" }
        ]
      },
      cta: {
        title: "开启您的全平台内容营销新篇章",
        subtitle: "无论您是希望通过海外KOL实现品牌出海，还是致力于深耕本地市场、扩大影响力",
        description: "我们都能为您量身定制最直接、最高效的达人营销解决方案",
        button: "立即合作咨询"
      }
    },
    en: {
      hero: {
        title: "Breaking Barriers Between East and West",
        subtitle: "The only MCN with complete content marketing ecosystems in both North America and China",
        description: "70+ Exclusive KOLs × 600+ NA Creators × Official Platform Authorization = True Cross-Border Marketing Solution"
      },
      advantages: {
        title: "Bi-Directional Marketing Excellence",
        subtitle: "Breaking traditional geographical and cultural barriers in cross-border marketing",
        items: [
          {
            title: "Exclusive Cross-Border Gateway",
            description: "The only MCN with deep operational resources in both North America and China, successfully breaking traditional cross-border marketing barriers",
            highlight: "only MCN"
          },
          {
            title: "Direct Creator Resources",
            description: "All KOL collaborations are first-hand resource connections, completely avoiding information loss and cost markup from traditional multi-layer agency models",
            highlight: "first-hand"
          },
          {
            title: "Full-Chain Ecosystem Loop",
            description: "Complete integration from business insights, strategy development, media placement to creator execution - the only professional MCN achieving full ecosystem closure",
            highlight: "complete integration"
          }
        ]
      },
      creators: {
        title: "Matrix Creator Resources with Precision Targeting",
        subtitle: "70+ deeply incubated signed KOLs + 600+ long-term North American quality creators",
        stats: [
          { number: "70+", label: "Signed KOLs", desc: "Deeply incubated creators" },
          { number: "600+", label: "Partner Creators", desc: "Long-term NA collaborators" },
          { number: "30+", label: "Core Cities", desc: "Covering major US-CA markets" },
          { number: "$825B", label: "Market Value", desc: "Asian diaspora purchasing power" }
        ]
      },
      platforms: {
        title: "Official Platform Authorization & Programmatic Empowerment",
        subtitle: "Professional MCN with official certifications from both Eastern and Western mainstream platforms",
        description: "Complete programmatic advertising placement qualifications and professional media procurement capabilities, supporting CPC, CPM, CPA and other billing models for precise targeting"
      },
      services: {
        title: "Professional Service Matrix for Comprehensive Marketing",
        subtitle: "Covering the complete value chain of content marketing, from creator incubation to commercial monetization",
        items: [
          {
            title: "Cross-Border Market Entry",
            description: "Professional cross-border marketing strategy consulting, compliance management and localized execution services",
            icon: Globe
          },
          {
            title: "KOL Marketing Management",
            description: "AI algorithm precise matching of optimal KOL combinations, ensuring perfect alignment of content quality and brand tone",
            icon: Users
          },
          {
            title: "Data-Driven Optimization",
            description: "Real-time monitoring of content performance data and conversion effects, continuous optimization through data feedback",
            icon: BarChart3
          },
          {
            title: "Creative Content Strategy",
            description: "Professional content marketing strategy based on big data analysis of market insights and user behavior",
            icon: Briefcase
          }
        ]
      },
      performance: {
        title: "Data-Driven Results with Measurable ROI",
        subtitle: "Through professional data analysis systems, ensuring every marketing dollar generates optimal return on investment",
        stats: [
          { metric: "3.2x", label: "Engagement Boost", desc: "Asian audience engagement" },
          { metric: "45%", label: "CAC Reduction", desc: "Asian consumer targeting" },
          { metric: "2.8x", label: "Conversion Lift", desc: "Culturally-aligned messaging" },
          { metric: "500+", label: "Success Cases", desc: "Total campaigns delivered" }
        ]
      },
      cta: {
        title: "Start Your Cross-Border Content Marketing Journey",
        subtitle: "Whether you're seeking brand expansion through overseas KOLs or targeting Asian markets with deeper penetration",
        description: "We customize the most direct and efficient creator marketing solutions for your unique needs",
        button: "Contact for Collaboration"
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      const elements = document.querySelectorAll('[data-animate]');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * CONFIG.scroll.trigger.threshold;
        const id = el.getAttribute('data-animate');
        
        if (id) {
          setIsVisible(prev => ({ ...prev, [id]: isVisible }));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  return (
    <div className="relative text-black overflow-hidden min-h-screen bg-white" 
         style={{ 
           fontFamily: language === 'zh' 
             ? CONFIG.typography.families.zh
             : CONFIG.typography.families.en
         }}>
      <style>{`
        /* 现代化高级动画 */
        @keyframes subtleFadeIn {
          0% { 
            opacity: 0; 
            transform: ${CONFIG.animations.transforms.fadeIn.from}; 
            filter: ${CONFIG.animations.filters.blur.light};
          }
          100% { 
            opacity: 1; 
            transform: ${CONFIG.animations.transforms.fadeIn.to}; 
            filter: ${CONFIG.animations.filters.blur.none};
          }
        }
        
        @keyframes gentleRise {
          0% { 
            opacity: 0; 
            transform: ${CONFIG.animations.transforms.gentleRise.from}; 
          }
          100% { 
            opacity: 1; 
            transform: ${CONFIG.animations.transforms.gentleRise.to}; 
          }
        }
        
        @keyframes elegantShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes floatAnimation {
          0%, 100% { transform: ${CONFIG.animations.transforms.float.from}; }
          50% { transform: ${CONFIG.animations.transforms.float.mid}; }
        }
        
        /* 现代动画类 */
        .modern-fade { 
          animation: subtleFadeIn ${CONFIG.animations.durations.slowest} ${CONFIG.animations.easings.smooth} forwards; 
        }
        .modern-rise { 
          animation: gentleRise ${CONFIG.animations.durations.slow} ${CONFIG.animations.easings.elastic} forwards; 
        }
        .float-animation {
          animation: floatAnimation ${CONFIG.animations.durations.float} ease-in-out infinite;
        }
        
        /* 深香槟金渐变 */
        .gold-gradient {
          background: ${CONFIG.colors.gradients.gold.primary};
          background-size: ${CONFIG.colors.gradients.gold.size.primary};
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: elegantShimmer ${CONFIG.animations.durations.shimmer} ease-in-out infinite;
          filter: drop-shadow(0 0.5px 1px ${CONFIG.colors.shadow.gold});
        }
        
        .gold-gradient-dark {
          background: ${CONFIG.colors.gradients.gold.dark};
          background-size: ${CONFIG.colors.gradients.gold.size.dark};
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: elegantShimmer ${CONFIG.animations.durations.shimmerDark} ease-in-out infinite;
          filter: drop-shadow(0 0.5px 1px ${CONFIG.colors.shadow.goldDark});
        }

        /* 高级滚动交互 */
        .scroll-element {
          opacity: ${CONFIG.scroll.visibility.opacity.hidden};
          transform: ${CONFIG.scroll.visibility.transform.hidden};
          filter: ${CONFIG.scroll.visibility.filter.hidden};
          transition: all ${CONFIG.animations.durations.slower} ${CONFIG.animations.easings.custom};
        }
        .scroll-element.visible {
          opacity: ${CONFIG.scroll.visibility.opacity.visible};
          transform: ${CONFIG.scroll.visibility.transform.visible};
          filter: ${CONFIG.scroll.visibility.filter.visible};
        }
        
        /* 现代字体权重 */
        .font-light { font-weight: 300; }
        .font-normal { font-weight: 400; }
        .font-medium { font-weight: 500; }
        .font-semibold { font-weight: 600; }
        .font-bold { font-weight: 700; }

        /* 自定义行高 - 解决中文字符截断问题 */
        .custom-title-height {
          line-height: 1.3 !important;
        }
        .platform-logo {
          transition: all ${CONFIG.animations.durations.fast} ${CONFIG.animations.easings.standard};
        }
        .platform-logo:hover {
          transform: ${CONFIG.animations.transforms.platformHover};
        }
      `}</style>

      {/* AudioWaveAnimation组件 */}
      <AudioWaveAnimation />

      {/* 语言切换按钮 */}
      <div className={CONFIG.positioning.fixed.languageToggle}>
        <button 
          onClick={toggleLanguage}
          className={`text-gray-500 hover:text-gray-700 ${CONFIG.transitions.all} ${CONFIG.transitions.durations[500]} ${CONFIG.typography.sizes.sm} ${CONFIG.typography.weights.light} ${CONFIG.typography.tracking.wide} hover:${CONFIG.animations.transforms.hoverScale.small} ${CONFIG.spacing.padding.px[4]} ${CONFIG.spacing.padding.py[2]}`}
        >
          {language === 'zh' ? '中' : 'En'} / {language === 'zh' ? 'En' : '中'}
        </button>
      </div>

      {/* Hero Section */}
      <section className={`${CONFIG.layout.positions.relative} min-h-screen ${CONFIG.layout.flex.center} ${CONFIG.spacing.sections.hero}`}>
        <div className={`${CONFIG.spacing.containers.maxWidth['5xl']} ${CONFIG.spacing.containers.margin} text-center`}>
          <div 
            data-animate="hero"
            className={`scroll-element ${isVisible.hero ? 'visible' : ''}`}
          >
            <h1 className={`${CONFIG.typography.sizes['4xl']} ${CONFIG.breakpoints.screens.md}${CONFIG.typography.sizes['6xl']} ${CONFIG.breakpoints.screens.lg}${CONFIG.typography.sizes['7xl']} ${CONFIG.typography.weights.bold} ${CONFIG.spacing.margins.mb[10]} ${CONFIG.spacing.padding.py[8]} bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent ${CONFIG.typography.tracking.tight} custom-title-height`}>
              {content[language].hero.title}
            </h1>
            <p className={`${CONFIG.typography.sizes.xl} ${CONFIG.breakpoints.screens.md}${CONFIG.typography.sizes['2xl']} text-gray-600 ${CONFIG.spacing.margins.mb[8]} ${CONFIG.typography.weights.light} ${CONFIG.typography.leading.relaxed} ${CONFIG.spacing.containers.maxWidth['4xl']} ${CONFIG.spacing.containers.margin}`}>
              {content[language].hero.subtitle}
            </p>
            <p className={`${CONFIG.typography.sizes.lg} text-gray-700 ${CONFIG.spacing.margins.mb[12]} ${CONFIG.typography.weights.light} ${CONFIG.typography.leading.relaxed} max-w-3xl ${CONFIG.spacing.containers.margin}`}>
              <span className={`gold-gradient ${CONFIG.typography.weights.medium}`}>
                {content[language].hero.description.split(' × ')[0]}
              </span>
              {' × '}
              <span className={`gold-gradient-dark ${CONFIG.typography.weights.medium}`}>
                {content[language].hero.description.split(' × ')[1]}
              </span>
              {' × '}
              <span className={`gold-gradient ${CONFIG.typography.weights.medium}`}>
                {content[language].hero.description.split(' × ')[2].split(' = ')[0]}
              </span>
              {' = '}
              <span className={`${CONFIG.typography.weights.semibold} text-black`}>
                {content[language].hero.description.split(' = ')[1]}
              </span>
            </p>
          </div>
        </div>
        
        <div className={`${CONFIG.positioning.absolute.heroScroll} animate-bounce`}>
          <div className={`${CONFIG.scroll.indicator.size} ${CONFIG.scroll.indicator.border} ${CONFIG.scroll.indicator.radius} ${CONFIG.scroll.indicator.padding}`}>
            <div className={`${CONFIG.scroll.indicator.innerSize} bg-black/30 ${CONFIG.scroll.indicator.radius} ${CONFIG.spacing.containers.margin} animate-pulse`} />
          </div>
        </div>
      </section>

      {/* 跨境双向优势 */}
      <section className={`${CONFIG.layout.positions.relative} ${CONFIG.spacing.sections.padding}`}>
        <div className={`${CONFIG.spacing.containers.maxWidth['7xl']} ${CONFIG.spacing.containers.margin}`}>
          <div 
            data-animate="advantages"
            className={`text-center ${CONFIG.spacing.margins.mb[20]} scroll-element ${isVisible.advantages ? 'visible' : ''}`}
          >
            <h2 className={`${CONFIG.typography.sizes['3xl']} ${CONFIG.breakpoints.screens.md}${CONFIG.typography.sizes['5xl']} ${CONFIG.typography.weights.bold} ${CONFIG.spacing.margins.mb[6]} text-black ${CONFIG.typography.tracking.tight} ${CONFIG.typography.leading.tight}`}>
              {content[language].advantages.title}
            </h2>
            <p className={`${CONFIG.typography.sizes.xl} text-gray-600 max-w-3xl ${CONFIG.spacing.containers.margin} ${CONFIG.typography.weights.light} ${CONFIG.typography.leading.relaxed}`}>
              {content[language].advantages.subtitle}
            </p>
          </div>

          <div className={`grid ${CONFIG.layout.grids.cols[1]} ${CONFIG.layout.grids.cols['lg-3']} ${CONFIG.spacing.gaps[12]}`}>
            {content[language].advantages.items.map((item, index) => (
              <div
                key={index}
                data-animate={`advantage-${index}`}
                className={`scroll-element bg-white ${CONFIG.components.cards.radius} ${CONFIG.components.cards.padding.large} ${CONFIG.components.cards.shadow} ${CONFIG.components.cards.border} ${CONFIG.components.cards.hoverShadow} ${CONFIG.transitions.all} ${CONFIG.transitions.durations[500]} ${
                  isVisible[`advantage-${index}`] ? 'visible' : ''
                }`}
                style={{ transitionDelay: `${index * parseFloat(CONFIG.animations.delays.long.replace('s', '')) * 1000}ms` }}
              >
                <div className={`${CONFIG.components.icons.containers.large} bg-gray-100 ${CONFIG.components.buttons.radius.xl} ${CONFIG.layout.flex.center} ${CONFIG.spacing.margins.mb[6]} float-animation`}>
                  {[Globe, Zap, TrendingUp][index] && 
                    React.createElement([Globe, Zap, TrendingUp][index], { 
                      size: CONFIG.components.icons.sizes.xl, 
                      className: "text-gray-600" 
                    })
                  }
                </div>
                <h3 className={`${CONFIG.typography.sizes.xl} ${CONFIG.typography.weights.semibold} text-black ${CONFIG.spacing.margins.mb[4]} ${CONFIG.typography.leading.snug}`}>
                  {item.title}
                </h3>
                <p className={`text-gray-700 ${CONFIG.typography.leading.relaxed} ${CONFIG.typography.weights.light}`}>
                  {item.description.includes(item.highlight) ? (
                    <>
                      {item.description.split(item.highlight)[0]}
                      <span className={`gold-gradient ${CONFIG.typography.weights.medium}`}>{item.highlight}</span>
                      {item.description.split(item.highlight)[1]}
                    </>
                  ) : (
                    item.description
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 达人资源矩阵 */}
      <section className={`${CONFIG.layout.positions.relative} ${CONFIG.spacing.sections.padding}`}>
        <div className={`${CONFIG.spacing.containers.maxWidth['7xl']} ${CONFIG.spacing.containers.margin}`}>
          <div 
            data-animate="creators"
            className={`text-center ${CONFIG.spacing.margins.mb[20]} scroll-element ${isVisible.creators ? 'visible' : ''}`}
          >
            <h2 className={`${CONFIG.typography.sizes['3xl']} ${CONFIG.breakpoints.screens.md}${CONFIG.typography.sizes['5xl']} ${CONFIG.typography.weights.bold} ${CONFIG.spacing.margins.mb[6]} text-black ${CONFIG.typography.tracking.tight} ${CONFIG.typography.leading.tight}`}>
              {content[language].creators.title}
            </h2>
            <p className={`${CONFIG.typography.sizes.xl} text-gray-600 ${CONFIG.spacing.containers.maxWidth['4xl']} ${CONFIG.spacing.containers.margin} ${CONFIG.typography.weights.light} ${CONFIG.typography.leading.relaxed}`}>
              {content[language].creators.subtitle}
            </p>
          </div>

          <div className={`grid ${CONFIG.layout.grids.cols[2]} ${CONFIG.layout.grids.cols['lg-4']} ${CONFIG.spacing.gaps[8]}`}>
            {content[language].creators.stats.map((stat, index) => (
              <div
                key={index}
                data-animate={`stat-${index}`}
                className={`text-center scroll-element ${isVisible[`stat-${index}`] ? 'visible' : ''}`}
                style={{ transitionDelay: `${index * parseFloat(CONFIG.animations.delays.medium.replace('s', '')) * 1000}ms` }}
              >
                <div className={`${CONFIG.typography.sizes['4xl']} ${CONFIG.breakpoints.screens.md}${CONFIG.typography.sizes['5xl']} ${CONFIG.typography.weights.bold} text-black ${CONFIG.spacing.margins.mb[3]}`}>
                  <span className="gold-gradient">{stat.number}</span>
                </div>
                <div className={`${CONFIG.typography.sizes.lg} ${CONFIG.typography.weights.semibold} text-gray-800 ${CONFIG.spacing.margins.mb[2]}`}>{stat.label}</div>
                <div className={`${CONFIG.typography.sizes.sm} text-gray-600 ${CONFIG.typography.weights.light}`}>{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 全平台官方授权 */}
      <section className={`${CONFIG.layout.positions.relative} ${CONFIG.spacing.sections.padding}`}>
        <div className={`${CONFIG.spacing.containers.maxWidth['7xl']} ${CONFIG.spacing.containers.margin}`}>
          <div 
            data-animate="platforms"
            className={`text-center ${CONFIG.spacing.margins.mb[16]} scroll-element ${isVisible.platforms ? 'visible' : ''}`}
          >
            <h2 className={`${CONFIG.typography.sizes['3xl']} ${CONFIG.breakpoints.screens.md}${CONFIG.typography.sizes['5xl']} ${CONFIG.typography.weights.bold} ${CONFIG.spacing.margins.mb[6]} text-black ${CONFIG.typography.tracking.tight} ${CONFIG.typography.leading.tight}`}>
              {content[language].platforms.title}
            </h2>
            <p className={`${CONFIG.typography.sizes.xl} text-gray-600 ${CONFIG.spacing.containers.maxWidth['4xl']} ${CONFIG.spacing.containers.margin} ${CONFIG.typography.weights.light} ${CONFIG.typography.leading.relaxed} ${CONFIG.spacing.margins.mb[8]}`}>
              {content[language].platforms.subtitle}
            </p>
            <p className={`${CONFIG.typography.sizes.lg} text-gray-700 max-w-5xl ${CONFIG.spacing.containers.margin} ${CONFIG.typography.weights.light} ${CONFIG.typography.leading.relaxed}`}>
              {content[language].platforms.description}
            </p>
          </div>

          {/* 社媒平台Logo展示 */}
          <div 
            data-animate="platform-logos"
            className={`scroll-element ${isVisible['platform-logos'] ? 'visible' : ''}`}
          >
            <div className={`grid ${CONFIG.layout.grids.cols[3]} ${CONFIG.layout.grids.cols['md-6']} ${CONFIG.spacing.gaps[8]} ${CONFIG.spacing.margins.mb[12]}`}>
              {socialPlatforms.map((platform, index) => (
                <div key={index} className={`${CONFIG.layout.flex.col} items-center group platform-logo`}>
                  <div className={`${CONFIG.components.icons.containers.large} bg-white ${CONFIG.components.cards.radius} ${CONFIG.layout.flex.center} ${CONFIG.components.cards.shadow} ${CONFIG.components.cards.border} group-hover:shadow-md ${CONFIG.transitions.all} ${CONFIG.transitions.durations[300]}`}>
                    <img 
                      src={platform.logo}
                      alt={platform.name}
                      className={`${CONFIG.components.platforms.logo.size} object-contain`}
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        // 备用fallback显示平台名称
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="${CONFIG.typography.sizes.xs} ${CONFIG.typography.weights.medium} text-gray-700">${platform.name}</span>`;
                        }
                      }}
                    />
                  </div>
                  <span className={`${CONFIG.typography.sizes.xs} text-gray-600 ${CONFIG.spacing.margins.mt[2]} ${CONFIG.typography.weights.medium}`}>{platform.name}</span>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className={`text-gray-600 ${CONFIG.typography.sizes.lg} ${CONFIG.typography.weights.light} ${CONFIG.spacing.margins.mb[12]}`}>
                <span className={`gold-gradient ${CONFIG.typography.weights.medium}`}>CPC、CPM、CPA</span>
                {language === 'zh' ? ' 全模式投放 | 广告预算直达平台，无中间商赚差价' : ' Full-Model Placement | Direct Budget Access, No Middleman Markup'}
              </p>
              
              {/* 投放平台官方logo */}
              <div className={CONFIG.spacing.margins.mt[16]}>
                <h3 className={`${CONFIG.typography.sizes.lg} ${CONFIG.typography.weights.semibold} text-gray-800 ${CONFIG.spacing.margins.mb[8]}`}>
                  {language === 'zh' ? '官方授权投放平台' : 'Officially Authorized Platforms'}
                </h3>
                
                {/* 国外平台 */}
                <div className={CONFIG.spacing.margins.mb[12]}>
                  <p className={`${CONFIG.typography.sizes.sm} text-gray-500 ${CONFIG.spacing.margins.mb[6]} ${CONFIG.typography.weights.medium}`}>
                    {language === 'zh' ? '海外平台官方认证' : 'International Platform Certifications'}
                  </p>
                  <div className={`grid ${CONFIG.layout.grids.cols[2]} ${CONFIG.layout.grids.cols['md-4']} ${CONFIG.spacing.gaps[8]} ${CONFIG.layout.grids.justifyItems}`}>
                    {[
                      { name: 'Meta Business', logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMjAiIGZpbGw9IiMxODc3RjIiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTMwIDVMMjUgMjBIMTBMMjAgMzBMMTUgNTBMMzAgNDBMNDUgNTBMNDAgMzBMNTAgMjBIMzVMMzAgNVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4=' },
                      { name: 'TikTok Creator', logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMjAiIGZpbGw9IiMwMDAwMDAiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTI1IDEwSDM1VjUwSDI1VjEwWk00MCAyMEg1MFY0MEg0MFYyMFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4=' },
                      { name: 'YouTube Connect', logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMjAiIGZpbGw9IiNGRjAwMDAiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEwIDIwSDUwVjQwSDEwVjIwWk0yMCAyNUwzNSAzMEwyMCAzNVYyNVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4=' },
                      { name: 'X Ads', logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMjAiIGZpbGw9IiMwMDAwMDAiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEwIDEwTDUwIDUwTTUwIDEwTDEwIDUwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjQiLz4KPC9zdmc+Cjwvc3ZnPgo8L3N2Zz4=' }
                    ].map((platform, index) => (
                      <div key={index} className={`${CONFIG.layout.flex.col} items-center group platform-logo`}>
                        <div className={`${CONFIG.components.icons.containers.xl} bg-white ${CONFIG.components.cards.radius} ${CONFIG.layout.flex.center} ${CONFIG.components.cards.shadow} ${CONFIG.components.cards.border} group-hover:shadow-md ${CONFIG.transitions.all} ${CONFIG.transitions.durations[300]}`}>
                          <img 
                            src={platform.logo}
                            alt={platform.name}
                            className={`${CONFIG.components.platforms.logo.sizeLarge} object-contain`}
                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<span class="${CONFIG.typography.sizes.xs} ${CONFIG.typography.weights.medium} text-gray-700 text-center ${CONFIG.spacing.padding.px[2]}">${platform.name}</span>`;
                              }
                            }}
                          />
                        </div>
                        <span className={`${CONFIG.typography.sizes.xs} text-gray-600 ${CONFIG.spacing.margins.mt[2]} ${CONFIG.typography.weights.medium} text-center`}>{platform.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 国内平台 */}
                <div>
                  <p className={`${CONFIG.typography.sizes.sm} text-gray-500 ${CONFIG.spacing.margins.mb[6]} ${CONFIG.typography.weights.medium}`}>
                    {language === 'zh' ? '国内平台官方服务商' : 'Domestic Platform Official Partners'}
                  </p>
                  <div className={`grid ${CONFIG.layout.grids.cols[2]} ${CONFIG.layout.grids.cols['md-3']} ${CONFIG.layout.grids.cols['lg-6']} ${CONFIG.spacing.gaps[6]} ${CONFIG.layout.grids.justifyItems}`}>
                    {[
                      { name: '巨量星图', logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMjAiIGZpbGw9IiMwMDAwMDAiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTMwIDVMMzUgMjBMNTAgMTVMNDAzMEw1NSAzNUw0MCA0NUw0NSA2MEwzMCA1MEwxNSA1NUwyNSAzNUwxMCAzMEwyNSAyMEwyMCA1TDMwIDVaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+' },
                      { name: '磁力聚星', logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMjAiIGZpbGw9IiNGRjZBMDAiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIiBmaWxsPSJub25lIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iNCIvPgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI2IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+' },
                      { name: '蒲公英', logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMjAiIGZpbGw9IiNGRjJEOTIiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIiBmaWxsPSJub25lIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNSIgZmlsbD0id2hpdGUiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMyIgZmlsbD0id2hpdGUiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSIyMCIgcj0iMyIgZmlsbD0id2hpdGUiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSI0MCIgcj0iMyIgZmlsbD0id2hpdGUiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMyIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo8L3N2Zz4=' },
                      { name: 'V任务', logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMjAiIGZpbGw9IiNGRjY2MDAiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEwIDEwTDMwIDUwTDUwIDEwSDEwWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo8L3N2Zz4=' },
                      { name: '花火', logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMjAiIGZpbGw9IiNGRjQ1MDAiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIiBmaWxsPSJub25lIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iOCIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTMwIDVWMjJNMzAgMzhWNTVNNTUgMzBIMzhNMjIgMzBINSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIi8+Cjwvc3ZnPgo8L3N2Zz4=' },
                      { name: '微任务', logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMjAiIGZpbGw9IiMwN0MxNjAiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIiBmaWxsPSJub25lIj4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSI4IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjMiLz4KPHBhdGggZD0iTTIwIDI1TDI1IDMwTDM1IDIwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiLz4KPC9zdmc+Cjwvc3ZnPgo8L3N2Zz4=' }
                    ].map((platform, index) => (
                      <div key={index} className={`${CONFIG.layout.flex.col} items-center group platform-logo`}>
                        <div className={`${CONFIG.components.icons.containers.large} bg-white ${CONFIG.components.cards.radius} ${CONFIG.layout.flex.center} ${CONFIG.components.cards.shadow} ${CONFIG.components.cards.border} group-hover:shadow-md ${CONFIG.transitions.all} ${CONFIG.transitions.durations[300]}`}>
                          <img 
                            src={platform.logo}
                            alt={platform.name}
                            className={`${CONFIG.components.platforms.logo.size} object-contain`}
                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<span class="${CONFIG.typography.sizes.xs} ${CONFIG.typography.weights.medium} text-gray-700 text-center ${CONFIG.spacing.padding.px[1]}">${platform.name}</span>`;
                              }
                            }}
                          />
                        </div>
                        <span className={`${CONFIG.typography.sizes.xs} text-gray-600 ${CONFIG.spacing.margins.mt[2]} ${CONFIG.typography.weights.medium} text-center`}>{platform.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 专业化服务矩阵 */}
      <section className={`${CONFIG.layout.positions.relative} ${CONFIG.spacing.sections.padding}`}>
        <div className={`${CONFIG.spacing.containers.maxWidth['7xl']} ${CONFIG.spacing.containers.margin}`}>
          <div 
            data-animate="services"
            className={`text-center ${CONFIG.spacing.margins.mb[20]} scroll-element ${isVisible.services ? 'visible' : ''}`}
          >
            <h2 className={`${CONFIG.typography.sizes['3xl']} ${CONFIG.breakpoints.screens.md}${CONFIG.typography.sizes['5xl']} ${CONFIG.typography.weights.bold} ${CONFIG.spacing.margins.mb[6]} text-black ${CONFIG.typography.tracking.tight} ${CONFIG.typography.leading.tight}`}>
              {content[language].services.title}
            </h2>
            <p className={`${CONFIG.typography.sizes.xl} text-gray-600 ${CONFIG.spacing.containers.maxWidth['4xl']} ${CONFIG.spacing.containers.margin} ${CONFIG.typography.weights.light} ${CONFIG.typography.leading.relaxed}`}>
              {content[language].services.subtitle}
            </p>
          </div>

          <div className={`grid ${CONFIG.layout.grids.cols[1]} ${CONFIG.layout.grids.cols['md-2']} ${CONFIG.layout.grids.cols['lg-4']} ${CONFIG.spacing.gaps[8]}`}>
            {content[language].services.items.map((service, index) => (
              <div
                key={index}
                data-animate={`service-${index}`}
                className={`scroll-element bg-white ${CONFIG.components.cards.radius} ${CONFIG.components.cards.padding.small} ${CONFIG.components.cards.shadow} ${CONFIG.components.cards.border} ${CONFIG.components.cards.hoverShadow} ${CONFIG.transitions.all} ${CONFIG.transitions.durations[500]} text-center ${
                  isVisible[`service-${index}`] ? 'visible' : ''
                }`}
                style={{ transitionDelay: `${index * parseFloat(CONFIG.animations.delays.short.replace('s', '')) * 1000}ms` }}
              >
                <div className={`${CONFIG.components.icons.containers.medium} bg-gray-100 ${CONFIG.components.buttons.radius.xl} ${CONFIG.layout.flex.center} ${CONFIG.spacing.margins.mb[4]} ${CONFIG.spacing.containers.margin}`}>
                  <service.icon size={CONFIG.components.icons.sizes.large} className="text-gray-600" />
                </div>
                <h3 className={`${CONFIG.typography.sizes.lg} ${CONFIG.typography.weights.semibold} text-black ${CONFIG.spacing.margins.mb[3]} ${CONFIG.typography.leading.snug}`}>
                  {service.title}
                </h3>
                <p className={`text-gray-700 ${CONFIG.typography.leading.relaxed} ${CONFIG.typography.weights.light} ${CONFIG.typography.sizes.sm}`}>
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 数据驱动成果 */}
      <section className={`${CONFIG.layout.positions.relative} ${CONFIG.spacing.sections.padding}`}>
        <div className={`${CONFIG.spacing.containers.maxWidth['7xl']} ${CONFIG.spacing.containers.margin}`}>
          <div 
            data-animate="performance"
            className={`text-center ${CONFIG.spacing.margins.mb[20]} scroll-element ${isVisible.performance ? 'visible' : ''}`}
          >
            <h2 className={`${CONFIG.typography.sizes['3xl']} ${CONFIG.breakpoints.screens.md}${CONFIG.typography.sizes['5xl']} ${CONFIG.typography.weights.bold} ${CONFIG.spacing.margins.mb[6]} text-black ${CONFIG.typography.tracking.tight} ${CONFIG.typography.leading.tight}`}>
              {content[language].performance.title}
            </h2>
            <p className={`${CONFIG.typography.sizes.xl} text-gray-600 ${CONFIG.spacing.containers.maxWidth['4xl']} ${CONFIG.spacing.containers.margin} ${CONFIG.typography.weights.light} ${CONFIG.typography.leading.relaxed}`}>
              {content[language].performance.subtitle}
            </p>
          </div>

          <div className={`grid ${CONFIG.layout.grids.cols[2]} ${CONFIG.layout.grids.cols['lg-4']} ${CONFIG.spacing.gaps[8]}`}>
            {content[language].performance.stats.map((stat, index) => (
              <div
                key={index}
                data-animate={`perf-${index}`}
                className={`text-center scroll-element bg-white ${CONFIG.components.cards.radius} ${CONFIG.components.cards.padding.small} ${CONFIG.components.cards.shadow} ${CONFIG.components.cards.border} ${
                  isVisible[`perf-${index}`] ? 'visible' : ''
                }`}
                style={{ transitionDelay: `${index * parseFloat(CONFIG.animations.delays.short.replace('s', '')) * 1000}ms` }}
              >
                <div className={`${CONFIG.typography.sizes['3xl']} ${CONFIG.breakpoints.screens.md}${CONFIG.typography.sizes['4xl']} ${CONFIG.typography.weights.bold} ${CONFIG.spacing.margins.mb[3]}`}>
                  <span className="gold-gradient">{stat.metric}</span>
                </div>
                <div className={`${CONFIG.typography.sizes.lg} ${CONFIG.typography.weights.semibold} text-gray-800 ${CONFIG.spacing.margins.mb[2]}`}>{stat.label}</div>
                <div className={`${CONFIG.typography.sizes.sm} text-gray-600 ${CONFIG.typography.weights.light}`}>{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA区域 */}
      <section className={`${CONFIG.layout.positions.relative} ${CONFIG.spacing.sections.padding}`}>
        <div className={`${CONFIG.spacing.containers.maxWidth['4xl']} ${CONFIG.spacing.containers.margin}`}>
          <div 
            data-animate="cta"
            className={`text-center scroll-element ${isVisible.cta ? 'visible' : ''}`}
          >
            <h2 className={`${CONFIG.typography.sizes['3xl']} ${CONFIG.breakpoints.screens.md}${CONFIG.typography.sizes['5xl']} ${CONFIG.typography.weights.bold} ${CONFIG.spacing.margins.mb[8]} text-black ${CONFIG.typography.tracking.tight} ${CONFIG.typography.leading.tight}`}>
              {content[language].cta.title}
            </h2>
            <p className={`${CONFIG.typography.sizes.xl} text-gray-600 ${CONFIG.spacing.margins.mb[6]} ${CONFIG.typography.leading.relaxed} ${CONFIG.typography.weights.light}`}>
              {content[language].cta.subtitle}
            </p>
            <p className={`${CONFIG.typography.sizes.lg} text-gray-700 ${CONFIG.spacing.margins.mb[12]} ${CONFIG.typography.leading.relaxed} ${CONFIG.typography.weights.light}`}>
              <span className={`gold-gradient-dark ${CONFIG.typography.weights.medium}`}>
                {content[language].cta.description}
              </span>
            </p>
            
            <div className={`${CONFIG.layout.flex.col} sm:${CONFIG.layout.flex.rowReverse} ${CONFIG.spacing.gaps[6]} justify-center`}>
              <button className={`group ${CONFIG.layout.positions.relative} ${CONFIG.components.buttons.sizes.large} bg-black text-white ${CONFIG.components.buttons.radius.full} ${CONFIG.typography.weights.medium} ${CONFIG.typography.sizes.lg} hover:${CONFIG.colors.gradients.hover.black} ${CONFIG.transitions.all} ${CONFIG.transitions.durations[500]} hover:${CONFIG.animations.transforms.hoverScale.small}`}>
                {content[language].cta.button}
                <ChevronRight size={CONFIG.components.icons.sizes.medium} className={`inline-block ml-2 group-hover:translate-x-1 ${CONFIG.transitions.properties.transform}`} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${CONFIG.layout.positions.relative} ${CONFIG.spacing.sections.footer} border-t border-gray-200`}>
        <div className={`${CONFIG.spacing.containers.maxWidth['7xl']} ${CONFIG.spacing.containers.margin}`}>
          <div className="text-center">
            <p className={`text-gray-600 ${CONFIG.typography.weights.light} ${CONFIG.typography.sizes.lg}`}>
              <span className={`gold-gradient ${CONFIG.typography.weights.medium}`}>
                {language === 'zh' ? '跨境内容营销解决方案提供商' : 'Cross-Border Content Marketing Solutions Provider'}
              </span>
            </p>
            <p className={`${CONFIG.typography.sizes.sm} ${CONFIG.spacing.margins.mt[3]} text-gray-500 ${CONFIG.typography.weights.light}`}>© 2024 Mega Volume Production Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* 数据管理入口按钮 - 固定在右下角 */}
      <button
        onClick={onNavigateToSystem}
        className={`${CONFIG.positioning.fixed.dataManagement} group ${CONFIG.components.buttons.sizes.medium} bg-gray-900 text-white ${CONFIG.components.buttons.radius.full} border border-gray-800 hover:bg-black ${CONFIG.transitions.all} ${CONFIG.transitions.durations[500]} backdrop-blur-sm hover:${CONFIG.animations.transforms.hoverScale.small}`}
      >
        <span className={`${CONFIG.layout.flex.center} ${CONFIG.spacing.gaps[2]} ${CONFIG.typography.weights.medium}`}>
          {language === 'zh' ? '数据管理系统' : 'Data Management'}
          <ChevronRight size={CONFIG.components.icons.sizes.small} className={`group-hover:translate-x-1 ${CONFIG.transitions.properties.transform} ${CONFIG.transitions.durations[300]}`} />
        </span>
      </button>

      {/* 回到顶部 */}
      {scrollY > CONFIG.scroll.trigger.minScroll && (
        <button
          onClick={scrollToTop}
          className={`${CONFIG.positioning.fixed.scrollTop} ${CONFIG.components.icons.containers.small} bg-gray-100 text-gray-700 ${CONFIG.components.buttons.radius.full} ${CONFIG.layout.flex.center} hover:${CONFIG.animations.transforms.hoverScale.medium} ${CONFIG.transitions.all} ${CONFIG.transitions.durations[500]} shadow-lg border border-gray-200`}
        >
          <ArrowUp size={CONFIG.components.icons.sizes.medium} />
        </button>
      )}
    </div>
  );
};

export default LandingPage;
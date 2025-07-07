'use client';

import React, { useEffect, useState } from 'react';
import { ChevronRight, Users, Globe, TrendingUp, Zap, Award, BarChart3, ArrowUp, Play, Star, Target, Briefcase } from 'lucide-react';
import AudioWaveAnimation from './AudioWaveAnimation';

interface LandingPageProps {
  onNavigateToSystem: () => void;
}

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
        title: "跨境内容营销新纪元",
        subtitle: "业界唯一在北美和中国同时建立完整内容营销生态系统的MCN机构",
        description: "70+签约KOL × 600+北美创作者 × 全平台官方授权 = 真正的跨境营销一站式解决方案"
      },
      advantages: {
        title: "跨境双向 独家生态优势",
        subtitle: "打破传统跨境营销的地域壁垒和文化隔阂",
        items: [
          {
            title: "独家跨境双向通道",
            description: "业界唯一同时在北美和中国拥有深度运营资源的MCN机构，成功打破传统跨境营销的地域壁垒和文化隔阂",
            highlight: "业界唯一"
          },
          {
            title: "一手达人资源直采",
            description: "所有KOL合作均为第一手资源对接，彻底避免传统多层代理模式带来的信息衰减和成本层层加码",
            highlight: "第一手"
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
        subtitle: "超过70名深度孵化的签约KOL + 北美地区超过600名长期合作的优质达人",
        stats: [
          { number: "70+", label: "签约KOL", desc: "深度孵化签约达人" },
          { number: "600+", label: "合作创作者", desc: "北美长期合作伙伴" },
          { number: "30+", label: "核心城市", desc: "覆盖美加主要市场" },
          { number: "$825B", label: "市场价值", desc: "北美亚裔消费力" }
        ]
      },
      platforms: {
        title: "全平台官方授权 程序化投放赋能",
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
          { metric: "45%", label: "获客成本降低", desc: "针对亚裔消费者" },
          { metric: "2.8x", label: "转化率提升", desc: "文化对齐传播" },
          { metric: "500+", label: "成功案例", desc: "累计campaign数量" }
        ]
      },
      cta: {
        title: "开启您的跨境内容营销新篇章",
        subtitle: "无论您是希望通过海外KOL实现品牌出海，还是致力于深耕华人市场、扩大亚洲影响力",
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
        const isVisible = rect.top < window.innerHeight * 0.75;
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
             ? "'PingFang SC', 'Noto Sans SC', 'SF Pro Text', system-ui, sans-serif" 
             : "'Inter', 'SF Pro Display', 'Segoe UI', system-ui, sans-serif"
         }}>
      <style>{`
        /* 现代化高级动画 */
        @keyframes subtleFadeIn {
          0% { 
            opacity: 0; 
            transform: translateY(12px); 
            filter: blur(1px);
          }
          100% { 
            opacity: 1; 
            transform: translateY(0); 
            filter: blur(0);
          }
        }
        
        @keyframes gentleRise {
          0% { 
            opacity: 0; 
            transform: translateY(16px) scale(0.98); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        @keyframes elegantShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes floatAnimation {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        /* 现代动画类 */
        .modern-fade { 
          animation: subtleFadeIn 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; 
        }
        .modern-rise { 
          animation: gentleRise 1.4s cubic-bezier(0.23, 1, 0.32, 1) forwards; 
        }
        .float-animation {
          animation: floatAnimation 6s ease-in-out infinite;
        }
        
        /* 深香槟金渐变 */
        .gold-gradient {
          background: linear-gradient(
            135deg,
            #8B6845 0%, #A07B52 20%, #9C7848 40%, #765A3A 60%,
            #8B6845 80%, #A07B52 100%
          );
          background-size: 300% 300%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: elegantShimmer 12s ease-in-out infinite;
          filter: drop-shadow(0 0.5px 1px rgba(139, 104, 69, 0.2));
        }
        
        .gold-gradient-dark {
          background: linear-gradient(
            135deg,
            #765A3A 0%, #9C7848 40%, #A07B52 80%, #8B6845 100%
          );
          background-size: 250% 250%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: elegantShimmer 15s ease-in-out infinite;
          filter: drop-shadow(0 0.5px 1px rgba(118, 88, 58, 0.18));
        }

        /* 高级滚动交互 */
        .scroll-element {
          opacity: 0;
          transform: translateY(20px);
          filter: blur(1px);
          transition: all 1.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .scroll-element.visible {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }
        
        /* 现代字体权重 */
        .font-light { font-weight: 300; }
        .font-normal { font-weight: 400; }
        .font-medium { font-weight: 500; }
        .font-semibold { font-weight: 600; }
        .font-bold { font-weight: 700; }

        /* 社媒平台logo动画 */
        .platform-logo {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .platform-logo:hover {
          transform: translateY(-4px) scale(1.05);
        }
      `}</style>

      {/* AudioWaveAnimation组件 */}
      <AudioWaveAnimation />

      {/* 语言切换按钮 */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <button 
          onClick={toggleLanguage}
          className="text-gray-500 hover:text-gray-700 transition-all duration-500 text-sm font-light tracking-wide hover:scale-105 px-4 py-2"
        >
          {language === 'zh' ? '中' : 'En'} / {language === 'zh' ? 'En' : '中'}
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <div 
            data-animate="hero"
            className={`scroll-element ${isVisible.hero ? 'visible' : ''}`}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent tracking-tight leading-tight">
              {content[language].hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 font-light leading-relaxed max-w-4xl mx-auto">
              {content[language].hero.subtitle}
            </p>
            <p className="text-lg text-gray-700 mb-12 font-light leading-relaxed max-w-3xl mx-auto">
              <span className="gold-gradient font-medium">
                {content[language].hero.description.split(' × ')[0]}
              </span>
              {' × '}
              <span className="gold-gradient-dark font-medium">
                {content[language].hero.description.split(' × ')[1]}
              </span>
              {' × '}
              <span className="gold-gradient font-medium">
                {content[language].hero.description.split(' × ')[2].split(' = ')[0]}
              </span>
              {' = '}
              <span className="font-semibold text-black">
                {content[language].hero.description.split(' = ')[1]}
              </span>
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-5 h-8 border border-black/20 rounded-full p-0.5">
            <div className="w-0.5 h-2 bg-black/30 rounded-full mx-auto animate-pulse" />
          </div>
        </div>
      </section>

      {/* 跨境双向优势 */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div 
            data-animate="advantages"
            className={`text-center mb-20 scroll-element ${isVisible.advantages ? 'visible' : ''}`}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-black tracking-tight leading-tight">
              {content[language].advantages.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              {content[language].advantages.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {content[language].advantages.items.map((item, index) => (
              <div
                key={index}
                data-animate={`advantage-${index}`}
                className={`scroll-element bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-500 ${
                  isVisible[`advantage-${index}`] ? 'visible' : ''
                }`}
                style={{ transitionDelay: `${index * 0.2}s` }}
              >
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-6 float-animation">
                  {[Globe, Zap, TrendingUp][index] && 
                    React.createElement([Globe, Zap, TrendingUp][index], { 
                      size: 32, 
                      className: "text-gray-600" 
                    })
                  }
                </div>
                <h3 className="text-xl font-semibold text-black mb-4 leading-snug">
                  {item.title}
                </h3>
                <p className="text-gray-700 leading-relaxed font-light">
                  {item.description.includes(item.highlight) ? (
                    <>
                      {item.description.split(item.highlight)[0]}
                      <span className="gold-gradient font-medium">{item.highlight}</span>
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
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div 
            data-animate="creators"
            className={`text-center mb-20 scroll-element ${isVisible.creators ? 'visible' : ''}`}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-black tracking-tight leading-tight">
              {content[language].creators.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
              {content[language].creators.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {content[language].creators.stats.map((stat, index) => (
              <div
                key={index}
                data-animate={`stat-${index}`}
                className={`text-center scroll-element ${isVisible[`stat-${index}`] ? 'visible' : ''}`}
                style={{ transitionDelay: `${index * 0.15}s` }}
              >
                <div className="text-4xl md:text-5xl font-bold text-black mb-3">
                  <span className="gold-gradient">{stat.number}</span>
                </div>
                <div className="text-lg font-semibold text-gray-800 mb-2">{stat.label}</div>
                <div className="text-sm text-gray-600 font-light">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 全平台官方授权 */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div 
            data-animate="platforms"
            className={`text-center mb-16 scroll-element ${isVisible.platforms ? 'visible' : ''}`}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-black tracking-tight leading-tight">
              {content[language].platforms.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed mb-8">
              {content[language].platforms.subtitle}
            </p>
            <p className="text-lg text-gray-700 max-w-5xl mx-auto font-light leading-relaxed">
              {content[language].platforms.description}
            </p>
          </div>

          {/* 社媒平台Logo展示 */}
          <div 
            data-animate="platform-logos"
            className={`scroll-element ${isVisible['platform-logos'] ? 'visible' : ''}`}
          >
            <div className="grid grid-cols-3 md:grid-cols-6 gap-8 mb-12">
              {socialPlatforms.map((platform, index) => (
                <div key={index} className="flex flex-col items-center group platform-logo">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300">
                    <img 
                      src={platform.logo}
                      alt={platform.name}
                      className="w-10 h-10 object-contain"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        // 备用fallback显示平台名称
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="text-xs font-medium text-gray-700">${platform.name}</span>`;
                        }
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 mt-2 font-medium">{platform.name}</span>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 text-lg font-light">
                <span className="gold-gradient font-medium">CPC、CPM、CPA</span>
                {language === 'zh' ? ' 全模式投放 | 广告预算直达平台，无中间商赚差价' : ' Full-Model Placement | Direct Budget Access, No Middleman Markup'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 专业化服务矩阵 */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div 
            data-animate="services"
            className={`text-center mb-20 scroll-element ${isVisible.services ? 'visible' : ''}`}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-black tracking-tight leading-tight">
              {content[language].services.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
              {content[language].services.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content[language].services.items.map((service, index) => (
              <div
                key={index}
                data-animate={`service-${index}`}
                className={`scroll-element bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-500 text-center ${
                  isVisible[`service-${index}`] ? 'visible' : ''
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <service.icon size={24} className="text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-3 leading-snug">
                  {service.title}
                </h3>
                <p className="text-gray-700 leading-relaxed font-light text-sm">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 数据驱动成果 */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div 
            data-animate="performance"
            className={`text-center mb-20 scroll-element ${isVisible.performance ? 'visible' : ''}`}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-black tracking-tight leading-tight">
              {content[language].performance.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
              {content[language].performance.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {content[language].performance.stats.map((stat, index) => (
              <div
                key={index}
                data-animate={`perf-${index}`}
                className={`text-center scroll-element bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${
                  isVisible[`perf-${index}`] ? 'visible' : ''
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl md:text-4xl font-bold mb-3">
                  <span className="gold-gradient">{stat.metric}</span>
                </div>
                <div className="text-lg font-semibold text-gray-800 mb-2">{stat.label}</div>
                <div className="text-sm text-gray-600 font-light">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA区域 */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div 
            data-animate="cta"
            className={`text-center scroll-element ${isVisible.cta ? 'visible' : ''}`}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-black tracking-tight leading-tight">
              {content[language].cta.title}
            </h2>
            <p className="text-xl text-gray-600 mb-6 leading-relaxed font-light">
              {content[language].cta.subtitle}
            </p>
            <p className="text-lg text-gray-700 mb-12 leading-relaxed font-light">
              <span className="gold-gradient-dark font-medium">
                {content[language].cta.description}
              </span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="group relative px-10 py-4 bg-black text-white rounded-full font-medium text-lg hover:bg-gray-800 transition-all duration-500 hover:scale-105">
                {content[language].cta.button}
                <ChevronRight size={20} className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-gray-600 font-light text-lg">
              <span className="gold-gradient font-medium">
                {language === 'zh' ? '跨境内容营销解决方案提供商' : 'Cross-Border Content Marketing Solutions Provider'}
              </span>
            </p>
            <p className="text-sm mt-3 text-gray-500 font-light">© 2024 Mega Volume Production Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* 数据管理入口按钮 - 固定在右下角 */}
      <button
        onClick={onNavigateToSystem}
        className="fixed bottom-8 right-8 z-50 group px-6 py-3 bg-gray-900 text-white rounded-full border border-gray-800 hover:bg-black transition-all duration-500 backdrop-blur-sm hover:scale-105"
      >
        <span className="flex items-center gap-2 font-medium">
          {language === 'zh' ? '数据管理系统' : 'Data Management'}
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
        </span>
      </button>

      {/* 回到顶部 */}
      {scrollY > 1000 && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-52 z-50 w-12 h-12 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-500 shadow-lg border border-gray-200"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default LandingPage;
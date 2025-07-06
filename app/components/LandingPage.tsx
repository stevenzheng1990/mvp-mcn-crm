// app/components/LandingPage.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { ChevronRight, Play, Users, Globe, TrendingUp, Zap, Award, BarChart3, ArrowUp } from 'lucide-react';
import AudioWaveAnimation from './AudioWaveAnimation'; // 导入声波动画组件

interface LandingPageProps {
  onNavigateToSystem: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToSystem }) => {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [scrollY, setScrollY] = useState(0);

  // 滚动监听
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      const elements = document.querySelectorAll('[data-animate]');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;
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

  return (
    <div className="relative bg-black text-white overflow-hidden" style={{ fontFamily: "'Helvetica Neue', 'Arial Black', system-ui, sans-serif" }}>
      <style>{`
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes textGlow {
          0%, 100% { 
            text-shadow: 
              0 0 10px rgba(245, 230, 211, 0.3),
              0 0 20px rgba(229, 212, 176, 0.2);
          }
          50% { 
            text-shadow: 
              0 0 20px rgba(245, 230, 211, 0.5),
              0 0 30px rgba(229, 212, 176, 0.3),
              0 0 40px rgba(201, 183, 139, 0.2);
          }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes goldShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-text-glow { animation: textGlow 3s ease-in-out infinite; }
        .animate-gradient { 
          background-size: 200% 200%;
          animation: gradientShift 4s ease-in-out infinite;
        }
        /* 高级香槟金渐变 */
        .gold-gradient {
          background: linear-gradient(
            135deg,
            #F5E6D3 0%,    /* 香槟色 */
            #E5D4B0 15%,   /* 淡香槟金 */
            #D4C5A0 30%,   /* 米金色 */
            #C9B78B 45%,   /* 深香槟金 */
            #BFA970 60%,   /* 古铜金 */
            #D4C5A0 75%,   /* 米金色 */
            #E5D4B0 90%,   /* 淡香槟金 */
            #F5E6D3 100%   /* 香槟色 */
          );
          background-size: 400% 400%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: goldShimmer 8s ease-in-out infinite;
          filter: drop-shadow(0 1px 2px rgba(201, 183, 139, 0.2));
        }
        /* 深香槟金变体 */
        .gold-gradient-dark {
          background: linear-gradient(
            135deg,
            #BFA970 0%,    /* 古铜金 */
            #D4C5A0 33%,   /* 米金色 */
            #E5D4B0 66%,   /* 淡香槟金 */
            #BFA970 100%   /* 古铜金 */
          );
          background-size: 400% 400%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: goldShimmer 10s ease-in-out infinite;
          filter: drop-shadow(0 1px 2px rgba(191, 169, 112, 0.15));
        }
        /* 亮香槟金变体 */
        .gold-gradient-light {
          background: linear-gradient(
            to right,
            #F5E6D3,       /* 香槟色 */
            #FAF0E6,       /* 亚麻色 */
            #FFF8DC,       /* 玉米丝色 */
            #F5E6D3,       /* 香槟色 */
            #EDE0C8        /* 珍珠色 */
          );
          background-size: 400% 400%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: goldShimmer 6s ease-in-out infinite;
          filter: drop-shadow(0 1px 1px rgba(245, 230, 211, 0.2));
        }
      `}</style>

      {/* 使用独立的声波动画组件 */}
      <AudioWaveAnimation />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-8">
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-5 h-8 border border-white/30 rounded-full p-0.5">
            <div className="w-0.5 h-2 bg-white/50 rounded-full mx-auto animate-pulse" />
          </div>
        </div>
      </section>

      {/* 核心优势 */}
      <section className="relative py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div 
            data-animate="advantages"
            className={`text-center mb-20 transition-all duration-1000 ${
              isVisible.advantages ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight">
              为什么选择我们
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
              <span className="gold-gradient font-medium">一手资源直采</span>
              +
              <span className="gold-gradient-dark font-medium">全链条服务</span>
              = 更低成本，更高转化
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: Globe, 
                title: "独家跨境双向通道", 
                description: "业界唯一同时在北美和中国拥有深度运营资源的MCN机构，直接避开中间商赚差价",
                highlight: "业界唯一"
              },
              { 
                icon: Users, 
                title: "70+签约KOL矩阵", 
                description: "深度孵化签约达人+600名北美长期合作伙伴，覆盖美加30个核心城市",
                highlight: "70+"
              },
              { 
                icon: Award, 
                title: "全平台官方认证", 
                description: "TikTok、YouTube、Instagram等主流平台官方合作伙伴，投放资质齐全",
                highlight: "官方认证"
              },
              { 
                icon: TrendingUp, 
                title: "策略到执行一站式", 
                description: "从市场洞察、KOL匹配到内容执行，全链条自主可控，效率更高",
                highlight: "全链条"
              },
              { 
                icon: Zap, 
                title: "一手达人资源", 
                description: "所有KOL合作均为直接对接，无中间环节，成本更低，执行更快",
                highlight: "一手"
              },
              { 
                icon: BarChart3, 
                title: "数据驱动优化", 
                description: "实时监控投放效果，AI算法优化达人匹配，确保每分预算都有最佳ROI",
                highlight: "数据驱动"
              }
            ].map((item, index) => (
              <div
                key={index}
                data-animate={`advantage-${index}`}
                className={`group relative p-10 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 text-center hover:scale-105 ${
                  isVisible[`advantage-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                }`}
              >
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <item.icon size={36} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-6 group-hover:scale-105 transition-transform duration-300">{item.title}</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {item.description.includes(item.highlight) ? (
                      <>
                        {item.description.split(item.highlight)[0]}
                        <span className="gold-gradient font-semibold">{item.highlight}</span>
                        {item.description.split(item.highlight)[1]}
                      </>
                    ) : (
                      item.description
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 平台展示 */}
      <section className="relative py-32 px-8 bg-gradient-to-b from-transparent to-black/30">
        <div className="max-w-7xl mx-auto">
          <div 
            data-animate="platforms"
            className={`text-center mb-20 transition-all duration-1000 ${
              isVisible.platforms ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight">
              官方认证投放资质
            </h2>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto font-light mb-16">
              <span className="gold-gradient font-semibold">TikTok、YouTube、Instagram</span>
              等主流平台官方合作伙伴 | 
              <span className="gold-gradient-dark font-semibold">巨量星图、蒲公英</span>
              等国内平台官方服务商
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-12 mb-16">
            {[
              'meta', 'tiktok', 'youtube', 'instagram', 'x', 'linkedin',
              'snapchat', 'facebook', 'bilibili', 'sinaweibo', 'taobao'
            ].map((platform, index) => (
              <div key={index} className="flex flex-col items-center group">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                  <img 
                    src={`https://cdn.simpleicons.org/${platform}/ffffff`}
                    alt={platform}
                    className="w-8 h-8"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-gray-400 text-lg">
              <span className="gold-gradient-light font-semibold">CPC、CPM、CPA</span>
              全模式投放 | 广告预算直达平台，无中间商赚差价
            </p>
          </div>
        </div>
      </section>

      {/* 数据展示 */}
      <section className="relative py-32 px-8 bg-gradient-to-b from-transparent to-black/50">
        <div className="max-w-7xl mx-auto">
          <div 
            data-animate="stats"
            className={`text-center mb-24 transition-all duration-1000 ${
              isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight">
              真实数据说话
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
              <span className="gold-gradient font-semibold">深度签约达人</span>
              +
              <span className="gold-gradient-dark font-semibold">北美合作网络</span>
              = 全覆盖资源矩阵
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { number: "70+", label: "深度签约KOL", subtitle: "专业孵化，稳定合作" },
              { number: "600+", label: "北美合作达人", subtitle: "一手资源，直接对接" },
              { number: "30+", label: "美加核心城市", subtitle: "本土化运营覆盖" },
              { number: "100%", label: "平台官方认证", subtitle: "投放资质完整齐全" }
            ].map((stat, index) => (
              <div
                key={index}
                data-animate={`stat-${index}`}
                className={`text-center transition-all duration-1000 group cursor-default ${
                  isVisible[`stat-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                }`}
              >
                <div className={`text-6xl md:text-7xl font-black ${index % 2 === 0 ? 'gold-gradient' : 'gold-gradient-dark'} mb-4 tracking-tighter group-hover:scale-110 transition-transform duration-300`}>
                  {stat.number}
                </div>
                <div className="text-xl font-bold text-white mb-2 group-hover:text-gray-200 transition-colors duration-300">{stat.label}</div>
                <div className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{stat.subtitle}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 px-8 bg-gradient-to-b from-transparent via-black/50 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            data-animate="cta"
            className={`transition-all duration-1000 ${
              isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-12 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent tracking-tight">
              开启您的
              <span className="gold-gradient">内容营销</span>
              新篇章
            </h2>
            <p className="text-xl text-gray-300 mb-16 leading-relaxed font-light">
              一手达人资源 × 全链条服务 × 官方投放资质 = 
              <span className="gold-gradient-dark font-semibold">更低成本，更高转化</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <button className="group relative px-12 py-4 bg-white/10 rounded-full text-white font-medium text-lg hover:bg-white/20 transition-all duration-300 border border-white/20 hover:scale-105">
                立即合作咨询
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-8 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-gray-400">
              <span className="gold-gradient-light font-semibold">跨境内容营销</span>
              解决方案提供商
            </p>
            <p className="text-sm mt-2 text-gray-500">© 2024 All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* 数据管理入口按钮 - 固定在右下角 */}
      <button
        onClick={onNavigateToSystem}
        className="fixed bottom-8 right-8 z-50 group px-6 py-3 bg-white/10 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur-sm hover:bg-white/20 hover:scale-105"
      >
        <span className="flex items-center gap-2 text-white font-medium">
          数据管理系统
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </span>
      </button>

      {/* 回到顶部 */}
      {scrollY > 1000 && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-48 z-50 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg border border-white/20"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default LandingPage;
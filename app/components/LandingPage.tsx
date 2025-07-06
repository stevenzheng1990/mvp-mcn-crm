// app/components/LandingPage.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight, Play, Users, Globe, TrendingUp, Zap, Award, BarChart3, ArrowUp } from 'lucide-react';

interface LandingPageProps {
  onNavigateToSystem: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToSystem }) => {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [scrollY, setScrollY] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // 频谱图动画 - 增强版
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      
      // 频谱图配置 - 更真实的音频频谱效果
      const barCount = Math.max(60, Math.floor(canvasWidth / 15));
      const barWidth = (canvasWidth / barCount) * 0.6; // 增加间距
      const spacing = canvasWidth / barCount;
      const maxBarHeight = canvasHeight * 0.35;
      const minBarHeight = 4;
      const centerY = canvasHeight / 2;
      
      // 绘制频谱图矩形 - 真实频谱特征
      for (let i = 0; i < barCount; i++) {
        const x = i * spacing + (spacing - barWidth) / 2;
        const barCenterX = x + barWidth / 2;
        
        // 计算鼠标影响 - 更自然的交互
        const distanceToMouse = Math.sqrt(Math.pow(barCenterX - mouseX, 2) + Math.pow(centerY - mouseY, 2));
        const mouseInfluence = Math.max(0, 150 - distanceToMouse) / 150;
        const smoothMouseInfluence = Math.pow(mouseInfluence, 1.5); // 更平滑的衰减
        
        // 模拟真实音频频谱特征
        const normalizedIndex = i / barCount; // 0-1之间的频率位置
        
        // 低频区域（左侧）- 更强的能量
        const lowFreqBoost = normalizedIndex < 0.2 ? (0.2 - normalizedIndex) * 2 : 0;
        
        // 中频区域（中间）- 适中能量
        const midFreqBoost = normalizedIndex > 0.2 && normalizedIndex < 0.7 ? 0.8 : 0;
        
        // 高频区域（右侧）- 较弱能量，更快衰减
        const highFreqDecay = normalizedIndex > 0.7 ? Math.pow(1 - normalizedIndex, 2) : 1;
        
        // 复杂波形组合 - 模拟多个频率成分
        const basePhase = i * 0.08;
        const lowWave = Math.sin(time * 0.006 + basePhase) * (0.7 + lowFreqBoost);
        const midWave = Math.sin(time * 0.009 + basePhase * 1.3) * (0.5 + midFreqBoost);
        const highWave = Math.sin(time * 0.012 + basePhase * 2.1) * (0.3 * highFreqDecay);
        const subWave = Math.sin(time * 0.004 + basePhase * 0.7) * 0.2;
        
        // 添加随机噪声模拟真实音频
        const noise = (Math.random() - 0.5) * 0.05;
        
        // 组合所有波形
        const combinedWave = lowWave + midWave + highWave + subWave + noise;
        const normalizedWave = Math.max(0, (combinedWave + 2) / 4); // 标准化到0-1，避免负值
        
        // 计算最终高度
        const baseHeight = minBarHeight + (maxBarHeight - minBarHeight) * normalizedWave;
        const mouseBoost = smoothMouseInfluence * maxBarHeight * 0.3;
        const finalHeight = Math.max(minBarHeight, baseHeight + mouseBoost);
        
        const barY = centerY - finalHeight / 2;
        
        // 透明度和颜色 - 增强空间感
        const intensity = normalizedWave + smoothMouseInfluence * 0.4;
        const baseOpacity = 0.08 + intensity * 0.15; // 降低基础透明度
        const opacity = Math.min(0.35, baseOpacity); // 最大透明度限制
        
        // 距离感效果 - 根据高度调整透明度
        const heightRatio = finalHeight / maxBarHeight;
        const depthOpacity = 0.15 + heightRatio * 0.2;
        const finalOpacity = Math.min(opacity, depthOpacity);
        
        // 灰白色调，增强空间层次
        const grayValue = Math.floor(60 + intensity * 140); // 60-200范围，降低亮度
        const color = `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${finalOpacity})`;
        
        // 绘制主体矩形
        ctx.fillStyle = color;
        ctx.fillRect(x, barY, barWidth, finalHeight);
        
        // 背景层效果 - 增强深度感
        if (finalHeight > minBarHeight * 2) {
          const bgOpacity = finalOpacity * 0.2; // 进一步降低背景层透明度
          ctx.fillStyle = `rgba(120, 120, 120, ${bgOpacity})`;
          ctx.fillRect(x - 1, barY + 2, barWidth + 2, finalHeight);
        }
        
        // 鼠标附近的微妙光效
        if (smoothMouseInfluence > 0.1) {
          const glowOpacity = smoothMouseInfluence * 0.05; // 大幅降低光效强度
          ctx.fillStyle = `rgba(200, 200, 200, ${glowOpacity})`;
          ctx.fillRect(x, barY, barWidth, finalHeight);
        }
        
        // 顶部反光效果 - 增强立体感但保持扁平
        if (intensity > 0.6 && finalHeight > minBarHeight * 3) {
          const highlightHeight = Math.max(1, finalHeight * 0.03);
          ctx.fillStyle = `rgba(255, 255, 255, ${(intensity - 0.6) * 0.08})`; // 进一步降低高光强度
          ctx.fillRect(x, barY, barWidth, highlightHeight);
        }
      }

      time += 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

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
          0%, 100% { text-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
          50% { text-shadow: 0 0 20px rgba(59, 130, 246, 0.6), 0 0 30px rgba(59, 130, 246, 0.4); }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-text-glow { animation: textGlow 3s ease-in-out infinite; }
        .animate-gradient { 
          background-size: 200% 200%;
          animation: gradientShift 4s ease-in-out infinite;
        }
      `}</style>

      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 opacity-30"
        style={{ 
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #0a0a0a 100%)',
          width: '100%',
          height: '100%'
        }}
      />

      {/* 导航 */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/mvplogo.png" alt="十方众声 MCN" className="h-12 w-auto filter brightness-0 invert" />
              <div>
                <h1 className="text-xl font-bold text-white">十方众声 MCN</h1>
                <p className="text-sm text-gray-400">Mega Volume Production</p>
              </div>
            </div>
            
            <button
              onClick={onNavigateToSystem}
              className="group relative px-8 py-3 bg-white/5 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur-sm hover:bg-white/10"
            >
              <span className="relative z-10 flex items-center gap-2 text-white font-medium">
                数据管理系统
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-8">
        <div 
          className="text-center max-w-6xl mx-auto"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          <h1 className="text-8xl md:text-9xl lg:text-[10rem] font-black mb-8 leading-none tracking-tighter animate-text-glow">
            <span className="block bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">十方</span>
            <span className="block bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">众声</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-16 leading-relaxed font-light">
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent font-medium animate-gradient">业界唯一</span>
            在北美和中国同时拥有完整达人资源的
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent font-medium animate-gradient">专业MCN机构</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <button className="group relative px-12 py-4 bg-white/10 rounded-full text-white font-medium text-lg hover:bg-white/20 transition-all duration-300 border border-white/20">
              <span className="relative z-10 flex items-center gap-3">
                <Play size={20} fill="currentColor" />
                开启合作
              </span>
            </button>
            
            <div className="text-center group cursor-default">
              <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">70+</div>
              <div className="text-gray-400 text-lg">签约KOL</div>
            </div>
            
            <div className="text-center group cursor-default">
              <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">600+</div>
              <div className="text-gray-400 text-lg">合作达人</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full p-1">
            <div className="w-1 h-3 bg-white/60 rounded-full mx-auto animate-pulse" />
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
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent font-medium animate-gradient">一手资源直采</span>
              +
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent font-medium animate-gradient">全链条服务</span>
              = 更低成本，更高转化
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: Globe, 
                title: "独家跨境双向通道", 
                description: "业界唯一同时在北美和中国拥有深度运营资源的MCN机构，直接避开中间商赚差价",
                highlight: "业界唯一",
                color: "from-blue-400 to-cyan-600"
              },
              { 
                icon: Users, 
                title: "70+签约KOL矩阵", 
                description: "深度孵化签约达人+600名北美长期合作伙伴，覆盖美加30个核心城市",
                highlight: "70+",
                color: "from-purple-400 to-pink-600"
              },
              { 
                icon: Award, 
                title: "全平台官方认证", 
                description: "TikTok、YouTube、Instagram等主流平台官方合作伙伴，投放资质齐全",
                highlight: "官方认证",
                color: "from-orange-400 to-red-600"
              },
              { 
                icon: TrendingUp, 
                title: "策略到执行一站式", 
                description: "从市场洞察、KOL匹配到内容执行，全链条自主可控，效率更高",
                highlight: "全链条",
                color: "from-cyan-400 to-blue-600"
              },
              { 
                icon: Zap, 
                title: "一手达人资源", 
                description: "所有KOL合作均为直接对接，无中间环节，成本更低，执行更快",
                highlight: "一手",
                color: "from-pink-400 to-purple-600"
              },
              { 
                icon: BarChart3, 
                title: "数据驱动优化", 
                description: "实时监控投放效果，AI算法优化达人匹配，确保每分预算都有最佳ROI",
                highlight: "数据驱动",
                color: "from-blue-500 to-indigo-600"
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
                        <span className={`bg-gradient-to-r ${item.color} bg-clip-text text-transparent font-semibold animate-gradient`}>{item.highlight}</span>
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
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent font-semibold animate-gradient">TikTok、YouTube、Instagram</span>
              等主流平台官方合作伙伴 | 
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent font-semibold animate-gradient">巨量星图、蒲公英</span>
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
              <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent font-semibold animate-gradient">CPC、CPM、CPA</span>
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
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent font-semibold animate-gradient">深度签约达人</span>
              +
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent font-semibold animate-gradient">北美合作网络</span>
              = 全覆盖资源矩阵
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { number: "70+", label: "深度签约KOL", subtitle: "专业孵化，稳定合作", color: "from-blue-400 to-cyan-600" },
              { number: "600+", label: "北美合作达人", subtitle: "一手资源，直接对接", color: "from-purple-400 to-pink-600" },
              { number: "30+", label: "美加核心城市", subtitle: "本土化运营覆盖", color: "from-orange-400 to-red-600" },
              { number: "100%", label: "平台官方认证", subtitle: "投放资质完整齐全", color: "from-cyan-400 to-blue-600" }
            ].map((stat, index) => (
              <div
                key={index}
                data-animate={`stat-${index}`}
                className={`text-center transition-all duration-1000 group cursor-default ${
                  isVisible[`stat-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                }`}
              >
                <div className={`text-6xl md:text-7xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-4 tracking-tighter group-hover:scale-110 transition-transform duration-300 animate-gradient`}>
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
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent animate-gradient">内容营销</span>
              新篇章
            </h2>
            <p className="text-xl text-gray-300 mb-16 leading-relaxed font-light">
              一手达人资源 × 全链条服务 × 官方投放资质 = 
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent font-semibold animate-gradient">更低成本，更高转化</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <button className="group relative px-12 py-4 bg-white/10 rounded-full text-white font-medium text-lg hover:bg-white/20 transition-all duration-300 border border-white/20 hover:scale-105">
                立即合作咨询
              </button>
              
              <button 
                onClick={onNavigateToSystem}
                className="group relative px-12 py-4 border-2 border-white/20 rounded-full text-white font-medium text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                进入管理系统
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-8 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-4 mb-8 md:mb-0">
              <img src="/mvplogo.png" alt="十方众声 MCN" className="h-10 w-auto filter brightness-0 invert" />
              <div>
                <div className="text-white font-bold">十方众声 MCN</div>
                <div className="text-gray-400 text-sm">Mega Volume Production</div>
              </div>
            </div>
            
            <div className="text-gray-400 text-center md:text-right">
              <p>
                <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent font-semibold animate-gradient">跨境内容营销</span>
                解决方案提供商
              </p>
              <p className="text-sm mt-1">© 2024 十方众声. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* 回到顶部 */}
      {scrollY > 1000 && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg border border-white/20"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default LandingPage;
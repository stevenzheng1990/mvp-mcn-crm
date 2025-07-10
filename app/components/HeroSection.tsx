import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useScroll, useTransform } from 'framer-motion';

// 注册 GSAP 插件
gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  language?: 'zh' | 'en';
  CONFIG?: any;
  content?: any;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  language = 'zh',
  CONFIG = {},
  content
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  
  // 滚动进度
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // 背景视差效果
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 清除之前的 ScrollTrigger
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());

      // 创建主时间轴
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
          pin: true, // 关闭 pin，让内容正常滚动
        }
      });

      // 初始状态设置
      if (titleRef.current) {
        gsap.set(titleRef.current, {
          opacity: 0,
          scale: 0.3,
          z: -1000,
          rotationX: 45,
          filter: 'blur(20px)',
          transformPerspective: 1200,
          transformOrigin: "center center"
        });
      }

      if (subtitleRef.current) {
        gsap.set(subtitleRef.current, {
          opacity: 0,
          y: 50,
          filter: 'blur(10px)'
        });
      }

      if (statsRef.current) {
        const statLines = statsRef.current.querySelectorAll('.stat-line');
        gsap.set(statLines, {
          opacity: 0,
          y: 40,
          scale: 0.9,
          filter: 'blur(8px)'
        });
      }

      // 标题飞入动画 - 从远到近
      if (titleRef.current) {
        masterTl.to(titleRef.current, {
          opacity: 1,
          scale: 1,
          z: 0,
          rotationX: 0,
          filter: 'blur(0px)',
          duration: 1.5,
          ease: "power3.out"
        });
      }
      
      // 副标题淡入
      if (subtitleRef.current) {
        masterTl.to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1,
          ease: "power2.out"
        }, "-=0.7");
      }
      
      // 统计数据逐行出现
      if (statsRef.current) {
        const statLines = statsRef.current.querySelectorAll('.stat-line');
        if (statLines.length > 0) {
          masterTl.to(statLines, {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
          }, "-=0.5");
        }
      }

      // 标题hover互动效果
      if (titleRef.current) {
        const titleWords = titleRef.current.querySelectorAll('.title-word');
        titleWords.forEach((word) => {
          word.addEventListener('mouseenter', () => {
            gsap.to(word, {
              scale: 1.05,
              duration: 0.3,
              ease: "power2.out"
            });
          });
          
          word.addEventListener('mouseleave', () => {
            gsap.to(word, {
              scale: 1,
              duration: 0.3,
              ease: "power2.out"
            });
          });
        });
      }

      // 添加细微的浮动动画
      if (titleRef.current) {
        gsap.to(titleRef.current, {
          y: "+=10",
          repeat: -1,
          yoyo: true,
          duration: 4,
          ease: "power1.inOut"
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, [language]);

  // 设置默认内容结构
  const defaultContent = {
    zh: {
      hero: {
        title: '十方众声 声动十方',
        subtitle: '业界唯一在北美和中国建立完整互联网营销生态的MCN机构',
        description: '70+签约KOL, 600+达人创作者 — 全赛道流量矩阵 × 20+社媒平台官方投放渠道 — 全覆盖投流渠道',
        stats: {
          kols: '70+签约KOL, 600+达人创作者',
          kolsDesc: '全赛道流量矩阵',
          platforms: '20+社媒平台官方投放渠道',
          platformsDesc: '全覆盖投流渠道'
        }
      }
    },
    en: {
      hero: {
        title: 'MEGA VOLUME PRODUCTION',
        subtitle: 'The only MCN with comprehensive digital ecosystems across North America and China',
        description: '70+ Exclusive KOLs, 600+ Content Creators — Omni-channel Traffic Matrix × 20+ Official Social Platform Partnerships — Full-spectrum Distribution Network',
        stats: {
          kols: '70+ Exclusive KOLs, 600+ Content Creators',
          kolsDesc: 'Omni-channel Traffic Matrix',
          platforms: '20+ Official Social Platform Partnerships',
          platformsDesc: 'Full-spectrum Distribution Network'
        }
      }
    }
  };

  // 合并传入的 content 和默认内容
  const mergedContent = content || defaultContent;
  
  // 确保 stats 存在
  if (!mergedContent[language]?.hero?.stats) {
    // 从 description 解析 stats
    const desc = mergedContent[language]?.hero?.description || '';
    const parts = desc.split(' × ');
    const firstPart = parts[0]?.split(' — ') || [];
    const secondPart = parts[1]?.split(' — ') || [];
    
    mergedContent[language] = {
      ...mergedContent[language],
      hero: {
        ...mergedContent[language]?.hero,
        stats: {
          kols: firstPart[0] || '70+签约KOL, 600+达人创作者',
          kolsDesc: firstPart[1] || '全赛道流量矩阵',
          platforms: secondPart[0] || '20+社媒平台官方投放渠道',
          platformsDesc: secondPart[1] || '全覆盖投流渠道'
        }
      }
    };
  }

  // 处理标题分词
  const titleWords = mergedContent[language].hero.title.split(' ');

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent"
      style={{ height: '120vh' }}
    >
      {/* 背景装饰 */}
      <motion.div 
        className="absolute inset-0 -z-10"
        style={{ 
          y: backgroundY,
          scale: backgroundScale
        }}
      >
        <div className="absolute top-1/3 -left-1/4 w-[800px] h-[800px] bg-gradient-radial from-amber-50/20 via-amber-100/10 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 -right-1/4 w-[800px] h-[800px] bg-gradient-radial from-yellow-50/20 via-yellow-100/10 to-transparent rounded-full blur-[120px]" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 text-center" style={{ marginTop: '-25vh' }}>
        {/* 主标题 */}
        <h1 
          ref={titleRef}
          className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight perspective-1000"
          style={{
            marginBottom: '50px',
            textShadow: '0 20px 40px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.05)'
          }}
        >
          {titleWords.map((word: string, index: number) => (
            <span 
              key={index}
              className="title-word inline-block mx-2 cursor-pointer transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 50%, #1a1a1a 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: 'none'
              }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* 副标题 */}
        <p 
          ref={subtitleRef}
          className="text-xl md:text-2xl lg:text-2xl text-gray-700 font-medium max-w-4xl mx-auto leading-relaxed"
          style={{
            marginBottom: '50px',
            textShadow: '0 8px 16px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04)'
          }}
        >
          {mergedContent[language].hero.subtitle}
        </p>

        {/* 统计数据 */}
        <div 
          ref={statsRef}
          className="text-lg md:text-xl lg:text-1xl font-bold max-w-5xl mx-auto"
        >
          {/* 第一行 - KOL 数据 */}
          <div className="stat-line" style={{ marginBottom: '20px' }}>
            <span 
              className="inline-block"
              style={{
                background: 'linear-gradient(135deg, #D4A574 0%, #B8956A 25%, #C9A876 50%, #B8956A 75%, #D4A574 100%)',
                backgroundSize: '200% 200%',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shimmer 3s ease-in-out infinite',
                textShadow: '0 12px 24px rgba(212, 165, 116, 0.2), 0 6px 12px rgba(212, 165, 116, 0.1)'
              }}
            >
              {mergedContent[language].hero.stats.kols}
            </span>
            <span className="mx-3 text-gray-500 font-light">—</span>
            <span className="text-gray-800 font-semibold">
              {mergedContent[language].hero.stats.kolsDesc}
            </span>
          </div>

          {/* × 符号 */}
          <div className="stat-line" style={{ marginBottom: '20px' }}>
            <span className="text-5xl font-light text-gray-400" style={{
              textShadow: '0 8px 16px rgba(0,0,0,0.1)'
            }}>×</span>
          </div>

          {/* 第二行 - 平台数据 */}
          <div className="stat-line">
            <span 
              className="inline-block"
              style={{
                background: 'linear-gradient(135deg, #C9A876 0%, #A68B5B 25%, #D4A574 50%, #A68B5B 75%, #C9A876 100%)',
                backgroundSize: '200% 200%',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shimmer 3s ease-in-out infinite 0.5s',
                textShadow: '0 12px 24px rgba(201, 168, 118, 0.2), 0 6px 12px rgba(201, 168, 118, 0.1)'
              }}
            >
              {mergedContent[language].hero.stats.platforms}
            </span>
            <span className="mx-3 text-gray-500 font-light">—</span>
            <span className="text-gray-800 font-semibold">
              {mergedContent[language].hero.stats.platformsDesc}
            </span>
          </div>
        </div>
      </div>

      {/* 滚动指示器 */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: [0, 10, 0],
        }}
        transition={{
          opacity: { delay: 2, duration: 0.5 },
          y: { delay: 2.5, duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <div className="w-6 h-10 border-2 border-gray-400/50 rounded-full p-1 backdrop-blur-sm">
          <motion.div 
            className="w-1.5 h-1.5 bg-gray-600 rounded-full mx-auto"
            animate={{
              y: [0, 16, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes shimmer {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .perspective-1000 {
          perspective: 1000px;
          transform-style: preserve-3d;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to));
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
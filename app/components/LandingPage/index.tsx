// Z:\MCN\mvp-mcn-crm\app\components\LandingPage\index.tsx
import React, { useState, useRef, useEffect } from 'react';
import FluidSimulation from '../FluidSimulation';
import { LandingPageProps, Language } from './LandingPage.types';

// 从配置文件导入所有配置
import { 
  DESIGN_TOKENS, 
  CONTENT_DATA, 
  SCROLL_CONFIG, 
  OBSERVER_CONFIG,
  getContent 
} from './LandingPage.config';

import { getCssVariables } from './LandingPage.styles';
import { useScrollProgress } from './hooks/useScrollProgress';

// 子组件导入
import AnimatedText from './components/AnimatedText';
import LanguageSwitcher from './components/LanguageSwitcher';
import NavigationButtons from './components/NavigationButtons';
import ScrollIndicator from './components/ScrollIndicator';
import LogoMaskLayer from './components/LogoMaskLayer';
import PageSection from './components/PageSection';
import BackToTopButton from './components/BackToTopButton';
import AnimatedNumber from './components/AnimatedNumber';
import ServiceCard from './components/ServiceCard';
import StatCard from './components/StatCard';
import PlatformBadge from './components/PlatformBadge';
import IndustryTag from './components/IndustryTag';
import AdvantageCard from './components/AdvantageCard';
import SolutionCard from './components/SolutionCard';
import ProcessStep from './components/ProcessStep';

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToSystem }) => {
  // 状态管理
  const [language, setLanguage] = useState<Language>('zh');
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set([0]));
  
  // 自定义 Hook
  const { scrollProgress, maskOpacity } = useScrollProgress();
  
  // Refs
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // 获取当前语言内容
  const content = getContent(language);

  // CSS 变量
  const cssVariables = getCssVariables();

  // 可见性观察器
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const index = Number(entry.target.getAttribute('data-section-index'));
        if (!isNaN(index)) {
          setVisibleSections(prev => {
            const newSet = new Set(prev);
            if (entry.isIntersecting) {
              newSet.add(index);
            } else {
              newSet.delete(index);
            }
            return newSet;
          });
        }
      });
    }, OBSERVER_CONFIG);

    sectionRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.setAttribute('data-section-index', index.toString());
        observer.observe(ref);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      className="landing-page"
      style={{
        position: 'relative',
        margin: 0,
        padding: 0,
        width: '100vw',
        minHeight: '100vh',
        overflow: 'hidden',
        fontFamily: DESIGN_TOKENS.typography.fontFamily,
        letterSpacing: DESIGN_TOKENS.typography.letterSpacing,
        fontWeight: DESIGN_TOKENS.typography.fontWeight.light,
        ...cssVariables,
      }}
    >
      {/* 背景层 - FluidSimulation */}
      <div className="background-layer" style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <FluidSimulation className="w-full h-full" />
      </div>

      {/* Logo遮罩层 */}
      <LogoMaskLayer
        scrollProgress={scrollProgress}
        maskOpacity={maskOpacity}
      />

      {/* 固定元素层 */}
      <div className="fixed-elements">
        <LanguageSwitcher
          language={language}
          onLanguageChange={setLanguage}
          scrollProgress={scrollProgress}
        />

        <NavigationButtons
          language={language}
          content={content}
          scrollProgress={scrollProgress}
          onNavigateToSystem={onNavigateToSystem}
        />

        <BackToTopButton 
          scrollProgress={scrollProgress}
          content={content}
        />

        <ScrollIndicator scrollProgress={scrollProgress} />
      </div>

      {/* 主内容区 */}
      <main className="main-content" style={{ position: 'relative', zIndex: 20, pointerEvents: 'none' }}>
        {/* 遮罩占位区 */}
        <div className="mask-spacer" style={{ height: '290vh' }} />

        {/* 英雄区块 */}
        <PageSection
          sectionRef={el => sectionRefs.current[0] = el}
          isVisible={visibleSections.has(0)}
          style={{
            transition: `all ${DESIGN_TOKENS.animation.duration.slower} ${DESIGN_TOKENS.animation.easing.default}`,
          }}
        >
          <div className="hero-content text-center">
            <h1 style={{
              fontSize: DESIGN_TOKENS.typography.fontSize.hero,
              color: DESIGN_TOKENS.colors.text.primary,
              marginBottom: DESIGN_TOKENS.spacing.gap.hero,
              lineHeight: DESIGN_TOKENS.typography.lineHeight.tight,
            }}>
              <AnimatedText
                text={content.title}
                inView={visibleSections.has(0) && scrollProgress > 0.5}
              />
            </h1>
            
            <h2 style={{
              fontSize: DESIGN_TOKENS.typography.fontSize.subtitle,
              color: DESIGN_TOKENS.colors.text.primary,
              marginBottom: DESIGN_TOKENS.spacing.gap.hero,
              lineHeight: DESIGN_TOKENS.typography.lineHeight.tight,
            }}>
              <AnimatedText
                text={content.subtitle}
                delay={0.3}
                inView={visibleSections.has(0) && scrollProgress > 0.5}
              />
            </h2>
            
            <p style={{
              fontSize: DESIGN_TOKENS.typography.fontSize.body,
              color: DESIGN_TOKENS.colors.text.secondary,
              lineHeight: DESIGN_TOKENS.typography.lineHeight.normal,
            }}>
              <AnimatedText
                text={content.tagline}
                delay={0.6}
                inView={visibleSections.has(0) && scrollProgress > 0.5}
              />
            </p>
          </div>
        </PageSection>

        {/* 描述区块 - 充实内容 */}
        <PageSection
          sectionRef={el => sectionRefs.current[1] = el}
          isVisible={visibleSections.has(1)}
        >
          <div className="description-content max-w-5xl text-center">
            <p style={{
              fontSize: DESIGN_TOKENS.typography.fontSize.heading,
              color: DESIGN_TOKENS.colors.text.primary,
              lineHeight: DESIGN_TOKENS.typography.lineHeight.relaxed,
            }}>
              <AnimatedText
                text={content.description}
                inView={visibleSections.has(1)}
              />
            </p>
          </div>
        </PageSection>

        {/* 核心能力数据展示 */}
        <PageSection
          sectionRef={el => sectionRefs.current[2] = el}
          isVisible={visibleSections.has(2)}
        >
          <div className="core-capabilities-content max-w-6xl w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {content.coreCapabilities.map((capability, index) => (
                <StatCard
                  key={`capability-${index}`}
                  stat={capability}
                  index={index}
                  isVisible={visibleSections.has(2)}
                  large={false}
                />
              ))}
            </div>
          </div>
        </PageSection>

        {/* 创作者生态系统 - 充实内容 */}
        <PageSection
          sectionRef={el => sectionRefs.current[3] = el}
          isVisible={visibleSections.has(3)}
          style={{ minHeight: 'auto', padding: '10vh 5vw' }}
        >
          <div className="ecosystem-content max-w-6xl w-full">
            <div className="text-center mb-16">
              <h2 style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.heading,
                color: DESIGN_TOKENS.colors.text.primary,
                marginBottom: DESIGN_TOKENS.spacing.gap.small,
              }}>
                <AnimatedText
                  text={content.ecosystem.title}
                  inView={visibleSections.has(3)}
                />
              </h2>
              <p style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.subheading,
                color: DESIGN_TOKENS.colors.text.secondary,
                marginBottom: DESIGN_TOKENS.spacing.gap.content,
              }}>
                <AnimatedText
                  text={content.ecosystem.subtitle}
                  delay={0.2}
                  inView={visibleSections.has(3)}
                />
              </p>
              <p style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.body,
                color: DESIGN_TOKENS.colors.text.tertiary,
                lineHeight: DESIGN_TOKENS.typography.lineHeight.loose,
                maxWidth: '800px',
                margin: '0 auto',
                marginBottom: DESIGN_TOKENS.spacing.gap.content,
              }}>
                <AnimatedText
                  text={content.ecosystem.description}
                  delay={0.4}
                  inView={visibleSections.has(3)}
                />
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.ecosystem.highlights.map((highlight, index) => (
                <div 
                  key={index}
                  style={{
                    padding: '1.5rem',
                    borderLeft: '3px solid rgba(150,150,150,0.3)',
                    opacity: visibleSections.has(3) ? 1 : 0,
                    transform: visibleSections.has(3) ? 'translateX(0)' : 'translateX(-20px)',
                    transition: `all ${DESIGN_TOKENS.animation.duration.slow} ${DESIGN_TOKENS.animation.easing.default}`,
                    transitionDelay: `${0.6 + index * 0.1}s`,
                  }}
                >
                  <p style={{
                    fontSize: DESIGN_TOKENS.typography.fontSize.body,
                    color: DESIGN_TOKENS.colors.text.secondary,
                    margin: 0,
                  }}>
                    {highlight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </PageSection>

        {/* 创作者服务体系 */}
        <PageSection
          sectionRef={el => sectionRefs.current[4] = el}
          isVisible={visibleSections.has(4)}
          style={{ minHeight: 'auto', padding: '10vh 5vw' }}
        >
          <div className="creator-services-content max-w-7xl w-full">
            <div className="text-center mb-16">
              <h2 style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.heading,
                color: DESIGN_TOKENS.colors.text.primary,
                marginBottom: DESIGN_TOKENS.spacing.gap.small,
              }}>
                <AnimatedText
                  text={content.creatorServices.title}
                  inView={visibleSections.has(4)}
                />
              </h2>
              <p style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.body,
                color: DESIGN_TOKENS.colors.text.secondary,
              }}>
                <AnimatedText
                  text={content.creatorServices.subtitle}
                  delay={0.2}
                  inView={visibleSections.has(4)}
                />
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.creatorServices.services.map((service, index) => (
                <ServiceCard
                  key={`service-${index}`}
                  service={service}
                  index={index}
                  isVisible={visibleSections.has(4)}
                />
              ))}
            </div>
          </div>
        </PageSection>

        {/* 解决方案 - 新增详细内容 */}
        <PageSection
          sectionRef={el => sectionRefs.current[5] = el}
          isVisible={visibleSections.has(5)}
          style={{ minHeight: 'auto', padding: '10vh 5vw' }}
        >
          <div className="solutions-content max-w-7xl w-full">
            <div className="text-center mb-16">
              <h2 style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.heading,
                color: DESIGN_TOKENS.colors.text.primary,
                marginBottom: DESIGN_TOKENS.spacing.gap.small,
              }}>
                <AnimatedText
                  text={content.solutions.title}
                  inView={visibleSections.has(5)}
                />
              </h2>
              <p style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.body,
                color: DESIGN_TOKENS.colors.text.secondary,
              }}>
                <AnimatedText
                  text={content.solutions.subtitle}
                  delay={0.2}
                  inView={visibleSections.has(5)}
                />
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.solutions.items.map((solution, index) => (
                <SolutionCard
                  key={`solution-${index}`}
                  solution={solution}
                  index={index}
                  isVisible={visibleSections.has(5)}
                />
              ))}
            </div>
          </div>
        </PageSection>

        {/* 差异化优势 */}
        <PageSection
          sectionRef={el => sectionRefs.current[6] = el}
          isVisible={visibleSections.has(6)}
        >
          <div className="advantages-content max-w-6xl w-full">
            <div className="text-center mb-16">
              <h2 style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.heading,
                color: DESIGN_TOKENS.colors.text.primary,
                marginBottom: DESIGN_TOKENS.spacing.gap.small,
              }}>
                <AnimatedText
                  text={content.advantages.title}
                  inView={visibleSections.has(6)}
                />
              </h2>
              <p style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.body,
                color: DESIGN_TOKENS.colors.text.secondary,
              }}>
                <AnimatedText
                  text={content.advantages.subtitle}
                  delay={0.2}
                  inView={visibleSections.has(6)}
                />
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {content.advantages.items.map((item, index) => (
                <AdvantageCard
                  key={`advantage-${index}`}
                  item={item}
                  index={index}
                  isVisible={visibleSections.has(6)}
                />
              ))}
            </div>
          </div>
        </PageSection>

        {/* 服务流程 */}
        <PageSection
          sectionRef={el => sectionRefs.current[7] = el}
          isVisible={visibleSections.has(7)}
          style={{ minHeight: 'auto', padding: '10vh 5vw' }}
        >
          <div className="process-content max-w-4xl w-full">
            <div className="text-center mb-16">
              <h2 style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.heading,
                color: DESIGN_TOKENS.colors.text.primary,
                marginBottom: DESIGN_TOKENS.spacing.gap.small,
              }}>
                <AnimatedText
                  text={content.process.title}
                  inView={visibleSections.has(7)}
                />
              </h2>
              <p style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.body,
                color: DESIGN_TOKENS.colors.text.secondary,
              }}>
                <AnimatedText
                  text={content.process.subtitle}
                  delay={0.2}
                  inView={visibleSections.has(7)}
                />
              </p>
            </div>
            
            <div className="process-steps" style={{
              display: 'grid',
              gap: DESIGN_TOKENS.spacing.gap.item,
            }}>
              {content.process.steps.map((step, index) => (
                <ProcessStep
                  key={`step-${index}`}
                  step={step}
                  index={index}
                  isVisible={visibleSections.has(7)}
                  totalSteps={content.process.steps.length}
                />
              ))}
            </div>
          </div>
        </PageSection>

        {/* 平台合作伙伴 */}
        <PageSection
          sectionRef={el => sectionRefs.current[8] = el}
          isVisible={visibleSections.has(8)}
        >
          <div className="platforms-content max-w-5xl w-full">
            <div className="text-center mb-12">
              <h2 style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.heading,
                color: DESIGN_TOKENS.colors.text.primary,
                marginBottom: DESIGN_TOKENS.spacing.gap.small,
              }}>
                <AnimatedText
                  text={content.platforms.title}
                  inView={visibleSections.has(8)}
                />
              </h2>
              <p style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.body,
                color: DESIGN_TOKENS.colors.text.secondary,
              }}>
                <AnimatedText
                  text={content.platforms.subtitle}
                  delay={0.2}
                  inView={visibleSections.has(8)}
                />
              </p>
            </div>
            
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: DESIGN_TOKENS.spacing.component.buttonGap,
              justifyContent: 'center',
            }}>
              {content.platforms.list.map((platform, index) => (
                <PlatformBadge
                  key={`platform-${index}`}
                  platform={platform}
                  index={index}
                  isVisible={visibleSections.has(8)}
                />
              ))}
            </div>
          </div>
        </PageSection>

        {/* 服务行业 */}
        <PageSection
          sectionRef={el => sectionRefs.current[9] = el}
          isVisible={visibleSections.has(9)}
          style={{ minHeight: 'auto', padding: '10vh 5vw' }}
        >
          <div className="industries-content max-w-5xl w-full">
            <div className="text-center mb-12">
              <h2 style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.heading,
                color: DESIGN_TOKENS.colors.text.primary,
                marginBottom: DESIGN_TOKENS.spacing.gap.small,
              }}>
                <AnimatedText
                  text={content.industries.title}
                  inView={visibleSections.has(9)}
                />
              </h2>
              <p style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.body,
                color: DESIGN_TOKENS.colors.text.secondary,
              }}>
                <AnimatedText
                  text={content.industries.subtitle}
                  delay={0.2}
                  inView={visibleSections.has(9)}
                />
              </p>
            </div>
            
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center',
            }}>
              {content.industries.list.map((industry, index) => (
                <IndustryTag
                  key={`industry-${index}`}
                  industry={industry}
                  index={index}
                  isVisible={visibleSections.has(9)}
                />
              ))}
            </div>
          </div>
        </PageSection>

        {/* 成功案例数据 - 充实内容 */}
        <PageSection
          sectionRef={el => sectionRefs.current[10] = el}
          isVisible={visibleSections.has(10)}
        >
          <div className="case-studies-content max-w-6xl w-full">
            <div className="text-center mb-16">
              <h2 style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.heading,
                color: DESIGN_TOKENS.colors.text.primary,
                marginBottom: DESIGN_TOKENS.spacing.gap.small,
              }}>
                <AnimatedText
                  text={content.caseStudies.title}
                  inView={visibleSections.has(10)}
                />
              </h2>
              <p style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.body,
                color: DESIGN_TOKENS.colors.text.secondary,
                marginBottom: DESIGN_TOKENS.spacing.gap.content,
              }}>
                <AnimatedText
                  text={content.caseStudies.subtitle}
                  delay={0.2}
                  inView={visibleSections.has(10)}
                />
              </p>
              <p style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.body,
                color: DESIGN_TOKENS.colors.text.tertiary,
                lineHeight: DESIGN_TOKENS.typography.lineHeight.loose,
                maxWidth: '800px',
                margin: '0 auto',
                marginBottom: DESIGN_TOKENS.spacing.gap.content,
              }}>
                <AnimatedText
                  text={content.caseStudies.description}
                  delay={0.4}
                  inView={visibleSections.has(10)}
                />
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {content.caseStudies.stats.map((stat, index) => (
                <StatCard
                  key={`case-stat-${index}`}
                  stat={stat}
                  index={index}
                  isVisible={visibleSections.has(10)}
                  large={true}
                />
              ))}
            </div>
          </div>
        </PageSection>

        {/* CTA区块 */}
        <PageSection
          sectionRef={el => sectionRefs.current[11] = el}
          isVisible={visibleSections.has(11)}
        >
          <div className="cta-content text-center">
            <h2 style={{
              fontSize: DESIGN_TOKENS.typography.fontSize.heading,
              color: DESIGN_TOKENS.colors.text.primary,
              lineHeight: DESIGN_TOKENS.typography.lineHeight.tight,
            }}>
              <AnimatedText
                text={content.readyToStart}
                inView={visibleSections.has(11)}
              />
            </h2>
          </div>
        </PageSection>

        {/* 页脚 */}
        <footer className="footer py-20 text-center" style={{ paddingTop: '10vh', paddingBottom: '10vh' }}>
          <p style={{
            fontSize: DESIGN_TOKENS.typography.fontSize.small,
            color: DESIGN_TOKENS.colors.footer.text,
            marginBottom: '0.5rem',
          }}>
            {content.footer.copyright}
          </p>
          {content.footer.address && (
            <p style={{
              fontSize: DESIGN_TOKENS.typography.fontSize.tiny,
              color: DESIGN_TOKENS.colors.footer.text,
              marginBottom: '0.5rem',
            }}>
              {content.footer.address}
            </p>
          )}
          {content.footer.phone && (
            <p style={{
              fontSize: DESIGN_TOKENS.typography.fontSize.tiny,
              color: DESIGN_TOKENS.colors.footer.text,
            }}>
              {content.footer.phone}
            </p>
          )}
        </footer>
      </main>

      {/* 全局样式 */}
      <style jsx global>{`
        /* 确保没有默认边框 */
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        * {
          box-sizing: border-box;
        }

        /* 防止 SVG 边缘问题 */
        svg {
          shape-rendering: crispEdges;
        }
        
        /* 滚动优化 */
        html {
          scroll-behavior: smooth;
        }

        /* 隐藏滚动条 */
        ::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }

        /* 字体渲染优化 */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        /* 滚动指示器动画 */
        @keyframes scrollIndicatorAnimation {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: translateY(60px);
            opacity: 0;
          }
        }
        
        /* 响应式工具类 */
        @media (max-width: ${DESIGN_TOKENS.layout.breakpoints.mobile}) {
          .grid-cols-2 { grid-template-columns: repeat(1, 1fr); }
          .md\\:grid-cols-3 { grid-template-columns: repeat(1, 1fr); }
          .md\\:grid-cols-4 { grid-template-columns: repeat(2, 1fr); }
          .lg\\:grid-cols-4 { grid-template-columns: repeat(1, 1fr); }
        }
        
        @media (min-width: ${DESIGN_TOKENS.layout.breakpoints.tablet}) {
          .md\\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
          .md\\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
          .md\\:grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
          .lg\\:grid-cols-4 { grid-template-columns: repeat(2, 1fr); }
        }
        
        @media (min-width: ${DESIGN_TOKENS.layout.breakpoints.desktop}) {
          .lg\\:grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
        }
        
        /* 网格系统 */
        .grid {
          display: grid;
        }
        
        .gap-4 { gap: 1rem; }
        .gap-6 { gap: 1.5rem; }
        .gap-8 { gap: 2rem; }
        .gap-12 { gap: 3rem; }
        .gap-16 { gap: 4rem; }
        .gap-24 { gap: 6rem; }
        
        /* Flexbox 工具类 */
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .flex-wrap { flex-wrap: wrap; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        
        /* 间距工具类 */
        .mb-12 { margin-bottom: 3rem; }
        .mb-16 { margin-bottom: 4rem; }
        .py-20 { padding-top: 5rem; padding-bottom: 5rem; }
        
        /* 文本工具类 */
        .text-center { text-align: center; }
        
        /* 尺寸工具类 */
        .w-full { width: 100%; }
        .h-full { height: 100%; }
        .max-w-4xl { max-width: 56rem; }
        .max-w-5xl { max-width: 64rem; }
        .max-w-6xl { max-width: 72rem; }
        .max-w-7xl { max-width: 80rem; }
      `}</style>
    </div>
  );
};

export default LandingPage;
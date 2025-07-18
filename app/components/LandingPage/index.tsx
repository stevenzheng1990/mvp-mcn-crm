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
import LogoMaskLayer from './components/LogoMaskLayer'; // 新的Logo遮罩组件
import PageSection from './components/PageSection';
import BackToTopButton from './components/BackToTopButton';

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
          margin: 0,  // 确保没有外边距
          padding: 0, // 确保没有内边距
          width: '100vw', // 使用视口宽度
          minHeight: '100vh', // 使用视口高度
          overflow: 'hidden', // 防止内容溢出
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

      {/* Logo遮罩层 - 替换原有的TextMaskLayer */}
      <LogoMaskLayer
        scrollProgress={scrollProgress}
        maskOpacity={maskOpacity}
      />

      {/* 固定元素层 */}
      <div className="fixed-elements">
        {/* 语言切换器 */}
        <LanguageSwitcher
          language={language}
          onLanguageChange={setLanguage}
          scrollProgress={scrollProgress}
        />

        {/* 分离的导航按钮 */}
        <NavigationButtons
          language={language}
          content={content}
          scrollProgress={scrollProgress}
          onNavigateToSystem={onNavigateToSystem}
        />

        {/* 返回顶部按钮 */}
        <BackToTopButton 
          scrollProgress={scrollProgress}
          content={content}
        />

        {/* 滚动指示器 */}
        <ScrollIndicator scrollProgress={scrollProgress} />
      </div>

      {/* 主内容区 */}
      <main className="main-content" style={{ position: 'relative', zIndex: 20, pointerEvents: 'none' }}>
        {/* 遮罩占位区 - 增加高度以延长动画 */}
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

        {/* 描述区块 */}
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

        {/* 统计数据区块 */}
        <PageSection
          sectionRef={el => sectionRefs.current[2] = el}
          isVisible={visibleSections.has(2)}
        >
          <div className="stats-content flex flex-col md:flex-row gap-16 md:gap-24">
            {content.stats.map((stat, index) => (
              <div key={`stat-${index}`} className="stat-item text-center">
                <h3 style={{
                  fontSize: DESIGN_TOKENS.typography.fontSize.heading,
                  color: DESIGN_TOKENS.colors.text.primary,
                  lineHeight: DESIGN_TOKENS.typography.lineHeight.tight,
                }}>
                  <AnimatedText
                    text={stat}
                    delay={index * 0.2}
                    inView={visibleSections.has(2)}
                  />
                </h3>
              </div>
            ))}
          </div>
        </PageSection>

        {/* 特性区块 */}
        <PageSection
          sectionRef={el => sectionRefs.current[3] = el}
          isVisible={visibleSections.has(3)}
        >
          <div className="features-content flex flex-col gap-12 max-w-4xl">
            {content.features.map((feature, index) => (
              <div key={`feature-${index}`} className="feature-item text-center">
                <h3 style={{
                  fontSize: DESIGN_TOKENS.typography.fontSize.body,
                  color: DESIGN_TOKENS.colors.text.primary,
                  lineHeight: DESIGN_TOKENS.typography.lineHeight.normal,
                }}>
                  <AnimatedText
                    text={feature}
                    delay={index * 0.15}
                    inView={visibleSections.has(3)}
                  />
                </h3>
              </div>
            ))}
          </div>
        </PageSection>

        {/* 指标区块 */}
        <PageSection
          sectionRef={el => sectionRefs.current[4] = el}
          isVisible={visibleSections.has(4)}
        >
          <div className="metrics-content grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
            {content.metrics.map((metric, index) => (
              <div key={`metric-${index}`} className="metric-item text-center">
                <h3 style={{
                  fontSize: DESIGN_TOKENS.typography.fontSize.hero,
                  color: DESIGN_TOKENS.colors.text.primary,
                  marginBottom: '1rem',
                  lineHeight: DESIGN_TOKENS.typography.lineHeight.tight,
                }}>
                  <AnimatedText
                    text={metric.value}
                    delay={index * 0.15}
                    inView={visibleSections.has(4)}
                  />
                </h3>
                <p style={{
                  fontSize: DESIGN_TOKENS.typography.fontSize.small,
                  color: DESIGN_TOKENS.colors.text.secondary,
                  lineHeight: DESIGN_TOKENS.typography.lineHeight.normal,
                }}>
                  <AnimatedText
                    text={metric.label}
                    delay={index * 0.15 + 0.3}
                    inView={visibleSections.has(4)}
                  />
                </p>
              </div>
            ))}
          </div>
        </PageSection>

        {/* CTA区块 */}
        <PageSection
          sectionRef={el => sectionRefs.current[5] = el}
          isVisible={visibleSections.has(5)}
        >
          <div className="cta-content text-center">
            <h2 style={{
              fontSize: DESIGN_TOKENS.typography.fontSize.heading,
              color: DESIGN_TOKENS.colors.text.primary,
              lineHeight: DESIGN_TOKENS.typography.lineHeight.tight,
            }}>
              <AnimatedText
                text={content.readyToStart}
                inView={visibleSections.has(5)}
              />
            </h2>
          </div>
        </PageSection>

        {/* 页脚 */}
        <footer className="footer py-20 text-center">
          <p style={{
            fontSize: DESIGN_TOKENS.typography.fontSize.small,
            color: DESIGN_TOKENS.colors.footer.text,
          }}>
            {content.footer.copyright}
          </p>
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
      `}</style>
    </div>
  );
};

export default LandingPage;
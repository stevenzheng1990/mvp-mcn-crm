// app/components/LandingPage/index.tsx
import React, { useState, useRef, useEffect } from 'react';
import FluidSimulation from '../FluidSimulation';
import { LandingPageProps, Language } from './LandingPage.types';

// 导入更新后的配置
import { 
  DESIGN_TOKENS, 
  CONTENT_DATA, 
  SCROLL_CONFIG, 
  OBSERVER_CONFIG,
  getContent 
} from './LandingPage.config';

import { getCssVariables, createGlassStyles } from './LandingPage.styles';
import { useScrollProgress } from './hooks/useScrollProgress';
// 子组件导入
import AnimatedText from './components/AnimatedText';
import FastAnimatedText from './components/FastAnimatedText';
import LanguageSwitcher from './components/LanguageSwitcher';
import NavigationButtons from './components/NavigationButtons';
import ScrollIndicator from './components/ScrollIndicator';
import LogoMaskLayer from './components/LogoMaskLayer';
import PageSection from './components/PageSection';
import BackToTopButton from './components/BackToTopButton';
import AnimatedCard from './components/AnimatedCard';
import AnimatedCounter from './components/AnimatedCounter';
import MagneticSocialLogos from './components/MagneticSocialLogos';
import ModernChart from './components/ModernChart';
import ScrollingTags from './components/ScrollingTags';
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
        {/* 遮罩占位区 */}
        <div className="mask-spacer" style={{ height: '290vh' }} />

        {/* Hero Section */}
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
              fontWeight: DESIGN_TOKENS.typography.fontWeight.bold, // 增加一级粗细
            }}>
              <AnimatedText
                text={content.hero.title}
                inView={visibleSections.has(0) && scrollProgress > 0.5}
              />
            </h1>
            
            <h2 style={{
              fontSize: DESIGN_TOKENS.typography.fontSize.subtitle,
              color: DESIGN_TOKENS.colors.text.primary,
              marginBottom: DESIGN_TOKENS.spacing.gap.hero,
              lineHeight: DESIGN_TOKENS.typography.lineHeight.tight,
              fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold, // 增加一级粗细
            }}>
              <FastAnimatedText
                text={content.hero.subtitle}
                delay={0.3}
                inView={visibleSections.has(0) && scrollProgress > 0.5}
              />
            </h2>
            
            <p style={{
              fontSize: DESIGN_TOKENS.typography.fontSize.body,
              color: DESIGN_TOKENS.colors.text.secondary,
              lineHeight: DESIGN_TOKENS.typography.lineHeight.normal,
              opacity: visibleSections.has(0) && scrollProgress > 0.5 ? 1 : 0,
              transform: visibleSections.has(0) && scrollProgress > 0.5 ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s ease 0.6s',
            }}>
              {content.hero.tagline}
            </p>
          </div>
        </PageSection>

        {/* About Section - 调整统计区域高度和位置 */}
        <PageSection
          sectionRef={el => sectionRefs.current[1] = el}
          isVisible={visibleSections.has(1)}
          style={{ 
            position: 'relative', 
            overflow: 'hidden',
            minHeight: '200vh', // 大幅增加高度以容纳图表
            paddingTop: '10vh',
            paddingBottom: '10vh',
          }}
        >
          <div style={{ 
            maxWidth: '1400px', // 增加最大宽度
            margin: '0 auto', 
            width: '100%',
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12vh', // 增加间隙，提升呼吸感
          }}>
            
            {/* 标题与描述区域 */}
            <div style={{ 
              textAlign: 'center',
              maxWidth: '1100px',
              width: '100%',
            }}>
              {/* 标题 */}
              <h2 style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.heading,
                fontWeight: DESIGN_TOKENS.typography.fontWeight.bold, // 增加一级粗细
                marginBottom: '3rem',
                textAlign: 'center',
                color: DESIGN_TOKENS.colors.text.primary,
              }}>
                <AnimatedText
                  text={content.about.title}
                  inView={visibleSections.has(1)}
                />
              </h2>
              
              {/* 动态描述文字 */}
              <div style={{
                width: '100%',
              }}>
                {content.about.description.map((text, index) => (
                  <div key={index} style={{
                    marginBottom: index === content.about.description.length - 1 ? 0 : '2.8rem',
                    fontSize: DESIGN_TOKENS.typography.fontSize.body,
                    lineHeight: 1.8,
                    color: DESIGN_TOKENS.colors.text.secondary,
                    textAlign: 'center',
                    display: 'block',
                    maxWidth: '950px',
                    margin: '0 auto',
                    opacity: visibleSections.has(1) ? 1 : 0,
                    transform: visibleSections.has(1) ? 'translateY(0)' : 'translateY(20px)',
                    transition: `all 0.8s ease ${0.3 + index * 0.25}s`,
                  }}>
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* 社媒Logo磁性吸附展示 - 移到统计数据上方 */}
            <div style={{ 
              pointerEvents: 'auto', 
              position: 'relative', 
              zIndex: 2,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '6vh',
            }}>
              <MagneticSocialLogos 
                inView={visibleSections.has(1)} 
                className="social-logos-section"
              />
            </div>

            {/* 统计数据区域 */}
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '1000px',
              zIndex: 2,
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'clamp(2rem, 4vw, 4rem)',
                textAlign: 'center',
                marginBottom: '6vh',
              }}>
                {content.about.stats.map((stat, index) => (
                  <div key={index} style={{
                    opacity: visibleSections.has(1) ? 1 : 0,
                    transform: visibleSections.has(1) ? 'translateY(0)' : 'translateY(30px)',
                    transition: `all 0.8s ease ${0.8 + index * 0.15}s`,
                  }}>
                    <div style={{
                      fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                      fontWeight: DESIGN_TOKENS.typography.fontWeight.bold,
                      marginBottom: '0.8rem',
                      color: DESIGN_TOKENS.colors.text.primary,
                    }}>
                      <AnimatedCounter 
                        value={stat.value} 
                        duration={2000 + index * 200} 
                        inView={visibleSections.has(1)} 
                      />
                    </div>
                    <div style={{
                      fontSize: DESIGN_TOKENS.typography.fontSize.body,
                      color: DESIGN_TOKENS.colors.text.secondary,
                      fontWeight: DESIGN_TOKENS.typography.fontWeight.regular,
                      marginBottom: '0.5rem',
                      lineHeight: 1.3,
                    }}>
                      {stat.label}
                    </div>
                    <div style={{
                      fontSize: DESIGN_TOKENS.typography.fontSize.small,
                      color: DESIGN_TOKENS.colors.text.tertiary,
                      lineHeight: 1.2,
                    }}>
                      {stat.subtitle}
                    </div>
                  </div>
                ))}
              </div>
              
            </div>

          </div>
        </PageSection>

        {/* 全屏内容垂类滚动标签 */}
        <div style={{
          width: '100vw',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          paddingTop: '8vh',
          paddingBottom: '8vh',
          overflow: 'hidden'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '4rem',
            paddingLeft: '5vw',
            paddingRight: '5vw'
          }}>
            <h3 style={{
              fontSize: 'clamp(1.4rem, 3.5vw, 2.45rem)',
              fontWeight: DESIGN_TOKENS.typography.fontWeight.bold, // 增加一级粗细
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              <AnimatedText
                text={content.contentTags.title}
                inView={visibleSections.has(1)}
                delay={1.0}
              />
            </h3>
            <p style={{
              fontSize: 'clamp(0.84rem, 1.75vw, 1.26rem)',
              color: '#6b7280',
              margin: 0,
              fontWeight: '300',
              opacity: visibleSections.has(1) ? 1 : 0,
              transform: visibleSections.has(1) ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s ease 1.2s',
            }}>
              {content.contentTags.subtitle}
            </p>
          </div>
          
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem'
          }}>
            <ScrollingTags
              tags={content.contentTags.tags}
              speed={30}
              inView={visibleSections.has(1)}
              delay={1.2}
            />
          </div>
        </div>

        {/* For Creators Section */}
        <PageSection
          sectionRef={el => sectionRefs.current[3] = el}
          isVisible={visibleSections.has(3)}
          style={{ 
            minHeight: '150vh',
            paddingTop: '8vh',
            paddingBottom: '8vh',
          }}
        >
          <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
            <AnimatedCard inView={visibleSections.has(3)}>
              <h2 style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.heading,
                fontWeight: DESIGN_TOKENS.typography.fontWeight.bold, // 增加一级粗细
                marginBottom: '1rem',
                textAlign: 'center',
              }}>
                <AnimatedText
                  text={content.forCreators.title}
                  inView={visibleSections.has(3)}
                />
              </h2>
              <p style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.body,
                color: DESIGN_TOKENS.colors.text.secondary,
                textAlign: 'center',
                marginBottom: DESIGN_TOKENS.spacing.gap.content,
                opacity: visibleSections.has(3) ? 1 : 0,
                transform: visibleSections.has(3) ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s ease 0.3s',
              }}>
                <FastAnimatedText
                  text={content.forCreators.subtitle}
                  inView={visibleSections.has(3)}
                  delay={0.3}
                />
              </p>
            </AnimatedCard>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              marginBottom: DESIGN_TOKENS.spacing.gap.content,
            }}>
              {content.forCreators.benefits.map((benefit, index) => (
                <AnimatedCard key={index} delay={0.2 + index * 0.15} inView={visibleSections.has(3)}>
                  <div style={{
                    padding: '2rem',
                    borderLeft: '3px solid rgba(80, 80, 80, 0.1)',
                  }}>
                    <h3 style={{
                      fontSize: '1.3rem',
                      fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold, // 增加一级粗细
                      marginBottom: '1rem',
                    }}>
                      {benefit.title}
                    </h3>
                    <p style={{
                      fontSize: DESIGN_TOKENS.typography.fontSize.body,
                      color: DESIGN_TOKENS.colors.text.secondary,
                      lineHeight: 1.7,
                      opacity: visibleSections.has(3) ? 1 : 0,
                      transform: visibleSections.has(3) ? 'translateY(0)' : 'translateY(20px)',
                      transition: `all 0.8s ease ${0.4 + index * 0.15}s`,
                    }}>
                      {benefit.description}
                    </p>
                    {benefit.highlight && (
                      <div style={{
                        marginTop: '1rem',
                        fontSize: '1.1rem',
                        fontWeight: DESIGN_TOKENS.typography.fontWeight.bold,
                        color: DESIGN_TOKENS.colors.text.primary,
                      }}>
                        <AnimatedCounter 
                          value={benefit.highlight} 
                          duration={2000} 
                          inView={visibleSections.has(3)} 
                        />
                      </div>
                    )}
                  </div>
                </AnimatedCard>
              ))}
            </div>

            {/* 创作者收益增长图表 */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '6rem',
              width: '100%',
            }}>
              <ModernChart
                type="multiLine"
                title={content.charts.creatorIncome.title}
                subtitle={content.charts.creatorIncome.subtitle}
                multiSeriesData={[
                  {
                    name: content.charts.creatorIncome.series.mvp,
                    color: '#1e40af',
                    data: [
                      { label: content.charts.creatorIncome.timeLabels.before, value: 8500 },
                      { label: content.charts.creatorIncome.timeLabels.month1, value: 15200 },
                      { label: content.charts.creatorIncome.timeLabels.month2, value: 22800 },
                      { label: content.charts.creatorIncome.timeLabels.month3, value: 31500 },
                      { label: content.charts.creatorIncome.timeLabels.month4, value: 42300 },
                      { label: content.charts.creatorIncome.timeLabels.month6, value: 58900 },
                      { label: content.charts.creatorIncome.timeLabels.month8, value: 67200 },
                      { label: content.charts.creatorIncome.timeLabels.month12, value: 85600 }
                    ]
                  },
                  {
                    name: content.charts.creatorIncome.series.industry,
                    color: '#7c3aed',
                    data: [
                      { label: content.charts.creatorIncome.timeLabels.before, value: 8500 },
                      { label: content.charts.creatorIncome.timeLabels.month1, value: 9200 },
                      { label: content.charts.creatorIncome.timeLabels.month2, value: 11800 },
                      { label: content.charts.creatorIncome.timeLabels.month3, value: 14200 },
                      { label: content.charts.creatorIncome.timeLabels.month4, value: 17600 },
                      { label: content.charts.creatorIncome.timeLabels.month6, value: 21800 },
                      { label: content.charts.creatorIncome.timeLabels.month8, value: 25300 },
                      { label: content.charts.creatorIncome.timeLabels.month12, value: 32400 }
                    ]
                  },
                  {
                    name: content.charts.creatorIncome.series.independent,
                    color: '#db2777',
                    data: [
                      { label: content.charts.creatorIncome.timeLabels.before, value: 8500 },
                      { label: content.charts.creatorIncome.timeLabels.month1, value: 7800 },
                      { label: content.charts.creatorIncome.timeLabels.month2, value: 8900 },
                      { label: content.charts.creatorIncome.timeLabels.month3, value: 10200 },
                      { label: content.charts.creatorIncome.timeLabels.month4, value: 12100 },
                      { label: content.charts.creatorIncome.timeLabels.month6, value: 15800 },
                      { label: content.charts.creatorIncome.timeLabels.month8, value: 18200 },
                      { label: content.charts.creatorIncome.timeLabels.month12, value: 22700 }
                    ]
                  }
                ]}
                data={[]} // 保留空数组以满足接口要求
                inView={visibleSections.has(3)}
                delay={0.8}
              />
            </div>

            <AnimatedCard delay={0.8} inView={visibleSections.has(3)}>
              <div style={{
                padding: '3rem',
                borderRadius: '1rem',
                textAlign: 'center',
                ...createGlassStyles(false),
              }}>
                <p style={{
                  fontSize: '1.2rem',
                  fontStyle: 'italic',
                  marginBottom: '1rem',
                  lineHeight: 1.8,
                  opacity: visibleSections.has(3) ? 1 : 0,
                  transform: visibleSections.has(3) ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.8s ease 0.9s',
                }}>
                  "{content.forCreators.testimonial.quote}"
                </p>
                <p style={{
                  fontSize: DESIGN_TOKENS.typography.fontSize.small,
                  color: DESIGN_TOKENS.colors.text.secondary,
                  opacity: visibleSections.has(3) ? 1 : 0,
                  transform: visibleSections.has(3) ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.8s ease 1.0s',
                }}>
                  — {content.forCreators.testimonial.author}
                </p>
              </div>
            </AnimatedCard>
          </div>
        </PageSection>

        {/* For Brands Section */}
        <PageSection
          sectionRef={el => sectionRefs.current[4] = el}
          isVisible={visibleSections.has(4)}
          style={{ 
            minHeight: '140vh',
            paddingTop: '8vh',
            paddingBottom: '8vh',
          }}
        >
          <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
            <AnimatedCard inView={visibleSections.has(4)}>
              <h2 style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.heading,
                fontWeight: DESIGN_TOKENS.typography.fontWeight.bold, // 增加一级粗细
                marginBottom: '1rem',
                textAlign: 'center',
              }}>
                <AnimatedText
                  text={content.forBrands.title}
                  inView={visibleSections.has(4)}
                />
              </h2>
              <p style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.body,
                color: DESIGN_TOKENS.colors.text.secondary,
                textAlign: 'center',
                marginBottom: DESIGN_TOKENS.spacing.gap.content,
                opacity: visibleSections.has(4) ? 1 : 0,
                transform: visibleSections.has(4) ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s ease 0.3s',
              }}>
                <FastAnimatedText
                  text={content.forBrands.subtitle}
                  inView={visibleSections.has(4)}
                  delay={0.3}
                />
              </p>
            </AnimatedCard>

            <div style={{
              display: 'grid',
              gap: '2rem',
              marginBottom: '3rem',
            }}>
              {content.forBrands.services.map((service, index) => (
                <AnimatedCard key={index} delay={0.2 + index * 0.15} inView={visibleSections.has(4)}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '2rem',
                    padding: '2.5rem',
                    borderRadius: '1rem',
                    alignItems: 'center',
                    ...createGlassStyles(false),
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    const card = e.currentTarget as HTMLDivElement;
                    card.style.transform = 'translateX(8px)';
                  }}
                  onMouseLeave={(e) => {
                    const card = e.currentTarget as HTMLDivElement;
                    card.style.transform = 'translateX(0)';
                  }}
                  >
                    <div>
                      <h3 style={{
                        fontSize: '1.5rem',
                        fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold, // 增加一级粗细
                        marginBottom: '1rem',
                      }}>
                        {service.title}
                      </h3>
                      <p style={{
                        fontSize: DESIGN_TOKENS.typography.fontSize.body,
                        color: DESIGN_TOKENS.colors.text.secondary,
                        lineHeight: 1.7,
                        opacity: visibleSections.has(4) ? 1 : 0,
                        transform: visibleSections.has(4) ? 'translateY(0)' : 'translateY(20px)',
                        transition: `all 0.8s ease ${0.4 + index * 0.15}s`,
                      }}>
                        {service.description}
                      </p>
                    </div>
                    {service.results && (
                      <div style={{
                        fontSize: '1.1rem',
                        fontWeight: DESIGN_TOKENS.typography.fontWeight.bold,
                        color: DESIGN_TOKENS.colors.text.primary,
                        whiteSpace: 'nowrap',
                      }}>
                        <AnimatedCounter 
                          value={service.results} 
                          duration={2200} 
                          inView={visibleSections.has(4)} 
                        />
                      </div>
                    )}
                  </div>
                </AnimatedCard>
              ))}
            </div>

            {/* 客户满意度图表 */}
            <div style={{
              width: '100%',
              marginBottom: '8vh',
            }}>
              <ModernChart
                type="radialProgress"
                title={content.charts.satisfaction.title}
                subtitle={content.charts.satisfaction.subtitle}
                data={[{ label: content.charts.satisfaction.label, value: 94 }]}
                maxValue={100}
                showPercentage={true}
                inView={visibleSections.has(4)}
                delay={0.8}
              />
            </div>

            {/* 营销效果对比图表 */}
            <div style={{
              width: '100%',
              marginBottom: '8vh',
            }}>
              <ModernChart
                type="comparisonBar"
                title={content.charts.comparison.title}
                subtitle={content.charts.comparison.subtitle}
                multiSeriesData={[
                  {
                    name: content.charts.comparison.series.mvp,
                    color: '#1e40af',
                    data: [
                      { label: content.charts.comparison.metrics.brandAwareness, value: 285 },
                      { label: content.charts.comparison.metrics.engagement, value: 340 },
                      { label: content.charts.comparison.metrics.roi, value: 380 },
                      { label: content.charts.comparison.metrics.conversion, value: 265 },
                      { label: content.charts.comparison.metrics.retention, value: 290 },
                      { label: content.charts.comparison.metrics.reputation, value: 315 }
                    ]
                  },
                  {
                    name: content.charts.comparison.series.industry,
                    color: '#9ca3af',
                    data: [
                      { label: content.charts.comparison.metrics.brandAwareness, value: 100 },
                      { label: content.charts.comparison.metrics.engagement, value: 100 },
                      { label: content.charts.comparison.metrics.roi, value: 100 },
                      { label: content.charts.comparison.metrics.conversion, value: 100 },
                      { label: content.charts.comparison.metrics.retention, value: 100 },
                      { label: content.charts.comparison.metrics.reputation, value: 100 }
                    ]
                  }
                ]}
                data={[]} // 保留空数组以满足接口要求
                showPercentage={false}
                inView={visibleSections.has(4)}
                delay={1.0}
              />
            </div>

            {/* 投放平台生态 */}
            <AnimatedCard delay={1.2} inView={visibleSections.has(4)}>
              <div style={{
                padding: '3rem 2rem',
                borderRadius: '1rem',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
              }}>
                <h3 style={{
                  fontSize: 'clamp(1.4rem, 3.5vw, 2.45rem)',
                  fontWeight: DESIGN_TOKENS.typography.fontWeight.bold, // 增加一级粗细
                  marginBottom: '1rem',
                  textAlign: 'center',
                  color: DESIGN_TOKENS.colors.text.primary,
                }}>
                  <AnimatedText
                    text={content.platforms.title}
                    inView={visibleSections.has(4)}
                    delay={1.2}
                  />
                </h3>
                <p style={{
                  fontSize: DESIGN_TOKENS.typography.fontSize.body,
                  color: DESIGN_TOKENS.colors.text.secondary,
                  textAlign: 'center',
                  marginBottom: '3rem',
                  lineHeight: 1.6,
                  opacity: visibleSections.has(4) ? 1 : 0,
                  transform: visibleSections.has(4) ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.8s ease 1.4s',
                }}>
                  {content.platforms.subtitle}
                </p>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '2rem',
                  marginBottom: '2rem',
                }}>
                  {/* 中国市场平台 */}
                  <div style={{
                    padding: '2rem',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                  }}>
                    <h4 style={{
                      fontSize: '1.2rem',
                      fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold, // 增加一级粗细
                      color: DESIGN_TOKENS.colors.text.primary,
                      marginBottom: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}>
                      <span style={{
                        display: 'inline-block',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#1e40af',
                      }}></span>
                      <FastAnimatedText
                        text={content.platforms.china.title}
                        inView={visibleSections.has(4)}
                        delay={1.6}
                      />
                    </h4>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                    }}>
                      {content.platforms.china.platforms.map((platform, index) => (
                        <span
                          key={index}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: 'rgba(80, 80, 80, 0.8)',
                            background: 'rgba(255, 255, 255, 0.12)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => {
                            const el = e.currentTarget;
                            el.style.background = 'rgba(255, 255, 255, 0.2)';
                            el.style.transform = 'translateY(-1px) scale(1.02)';
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget;
                            el.style.background = 'rgba(255, 255, 255, 0.12)';
                            el.style.transform = 'translateY(0) scale(1)';
                          }}
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 海外市场平台 */}
                  <div style={{
                    padding: '2rem',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                  }}>
                    <h4 style={{
                      fontSize: '1.2rem',
                      fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold, // 增加一级粗细
                      color: DESIGN_TOKENS.colors.text.primary,
                      marginBottom: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}>
                      <span style={{
                        display: 'inline-block',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#7c3aed',
                      }}></span>
                      <FastAnimatedText
                        text={content.platforms.overseas.title}
                        inView={visibleSections.has(4)}
                        delay={1.6}
                      />
                    </h4>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                    }}>
                      {content.platforms.overseas.platforms.map((platform, index) => (
                        <span
                          key={index}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: 'rgba(80, 80, 80, 0.8)',
                            background: 'rgba(255, 255, 255, 0.12)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => {
                            const el = e.currentTarget;
                            el.style.background = 'rgba(255, 255, 255, 0.2)';
                            el.style.transform = 'translateY(-1px) scale(1.02)';
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget;
                            el.style.background = 'rgba(255, 255, 255, 0.12)';
                            el.style.transform = 'translateY(0) scale(1)';
                          }}
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.1), rgba(124, 58, 237, 0.1))',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}>
                  <p style={{
                    fontSize: '1rem',
                    fontWeight: '500',
                    color: DESIGN_TOKENS.colors.text.primary,
                    margin: 0,
                    lineHeight: 1.6,
                  }}>
                    <strong>{content.platforms.summary.platforms}</strong> {content.platforms.summary.platformsLabel} | <strong>{content.platforms.summary.successRate}</strong> {content.platforms.summary.successLabel} | <strong>{content.platforms.summary.monitoring}</strong> {content.platforms.summary.monitoringLabel}
                  </p>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </PageSection>

        {/* Process Section */}
        <PageSection
          sectionRef={el => sectionRefs.current[5] = el}
          isVisible={visibleSections.has(5)}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <AnimatedCard inView={visibleSections.has(5)}>
              <h2 style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.heading,
                fontWeight: DESIGN_TOKENS.typography.fontWeight.bold, // 增加一级粗细
                marginBottom: DESIGN_TOKENS.spacing.gap.content,
                textAlign: 'center',
              }}>
                <AnimatedText
                  text={content.process.title}
                  inView={visibleSections.has(5)}
                />
              </h2>
            </AnimatedCard>

            <div style={{
              display: 'grid',
              gap: '1rem',
              maxWidth: '800px',
              margin: '0 auto',
            }}>
              {content.process.steps.map((step, index) => (
                <AnimatedCard key={index} delay={0.2 + index * 0.1} inView={visibleSections.has(5)}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr',
                    gap: '2rem',
                    padding: '2rem',
                    alignItems: 'center',
                    borderBottom: index < content.process.steps.length - 1 ? '1px solid rgba(80, 80, 80, 0.05)' : 'none',
                  }}>
                    <div style={{
                      fontSize: '3rem',
                      fontWeight: DESIGN_TOKENS.typography.fontWeight.bold,
                      color: DESIGN_TOKENS.colors.text.tertiary,
                    }}>
                      {step.number}
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: '1.3rem',
                        fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold, // 增加一级粗细
                        marginBottom: '0.5rem',
                      }}>
                        {step.title}
                      </h3>
                      <p style={{
                        fontSize: DESIGN_TOKENS.typography.fontSize.body,
                        color: DESIGN_TOKENS.colors.text.secondary,
                        lineHeight: 1.6,
                        opacity: visibleSections.has(5) ? 1 : 0,
                        transform: visibleSections.has(5) ? 'translateY(0)' : 'translateY(20px)',
                        transition: `all 0.8s ease ${0.3 + index * 0.1}s`,
                      }}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </PageSection>

        {/* Conclusion Section */}
        <PageSection
          sectionRef={el => sectionRefs.current[6] = el}
          isVisible={visibleSections.has(6)}
          style={{ minHeight: '60vh' }}
        >
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <AnimatedCard inView={visibleSections.has(6)}>
              <h2 style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.heading,
                fontWeight: DESIGN_TOKENS.typography.fontWeight.bold, // 增加一级粗细
                marginBottom: '2rem',
              }}>
                <AnimatedText
                  text={content.conclusion.title}
                  inView={visibleSections.has(6)}
                />
              </h2>
              <p style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.body,
                color: DESIGN_TOKENS.colors.text.secondary,
                lineHeight: 1.8,
                opacity: visibleSections.has(6) ? 1 : 0,
                transform: visibleSections.has(6) ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s ease 0.3s',
              }}>
                {content.conclusion.message}
              </p>
            </AnimatedCard>
          </div>
        </PageSection>

        {/* CTA Section */}
        <PageSection
          sectionRef={el => sectionRefs.current[7] = el}
          isVisible={visibleSections.has(7)}
          style={{ minHeight: '50vh' }}
        >
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', width: '100%' }}>
            <AnimatedCard inView={visibleSections.has(7)}>
              <h2 style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.subtitle,
                fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold, // 增加一级粗细
                marginBottom: DESIGN_TOKENS.spacing.gap.hero,
              }}>
                <FastAnimatedText
                  text={content.cta.title}
                  inView={visibleSections.has(7)}
                />
              </h2>
            </AnimatedCard>
            
            <AnimatedCard delay={0.3} inView={visibleSections.has(7)}>
              <div style={{
                display: 'flex',
                gap: '1.5rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
                pointerEvents: 'auto',
              }}>
                <button
                  style={{
                    padding: '1rem 3rem',
                    fontSize: '1.1rem',
                    color: DESIGN_TOKENS.colors.text.primary,
                    border: 'none',
                    borderRadius: '3rem',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    ...createGlassStyles(false),
                  }}
                  onMouseEnter={(e) => {
                    const btn = e.currentTarget;
                    btn.style.transform = 'scale(1.08)';
                    btn.style.borderRadius = '24px';
                    Object.assign(btn.style, createGlassStyles(true));
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.currentTarget;
                    btn.style.transform = 'scale(1)';
                    btn.style.borderRadius = '3rem';
                    Object.assign(btn.style, createGlassStyles(false));
                  }}
                >
                  {content.cta.buttons.brands}
                </button>
                
                <button
                  style={{
                    padding: '1rem 3rem',
                    fontSize: '1.1rem',
                    color: DESIGN_TOKENS.colors.text.primary,
                    border: 'none',
                    borderRadius: '3rem',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    ...createGlassStyles(false),
                  }}
                  onMouseEnter={(e) => {
                    const btn = e.currentTarget;
                    btn.style.transform = 'scale(1.08)';
                    btn.style.borderRadius = '24px';
                    Object.assign(btn.style, createGlassStyles(true));
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.currentTarget;
                    btn.style.transform = 'scale(1)';
                    btn.style.borderRadius = '3rem';
                    Object.assign(btn.style, createGlassStyles(false));
                  }}
                >
                  {content.cta.buttons.creators}
                </button>
              </div>
            </AnimatedCard>
          </div>
        </PageSection>

        {/* Footer */}
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
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        * {
          box-sizing: border-box;
        }

        svg {
          shape-rendering: crispEdges;
        }

        html {
          scroll-behavior: smooth;
        }

        ::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }

        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

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
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
import LanguageSwitcher from './components/LanguageSwitcher';
import NavigationButtons from './components/NavigationButtons';
import ScrollIndicator from './components/ScrollIndicator';
import LogoMaskLayer from './components/LogoMaskLayer';
import PageSection from './components/PageSection';
import BackToTopButton from './components/BackToTopButton';
import AnimatedCard from './components/AnimatedCard';
import AnimatedCounter from './components/AnimatedCounter';
import WorldMapAnimation from './components/WorldMapAnimation';

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
            }}>
              <AnimatedText
                text={content.hero.subtitle}
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
                text={content.hero.tagline}
                delay={0.6}
                inView={visibleSections.has(0) && scrollProgress > 0.5}
              />
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
            minHeight: '120vh', // 增加高度
            paddingTop: '8vh',   // 下移一点
          }}
        >
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            width: '100%',
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8vh', // 增加间距
          }}>
            
            {/* 标题区域 */}
            <div style={{ 
              textAlign: 'center',
              maxWidth: '900px',
            }}>
              <AnimatedCard inView={visibleSections.has(1)}>
                <h2 style={{
                  fontSize: DESIGN_TOKENS.typography.fontSize.heading,
                  fontWeight: DESIGN_TOKENS.typography.fontWeight.light,
                  marginBottom: DESIGN_TOKENS.spacing.gap.content,
                  textAlign: 'center',
                  color: DESIGN_TOKENS.colors.text.primary,
                }}>
                  <AnimatedText
                    text={content.about.title}
                    inView={visibleSections.has(1)}
                  />
                </h2>
              </AnimatedCard>
              
              {/* 合并的描述文字 - 一个玻璃卡片 */}
              <AnimatedCard delay={0.3} inView={visibleSections.has(1)}>
                <div style={{
                  padding: '2.5rem',
                  borderRadius: '1.5rem',
                  marginBottom: '2rem',
                  ...createGlassStyles(false),
                }}>
                  {content.about.description.map((text, index) => (
                    <p key={index} style={{
                      fontSize: DESIGN_TOKENS.typography.fontSize.body,
                      lineHeight: 1.8,
                      color: DESIGN_TOKENS.colors.text.secondary,
                      textAlign: 'center',
                      margin: index === content.about.description.length - 1 ? 0 : '0 0 1.5rem 0',
                    }}>
                      {text}
                    </p>
                  ))}
                </div>
              </AnimatedCard>
            </div>

            {/* 统计数据区域 - 增加高度，包含地图动画背景 */}
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '900px',
              minHeight: '50vh', // 增加统计区域高度
              display: 'flex',
              alignItems: 'center',
            }}>
              {/* 世界地图动画背景 - 增加高度 */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '1400px',
                height: '900px', // 增加动画区域高度
                zIndex: 0,
              }}>
                <WorldMapAnimation 
                  inView={visibleSections.has(1)}
                  className="about-section-background"
                />
              </div>

              {/* 统计数据网格 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '4rem', // 增加间距
                textAlign: 'center',
                position: 'relative',
                zIndex: 2,
                width: '100%',
              }}>
                {content.about.stats.map((stat, index) => (
                  <AnimatedCard key={index} delay={0.5 + index * 0.1} inView={visibleSections.has(1)}>
                    <div>
                      <div style={{
                        fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                        fontWeight: DESIGN_TOKENS.typography.fontWeight.bold,
                        marginBottom: '0.5rem',
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
                      }}>
                        {stat.label}
                      </div>
                      <div style={{
                        fontSize: DESIGN_TOKENS.typography.fontSize.small,
                        color: DESIGN_TOKENS.colors.text.tertiary,
                      }}>
                        {stat.subtitle}
                      </div>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            </div>
          </div>
        </PageSection>

        {/* For Creators Section */}
        <PageSection
          sectionRef={el => sectionRefs.current[3] = el}
          isVisible={visibleSections.has(3)}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <AnimatedCard inView={visibleSections.has(3)}>
              <h2 style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.heading,
                fontWeight: DESIGN_TOKENS.typography.fontWeight.light,
                marginBottom: '1rem',
                textAlign: 'center',
              }}>
                {content.forCreators.title}
              </h2>
              <p style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.body,
                color: DESIGN_TOKENS.colors.text.secondary,
                textAlign: 'center',
                marginBottom: DESIGN_TOKENS.spacing.gap.content,
              }}>
                {content.forCreators.subtitle}
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
                      fontWeight: DESIGN_TOKENS.typography.fontWeight.regular,
                      marginBottom: '1rem',
                    }}>
                      {benefit.title}
                    </h3>
                    <p style={{
                      fontSize: DESIGN_TOKENS.typography.fontSize.body,
                      color: DESIGN_TOKENS.colors.text.secondary,
                      lineHeight: 1.7,
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
                }}>
                  "{content.forCreators.testimonial.quote}"
                </p>
                <p style={{
                  fontSize: DESIGN_TOKENS.typography.fontSize.small,
                  color: DESIGN_TOKENS.colors.text.secondary,
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
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <AnimatedCard inView={visibleSections.has(4)}>
              <h2 style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.heading,
                fontWeight: DESIGN_TOKENS.typography.fontWeight.light,
                marginBottom: '1rem',
                textAlign: 'center',
              }}>
                {content.forBrands.title}
              </h2>
              <p style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.body,
                color: DESIGN_TOKENS.colors.text.secondary,
                textAlign: 'center',
                marginBottom: DESIGN_TOKENS.spacing.gap.content,
              }}>
                {content.forBrands.subtitle}
              </p>
            </AnimatedCard>

            <div style={{
              display: 'grid',
              gap: '2rem',
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
                        fontWeight: DESIGN_TOKENS.typography.fontWeight.regular,
                        marginBottom: '1rem',
                      }}>
                        {service.title}
                      </h3>
                      <p style={{
                        fontSize: DESIGN_TOKENS.typography.fontSize.body,
                        color: DESIGN_TOKENS.colors.text.secondary,
                        lineHeight: 1.7,
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
                fontWeight: DESIGN_TOKENS.typography.fontWeight.light,
                marginBottom: DESIGN_TOKENS.spacing.gap.content,
                textAlign: 'center',
              }}>
                {content.process.title}
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
                        fontWeight: DESIGN_TOKENS.typography.fontWeight.regular,
                        marginBottom: '0.5rem',
                      }}>
                        {step.title}
                      </h3>
                      <p style={{
                        fontSize: DESIGN_TOKENS.typography.fontSize.body,
                        color: DESIGN_TOKENS.colors.text.secondary,
                        lineHeight: 1.6,
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
                fontWeight: DESIGN_TOKENS.typography.fontWeight.light,
                marginBottom: '2rem',
              }}>
                {content.conclusion.title}
              </h2>
              <p style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.body,
                color: DESIGN_TOKENS.colors.text.secondary,
                lineHeight: 1.8,
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
                fontWeight: DESIGN_TOKENS.typography.fontWeight.light,
                marginBottom: DESIGN_TOKENS.spacing.gap.hero,
              }}>
                {content.cta.title}
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
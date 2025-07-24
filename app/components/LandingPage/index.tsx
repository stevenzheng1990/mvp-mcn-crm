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

import { 
  getCssVariables, 
  createGlassStyles,
  getGlassBarNavItemStyles,
  getGlassBarNavItemHoverStyles,
  getGlassBarSpecialItemStyles,
  getGlassBarSpecialItemHoverStyles
} from './LandingPage.styles';
import { useScrollProgress } from './hooks/useScrollProgress';
// import { useResponsive } from './hooks/useResponsive';
// import { getResponsiveSpacing, createMobileOptimizedGlassStyles, getTouchFriendlyStyles, getMobileNavigationStyles } from './LandingPage.styles';
// 子组件导入
import AnimatedText from './components/AnimatedText';
import FastAnimatedText from './components/FastAnimatedText';
import ScrollIndicator from './components/ScrollIndicator';
import LogoMaskLayer from './components/LogoMaskLayer';
import PageSection from './components/PageSection';
import AnimatedCard from './components/AnimatedCard';
import AnimatedCounter from './components/AnimatedCounter';
import SurroundingLogos from './components/SurroundingLogos';
import GrowthMetrics from './components/GrowthMetrics';
import ClientSatisfactionMetrics from './components/ClientSatisfactionMetrics';
import MarketingEffectivenessMetrics from './components/MarketingEffectivenessMetrics';
import ModernChart from './components/ModernChart';
import ScrollingTags from './components/ScrollingTags';
import PlatformLogosScroller from './components/PlatformLogosScroller';
import GlassSurface from './components/GlassSurface';
// import ResponsiveContainer from './components/ResponsiveContainer';
// import ResponsiveGrid from './components/ResponsiveGrid';
// import ResponsiveText from './components/ResponsiveText';

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToSystem }) => {
  // 根据浏览器语言设置初始语言
  const getInitialLanguage = (): Language => {
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language || navigator.languages?.[0];
      return browserLang?.toLowerCase().includes('zh') ? 'zh' : 'en';
    }
    return 'zh';
  };

  // 状态管理
  const [language, setLanguage] = useState<Language>(getInitialLanguage());
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set([0]));
  const [hasSeenAbout, setHasSeenAbout] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // 自定义 Hook
  const { scrollProgress, maskOpacity } = useScrollProgress();
  // const { device, isMobile, isTablet, isDesktop, width } = useResponsive();
  // const spacing = getResponsiveSpacing(device);
  
  // ScrollingTags 可见性控制 - 基于 scrollProgress，避免额外的滚动监听
  const isScrollingTagsVisible = scrollProgress > 0.2; // 当滚动进度超过20%时显示
  
  // Refs
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // 获取当前语言内容
  const content = getContent(language);

  // CSS 变量
  const cssVariables = getCssVariables();

  // 检测移动端
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


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
              // 如果是about section（index 1）变可见，记录状态
              if (index === 1) {
                setHasSeenAbout(true);
              }
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
        width: '100%',
        minHeight: '100vh',
        overflowX: 'hidden',
        overflowY: 'auto',
        backgroundColor: 'white', // 添加白色背景防止黑边
        fontFamily: DESIGN_TOKENS.typography.fontFamily,
        letterSpacing: DESIGN_TOKENS.typography.letterSpacing,
        ...cssVariables,
      }}
    >
      {/* 背景层 - FluidSimulation */}
      <div className="background-layer" style={{ 
        position: 'fixed', 
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        width: 'calc(100vw + 4px)',
        height: 'calc(100vh + 4px)',
        zIndex: 0,
        overflow: 'hidden'
      }}>
        <FluidSimulation className="w-full h-full" />
      </div>


      {/* Logo遮罩层 */}
      <LogoMaskLayer
        scrollProgress={scrollProgress}
        maskOpacity={maskOpacity}
        onLogoClick={() => {
          // 立即开始滚动，无延迟
          const targetScroll = window.innerHeight * 2.9;
          const startScroll = window.pageYOffset;
          const distance = targetScroll - startScroll;
          const duration = 1500; // 缩短到1.5秒
          const startTime = performance.now(); // 使用performance.now()更精确
          
          const animation = (currentTime: number) => {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // 使用更快的缓动函数
            const easeOutQuad = (t: number) => {
              return t * (2 - t);
            };
            
            window.scrollTo(0, startScroll + distance * easeOutQuad(progress));
            
            if (progress < 1) {
              requestAnimationFrame(animation);
            }
          };
          
          // 立即执行第一帧
          animation(performance.now());
        }}
      />

      {/* 固定元素层 */}
      <div className="fixed-elements">
        {/* 玻璃长条 */}
        <div style={{
          position: 'fixed',
          // 当滚动回到遮罩动画区域时（scrollProgress < 0.8），菜单栏上滑消失
          top: hasSeenAbout && scrollProgress > 0.8 ? '30px' : '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          opacity: hasSeenAbout && scrollProgress > 0.8 ? 1 : 0,
          transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          pointerEvents: hasSeenAbout && scrollProgress > 0.8 ? 'auto' : 'none',
          ...(isMobile && {
            width: '100%',
            maxWidth: '95vw',
          })
        }}>
          <GlassSurface className="glass-bar">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '0.8rem' : (language === 'en' ? '0.8rem' : '1.2rem'),
              padding: isMobile ? '0 1rem' : '0 2rem',
              flexWrap: isMobile && window.innerWidth < 480 ? 'wrap' : 'nowrap',
              justifyContent: 'center',
            }}>
              <span
                style={{
                  ...getGlassBarNavItemStyles(language),
                  fontSize: DESIGN_TOKENS.typography.level5.fontSize,
                  fontWeight: DESIGN_TOKENS.typography.level5.fontWeight,
                  lineHeight: DESIGN_TOKENS.typography.level5.lineHeight,
                }}
                onClick={() => {
                  const element = sectionRefs.current[1];
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, {
                    ...getGlassBarNavItemStyles(language),
                    ...getGlassBarNavItemHoverStyles()
                  });
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.currentTarget.style, getGlassBarNavItemStyles(language));
                }}
              >
{content.navigation.about}
              </span>
              
              {!isMobile && <div style={{
                width: '1px',
                height: '20px',
                background: 'rgba(100, 100, 100, 0.3)',
              }} />}
              
              <span
                style={{
                  ...getGlassBarNavItemStyles(language),
                  fontSize: DESIGN_TOKENS.typography.level5.fontSize,
                  fontWeight: DESIGN_TOKENS.typography.level5.fontWeight,
                  lineHeight: DESIGN_TOKENS.typography.level5.lineHeight,
                }}
                onClick={() => {
                  const element = sectionRefs.current[3];
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, {
                    ...getGlassBarNavItemStyles(language),
                    ...getGlassBarNavItemHoverStyles()
                  });
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.currentTarget.style, getGlassBarNavItemStyles(language));
                }}
              >
{content.navigation.creators}
              </span>
              
              {!isMobile && <div style={{
                width: '1px',
                height: '20px',
                background: 'rgba(100, 100, 100, 0.3)',
              }} />}
              
              <span
                style={{
                  ...getGlassBarNavItemStyles(language),
                  fontSize: DESIGN_TOKENS.typography.level5.fontSize,
                  fontWeight: DESIGN_TOKENS.typography.level5.fontWeight,
                  lineHeight: DESIGN_TOKENS.typography.level5.lineHeight,
                }}
                onClick={() => {
                  const element = sectionRefs.current[4];
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, {
                    ...getGlassBarNavItemStyles(language),
                    ...getGlassBarNavItemHoverStyles()
                  });
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.currentTarget.style, getGlassBarNavItemStyles(language));
                }}
              >
{content.navigation.brands}
              </span>
              
              {!isMobile && <div style={{
                width: '1px',
                height: '20px',
                background: 'rgba(100, 100, 100, 0.3)',
              }} />}
              
              <span
                style={{
                  ...getGlassBarNavItemStyles(language),
                  fontSize: DESIGN_TOKENS.typography.level5.fontSize,
                  fontWeight: DESIGN_TOKENS.typography.level5.fontWeight,
                  lineHeight: DESIGN_TOKENS.typography.level5.lineHeight,
                }}
                onClick={() => {
                  const element = sectionRefs.current[5];
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, {
                    ...getGlassBarNavItemStyles(language),
                    ...getGlassBarNavItemHoverStyles()
                  });
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.currentTarget.style, getGlassBarNavItemStyles(language));
                }}
              >
{content.navigation.process}
              </span>
              
              {!isMobile && <div style={{
                width: '1px',
                height: '20px',
                background: 'rgba(100, 100, 100, 0.3)',
              }} />}
              
              <span
                style={{
                  ...getGlassBarSpecialItemStyles(language),
                  fontSize: DESIGN_TOKENS.typography.level5.fontSize,
                  fontWeight: DESIGN_TOKENS.typography.level5.fontWeight,
                  lineHeight: DESIGN_TOKENS.typography.level5.lineHeight,
                }}
                onClick={onNavigateToSystem}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, {
                    ...getGlassBarSpecialItemStyles(language),
                    ...getGlassBarSpecialItemHoverStyles()
                  });
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.currentTarget.style, getGlassBarSpecialItemStyles(language));
                }}
              >
{content.navigation.system}
              </span>
              
              {!isMobile && <div style={{
                width: '1px',
                height: '20px',
                background: 'rgba(100, 100, 100, 0.3)',
              }} />}
              
              <span
                style={{
                  ...getGlassBarSpecialItemStyles(language),
                  fontSize: DESIGN_TOKENS.typography.level5.fontSize,
                  fontWeight: DESIGN_TOKENS.typography.level5.fontWeight,
                  lineHeight: DESIGN_TOKENS.typography.level5.lineHeight,
                }}
                onClick={() => {}}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, {
                    ...getGlassBarSpecialItemStyles(language),
                    ...getGlassBarSpecialItemHoverStyles()
                  });
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.currentTarget.style, getGlassBarSpecialItemStyles(language));
                }}
              >
{content.navigation.contact}
              </span>
              
              {!isMobile && <div style={{
                width: '1px',
                height: '20px',
                background: 'rgba(100, 100, 100, 0.3)',
              }} />}
              
              {/* 语言切换 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}>
                <span
                  style={{
                    color: language === 'zh' ? 'rgba(40, 40, 40, 1)' : 'rgba(80, 80, 80, 0.8)',
                    fontSize: DESIGN_TOKENS.typography.level6.fontSize,
                    fontWeight: DESIGN_TOKENS.typography.level6.fontWeight,
                    lineHeight: DESIGN_TOKENS.typography.level6.lineHeight,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                    whiteSpace: 'nowrap',
                    padding: '4px 8px',
                    borderRadius: '4px',
                  }}
                  onClick={() => setLanguage('zh')}
                  onMouseEnter={(e) => {
                    if (language !== 'zh') {
                      Object.assign(e.currentTarget.style, {
                        color: 'rgba(200, 200, 200, 0.9)',
                      });
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (language !== 'zh') {
                      Object.assign(e.currentTarget.style, {
                        color: 'rgba(80, 80, 80, 0.8)',
                      });
                    }
                  }}
                >
                  中
                </span>
                <span style={{ color: 'rgba(100, 100, 100, 0.5)', fontSize: DESIGN_TOKENS.typography.level6.fontSize }}>/</span>
                <span
                  style={{
                    color: language === 'en' ? 'rgba(40, 40, 40, 1)' : 'rgba(80, 80, 80, 0.8)',
                    fontSize: DESIGN_TOKENS.typography.level6.fontSize,
                    fontWeight: DESIGN_TOKENS.typography.level6.fontWeight,
                    lineHeight: DESIGN_TOKENS.typography.level6.lineHeight,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                    whiteSpace: 'nowrap',
                    padding: '4px 8px',
                    borderRadius: '4px',
                  }}
                  onClick={() => setLanguage('en')}
                  onMouseEnter={(e) => {
                    if (language !== 'en') {
                      Object.assign(e.currentTarget.style, {
                        color: 'rgba(200, 200, 200, 0.9)',
                      });
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (language !== 'en') {
                      Object.assign(e.currentTarget.style, {
                        color: 'rgba(80, 80, 80, 0.8)',
                      });
                    }
                  }}
                >
                  En
                </span>
              </div>
            </div>
          </GlassSurface>
        </div>

        {/* 滚动指示器 */}
        <ScrollIndicator scrollProgress={scrollProgress} />
      </div>

      {/* 主内容区 */}
      <main className="main-content" style={{ position: 'relative', zIndex: 20, pointerEvents: 'none' }}>
        {/* 遮罩占位区 */}
        <div 
          className="mask-spacer" 
          style={{ 
            height: '290vh',
            willChange: 'transform',
            transform: 'translateZ(0)', // 强制GPU加速
          }} 
        />

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
              fontSize: DESIGN_TOKENS.typography.level1.fontSize,
              fontWeight: DESIGN_TOKENS.typography.level1.fontWeight,
              lineHeight: DESIGN_TOKENS.typography.level1.lineHeight,
              letterSpacing: DESIGN_TOKENS.typography.level1.letterSpacing,
              color: DESIGN_TOKENS.colors.text.primary,
              marginBottom: DESIGN_TOKENS.spacing.gap.hero,
            }}>
              <AnimatedText
                text={content.hero.title}
                inView={visibleSections.has(0) && scrollProgress > 0.5}
              />
            </h1>
            
            <h2 style={{
              fontSize: DESIGN_TOKENS.typography.level3.fontSize,
              fontWeight: DESIGN_TOKENS.typography.level3.fontWeight,
              lineHeight: DESIGN_TOKENS.typography.level3.lineHeight,
              letterSpacing: DESIGN_TOKENS.typography.level3.letterSpacing,
              color: DESIGN_TOKENS.colors.text.primary,
              marginBottom: DESIGN_TOKENS.spacing.gap.hero,
            }}>
              <FastAnimatedText
                text={content.hero.subtitle}
                delay={0.3}
                inView={visibleSections.has(0) && scrollProgress > 0.5}
              />
            </h2>
            
            <p style={{
              fontSize: DESIGN_TOKENS.typography.level4.fontSize,
              fontWeight: DESIGN_TOKENS.typography.level4.fontWeight,
              lineHeight: DESIGN_TOKENS.typography.level4.lineHeight,
              letterSpacing: DESIGN_TOKENS.typography.level4.letterSpacing,
              color: DESIGN_TOKENS.colors.text.secondary,
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
            paddingTop: DESIGN_TOKENS.spacing.gap.largeSections,
            paddingBottom: DESIGN_TOKENS.spacing.gap.largeSections,
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
            gap: '8vh', // 调整间隙，因为统计数据区域已经缩小
          }}>
            
            {/* 标题与描述区域 */}
            <div style={{ 
              textAlign: 'center',
              maxWidth: '1100px',
              width: '100%',
            }}>
              {/* 标题 */}
              <h2 style={{
                fontSize: DESIGN_TOKENS.typography.level2.fontSize,
                fontWeight: DESIGN_TOKENS.typography.level2.fontWeight,
                lineHeight: DESIGN_TOKENS.typography.level2.lineHeight,
                marginBottom: DESIGN_TOKENS.spacing.gap.subsections,
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
                    marginBottom: index === content.about.description.length - 1 ? 0 : DESIGN_TOKENS.spacing.gap.elements,
                    fontSize: DESIGN_TOKENS.typography.level4.fontSize,
                    fontWeight: DESIGN_TOKENS.typography.level4.fontWeight,
                    lineHeight: DESIGN_TOKENS.typography.level4.lineHeight,
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

            {/* 社媒Logo磁性吸附展示 */}
            <div style={{ 
              pointerEvents: 'auto', 
              position: 'relative', 
              zIndex: 2,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: DESIGN_TOKENS.spacing.gap.smallSections,
              padding: '0 2rem', // 添加左右padding防止边缘溢出
            }}>
              <SurroundingLogos 
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
                marginBottom: DESIGN_TOKENS.spacing.gap.smallSections,
              }}>
                {content.about.stats.map((stat, index) => (
                  <div key={index} style={{
                    opacity: visibleSections.has(1) ? 1 : 0,
                    transform: visibleSections.has(1) ? 'translateY(0)' : 'translateY(30px)',
                    transition: `all 0.8s ease ${0.8 + index * 0.15}s`,
                  }}>
                    <div style={{
                      fontSize: DESIGN_TOKENS.typography.level2.fontSize,
                      fontWeight: DESIGN_TOKENS.typography.level2.fontWeight,
                      lineHeight: DESIGN_TOKENS.typography.level2.lineHeight,
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
                      fontSize: DESIGN_TOKENS.typography.level5.fontSize,
                      fontWeight: DESIGN_TOKENS.typography.level5.fontWeight,
                      lineHeight: DESIGN_TOKENS.typography.level5.lineHeight,
                      color: DESIGN_TOKENS.colors.text.secondary,
                      marginBottom: '0.5rem',
                    }}>
                      {stat.label}
                    </div>
                    <div style={{
                      fontSize: DESIGN_TOKENS.typography.level6.fontSize,
                      fontWeight: DESIGN_TOKENS.typography.level6.fontWeight,
                      lineHeight: DESIGN_TOKENS.typography.level6.lineHeight,
                      color: DESIGN_TOKENS.colors.text.tertiary,
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
          paddingTop: DESIGN_TOKENS.spacing.gap.smallSections,
          paddingBottom: DESIGN_TOKENS.spacing.gap.smallSections,
          overflow: 'hidden'
        }}>
          {/* 上方滚动动画 */}
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem',
            marginBottom: DESIGN_TOKENS.spacing.gap.subsections
          }}>
            <ScrollingTags
              tags={content.contentTags.tags}
              speed={60}
              inView={isScrollingTagsVisible}
              delay={0}
            />
          </div>

          {/* 标题和副标题 */}
          <div style={{
            textAlign: 'center',
            marginBottom: DESIGN_TOKENS.spacing.gap.subsections,
            paddingLeft: '5vw',
            paddingRight: '5vw'
          }}>
            <h3 style={{
              fontSize: DESIGN_TOKENS.typography.level2.fontSize,
              fontWeight: DESIGN_TOKENS.typography.level2.fontWeight,
              lineHeight: DESIGN_TOKENS.typography.level2.lineHeight,
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              <AnimatedText
                text={content.contentTags.title}
                inView={isScrollingTagsVisible}
                delay={0.3}
              />
            </h3>
            <p style={{
              fontSize: DESIGN_TOKENS.typography.level4.fontSize,
              fontWeight: DESIGN_TOKENS.typography.level4.fontWeight,
              lineHeight: DESIGN_TOKENS.typography.level4.lineHeight,
              color: '#6b7280',
              margin: 0,
              opacity: isScrollingTagsVisible ? 1 : 0,
              transform: isScrollingTagsVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s',
            }}>
              {content.contentTags.subtitle}
            </p>
          </div>
          
          {/* 下方滚动动画 */}
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem'
          }}>
            <ScrollingTags
              tags={content.contentTags.tags}
              speed={45}
              inView={isScrollingTagsVisible}
              delay={0.6}
            />
          </div>
        </div>

        {/* For Creators Section */}
        <PageSection
          sectionRef={el => sectionRefs.current[3] = el}
          isVisible={visibleSections.has(3)}
          style={{ 
            minHeight: '100vh',
            paddingTop: DESIGN_TOKENS.spacing.section.padding.split(' ')[0],
            paddingBottom: DESIGN_TOKENS.spacing.section.padding.split(' ')[0],
          }}
        >
          <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
            {/* 标题区域 */}
            <AnimatedCard inView={visibleSections.has(3)}>
              <h2 style={{
                fontSize: DESIGN_TOKENS.typography.level2.fontSize,
                fontWeight: DESIGN_TOKENS.typography.level2.fontWeight,
                lineHeight: DESIGN_TOKENS.typography.level2.lineHeight,
                marginBottom: '1rem',
                textAlign: 'center',
              }}>
                <AnimatedText
                  text={content.forCreators.title}
                  inView={visibleSections.has(3)}
                />
              </h2>
              <p style={{
                fontSize: DESIGN_TOKENS.typography.level4.fontSize,
                fontWeight: DESIGN_TOKENS.typography.level4.fontWeight,
                lineHeight: DESIGN_TOKENS.typography.level4.lineHeight,
                color: DESIGN_TOKENS.colors.text.secondary,
                textAlign: 'center',
                marginBottom: DESIGN_TOKENS.spacing.gap.smallSections,
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

            {/* 优势展示 - 简洁卡片 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2rem',
              marginBottom: DESIGN_TOKENS.spacing.gap.smallSections,
            }}>
              {content.forCreators.benefits.map((benefit, index) => (
                <AnimatedCard key={index} delay={0.2 + index * 0.15} inView={visibleSections.has(3)}>
                  <div style={{
                    padding: '2.5rem',
                    borderRadius: '1rem',
                    ...createGlassStyles(false),
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    const card = e.currentTarget as HTMLDivElement;
                    card.style.transform = 'translateY(-4px)';
                    card.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    const card = e.currentTarget as HTMLDivElement;
                    card.style.transform = 'translateY(0)';
                    card.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.05)';
                  }}
                  >
                    <h3 style={{
                      fontSize: DESIGN_TOKENS.typography.level3.fontSize,
                      fontWeight: DESIGN_TOKENS.typography.level3.fontWeight,
                      lineHeight: DESIGN_TOKENS.typography.level3.lineHeight,
                      marginBottom: '1rem',
                      color: DESIGN_TOKENS.colors.text.primary,
                    }}>
                      {benefit.title}
                    </h3>
                    <p style={{
                      fontSize: DESIGN_TOKENS.typography.level4.fontSize,
                      fontWeight: DESIGN_TOKENS.typography.level4.fontWeight,
                      lineHeight: DESIGN_TOKENS.typography.level4.lineHeight,
                      color: DESIGN_TOKENS.colors.text.secondary,
                      margin: 0,
                    }}>
                      {benefit.description}
                    </p>
                  </div>
                </AnimatedCard>
              ))}
            </div>

            {/* 数据展示区域 */}
            <GrowthMetrics
              title={content.forCreators.creatorGrowth?.title}
              subtitle={content.forCreators.creatorGrowth?.subtitle}
              inView={visibleSections.has(3)}
              delay={0.8}
              language={language}
            />
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
                fontSize: DESIGN_TOKENS.typography.level2.fontSize,
                fontWeight: DESIGN_TOKENS.typography.level2.fontWeight,
                lineHeight: DESIGN_TOKENS.typography.level2.lineHeight,
                marginBottom: '1rem',
                textAlign: 'center',
              }}>
                <AnimatedText
                  text={content.forBrands.title}
                  inView={visibleSections.has(4)}
                />
              </h2>
              <p style={{
                fontSize: DESIGN_TOKENS.typography.level4.fontSize,
                fontWeight: DESIGN_TOKENS.typography.level4.fontWeight,
                lineHeight: DESIGN_TOKENS.typography.level4.lineHeight,
                color: DESIGN_TOKENS.colors.text.secondary,
                textAlign: 'center',
                marginBottom: DESIGN_TOKENS.spacing.gap.smallSections,
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
              marginBottom: DESIGN_TOKENS.spacing.gap.subsections,
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
                        fontSize: DESIGN_TOKENS.typography.level4.fontSize,
                        fontWeight: DESIGN_TOKENS.typography.level4.fontWeight,
                        lineHeight: DESIGN_TOKENS.typography.level4.lineHeight,
                        marginBottom: '1rem',
                      }}>
                        {service.title}
                      </h3>
                      <p style={{
                        fontSize: DESIGN_TOKENS.typography.level4.fontSize,
                        fontWeight: DESIGN_TOKENS.typography.level4.fontWeight,
                        lineHeight: DESIGN_TOKENS.typography.level4.lineHeight,
                        color: DESIGN_TOKENS.colors.text.secondary,
                        opacity: visibleSections.has(4) ? 1 : 0,
                        transform: visibleSections.has(4) ? 'translateY(0)' : 'translateY(20px)',
                        transition: `all 0.8s ease ${0.4 + index * 0.15}s`,
                      }}>
                        {service.description}
                      </p>
                    </div>
                    {service.results && (
                      <div style={{
                        fontSize: DESIGN_TOKENS.typography.level4.fontSize,
                        fontWeight: DESIGN_TOKENS.typography.level4.fontWeight,
                        lineHeight: DESIGN_TOKENS.typography.level4.lineHeight,
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

            {/* 客户满意度深度分析 */}
            <div style={{
              width: '100%',
              marginBottom: DESIGN_TOKENS.spacing.gap.mediumSections,
            }}>
              <ClientSatisfactionMetrics
                title={content.charts.satisfaction.title}
                subtitle={content.charts.satisfaction.subtitle}
                inView={visibleSections.has(4)}
                delay={0.8}
                language={language}
              />
            </div>

            {/* 营销效果综合分析 */}
            <div style={{
              width: '100%',
              marginBottom: DESIGN_TOKENS.spacing.gap.mediumSections,
            }}>
              <MarketingEffectivenessMetrics
                title={content.charts.comparison.title}
                subtitle={content.charts.comparison.subtitle}
                inView={visibleSections.has(4)}
                delay={1.0}
                language={language}
              />
            </div>

            {/* 投放平台生态 - 重新设计 */}
            <div style={{
              width: '100%',
              marginTop: DESIGN_TOKENS.spacing.gap.mediumSections,
            }}>
              {/* 主标题 */}
              <AnimatedCard delay={1.2} inView={visibleSections.has(4)}>
                <h3 style={{
                  fontSize: DESIGN_TOKENS.typography.level2.fontSize,
                  fontWeight: DESIGN_TOKENS.typography.level2.fontWeight,
                  lineHeight: DESIGN_TOKENS.typography.level2.lineHeight,
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
                  fontSize: DESIGN_TOKENS.typography.level4.fontSize,
                  fontWeight: DESIGN_TOKENS.typography.level4.fontWeight,
                  lineHeight: DESIGN_TOKENS.typography.level4.lineHeight,
                  color: DESIGN_TOKENS.colors.text.secondary,
                  textAlign: 'center',
                  marginBottom: DESIGN_TOKENS.spacing.gap.smallSections,
                  maxWidth: '800px',
                  margin: '0 auto 6rem',
                  opacity: visibleSections.has(4) ? 1 : 0,
                  transform: visibleSections.has(4) ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.8s ease 1.4s',
                }}>
                  {content.platforms.subtitle}
                </p>
              </AnimatedCard>

              {/* 平台Logo滚动展示 */}
              <div style={{
                marginBottom: DESIGN_TOKENS.spacing.gap.smallSections,
                width: '100%',
                position: 'relative',
              }}>
                <PlatformLogosScroller inView={visibleSections.has(4)} delay={1.5} />
              </div>

              {/* 内容sections */}
              {content.platforms.sections.map((section, sectionIndex) => (
                <AnimatedCard key={sectionIndex} delay={1.8 + sectionIndex * 0.3} inView={visibleSections.has(4)}>
                  <div style={{
                    marginBottom: DESIGN_TOKENS.spacing.gap.subsections,
                    padding: '3rem',
                    borderRadius: '1rem',
                    ...createGlassStyles(false),
                  }}>
                    <h4 style={{
                      fontSize: DESIGN_TOKENS.typography.level3.fontSize,
                      fontWeight: DESIGN_TOKENS.typography.level3.fontWeight,
                      lineHeight: DESIGN_TOKENS.typography.level3.lineHeight,
                      marginBottom: '1.5rem',
                      color: DESIGN_TOKENS.colors.text.primary,
                    }}>
                      {section.title}
                    </h4>
                    <p style={{
                      fontSize: DESIGN_TOKENS.typography.level4.fontSize,
                      fontWeight: DESIGN_TOKENS.typography.level4.fontWeight,
                      lineHeight: DESIGN_TOKENS.typography.level4.lineHeight,
                      color: DESIGN_TOKENS.colors.text.secondary,
                      marginBottom: DESIGN_TOKENS.spacing.gap.elements,
                    }}>
                      {section.description}
                    </p>

                    {/* 不同类型的内容展示 */}
                    {section.points && (
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                      }}>
                        {section.points.map((point, index) => (
                          <li key={index} style={{
                            marginBottom: '1rem',
                            paddingLeft: '2rem',
                            position: 'relative',
                            fontSize: DESIGN_TOKENS.typography.level5.fontSize,
                            fontWeight: DESIGN_TOKENS.typography.level5.fontWeight,
                            lineHeight: DESIGN_TOKENS.typography.level5.lineHeight,
                            color: DESIGN_TOKENS.colors.text.secondary,
                          }}>
                            <span style={{
                              position: 'absolute',
                              left: 0,
                              top: '0.5rem',
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: DESIGN_TOKENS.colors.brand.primary,
                            }} />
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.advantages && (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1.5rem',
                      }}>
                        {section.advantages.map((adv, index) => (
                          <div key={index} style={{
                            padding: '1.5rem',
                            borderRadius: '0.75rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                          >
                            <h5 style={{
                              fontSize: DESIGN_TOKENS.typography.level5.fontSize,
                              fontWeight: DESIGN_TOKENS.typography.level3.fontWeight,
                              lineHeight: DESIGN_TOKENS.typography.level5.lineHeight,
                              marginBottom: '0.5rem',
                              color: DESIGN_TOKENS.colors.text.primary,
                            }}>
                              {adv.title}
                            </h5>
                            <p style={{
                              fontSize: DESIGN_TOKENS.typography.level6.fontSize,
                              fontWeight: DESIGN_TOKENS.typography.level6.fontWeight,
                              lineHeight: DESIGN_TOKENS.typography.level6.lineHeight,
                              color: DESIGN_TOKENS.colors.text.secondary,
                              margin: 0,
                            }}>
                              {adv.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.categories && (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem',
                      }}>
                        {section.categories.map((cat, index) => (
                          <div key={index} style={{
                            padding: '2rem',
                            borderRadius: '1rem',
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.05))',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                          }}>
                            <h5 style={{
                              fontSize: DESIGN_TOKENS.typography.level3.fontSize,
                              fontWeight: DESIGN_TOKENS.typography.level3.fontWeight,
                              lineHeight: DESIGN_TOKENS.typography.level3.lineHeight,
                              marginBottom: '0.5rem',
                              color: DESIGN_TOKENS.colors.text.primary,
                            }}>
                              {cat.name}
                            </h5>
                            <p style={{
                              fontSize: DESIGN_TOKENS.typography.level5.fontSize,
                              fontWeight: DESIGN_TOKENS.typography.level3.fontWeight,
                              lineHeight: DESIGN_TOKENS.typography.level5.lineHeight,
                              color: DESIGN_TOKENS.colors.brand.primary,
                              marginBottom: '0.75rem',
                            }}>
                              {cat.platforms}
                            </p>
                            <p style={{
                              fontSize: DESIGN_TOKENS.typography.level6.fontSize,
                              fontWeight: DESIGN_TOKENS.typography.level6.fontWeight,
                              lineHeight: DESIGN_TOKENS.typography.level6.lineHeight,
                              color: DESIGN_TOKENS.colors.text.secondary,
                              margin: 0,
                            }}>
                              {cat.feature}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </AnimatedCard>
              ))}

              {/* 数据统计 */}
              <AnimatedCard delay={2.5} inView={visibleSections.has(4)}>
                <div style={{
                  padding: '4rem 2rem',
                  borderRadius: '1rem',
                  background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.05), rgba(124, 58, 237, 0.05))',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}>
                  <h4 style={{
                    fontSize: DESIGN_TOKENS.typography.level3.fontSize,
                    fontWeight: DESIGN_TOKENS.typography.level3.fontWeight,
                    lineHeight: DESIGN_TOKENS.typography.level3.lineHeight,
                    textAlign: 'center',
                    marginBottom: DESIGN_TOKENS.spacing.gap.subsections,
                    color: DESIGN_TOKENS.colors.text.primary,
                  }}>
                    {content.platforms.stats.title}
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '2rem',
                    textAlign: 'center',
                  }}>
                    {content.platforms.stats.items.map((stat, index) => (
                      <div key={index}>
                        <div style={{
                          fontSize: DESIGN_TOKENS.typography.level2.fontSize,
                          fontWeight: DESIGN_TOKENS.typography.level2.fontWeight,
                          lineHeight: DESIGN_TOKENS.typography.level2.lineHeight,
                          color: DESIGN_TOKENS.colors.brand.primary,
                          marginBottom: '0.5rem',
                        }}>
                          {stat.value}
                        </div>
                        <div style={{
                          fontSize: DESIGN_TOKENS.typography.level5.fontSize,
                          fontWeight: DESIGN_TOKENS.typography.level3.fontWeight,
                          lineHeight: DESIGN_TOKENS.typography.level5.lineHeight,
                          color: DESIGN_TOKENS.colors.text.primary,
                          marginBottom: '0.25rem',
                        }}>
                          {stat.label}
                        </div>
                        <div style={{
                          fontSize: DESIGN_TOKENS.typography.level6.fontSize,
                          fontWeight: DESIGN_TOKENS.typography.level6.fontWeight,
                          lineHeight: DESIGN_TOKENS.typography.level6.lineHeight,
                          color: DESIGN_TOKENS.colors.text.tertiary,
                        }}>
                          {stat.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedCard>
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
                fontSize: DESIGN_TOKENS.typography.level2.fontSize,
                fontWeight: DESIGN_TOKENS.typography.level2.fontWeight,
                lineHeight: DESIGN_TOKENS.typography.level2.lineHeight,
                marginBottom: DESIGN_TOKENS.spacing.gap.smallSections,
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
                      fontSize: DESIGN_TOKENS.typography.level1.fontSize,
                      fontWeight: DESIGN_TOKENS.typography.level1.fontWeight,
                      lineHeight: DESIGN_TOKENS.typography.level1.lineHeight,
                      color: DESIGN_TOKENS.colors.text.tertiary,
                    }}>
                      {step.number}
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: DESIGN_TOKENS.typography.level3.fontSize,
                        fontWeight: DESIGN_TOKENS.typography.level3.fontWeight,
                        lineHeight: DESIGN_TOKENS.typography.level3.lineHeight,
                        marginBottom: '0.5rem',
                      }}>
                        {step.title}
                      </h3>
                      <p style={{
                        fontSize: DESIGN_TOKENS.typography.level4.fontSize,
                        fontWeight: DESIGN_TOKENS.typography.level4.fontWeight,
                        lineHeight: DESIGN_TOKENS.typography.level4.lineHeight,
                        color: DESIGN_TOKENS.colors.text.secondary,
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
                fontSize: DESIGN_TOKENS.typography.level2.fontSize,
                fontWeight: DESIGN_TOKENS.typography.level2.fontWeight,
                lineHeight: DESIGN_TOKENS.typography.level2.lineHeight,
                marginBottom: DESIGN_TOKENS.spacing.gap.elements,
              }}>
                <AnimatedText
                  text={content.conclusion.title}
                  inView={visibleSections.has(6)}
                />
              </h2>
              <p style={{
                fontSize: DESIGN_TOKENS.typography.level4.fontSize,
                fontWeight: DESIGN_TOKENS.typography.level4.fontWeight,
                lineHeight: DESIGN_TOKENS.typography.level4.lineHeight,
                color: DESIGN_TOKENS.colors.text.secondary,
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
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', width: '100%' }}>
            <AnimatedCard inView={visibleSections.has(7)}>
              <h2 style={{
                fontSize: DESIGN_TOKENS.typography.level1.fontSize,
                fontWeight: DESIGN_TOKENS.typography.level1.fontWeight,
                lineHeight: DESIGN_TOKENS.typography.level1.lineHeight,
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
                    fontSize: DESIGN_TOKENS.typography.level5.fontSize,
                    fontWeight: DESIGN_TOKENS.typography.level5.fontWeight,
                    lineHeight: DESIGN_TOKENS.typography.level5.lineHeight,
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
                    fontSize: DESIGN_TOKENS.typography.level5.fontSize,
                    fontWeight: DESIGN_TOKENS.typography.level5.fontWeight,
                    lineHeight: DESIGN_TOKENS.typography.level5.lineHeight,
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
            fontSize: DESIGN_TOKENS.typography.level6.fontSize,
            fontWeight: DESIGN_TOKENS.typography.level6.fontWeight,
            lineHeight: DESIGN_TOKENS.typography.level6.lineHeight,
            color: DESIGN_TOKENS.colors.footer.text,
          }}>
            {content.footer.copyright}
          </p>
        </footer>
      </main>

      {/* 全局样式 */}
      <style jsx global>{`
        html {
          margin: 0;
          padding: 0;
          background-color: white;
          scroll-behavior: smooth;
          /* 移动端滚动优化 */
          -webkit-overflow-scrolling: touch;
          touch-action: manipulation;
        }

        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          background-color: white;
          width: 100%;
          height: 100%;
          /* 移动端优化 */
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          /* 防止移动端缩放 */
          user-zoom: fixed;
          -webkit-user-zoom: fixed;
        }

        #__next {
          background-color: white;
        }

        * {
          box-sizing: border-box;
          /* 移动端优化 */
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
        }

        svg {
          shape-rendering: crispEdges;
        }

        ::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }

        /* 移动端优化的动画性能 */
        @media (max-width: 768px) {
          * {
            animation-duration: 0.8s !important;
            transition-duration: 0.3s !important;
          }
          
          .animated-char, .fast-animated-char {
            will-change: transform, opacity;
            transform-style: flat;
          }

          /* 减少移动端的模糊效果 */
          .animated-card {
            filter: none !important;
          }
        }

        /* 高性能模式 */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
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

        /* 移动端导航优化 */
        @media (max-width: 768px) {
          .glass-bar {
            backdrop-filter: blur(8px) !important;
            -webkit-backdrop-filter: blur(8px) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
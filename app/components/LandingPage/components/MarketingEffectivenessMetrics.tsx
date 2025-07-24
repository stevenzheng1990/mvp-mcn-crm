// app/components/LandingPage/components/MarketingEffectivenessMetrics.tsx
import React from 'react';
import { DESIGN_TOKENS } from '../LandingPage.config';

interface MarketingEffectivenessMetricsProps {
  title?: string;
  subtitle?: string;
  inView?: boolean;
  delay?: number;
  language?: string;
}

const MarketingEffectivenessMetrics: React.FC<MarketingEffectivenessMetricsProps> = ({
  title,
  subtitle,
  inView = false,
  delay = 0,
  language = 'zh',
}) => {
  // 使用统一的设计系统
  const colors = DESIGN_TOKENS.colors.component;
  // fonts变量已不再使用，改为直接使用typography levels

  // 国际化内容配置
  const i18nContent = {
    zh: {
      comparison: {
        title: '投放效果对比',
        subtitle: '选择我们 VS 其他方式',
        metrics: [
          { 
            category: '曝光效果',
            our: 285,
            other: 100,
            detail: '曝光量提升185%',
          },
          {
            category: '互动率',
            our: 340,
            other: 100,
            detail: '用户互动提升240%',
          },
          {
            category: '转化效果',
            our: 265,
            other: 100,
            detail: '转化率提升165%',
          },
          {
            category: 'ROI回报',
            our: 380,
            other: 100,
            detail: 'ROI达到3.8倍',
          }
        ]
      },
      platforms: {
        title: '平台投放优势',
        subtitle: '专业数据展现竞争力',
        labels: {
          ourCPM: '我们CPM',
          marketPrice: '市场均价',
          saving: '节省'
        },
        data: [
        {
          platform: '小红书',
          metrics: {
            cpm: '¥8.5',
            engagement: '6.8%',
            conversion: '3.2%',
            advantage: '种草转化效果佳'
          },
          comparison: {
            our: '我们CPM ¥8.5',
            market: '市场均价 ¥15',
            saving: '节省43%'
          }
        },
        {
          platform: '抖音',
          metrics: {
            cpm: '¥4.2',
            engagement: '5.1%',
            conversion: '2.8%',
            advantage: '传播成本最低'
          },
          comparison: {
            our: '我们CPM ¥4.2',
            market: '市场均价 ¥7.8',
            saving: '节省46%'
          }
        },
        {
          platform: 'B站',
          metrics: {
            cpm: '¥12.5',
            engagement: '9.3%',
            conversion: '4.1%',
            advantage: '用户粘性最强'
          },
          comparison: {
            our: '我们CPM ¥12.5',
            market: '市场均价 ¥22',
            saving: '节省43%'
          }
        },
        {
          platform: '微博',
          metrics: {
            cpm: '¥6.8',
            engagement: '3.9%',
            conversion: '2.1%',
            advantage: '话题传播力强'
          },
          comparison: {
            our: '我们CPM ¥6.8',
            market: '市场均价 ¥11',
            saving: '节省38%'
          }
        }
      ]
    }
    },
    en: {
      comparison: {
        title: 'Performance Comparison',
        subtitle: 'Our Results VS Other Methods',
        metrics: [
          { 
            category: 'Exposure',
            our: 285,
            other: 100,
            detail: '185% exposure increase',
          },
          {
            category: 'Engagement',
            our: 340,
            other: 100,
            detail: '240% engagement boost',
          },
          {
            category: 'Conversion',
            our: 265,
            other: 100,
            detail: '165% conversion lift',
          },
          {
            category: 'ROI Returns',
            our: 380,
            other: 100,
            detail: '3.8x ROI achieved',
          }
        ]
      },
      platforms: {
        title: 'Platform Campaign Advantages',
        subtitle: 'Professional data showcasing competitiveness',
        labels: {
          ourCPM: 'Our CPM',
          marketPrice: 'Market Rate',
          saving: 'Savings'
        },
        data: [
          {
            platform: 'RED',
            metrics: {
              cpm: '¥8.5',
              engagement: '6.8%',
              conversion: '3.2%',
              advantage: 'Excellent seeding conversion'
            },
            comparison: {
              our: 'Our CPM ¥8.5',
              market: 'Market Rate ¥15',
              saving: '43% savings'
            }
          },
          {
            platform: 'Douyin',
            metrics: {
              cpm: '¥4.2',
              engagement: '5.1%',
              conversion: '2.8%',
              advantage: 'Lowest distribution cost'
            },
            comparison: {
              our: 'Our CPM ¥4.2',
              market: 'Market Rate ¥7.8',
              saving: '46% savings'
            }
          },
          {
            platform: 'Bilibili',
            metrics: {
              cpm: '¥12.5',
              engagement: '9.3%',
              conversion: '4.1%',
              advantage: 'Strongest user stickiness'
            },
            comparison: {
              our: 'Our CPM ¥12.5',
              market: 'Market Rate ¥22',
              saving: '43% savings'
            }
          },
          {
            platform: 'Weibo',
            metrics: {
              cpm: '¥6.8',
              engagement: '3.9%',
              conversion: '2.1%',
              advantage: 'Strong topic reach'
            },
            comparison: {
              our: 'Our CPM ¥6.8',
              market: 'Market Rate ¥11',
              saving: '38% savings'
            }
          }
        ]
      }
    }
  };

  // 获取当前语言内容
  const marketingData = i18nContent[language] || i18nContent.zh;

  const renderPerformanceComparison = () => (
    <div style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.98)',
    }}>
      <div style={{
        padding: '1.5rem 0',
        borderBottom: `1px solid ${colors.primary}30`,
      }}>
        <h4 style={{
          fontSize: DESIGN_TOKENS.typography.level5.fontSize,
          fontWeight: DESIGN_TOKENS.typography.level5.fontWeight,
          lineHeight: DESIGN_TOKENS.typography.level5.lineHeight,
          color: colors.primary,
          margin: 0,
        }}>
          {marketingData.comparison.title}
        </h4>
        <p style={{
          fontSize: DESIGN_TOKENS.typography.level5.fontSize,
          fontWeight: DESIGN_TOKENS.typography.level5.fontWeight,
          lineHeight: DESIGN_TOKENS.typography.level5.lineHeight,
          color: colors.secondary,
          margin: '0.25rem 0 0 0',
        }}>
          {marketingData.comparison.subtitle}
        </p>
      </div>

      <div style={{
        background: 'transparent',
        borderRadius: '8px',
        border: '1px solid rgba(107, 114, 128, 0.2)',
        padding: '1rem',
        marginTop: '1rem',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {marketingData.comparison.metrics.map((metric, index) => (
            <div key={index} style={{
              textAlign: 'center',
              padding: '1rem',
            }}>
              <div style={{
                fontSize: DESIGN_TOKENS.typography.level5.fontSize,
                fontWeight: DESIGN_TOKENS.typography.level5.fontWeight,
                lineHeight: DESIGN_TOKENS.typography.level5.lineHeight,
                color: colors.primary,
                marginBottom: '0.25rem',
              }}>
                {metric.our}%
              </div>
              <div style={{
                fontSize: DESIGN_TOKENS.typography.level5.fontSize,
                fontWeight: DESIGN_TOKENS.typography.level5.fontWeight,
                lineHeight: DESIGN_TOKENS.typography.level5.lineHeight,
                color: colors.secondary,
                marginBottom: '0.25rem',
              }}>
                {metric.category}
              </div>
              <div style={{
                fontSize: DESIGN_TOKENS.typography.level5.fontSize,
                fontWeight: DESIGN_TOKENS.typography.level6.fontWeight,
                lineHeight: DESIGN_TOKENS.typography.level6.lineHeight,
                color: colors.secondary,
              }}>
                {metric.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );


  return (
    <div style={{
      width: '100%',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(40px)',
    }}>
      {/* 标题区域 */}
      {(title || subtitle) && (
        <div style={{ marginBottom: DESIGN_TOKENS.spacing.gap.subsections, textAlign: 'center' }}>
          {title && (
            <h3 style={{
              fontSize: DESIGN_TOKENS.typography.level3.fontSize,
              fontWeight: DESIGN_TOKENS.typography.level3.fontWeight,
              lineHeight: DESIGN_TOKENS.typography.level3.lineHeight,
              color: 'rgba(80, 80, 80, 0.9)',
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
            }}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p style={{
              fontSize: DESIGN_TOKENS.typography.level5.fontSize,
              fontWeight: DESIGN_TOKENS.typography.level6.fontWeight,
              lineHeight: DESIGN_TOKENS.typography.level6.lineHeight,
              color: 'rgba(80, 80, 80, 0.6)',
            }}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* 效果对比 */}
      {renderPerformanceComparison()}
    </div>
  );
};

export default MarketingEffectivenessMetrics;
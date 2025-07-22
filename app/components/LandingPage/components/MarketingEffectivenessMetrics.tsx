// app/components/LandingPage/components/MarketingEffectivenessMetrics.tsx
import React from 'react';

interface MarketingEffectivenessMetricsProps {
  title?: string;
  subtitle?: string;
  inView?: boolean;
  delay?: number;
}

const MarketingEffectivenessMetrics: React.FC<MarketingEffectivenessMetricsProps> = ({
  title,
  subtitle,
  inView = false,
  delay = 0,
}) => {
  // 统一的2色配色方案
  const colors = {
    primary: '#7c3aed',   // 紫色
    secondary: '#6b7280', // 黑灰色
  };

  // 统一的字体规格
  const fonts = {
    title: { size: '1.1rem', weight: '600' },
    subtitle: { size: '0.85rem', weight: '400' },
    data: { size: '1.5rem', weight: '700' },
    label: { size: '0.75rem', weight: '500' },
  };

  // 投放效果对比数据
  const marketingData = {
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
  };

  const renderPerformanceComparison = () => (
    <div style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.98)',
      transition: `all 0.8s ease ${delay}s`,
    }}>
      <div style={{
        padding: '1.5rem 0',
        borderBottom: `1px solid ${colors.primary}30`,
      }}>
        <h4 style={{
          fontSize: fonts.title.size,
          fontWeight: fonts.title.weight,
          color: colors.primary,
          margin: 0,
        }}>
          {marketingData.comparison.title}
        </h4>
        <p style={{
          fontSize: fonts.subtitle.size,
          fontWeight: fonts.subtitle.weight,
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
                fontSize: fonts.data.size,
                fontWeight: fonts.data.weight,
                color: colors.primary,
                marginBottom: '0.25rem',
              }}>
                {metric.our}%
              </div>
              <div style={{
                fontSize: fonts.title.size,
                fontWeight: fonts.title.weight,
                color: colors.secondary,
                marginBottom: '0.25rem',
              }}>
                {metric.category}
              </div>
              <div style={{
                fontSize: fonts.label.size,
                fontWeight: fonts.label.weight,
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

  const renderChannelAnalysis = () => (
    <div style={{
      padding: '2rem 0',
      marginBottom: '2rem',
    }}>
      <h4 style={{
        fontSize: '1.3rem',
        fontWeight: '600',
        color: colors.primary,
        marginBottom: '1rem',
      }}>
        {marketingData.platforms.title}
      </h4>
      <p style={{
        fontSize: '0.9rem',
        color: colors.accent,
        marginBottom: '2rem',
      }}>
        {marketingData.platforms.subtitle}
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1.5rem',
      }}>
        {marketingData.platforms.data.map((channel, index) => (
          <div key={index} style={{
            padding: '1.5rem',
          }}>
            <h5 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: colors.primary,
              marginBottom: '1rem',
            }}>
              {channel.platform}
            </h5>
            
            {/* 核心指标 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
              marginBottom: '1rem',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: colors.success,
                  marginBottom: '0.25rem',
                }}>
                  {channel.metrics.cpm}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: colors.accent,
                }}>
                  千次费用
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: colors.accent,
                  marginBottom: '0.25rem',
                }}>
                  {channel.metrics.engagement}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: colors.accent,
                }}>
                  互动率
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: colors.primary,
                  marginBottom: '0.25rem',
                }}>
                  {channel.metrics.conversion}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: colors.accent,
                }}>
                  转化率
                </div>
              </div>
            </div>
            
            {/* 成本对比 */}
            <div style={{
              background: `${colors.success}20`,
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
              }}>
                <span style={{
                  fontSize: '0.85rem',
                  color: colors.primary,
                }}>
                  {channel.comparison.our}
                </span>
                <span style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: colors.success,
                }}>
                  {channel.comparison.saving}
                </span>
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: colors.accent,
              }}>
                {channel.comparison.market}
              </div>
            </div>
            
            <div style={{
              fontSize: '0.85rem',
              color: colors.primary,
              fontWeight: '500',
              textAlign: 'center',
            }}>
              {channel.metrics.advantage}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCostAnalysis = () => (
    <div style={{
      background: 'rgba(255, 255, 255, 0.02)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '20px',
      padding: '2.5rem',
      marginBottom: '2rem',
    }}>
      <h4 style={{
        fontSize: '1.3rem',
        fontWeight: '600',
        color: 'rgba(80, 80, 80, 0.9)',
        marginBottom: '1rem',
      }}>
        {marketingData.cost.title}
      </h4>
      <p style={{
        fontSize: '0.9rem',
        color: 'rgba(80, 80, 80, 0.6)',
        marginBottom: '2rem',
      }}>
        {marketingData.cost.subtitle}
      </p>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        {marketingData.cost.comparison.map((item, index) => (
          <div key={index} style={{
            padding: '1.5rem',
            background: item.highlight ? 
              'linear-gradient(135deg, rgba(30, 64, 175, 0.1), rgba(124, 58, 237, 0.1))' : 
              'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            border: item.highlight ? 
              '2px solid rgba(30, 64, 175, 0.3)' : 
              '1px solid rgba(255, 255, 255, 0.05)',
            position: 'relative',
          }}>
            {item.highlight && (
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '20px',
                background: 'linear-gradient(135deg, #1e40af, #7c3aed)',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '600',
              }}>
                推荐选择
              </div>
            )}
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 3fr',
              gap: '1rem',
              alignItems: 'center',
            }}>
              <div>
                <h5 style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'rgba(80, 80, 80, 0.9)',
                  marginBottom: '0.25rem',
                }}>
                  {item.method}
                </h5>
                <p style={{
                  fontSize: '0.85rem',
                  color: 'rgba(80, 80, 80, 0.6)',
                  margin: 0,
                }}>
                  {item.description}
                </p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'rgba(80, 80, 80, 0.6)',
                  marginBottom: '0.25rem',
                }}>
                  投入成本
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: item.highlight ? '#1e40af' : 'rgba(80, 80, 80, 0.8)',
                }}>
                  {item.cost}
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'rgba(80, 80, 80, 0.6)',
                  marginBottom: '0.25rem',
                }}>
                  效果回报
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: item.highlight ? '#10b981' : 'rgba(80, 80, 80, 0.8)',
                }}>
                  {item.result}
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: item.highlight ? '#1e40af' : 'rgba(80, 80, 80, 0.7)',
                }}>
                  性价比: {(parseFloat(item.result) / parseFloat(item.cost)).toFixed(1)}倍
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{
      width: '100%',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(40px)',
      transition: `all 0.8s ease ${delay}s`,
    }}>
      {/* 标题区域 */}
      {(title || subtitle) && (
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          {title && (
            <h3 style={{
              fontSize: 'clamp(1.4rem, 3.5vw, 2.45rem)',
              fontWeight: '700',
              color: 'rgba(80, 80, 80, 0.9)',
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
            }}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p style={{
              fontSize: 'clamp(0.84rem, 1.75vw, 1.26rem)',
              color: 'rgba(80, 80, 80, 0.6)',
              fontWeight: '400',
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
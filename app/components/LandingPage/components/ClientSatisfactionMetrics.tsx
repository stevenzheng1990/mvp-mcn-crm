// app/components/LandingPage/components/ClientSatisfactionMetrics.tsx
import React from 'react';

interface ClientSatisfactionMetricsProps {
  title?: string;
  subtitle?: string;
  inView?: boolean;
  delay?: number;
}

const ClientSatisfactionMetrics: React.FC<ClientSatisfactionMetricsProps> = ({
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

  // 核心投放成果
  const satisfactionData = {
    results: {
      title: '投放成果展示',
      subtitle: '真实数据证明效果',
      highlights: [
        { metric: '平均ROI', value: '4.8倍', desc: '投入产出比' },
        { metric: '转化提升', value: '245%', desc: '对比自主投放' },
        { metric: '成本优势', value: '32%', desc: '低于市场价格' },
        { metric: '达人匹配度', value: '96%', desc: '品牌适配成功率' },
      ]
    }
  };

  const renderSatisfactionBreakdown = () => (
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
        marginBottom: '2rem',
      }}>
        {satisfactionData.overall.title}
      </h4>
      <p style={{
        fontSize: '0.9rem',
        color: 'rgba(80, 80, 80, 0.6)',
        marginBottom: '2rem',
      }}>
        {satisfactionData.overall.subtitle}
      </p>
      
      {/* 总分展示 */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
      }}>
        <div style={{
          fontSize: '4rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #1e40af, #7c3aed)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1,
        }}>
          {satisfactionData.overall.score}%
        </div>
        <div style={{
          fontSize: '1rem',
          color: 'rgba(80, 80, 80, 0.6)',
          marginTop: '0.5rem',
        }}>
          综合满意度评分
        </div>
      </div>

      {/* 细分评分 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {satisfactionData.overall.breakdown.map((item, index) => (
          <div key={index}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
            }}>
              <span style={{
                fontSize: '0.95rem',
                color: 'rgba(80, 80, 80, 0.8)',
              }}>
                {item.aspect}
              </span>
              <span style={{
                fontSize: '0.95rem',
                fontWeight: '600',
                color: '#1e40af',
              }}>
                {item.score}分
              </span>
            </div>
            <div style={{
              position: 'relative',
              height: '8px',
              background: 'rgba(80, 80, 80, 0.1)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${item.score}%`,
                background: 'linear-gradient(90deg, #1e40af, #7c3aed)',
                borderRadius: '4px',
                transition: `width 1.2s ease ${delay + index * 0.1}s`,
                transform: inView ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'left',
              }} />
              {/* 行业基准线 */}
              <div style={{
                position: 'absolute',
                left: `${item.benchmark}%`,
                top: '-2px',
                width: '2px',
                height: '12px',
                background: 'rgba(239, 68, 68, 0.6)',
                zIndex: 1,
              }} />
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: 'rgba(80, 80, 80, 0.5)',
              marginTop: '0.25rem',
            }}>
              行业平均: {item.benchmark}分
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRetentionMetrics = () => (
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
        marginBottom: '2rem',
      }}>
        {satisfactionData.retention.title}
      </h4>
      <p style={{
        fontSize: '0.9rem',
        color: 'rgba(80, 80, 80, 0.6)',
        marginBottom: '2rem',
      }}>
        {satisfactionData.retention.subtitle}
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '2rem',
      }}>
        {satisfactionData.retention.metrics.map((metric, index) => (
          <div key={index} style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1e40af',
              marginBottom: '0.5rem',
            }}>
              {metric.rate}
            </div>
            <div style={{
              fontSize: '0.95rem',
              color: 'rgba(80, 80, 80, 0.8)',
              marginBottom: '0.25rem',
            }}>
              {metric.period}
            </div>
            <div style={{
              fontSize: '0.85rem',
              color: 'rgba(80, 80, 80, 0.6)',
            }}>
              {metric.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderResults = () => (
    <div style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.98)',
      transition: `all 0.8s ease ${delay}s`,
    }}>
      <div style={{
        padding: '1.5rem 0',
        borderBottom: `1px solid ${colors.secondary}30`,
      }}>
        <h4 style={{
          fontSize: fonts.title.size,
          fontWeight: fonts.title.weight,
          color: colors.primary,
          margin: 0,
        }}>
          {satisfactionData.results.title}
        </h4>
        <p style={{
          fontSize: fonts.subtitle.size,
          fontWeight: fonts.subtitle.weight,
          color: colors.secondary,
          margin: '0.25rem 0 0 0',
        }}>
          {satisfactionData.results.subtitle}
        </p>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        padding: '1rem 0',
        background: 'transparent',
        borderRadius: '8px',
        marginTop: '1rem',
        border: '1px solid rgba(107, 114, 128, 0.2)',
      }}>
        {satisfactionData.results.highlights.map((item, index) => (
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
              {item.value}
            </div>
            <div style={{
              fontSize: fonts.title.size,
              fontWeight: fonts.title.weight,
              color: colors.secondary,
              marginBottom: '0.25rem',
            }}>
              {item.metric}
            </div>
            <div style={{
              fontSize: fonts.label.size,
              fontWeight: fonts.label.weight,
              color: colors.secondary,
            }}>
              {item.desc}
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

      {/* 投放成果展示 */}
      {renderResults()}
    </div>
  );
};

export default ClientSatisfactionMetrics;
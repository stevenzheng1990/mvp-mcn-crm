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
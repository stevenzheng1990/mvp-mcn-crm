// app/components/LandingPage/components/ClientSatisfactionMetrics.tsx
import React from 'react';
import { DESIGN_TOKENS } from '../LandingPage.config';

interface ClientSatisfactionMetricsProps {
  title?: string;
  subtitle?: string;
  inView?: boolean;
  delay?: number;
  language?: string;
}

const ClientSatisfactionMetrics: React.FC<ClientSatisfactionMetricsProps> = ({
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
    },
    en: {
      results: {
        title: 'Campaign Performance',
        subtitle: 'Real data proving effectiveness',
        highlights: [
          { metric: 'Average ROI', value: '4.8x', desc: 'Return on investment' },
          { metric: 'Conversion Boost', value: '245%', desc: 'vs self-managed campaigns' },
          { metric: 'Cost Advantage', value: '32%', desc: 'below market rates' },
          { metric: 'Creator Match Rate', value: '96%', desc: 'brand-creator compatibility' },
        ]
      }
    }
  };

  // 核心投放成果
  const currentContent = i18nContent[language] || i18nContent.zh;
  const satisfactionData = currentContent;


  const renderResults = () => (
    <div style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.98)',
    }}>
      <div style={{
        padding: '1.5rem 0',
        borderBottom: `1px solid ${colors.secondary}30`,
      }}>
        <h4 style={{
          fontSize: DESIGN_TOKENS.typography.level5.fontSize,
          fontWeight: DESIGN_TOKENS.typography.level5.fontWeight,
          lineHeight: DESIGN_TOKENS.typography.level5.lineHeight,
          color: colors.primary,
          margin: 0,
        }}>
          {satisfactionData.results.title}
        </h4>
        <p style={{
          fontSize: DESIGN_TOKENS.typography.level5.fontSize,
          fontWeight: DESIGN_TOKENS.typography.level5.fontWeight,
          lineHeight: DESIGN_TOKENS.typography.level5.lineHeight,
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
              fontSize: DESIGN_TOKENS.typography.level5.fontSize,
              fontWeight: DESIGN_TOKENS.typography.level5.fontWeight,
              lineHeight: DESIGN_TOKENS.typography.level5.lineHeight,
              color: colors.primary,
              marginBottom: '0.25rem',
            }}>
              {item.value}
            </div>
            <div style={{
              fontSize: DESIGN_TOKENS.typography.level5.fontSize,
              fontWeight: DESIGN_TOKENS.typography.level5.fontWeight,
              lineHeight: DESIGN_TOKENS.typography.level5.lineHeight,
              color: colors.secondary,
              marginBottom: '0.25rem',
            }}>
              {item.metric}
            </div>
            <div style={{
              fontSize: DESIGN_TOKENS.typography.level5.fontSize,
              fontWeight: DESIGN_TOKENS.typography.level6.fontWeight,
              lineHeight: DESIGN_TOKENS.typography.level6.lineHeight,
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

      {/* 投放成果展示 */}
      {renderResults()}
    </div>
  );
};

export default ClientSatisfactionMetrics;
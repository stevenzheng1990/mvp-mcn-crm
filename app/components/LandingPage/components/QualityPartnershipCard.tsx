// app/components/LandingPage/components/QualityPartnershipCard.tsx
import React from 'react';
import { DESIGN_TOKENS } from '../LandingPage.config';
import { createGlassStyles } from '../LandingPage.styles';

interface QualityPartnershipCardProps {
  title: string;
  description: string;
  inView: boolean;
  index: number;
}

const QualityPartnershipCard: React.FC<QualityPartnershipCardProps> = ({
  title,
  description,
  inView,
  index
}) => {
  // 品质商务专业数据分析
  const partnershipData = {
    brandTiers: [
      { tier: '头部品牌', percentage: 35, avgBudget: '50K+', examples: ['雅诗兰黛', '苹果', '奔驰'] },
      { tier: '知名品牌', percentage: 42, avgBudget: '20-50K', examples: ['完美日记', '小米', '蔚来'] },
      { tier: '新锐品牌', percentage: 18, avgBudget: '10-20K', examples: ['花西子', '理想', 'SHEIN'] },
      { tier: '初创品牌', percentage: 5, avgBudget: '5-10K', examples: ['新兴品牌', '创业公司'] },
    ],
    satisfactionMetrics: [
      { metric: '合作续约率', current: 89, industry: 65, improvement: '+24%' },
      { metric: '项目按时完成', current: 96, industry: 78, improvement: '+18%' },
      { metric: '内容质量评分', current: 4.8, industry: 3.9, improvement: '+23%' },
      { metric: '传播效果达标', current: 92, industry: 71, improvement: '+21%' },
      { metric: '客户推荐意愿', current: 94, industry: 68, improvement: '+26%' },
    ],
    collaborationFlow: [
      { stage: '需求匹配', duration: '1-2天', accuracy: '96%', description: '精准匹配品牌调性与创作者风格' },
      { stage: '方案制定', duration: '2-3天', accuracy: '94%', description: '制定个性化内容策略方案' },
      { stage: '内容创作', duration: '5-7天', accuracy: '98%', description: '专业团队全程质量把控' },
      { stage: '投放优化', duration: '持续跟踪', accuracy: '92%', description: '实时数据监控与效果优化' },
    ]
  };

  const colors = {
    primary: '#2563eb', // 蓝色
    secondary: '#6b7280', // 黑灰色
    background: 'rgba(37, 99, 235, 0.08)',
    border: 'rgba(37, 99, 235, 0.2)'
  };

  return (
    <div style={{
      padding: '3rem 2.5rem',
      borderRadius: '1.5rem',
      ...createGlassStyles(false),
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      minHeight: '600px',
      display: 'flex',
      flexDirection: 'column',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(30px)',
      transitionDelay: `${0.2 + index * 0.15}s`,
    }}
    onMouseEnter={(e) => {
      const card = e.currentTarget as HTMLDivElement;
      card.style.transform = 'translateY(-8px) scale(1.02)';
      card.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
    }}
    onMouseLeave={(e) => {
      const card = e.currentTarget as HTMLDivElement;
      card.style.transform = 'translateY(0) scale(1)';
      card.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.05)';
    }}
    >
      {/* 头部 */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{
          fontSize: '2rem',
          fontWeight: DESIGN_TOKENS.typography.level2.fontWeight,
          marginBottom: '1rem',
          color: DESIGN_TOKENS.colors.text.primary,
          lineHeight: 1.2,
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: '1.1rem',
          color: DESIGN_TOKENS.colors.text.secondary,
          lineHeight: 1.6,
          marginBottom: '0',
        }}>
          {description}
        </p>
      </div>

      {/* 品牌层级分布 */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{
          fontSize: '1.2rem',
          fontWeight: '600',
          color: colors.primary,
          marginBottom: '1rem'
        }}>
          合作品牌层级分布
        </h4>
        <div style={{ fontSize: '0.9rem', color: colors.secondary, marginBottom: '1.5rem' }}>
          不同层级品牌合作占比及项目预算范围
        </div>
        
        {partnershipData.brandTiers.map((item, idx) => (
          <div key={idx} style={{
            marginBottom: '1.2rem',
            padding: '1rem',
            background: colors.background,
            borderRadius: '8px',
            border: `1px solid ${colors.border}`,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.8rem'
            }}>
              <div>
                <span style={{ fontWeight: '600', color: colors.secondary, fontSize: '0.95rem' }}>
                  {item.tier}
                </span>
                <span style={{ fontSize: '0.8rem', color: colors.primary, marginLeft: '0.5rem', fontWeight: '600' }}>
                  {item.avgBudget}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: '700', color: colors.primary }}>{item.percentage}%</div>
                  <div style={{ fontSize: '0.7rem', color: colors.secondary }}>占比</div>
                </div>
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: colors.secondary, marginBottom: '0.5rem' }}>
              代表品牌: {item.examples.join(' · ')}
            </div>
            {/* 进度条 */}
            <div style={{
              height: '4px',
              background: 'rgba(107, 114, 128, 0.1)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: inView ? `${item.percentage}%` : '0%',
                background: colors.primary,
                borderRadius: '2px',
                transition: `width 1s ease ${0.5 + idx * 0.1}s`
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* 服务质量指标 */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{
          fontSize: '1.2rem',
          fontWeight: '600',
          color: colors.primary,
          marginBottom: '1rem'
        }}>
          服务质量核心指标
        </h4>
        <div style={{ fontSize: '0.9rem', color: colors.secondary, marginBottom: '1.5rem' }}>
          vs 行业平均水平对比分析
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '0.8rem' }}>
          {partnershipData.satisfactionMetrics.map((item, idx) => (
            <div key={idx} style={{
              padding: '1rem',
              background: colors.background,
              borderRadius: '8px',
              border: `1px solid ${colors.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: colors.secondary,
                  marginBottom: '0.3rem'
                }}>
                  {item.metric}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', color: colors.primary }}>
                    {typeof item.current === 'number' && item.current < 10 ? item.current.toFixed(1) : `${item.current}%`}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: colors.secondary }}>我们</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1rem', fontWeight: '600', color: colors.secondary }}>
                    {typeof item.industry === 'number' && item.industry < 10 ? item.industry.toFixed(1) : `${item.industry}%`}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: colors.secondary }}>行业</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: colors.primary }}>
                    {item.improvement}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: colors.secondary }}>提升</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 合作流程效率 */}
      <div>
        <h4 style={{
          fontSize: '1.2rem',
          fontWeight: '600',
          color: colors.primary,
          marginBottom: '1rem'
        }}>
          合作流程与效率
        </h4>
        <div style={{ fontSize: '0.9rem', color: colors.secondary, marginBottom: '1.5rem' }}>
          标准化流程管理与质量保障体系
        </div>

        {partnershipData.collaborationFlow.map((item, idx) => (
          <div key={idx} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1rem',
            background: colors.background,
            borderRadius: '8px',
            border: `1px solid ${colors.border}`,
            marginBottom: '0.8rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: colors.primary,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
              fontWeight: '700',
              marginRight: '1rem',
              flexShrink: 0
            }}>
              {idx + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: colors.secondary,
                marginBottom: '0.3rem'
              }}>
                {item.stage}
              </div>
              <div style={{
                fontSize: '0.85rem',
                color: colors.secondary,
                opacity: 0.8,
                lineHeight: 1.4
              }}>
                {item.description}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: colors.primary }}>
                  {item.duration}
                </div>
                <div style={{ fontSize: '0.7rem', color: colors.secondary }}>时长</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: colors.primary }}>
                  {item.accuracy}
                </div>
                <div style={{ fontSize: '0.7rem', color: colors.secondary }}>准确率</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QualityPartnershipCard;
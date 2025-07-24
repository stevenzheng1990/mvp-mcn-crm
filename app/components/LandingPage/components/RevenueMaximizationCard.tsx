// app/components/LandingPage/components/RevenueMaximizationCard.tsx
import React from 'react';
import { DESIGN_TOKENS } from '../LandingPage.config';
import { createGlassStyles } from '../LandingPage.styles';

interface RevenueMaximizationCardProps {
  title: string;
  description: string;
  inView: boolean;
  index: number;
}

const RevenueMaximizationCard: React.FC<RevenueMaximizationCardProps> = ({
  title,
  description,
  inView,
  index
}) => {
  // 收益最大化专业数据分析
  const revenueData = {
    incomeGrowth: [
      { period: '入驻前', monthlyIncome: 8500, projects: 0, avgProject: 0 },
      { period: '第1月', monthlyIncome: 12300, projects: 2, avgProject: 6150 },
      { period: '第3月', monthlyIncome: 26400, projects: 4, avgProject: 6600 },
      { period: '第6月', monthlyIncome: 51600, projects: 6, avgProject: 8600 },
      { period: '第12月', monthlyIncome: 96800, projects: 8, avgProject: 12100 },
      { period: '第18月', monthlyIncome: 131700, projects: 9, avgProject: 14633 },
    ],
    priceDistribution: [
      { range: '5K-10K', percentage: 28, avgROI: '320%', cases: 42 },
      { range: '10K-20K', percentage: 35, avgROI: '280%', cases: 38 },
      { range: '20K-50K', percentage: 25, avgROI: '240%', cases: 18 },
      { range: '50K+', percentage: 12, avgROI: '180%', cases: 8 },
    ],
    revenueChannels: [
      { channel: '品牌合作', contribution: 68, growth: '+142%' },
      { channel: '直播带货', contribution: 18, growth: '+89%' },
      { channel: '知识付费', contribution: 9, growth: '+156%' },
      { channel: '其他变现', contribution: 5, growth: '+67%' },
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

      {/* 收益增长轨迹 */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{
          fontSize: '1.2rem',
          fontWeight: '600',
          color: colors.primary,
          marginBottom: '1rem'
        }}>
          月度收益增长轨迹
        </h4>
        <div style={{ fontSize: '0.9rem', color: colors.secondary, marginBottom: '1.5rem' }}>
          基于60位创作者真实收益数据统计
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.8rem' }}>
          {revenueData.incomeGrowth.map((item, idx) => (
            <div key={idx} style={{
              padding: '1rem 0.5rem',
              background: colors.background,
              borderRadius: '8px',
              border: `1px solid ${colors.border}`,
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '0.8rem',
                fontWeight: '600',
                color: colors.secondary,
                marginBottom: '0.8rem'
              }}>
                {item.period}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: colors.primary,
                  marginBottom: '0.2rem'
                }}>
                  {(item.monthlyIncome / 1000).toFixed(1)}K
                </div>
                <div style={{ fontSize: '0.7rem', color: colors.secondary }}>月收入</div>
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: colors.primary,
                  marginBottom: '0.2rem'
                }}>
                  {item.projects}
                </div>
                <div style={{ fontSize: '0.7rem', color: colors.secondary }}>项目数</div>
              </div>
              {item.avgProject > 0 && (
                <div>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: colors.secondary
                  }}>
                    {(item.avgProject / 1000).toFixed(1)}K
                  </div>
                  <div style={{ fontSize: '0.7rem', color: colors.secondary }}>均价</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 项目报价分布 */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{
          fontSize: '1.2rem',
          fontWeight: '600',
          color: colors.primary,
          marginBottom: '1rem'
        }}>
          项目报价分布与ROI
        </h4>
        <div style={{ fontSize: '0.9rem', color: colors.secondary, marginBottom: '1.5rem' }}>
          不同价格区间项目占比及投资回报率
        </div>

        {revenueData.priceDistribution.map((item, idx) => (
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
                  {item.range}
                </span>
                <span style={{ fontSize: '0.8rem', color: colors.secondary, marginLeft: '0.5rem', opacity: 0.7 }}>
                  {item.cases}个案例
                </span>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: colors.primary }}>{item.percentage}%</div>
                  <div style={{ fontSize: '0.7rem', color: colors.secondary }}>占比</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: colors.primary }}>{item.avgROI}</div>
                  <div style={{ fontSize: '0.7rem', color: colors.secondary }}>平均ROI</div>
                </div>
              </div>
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

      {/* 收益渠道分析 */}
      <div>
        <h4 style={{
          fontSize: '1.2rem',
          fontWeight: '600',
          color: colors.primary,
          marginBottom: '1rem'
        }}>
          收益渠道构成
        </h4>
        <div style={{ fontSize: '0.9rem', color: colors.secondary, marginBottom: '1.5rem' }}>
          多元化变现渠道及增长表现
        </div>

        {revenueData.revenueChannels.map((item, idx) => (
          <div key={idx} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            background: colors.background,
            borderRadius: '8px',
            border: `1px solid ${colors.border}`,
            marginBottom: '0.8rem'
          }}>
            <div>
              <span style={{ fontWeight: '600', color: colors.secondary, fontSize: '1rem' }}>
                {item.channel}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: '700', color: colors.primary }}>
                  {item.contribution}%
                </div>
                <div style={{ fontSize: '0.7rem', color: colors.secondary }}>贡献率</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: colors.primary }}>
                  {item.growth}
                </div>
                <div style={{ fontSize: '0.7rem', color: colors.secondary }}>增长率</div>
              </div>
              <div style={{ position: 'relative', width: '60px' }}>
                <div style={{
                  height: '6px',
                  background: 'rgba(107, 114, 128, 0.1)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: inView ? `${item.contribution}%` : '0%',
                    height: '100%',
                    background: colors.primary,
                    borderRadius: '3px',
                    transition: `width 1s ease ${0.8 + idx * 0.1}s`
                  }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueMaximizationCard;
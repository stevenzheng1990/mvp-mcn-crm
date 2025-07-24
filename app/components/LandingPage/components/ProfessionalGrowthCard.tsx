// app/components/LandingPage/components/ProfessionalGrowthCard.tsx
import React from 'react';
import { DESIGN_TOKENS } from '../LandingPage.config';
import { createGlassStyles } from '../LandingPage.styles';

interface ProfessionalGrowthCardProps {
  title: string;
  description: string;
  inView: boolean;
  index: number;
}

const ProfessionalGrowthCard: React.FC<ProfessionalGrowthCardProps> = ({
  title,
  description,
  inView,
  index
}) => {
  // 专业数据可视化数据
  const growthData = {
    followerGrowth: [
      { range: '1-10万粉丝', avg: '15.8%', median: '13.5%', max: '32.6%', count: '18位' },
      { range: '10-30万粉丝', avg: '11.2%', median: '9.8%', max: '24.3%', count: '22位' },
      { range: '30-100万粉丝', avg: '7.6%', median: '6.9%', max: '15.8%', count: '15位' },
      { range: '100万+粉丝', avg: '4.3%', median: '3.8%', max: '9.2%', count: '5位' },
    ],
    engagementTimeline: [
      { period: '入驻前', likeRate: '2.8%', completeRate: '18.5%' },
      { period: '3个月', likeRate: '3.6%', completeRate: '23.7%' },
      { period: '6个月', likeRate: '4.9%', completeRate: '30.1%' },
      { period: '12个月', likeRate: '7.1%', completeRate: '37.4%' },
      { period: '18个月', likeRate: '8.3%', completeRate: '41.3%' },
    ],
    viralContent: [
      { category: '美妆护肤', avg: '2.1', percentage: 35 },
      { category: '生活方式', avg: '1.6', percentage: 27 },
      { category: '美食探店', avg: '2.8', percentage: 47 },
      { category: '时尚穿搭', avg: '1.9', percentage: 32 },
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

      {/* 粉丝增长分布数据 */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{
          fontSize: '1.2rem',
          fontWeight: '600',
          color: colors.primary,
          marginBottom: '1rem'
        }}>
          月度粉丝增长率分布
        </h4>
        <div style={{ fontSize: '0.9rem', color: colors.secondary, marginBottom: '1.5rem' }}>
          不同体量创作者增长表现
        </div>
        
        {growthData.followerGrowth.map((item, idx) => (
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
                  {item.count}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: colors.primary }}>{item.avg}</div>
                  <div style={{ fontSize: '0.7rem', color: colors.secondary }}>平均值</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: colors.primary }}>{item.median}</div>
                  <div style={{ fontSize: '0.7rem', color: colors.secondary }}>中位数</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: colors.primary }}>{item.max}</div>
                  <div style={{ fontSize: '0.7rem', color: colors.secondary }}>最高值</div>
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
                width: inView ? `${(parseFloat(item.avg) / 20) * 100}%` : '0%',
                background: colors.primary,
                borderRadius: '2px',
                transition: `width 1s ease ${0.5 + idx * 0.1}s`
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* 互动数据提升时间线 */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{
          fontSize: '1.2rem',
          fontWeight: '600',
          color: colors.primary,
          marginBottom: '1rem'
        }}>
          内容质量提升轨迹
        </h4>
        <div style={{ fontSize: '0.9rem', color: colors.secondary, marginBottom: '1.5rem' }}>
          赞藏比与完播率双指标追踪
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.8rem' }}>
          {growthData.engagementTimeline.map((item, idx) => (
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
                  {item.likeRate}
                </div>
                <div style={{ fontSize: '0.7rem', color: colors.secondary }}>赞藏比</div>
              </div>
              <div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: colors.primary,
                  marginBottom: '0.2rem'
                }}>
                  {item.completeRate}
                </div>
                <div style={{ fontSize: '0.7rem', color: colors.secondary }}>完播率</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 爆款内容产出 */}
      <div>
        <h4 style={{
          fontSize: '1.2rem',
          fontWeight: '600',
          color: colors.primary,
          marginBottom: '1rem'
        }}>
          爆款内容产出能力
        </h4>
        <div style={{ fontSize: '0.9rem', color: colors.secondary, marginBottom: '1.5rem' }}>
          月均破圈作品数量（播放超平均10倍）
        </div>

        {growthData.viralContent.map((item, idx) => (
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
                {item.category}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: '700', color: colors.primary }}>
                  {item.avg}
                </div>
                <div style={{ fontSize: '0.7rem', color: colors.secondary }}>篇/月</div>
              </div>
              <div style={{ position: 'relative', width: '80px' }}>
                <div style={{
                  height: '6px',
                  background: 'rgba(107, 114, 128, 0.1)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: inView ? `${item.percentage}%` : '0%',
                    height: '100%',
                    background: colors.primary,
                    borderRadius: '3px',
                    transition: `width 1s ease ${0.8 + idx * 0.1}s`
                  }} />
                </div>
                <div style={{
                  position: 'absolute',
                  right: '-10px',
                  top: '-20px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: colors.primary
                }}>
                  {item.percentage}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessionalGrowthCard;
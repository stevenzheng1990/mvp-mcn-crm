// app/components/LandingPage/components/GrowthMetrics.tsx
import React from 'react';

interface GrowthMetricsProps {
  title?: string;
  subtitle?: string;
  inView?: boolean;
  delay?: number;
}

const GrowthMetrics: React.FC<GrowthMetricsProps> = ({
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
  // 基于真实数据的分布统计
  const metricsData = {
    followerGrowth: {
      title: '月度粉丝增长率分布',
      subtitle: '不同体量创作者增长表现',
      categories: [
        { range: '1-10万粉丝', avg: '15.8%', median: '13.5%', max: '32.6%', count: '18位' },
        { range: '10-30万粉丝', avg: '11.2%', median: '9.8%', max: '24.3%', count: '22位' },
        { range: '30-100万粉丝', avg: '7.6%', median: '6.9%', max: '15.8%', count: '15位' },
        { range: '100万+粉丝', avg: '4.3%', median: '3.8%', max: '9.2%', count: '5位' },
      ]
    },
    engagement: {
      title: '内容质量提升轨迹',
      subtitle: '赞藏比与完播率双指标追踪',
      data: [
        { month: '3个月', likeRate: '+0.8%', completeRate: '+5.2%', desc: '内容优化期' },
        { month: '6个月', likeRate: '+2.1%', completeRate: '+11.3%', desc: '风格形成期' },
        { month: '9个月', likeRate: '+3.2%', completeRate: '+15.7%', desc: '粉丝沉淀期' },
        { month: '12个月', likeRate: '+4.3%', completeRate: '+18.9%', desc: '品质稳定期' },
        { month: '18个月', likeRate: '+5.1%', completeRate: '+22.4%', desc: '影响力扩大期' },
      ]
    },
    viralPosts: {
      title: '爆款内容产出能力',
      subtitle: '月均破圈作品数量（播放超平均10倍）',
      distribution: [
        { category: '美妆护肤', avg: '2.1', percentage: 35, top: '单月最高6篇' },
        { category: '生活方式', avg: '1.6', percentage: 27, top: '单月最高4篇' },
        { category: '美食探店', avg: '2.8', percentage: 47, top: '单月最高8篇' },
        { category: '时尚穿搭', avg: '1.9', percentage: 32, top: '单月最高5篇' },
        { category: '知识科普', avg: '1.2', percentage: 20, top: '单月最高3篇' },
      ]
    },
    interaction: {
      title: '综合互动指标提升',
      subtitle: '评论、分享、收藏综合计算',
      metrics: [
        { name: '平均互动率', before: '3.2%', after: '5.8%', change: '+81%' },
        { name: '评论转化率', before: '0.8%', after: '1.5%', change: '+88%' },
        { name: '分享转化率', before: '1.1%', after: '2.3%', change: '+109%' },
        { name: '粉丝活跃度', before: '42%', after: '68%', change: '+62%' },
      ]
    }
  };

  return (
    <div style={{
      width: '100%',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(40px)',
      transition: `all 0.8s ease ${delay}s`,
    }}>
      {/* 标题区域 */}
      {(title || subtitle) && (
        <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
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

      {/* 数据网格布局 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '3rem',
        marginBottom: '4rem',
      }}>
        {/* 粉丝增长率分层数据 */}
        <MetricCard
          title={metricsData.followerGrowth.title}
          subtitle={metricsData.followerGrowth.subtitle}
          inView={inView}
          delay={delay + 0.2}
        >
          <div style={{ padding: '2rem' }}>
            {metricsData.followerGrowth.categories.map((cat, index) => (
              <div key={index} style={{
                marginBottom: '1.5rem',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateX(0)' : 'translateX(-20px)',
                transition: `all 0.6s ease ${delay + 0.3 + index * 0.1}s`,
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                }}>
                  <div>
                    <span style={{ fontWeight: '700', color: 'rgba(80, 80, 80, 0.9)', fontSize: '1.05rem' }}>{cat.range}</span>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(80, 80, 80, 0.5)', marginLeft: '0.5rem' }}>{cat.count}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.primary }}>{cat.avg}</div>
                      <div style={{ fontSize: '0.7rem', color: colors.secondary }}>平均值</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.primary }}>{cat.median}</div>
                      <div style={{ fontSize: '0.7rem', color: colors.secondary }}>中位数</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.primary }}>{cat.max}</div>
                      <div style={{ fontSize: '0.7rem', color: colors.secondary }}>最高值</div>
                    </div>
                  </div>
                </div>
                {/* 可视化条形图 */}
                <div style={{
                  height: '4px',
                  background: 'rgba(80, 80, 80, 0.1)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: inView ? `${(parseFloat(cat.avg) / 20) * 100}%` : '0%',
                    background: colors.primary,
                    borderRadius: '2px',
                    transition: `width 1s ease ${delay + 0.5 + index * 0.1}s`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </MetricCard>

        {/* 内容质量提升时间线 */}
        <MetricCard
          title={metricsData.engagement.title}
          subtitle={metricsData.engagement.subtitle}
          inView={inView}
          delay={delay + 0.3}
        >
          <div style={{ padding: '2rem' }}>
            {metricsData.engagement.data.map((item, index) => (
              <div key={index} style={{
                marginBottom: '1.8rem',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.6s ease ${delay + 0.4 + index * 0.1}s`,
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                }}>
                  <div>
                    <span style={{ fontWeight: '700', color: 'rgba(80, 80, 80, 0.9)' }}>{item.month}</span>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(80, 80, 80, 0.5)', marginLeft: '1rem' }}>{item.desc}</span>
                  </div>
                </div>
                
                {/* 双指标对比 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.8rem', color: colors.secondary }}>赞藏比</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600', color: colors.primary }}>{item.likeRate}</span>
                    </div>
                    <div style={{
                      height: '6px',
                      background: 'rgba(124, 58, 237, 0.1)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: inView ? `${(parseFloat(item.likeRate) / 6) * 100}%` : '0%',
                        background: colors.primary,
                        borderRadius: '3px',
                        transition: `width 0.8s ease ${delay + 0.6 + index * 0.1}s`,
                      }} />
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.8rem', color: colors.secondary }}>完播率</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600', color: colors.primary }}>{item.completeRate}</span>
                    </div>
                    <div style={{
                      height: '6px',
                      background: 'rgba(124, 58, 237, 0.1)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: inView ? `${(parseFloat(item.completeRate) / 25) * 100}%` : '0%',
                        background: colors.primary,
                        borderRadius: '3px',
                        transition: `width 0.8s ease ${delay + 0.7 + index * 0.1}s`,
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </MetricCard>

        {/* 爆款内容产出能力 */}
        <MetricCard
          title={metricsData.viralPosts.title}
          subtitle={metricsData.viralPosts.subtitle}
          inView={inView}
          delay={delay + 0.4}
        >
          <div style={{ padding: '2rem' }}>
            {metricsData.viralPosts.distribution.map((item, index) => (
              <div key={index} style={{
                marginBottom: '1.8rem',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                transition: `all 0.6s ease ${delay + 0.5 + index * 0.08}s`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontWeight: '700', color: 'rgba(80, 80, 80, 0.9)', fontSize: '1.05rem' }}>{item.category}</span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(80, 80, 80, 0.5)', marginLeft: '0.75rem' }}>{item.top}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.primary }}>{item.avg}</div>
                    <div style={{ fontSize: '0.7rem', color: colors.secondary }}>篇/月</div>
                  </div>
                </div>
                
                {/* 可视化进度条 */}
                <div style={{ position: 'relative' }}>
                  <div style={{
                    height: '8px',
                    background: 'rgba(124, 58, 237, 0.1)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: inView ? `${item.percentage}%` : '0%',
                      height: '100%',
                      background: colors.primary,
                      borderRadius: '4px',
                      transition: `width 1s ease ${delay + 0.7 + index * 0.1}s`,
                    }} />
                  </div>
                  {/* 百分比标签 */}
                  <div style={{
                    position: 'absolute',
                    left: inView ? `${item.percentage}%` : '0%',
                    top: '-20px',
                    transform: 'translateX(-50%)',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: colors.primary,
                    transition: `left 1s ease ${delay + 0.7 + index * 0.1}s`,
                  }}>
                    {item.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </MetricCard>

        {/* 综合互动指标 */}
        <MetricCard
          title={metricsData.interaction.title}
          subtitle={metricsData.interaction.subtitle}
          inView={inView}
          delay={delay + 0.5}
        >
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {metricsData.interaction.metrics.map((metric, index) => (
                <div key={index} style={{
                  padding: '1.5rem',
                  background: 'transparent',
                  borderRadius: '12px',
                  border: '1px solid rgba(107, 114, 128, 0.2)',
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'scale(1)' : 'scale(0.9)',
                  transition: `all 0.6s ease ${delay + 0.6 + index * 0.1}s`,
                }}>
                  <h5 style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: 'rgba(80, 80, 80, 0.8)',
                    marginBottom: '1rem',
                  }}>
                    {metric.name}
                  </h5>
                  
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: colors.secondary }}>前</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: '600', color: colors.secondary }}>{metric.before}</span>
                    <span style={{ fontSize: '1rem', color: colors.primary, margin: '0 0.5rem' }}>→</span>
                    <span style={{ fontSize: '0.8rem', color: colors.secondary }}>后</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: '600', color: colors.primary }}>{metric.after}</span>
                  </div>
                  
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: colors.primary,
                    marginTop: '0.5rem',
                  }}>
                    {metric.change}
                  </div>
                </div>
              ))}
            </div>
            
            {/* 整体总结 */}
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: 'transparent',
              borderRadius: '12px',
              border: '1px solid rgba(107, 114, 128, 0.2)',
              textAlign: 'center',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.8s ease ${delay + 1}s`,
            }}>
              <p style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: colors.secondary,
                margin: 0,
              }}>
                综合互动效果较入驻前平均提升 <span style={{ fontSize: '1.5rem', color: colors.primary }}>85%</span>
              </p>
            </div>
          </div>
        </MetricCard>
      </div>

      {/* 底部说明 */}
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        background: 'transparent',
        borderRadius: '12px',
        border: '1px solid rgba(107, 114, 128, 0.2)',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: `all 0.8s ease ${delay + 0.8}s`,
      }}>
        <p style={{
          fontSize: globalFonts.label.size,
          color: globalColors.secondary,
          margin: 0,
          lineHeight: 1.6,
        }}>
          * 数据基于平台60+签约创作者2024年10月到2025年7月真实表现统计
        </p>
      </div>
    </div>
  );
};

// 全局字体和颜色定义
const globalColors = {
  primary: '#7c3aed',   // 紫色
  secondary: '#6b7280', // 黑灰色
};

const globalFonts = {
  title: { size: '1.1rem', weight: '600' },
  subtitle: { size: '0.85rem', weight: '400' },
  data: { size: '1.5rem', weight: '700' },
  label: { size: '0.75rem', weight: '500' },
};

// 指标卡片组件
const MetricCard: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  inView: boolean;
  delay: number;
}> = ({ title, subtitle, children, inView, delay }) => (
  <div style={{
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.98)',
    transition: `all 0.8s ease ${delay}s`,
  }}>
    <div style={{
      padding: '1.5rem 0',
      borderBottom: `1px solid ${globalColors.secondary}30`,
    }}>
      <h4 style={{
        fontSize: globalFonts.title.size,
        fontWeight: globalFonts.title.weight,
        color: globalColors.primary,
        margin: 0,
      }}>
        {title}
      </h4>
      {subtitle && (
        <p style={{
          fontSize: globalFonts.subtitle.size,
          fontWeight: globalFonts.subtitle.weight,
          color: globalColors.secondary,
          margin: '0.25rem 0 0 0',
        }}>
          {subtitle}
        </p>
      )}
    </div>
    {children}
  </div>
);

export default GrowthMetrics;
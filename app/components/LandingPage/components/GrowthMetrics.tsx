// app/components/LandingPage/components/GrowthMetrics.tsx
import React from 'react';
import { DESIGN_TOKENS } from '../LandingPage.config';

interface GrowthMetricsProps {
  title?: string;
  subtitle?: string;
  inView?: boolean;
  delay?: number;
  language?: string;
}

const GrowthMetrics: React.FC<GrowthMetricsProps> = ({
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
      labels: {
        avg: '平均值',
        median: '中位数',
        max: '最高值',
        count: '位',
        month: '个月',
        fanCount: '万粉丝',
        fanCountPlus: '万+粉丝',
        monthlyAvg: '月均',
        singleMonthMax: '单月最高',
        posts: '篇',
        comprehensive: '综合'
      },
      periods: {
        '3months': '3个月',
        '6months': '6个月', 
        '9months': '9个月',
        '12months': '12个月',
        '18months': '18个月'
      },
      descriptions: {
        contentOptimization: '内容优化期',
        styleFormation: '风格形成期',
        fanAccumulation: '粉丝沉淀期',
        qualityStabilization: '品质稳定期',
        influenceExpansion: '影响力扩大期'
      },
      categories: {
        beauty: '美妆护肤',
        lifestyle: '生活方式',
        food: '美食探店',
        fashion: '时尚穿搭',
        knowledge: '知识科普'
      },
      footnote: '* 数据基于平台60+签约创作者2024年10月到2025年7月真实表现统计'
    },
    en: {
      labels: {
        avg: 'Average',
        median: 'Median',
        max: 'Peak',
        count: ' creators',
        month: ' months',
        fanCount: 'K followers',
        fanCountPlus: 'K+ followers',
        monthlyAvg: 'Monthly Avg',
        singleMonthMax: 'Monthly Peak',
        posts: ' posts',
        comprehensive: 'Overall'
      },
      periods: {
        '3months': '3 months',
        '6months': '6 months',
        '9months': '9 months', 
        '12months': '12 months',
        '18months': '18 months'
      },
      descriptions: {
        contentOptimization: 'Content Optimization',
        styleFormation: 'Style Development',
        fanAccumulation: 'Audience Growth',
        qualityStabilization: 'Quality Consistency',
        influenceExpansion: 'Influence Expansion'
      },
      categories: {
        beauty: 'Beauty & Skincare',
        lifestyle: 'Lifestyle',
        food: 'Food & Dining',
        fashion: 'Fashion & Style',
        knowledge: 'Educational'
      },
      footnote: '* Data based on 60+ signed creators\' real performance from Oct 2024 to Jul 2025'
    }
  };

  const currentContent = i18nContent[language as keyof typeof i18nContent] || i18nContent.zh;

  // 基于真实数据的分布统计
  const metricsData = {
    followerGrowth: {
      title: language === 'en' ? 'Monthly Follower Growth Distribution' : '月度粉丝增长率分布',
      subtitle: language === 'en' ? 'Growth performance across creator tiers' : '不同体量创作者增长表现',
      categories: [
        { range: language === 'en' ? '10-100K followers' : '1-10万粉丝', avg: '15.8%', median: '13.5%', max: '32.6%', count: language === 'en' ? '18 creators' : '18位' },
        { range: language === 'en' ? '100-300K followers' : '10-30万粉丝', avg: '11.2%', median: '9.8%', max: '24.3%', count: language === 'en' ? '22 creators' : '22位' },
        { range: language === 'en' ? '300K-1M followers' : '30-100万粉丝', avg: '7.6%', median: '6.9%', max: '15.8%', count: language === 'en' ? '15 creators' : '15位' },
        { range: language === 'en' ? '1M+ followers' : '100万+粉丝', avg: '4.3%', median: '3.8%', max: '9.2%', count: language === 'en' ? '5 creators' : '5位' },
      ]
    },
    engagement: {
      title: language === 'en' ? 'Content Quality Enhancement Trajectory' : '内容质量提升轨迹',
      subtitle: language === 'en' ? 'Like ratio & completion rate dual tracking' : '赞藏比与完播率双指标追踪',
      data: [
        { month: language === 'en' ? '3 months' : '3个月', likeRate: '+0.8%', completeRate: '+5.2%', desc: language === 'en' ? 'Content Optimization' : '内容优化期' },
        { month: language === 'en' ? '6 months' : '6个月', likeRate: '+2.1%', completeRate: '+11.3%', desc: language === 'en' ? 'Style Development' : '风格形成期' },
        { month: language === 'en' ? '9 months' : '9个月', likeRate: '+3.2%', completeRate: '+15.7%', desc: language === 'en' ? 'Audience Growth' : '粉丝沉淀期' },
        { month: language === 'en' ? '12 months' : '12个月', likeRate: '+4.3%', completeRate: '+18.9%', desc: language === 'en' ? 'Quality Consistency' : '品质稳定期' },
        { month: language === 'en' ? '18 months' : '18个月', likeRate: '+5.1%', completeRate: '+22.4%', desc: language === 'en' ? 'Influence Expansion' : '影响力扩大期' },
      ]
    },
    viralPosts: {
      title: language === 'en' ? 'Viral Content Production Capability' : '爆款内容产出能力',
      subtitle: language === 'en' ? 'Monthly viral posts (10x+ average views)' : '月均破圈作品数量（播放超平均10倍）',
      distribution: [
        { category: language === 'en' ? 'Beauty & Skincare' : '美妆护肤', avg: '2.1', percentage: 35, top: language === 'en' ? 'Peak: 6 posts/month' : '单月最高6篇' },
        { category: language === 'en' ? 'Lifestyle' : '生活方式', avg: '1.6', percentage: 27, top: language === 'en' ? 'Peak: 4 posts/month' : '单月最高4篇' },
        { category: language === 'en' ? 'Food & Dining' : '美食探店', avg: '2.8', percentage: 47, top: language === 'en' ? 'Peak: 8 posts/month' : '单月最高8篇' },
        { category: language === 'en' ? 'Fashion & Style' : '时尚穿搭', avg: '1.9', percentage: 32, top: language === 'en' ? 'Peak: 5 posts/month' : '单月最高5篇' },
        { category: language === 'en' ? 'Educational' : '知识科普', avg: '1.2', percentage: 20, top: language === 'en' ? 'Peak: 3 posts/month' : '单月最高3篇' },
      ]
    },
    interaction: {
      title: language === 'en' ? 'Comprehensive Interaction Index Improvement' : '综合互动指标提升',
      subtitle: language === 'en' ? 'Comments, shares, saves combined calculation' : '评论、分享、收藏综合计算',
      metrics: [
        { name: language === 'en' ? 'Avg Engagement Rate' : '平均互动率', before: '3.2%', after: '5.8%', change: '+81%' },
        { name: language === 'en' ? 'Comment Rate' : '评论转化率', before: '0.8%', after: '1.5%', change: '+88%' },
        { name: language === 'en' ? 'Share Rate' : '分享转化率', before: '1.1%', after: '2.3%', change: '+109%' },
        { name: language === 'en' ? 'Fan Activity' : '粉丝活跃度', before: '42%', after: '68%', change: '+62%' },
      ]
    }
  };

  return (
    <div style={{
      width: '100%',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(40px)',
    }}>
      {/* 标题区域 */}
      {(title || subtitle) && (
        <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
          {title && (
            <h3 style={{
              fontSize: DESIGN_TOKENS.typography.level5.fontSize,
              fontWeight: DESIGN_TOKENS.typography.level5.fontWeight,
              lineHeight: DESIGN_TOKENS.typography.level5.lineHeight,
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
              fontWeight: DESIGN_TOKENS.typography.level5.fontWeight,
              lineHeight: DESIGN_TOKENS.typography.level5.lineHeight,
              color: 'rgba(80, 80, 80, 0.6)',
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
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                }}>
                  <div>
                    <span style={{ fontWeight: '700', color: 'rgba(80, 80, 80, 0.9)', fontSize: DESIGN_TOKENS.typography.level5.fontSize }}>{cat.range}</span>
                    <span style={{ fontSize: DESIGN_TOKENS.typography.level5.fontSize, color: 'rgba(80, 80, 80, 0.5)', marginLeft: '0.5rem' }}>{cat.count}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: DESIGN_TOKENS.typography.level5.fontSize, fontWeight: '700', color: colors.primary }}>{cat.avg}</div>
                      <div style={{ fontSize: DESIGN_TOKENS.typography.level5.fontSize, color: colors.secondary }}>{currentContent.labels.avg}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: DESIGN_TOKENS.typography.level5.fontSize, fontWeight: '700', color: colors.primary }}>{cat.median}</div>
                      <div style={{ fontSize: DESIGN_TOKENS.typography.level5.fontSize, color: colors.secondary }}>{currentContent.labels.median}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: DESIGN_TOKENS.typography.level5.fontSize, fontWeight: '700', color: colors.primary }}>{cat.max}</div>
                      <div style={{ fontSize: DESIGN_TOKENS.typography.level5.fontSize, color: colors.secondary }}>{currentContent.labels.max}</div>
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
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                }}>
                  <div>
                    <span style={{ fontWeight: '700', color: 'rgba(80, 80, 80, 0.9)' }}>{item.month}</span>
                    <span style={{ fontSize: DESIGN_TOKENS.typography.level5.fontSize, color: 'rgba(80, 80, 80, 0.5)', marginLeft: '1rem' }}>{item.desc}</span>
                  </div>
                </div>
                
                {/* 双指标对比 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: DESIGN_TOKENS.typography.level5.fontSize, color: colors.secondary }}>{language === 'en' ? 'Like Ratio' : '赞藏比'}</span>
                      <span style={{ fontSize: DESIGN_TOKENS.typography.level5.fontSize, fontWeight: '600', color: colors.primary }}>{item.likeRate}</span>
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
                      }} />
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: DESIGN_TOKENS.typography.level5.fontSize, color: colors.secondary }}>{language === 'en' ? 'Completion Rate' : '完播率'}</span>
                      <span style={{ fontSize: DESIGN_TOKENS.typography.level5.fontSize, fontWeight: '600', color: colors.primary }}>{item.completeRate}</span>
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
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontWeight: '700', color: 'rgba(80, 80, 80, 0.9)', fontSize: DESIGN_TOKENS.typography.level5.fontSize }}>{item.category}</span>
                    <span style={{ fontSize: DESIGN_TOKENS.typography.level5.fontSize, color: 'rgba(80, 80, 80, 0.5)', marginLeft: '0.75rem' }}>{item.top}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: DESIGN_TOKENS.typography.level5.fontSize, fontWeight: '700', color: colors.primary }}>{item.avg}</div>
                    <div style={{ fontSize: DESIGN_TOKENS.typography.level5.fontSize, color: colors.secondary }}>{language === 'en' ? 'posts/month' : '篇/月'}</div>
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
                    }} />
                  </div>
                  {/* 百分比标签 */}
                  <div style={{
                    position: 'absolute',
                    left: inView ? `${item.percentage}%` : '0%',
                    top: '-20px',
                    transform: 'translateX(-50%)',
                    fontSize: DESIGN_TOKENS.typography.level5.fontSize,
                    fontWeight: '600',
                    color: colors.primary,
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
                }}>
                  <h5 style={{
                    fontSize: DESIGN_TOKENS.typography.level5.fontSize,
                    fontWeight: '600',
                    color: 'rgba(80, 80, 80, 0.8)',
                    marginBottom: '1rem',
                  }}>
                    {metric.name}
                  </h5>
                  
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: DESIGN_TOKENS.typography.level5.fontSize, color: colors.secondary }}>{language === 'en' ? 'Before' : '前'}</span>
                    <span style={{ fontSize: DESIGN_TOKENS.typography.level5.fontSize, fontWeight: '600', color: colors.secondary }}>{metric.before}</span>
                    <span style={{ fontSize: DESIGN_TOKENS.typography.level5.fontSize, color: colors.primary, margin: '0 0.5rem' }}>→</span>
                    <span style={{ fontSize: DESIGN_TOKENS.typography.level5.fontSize, color: colors.secondary }}>{language === 'en' ? 'After' : '后'}</span>
                    <span style={{ fontSize: DESIGN_TOKENS.typography.level5.fontSize, fontWeight: '600', color: colors.primary }}>{metric.after}</span>
                  </div>
                  
                  <div style={{
                    fontSize: DESIGN_TOKENS.typography.level5.fontSize,
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
                fontSize: DESIGN_TOKENS.typography.level5.fontSize,
                fontWeight: '600',
                color: colors.secondary,
                margin: 0,
              }}>
                {language === 'en' 
                  ? <>Overall engagement improved by an average of <span style={{ fontSize: '1.5rem', color: colors.primary }}>85%</span> since joining</>
                  : <>综合互动效果较入驻前平均提升 <span style={{ fontSize: '1.5rem', color: colors.primary }}>85%</span></>
                }
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
          fontSize: DESIGN_TOKENS.typography.level5.fontSize,
          color: globalColors.secondary,
          margin: 0,
          lineHeight: 1.6,
        }}>
          {currentContent.footnote}
        </p>
      </div>
    </div>
  );
};

// 使用统一的设计系统
const globalColors = DESIGN_TOKENS.colors.component;
// globalFonts变量已不再使用，改为直接使用typography levels

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
        fontSize: DESIGN_TOKENS.typography.level5.fontSize,
        fontWeight: DESIGN_TOKENS.typography.level5.fontWeight,
        color: globalColors.primary,
        margin: 0,
      }}>
        {title}
      </h4>
      {subtitle && (
        <p style={{
          fontSize: DESIGN_TOKENS.typography.level5.fontSize,
          fontWeight: DESIGN_TOKENS.typography.level5.fontWeight,
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
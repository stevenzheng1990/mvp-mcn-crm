// app/components/LandingPage/components/SimpleCardData.tsx
// 6个简化卡片的数据定义

export const cardData = [
  {
    title: '收益增长轨迹',
    subtitle: '创作者月度收入提升数据',
    data: [
      { label: '入驻前月收入', value: '8.5K', description: '行业平均水平' },
      { label: '第3月月收入', value: '26.4K', description: '+210% 增长' },
      { label: '第6月月收入', value: '51.6K', description: '+507% 增长' },
      { label: '第12月月收入', value: '96.8K', description: '+1039% 增长' },
    ]
  },
  {
    title: '项目报价分布',
    subtitle: '不同价格区间项目占比及ROI',
    data: [
      { label: '5K-10K 项目', value: '28%', description: '平均ROI 320%' },
      { label: '10K-20K 项目', value: '35%', description: '平均ROI 280%' },
      { label: '20K-50K 项目', value: '25%', description: '平均ROI 240%' },
      { label: '50K+ 项目', value: '12%', description: '平均ROI 180%' },
    ]
  },
  {
    title: '粉丝增长分析',
    subtitle: '不同体量创作者增长表现',
    data: [
      { label: '1-10万粉丝', value: '15.8%', description: '月均增长率' },
      { label: '10-30万粉丝', value: '11.2%', description: '月均增长率' },
      { label: '30-100万粉丝', value: '7.6%', description: '月均增长率' },
      { label: '100万+粉丝', value: '4.3%', description: '月均增长率' },
    ]
  },
  {
    title: '内容质量提升',
    subtitle: '赞藏比与完播率双指标追踪',
    data: [
      { label: '入驻前', value: '2.8%', description: '赞藏比 / 18.5% 完播率' },
      { label: '第3月', value: '4.9%', description: '赞藏比 / 30.1% 完播率' },
      { label: '第6月', value: '7.1%', description: '赞藏比 / 37.4% 完播率' },
      { label: '第12月', value: '8.3%', description: '赞藏比 / 41.3% 完播率' },
    ]
  },
  {
    title: '品牌合作层级',
    subtitle: '合作品牌分布及项目预算',
    data: [
      { label: '头部品牌', value: '35%', description: '50K+ 预算 · 雅诗兰黛、苹果' },
      { label: '知名品牌', value: '42%', description: '20-50K 预算 · 完美日记、小米' },
      { label: '新锐品牌', value: '18%', description: '10-20K 预算 · 花西子、理想' },
      { label: '初创品牌', value: '5%', description: '5-10K 预算 · 新兴品牌' },
    ]
  },
  {
    title: '服务质量指标',
    subtitle: 'vs 行业平均水平对比',
    data: [
      { label: '合作续约率', value: '89%', description: '行业平均 65% (+24%)' },
      { label: '项目按时完成', value: '96%', description: '行业平均 78% (+18%)' },
      { label: '内容质量评分', value: '4.8分', description: '行业平均 3.9分 (+23%)' },
      { label: '客户推荐意愿', value: '94%', description: '行业平均 68% (+26%)' },
    ]
  }
];

export default cardData;
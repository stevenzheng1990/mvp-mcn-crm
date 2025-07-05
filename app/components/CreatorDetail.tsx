// app/components/CreatorDetail.tsx
import React, { useMemo } from 'react';
import { 
  X, User, Phone, MapPin, Calendar, DollarSign, 
  FileText, TrendingUp, Users, BarChart3, Eye,
  Instagram, Youtube, Briefcase, PieChart
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart as RePieChart, Pie, Cell 
} from 'recharts';
import type { Creator, Account, Deal } from '../types';

interface CreatorDetailProps {
  isOpen: boolean;
  onClose: () => void;
  creator: Creator | null;
  accounts: Account[];
  deals: Deal[];
}

// 平台图标映射
const platformIcons: Record<string, any> = {
  '小红书': '📕',
  '抖音': '🎵',
  'B站': '📺',
  '微博': '🔥',
  '快手': '⚡',
  'Instagram': '📷',
  'YouTube': '▶️',
  '知乎': '💡',
  '微信视频号': '📹',
};

const MORANDI_COLORS = ['#a8b5c8', '#9caf88', '#d4b5a0', '#c7b299', '#d4a5a5', '#b8b5b1'];

export function CreatorDetail({ isOpen, onClose, creator, accounts, deals }: CreatorDetailProps) {
  if (!isOpen || !creator) return null;

  // 计算统计数据
  const stats = useMemo(() => {
    const creatorAccounts = accounts.filter(acc => acc.creatorId === creator.id);
    const creatorDeals = deals.filter(deal => deal.creatorId === creator.id);
    
    const totalFollowers = creatorAccounts.reduce((sum, acc) => sum + (acc.followers || 0), 0);
    const totalRevenue = creatorDeals.reduce((sum, deal) => sum + (deal.receivedAmount || 0), 0);
    const totalDeals = creatorDeals.length;
    const avgDealAmount = totalDeals > 0 ? totalRevenue / totalDeals : 0;
    
    // 平台分布数据
    const platformData = creatorAccounts.map(acc => ({
      name: acc.platform,
      value: acc.followers || 0,
      price: acc.price || 0
    }));

    // 业配趋势数据（按月）
    const dealTrend = creatorDeals.reduce((acc, deal) => {
      if (!deal.date) return acc;
      const month = new Date(deal.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' });
      const existing = acc.find(item => item.name === month);
      if (existing) {
        existing.value += deal.receivedAmount || 0;
        existing.count += 1;
      } else {
        acc.push({ 
          name: month, 
          value: deal.receivedAmount || 0,
          count: 1
        });
      }
      return acc;
    }, [] as Array<{ name: string; value: number; count: number }>)
    .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    // 合作方分布
    const partnerData = creatorDeals.reduce((acc, deal) => {
      if (!deal.partner) return acc;
      const existing = acc.find(item => item.name === deal.partner);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: deal.partner, value: 1 });
      }
      return acc;
    }, [] as Array<{ name: string; value: number }>)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // 只显示前5个合作方

    return {
      totalFollowers,
      totalRevenue,
      totalDeals,
      avgDealAmount,
      platformData,
      dealTrend,
      partnerData,
      creatorAccounts,
      creatorDeals
    };
  }, [creator.id, accounts, deals]);

  const formatNumber = (num: number) => {
    if (num >= 10000) return `${(num / 10000).toFixed(1)}万`;
    return num.toLocaleString();
  };

  const formatCurrency = (amount: number) => `¥${amount.toLocaleString()}`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-[var(--morandi-sage)] to-[var(--morandi-cloud)] p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                <User size={28} />
                {creator.realName || creator.wechatName || creator.id}
              </h2>
              <div className="flex flex-wrap gap-4 text-sm opacity-90">
                <span className="flex items-center gap-1">
                  <MapPin size={16} />
                  {creator.city || '未设置'}
                </span>
                <span className="flex items-center gap-1">
                  <Phone size={16} />
                  {creator.contactMethod || '未设置'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  签约状态: {creator.contractStatus || '未签约'}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Users}
              title="总粉丝数"
              value={formatNumber(stats.totalFollowers)}
              color="var(--morandi-sage)"
            />
            <StatCard
              icon={DollarSign}
              title="总收入"
              value={formatCurrency(stats.totalRevenue)}
              color="var(--morandi-cloud)"
            />
            <StatCard
              icon={FileText}
              title="业配数量"
              value={stats.totalDeals.toString()}
              color="var(--morandi-dust)"
            />
            <StatCard
              icon={TrendingUp}
              title="平均单价"
              value={formatCurrency(stats.avgDealAmount)}
              color="var(--morandi-rose)"
            />
          </div>

          {/* 平台账号信息 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[var(--morandi-stone)] mb-4 flex items-center gap-2">
              <BarChart3 size={20} />
              平台账号信息
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.creatorAccounts.map((account) => (
                <div key={`${account.creatorId}-${account.platform}`} 
                     className="bg-white rounded-xl p-4 shadow-sm border border-[var(--morandi-pearl)]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{platformIcons[account.platform] || '📱'}</span>
                    <span className="text-sm text-[var(--morandi-mist)]">{account.platform}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[var(--morandi-mist)]">粉丝数</span>
                      <span className="font-semibold">{formatNumber(account.followers || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[var(--morandi-mist)]">报价</span>
                      <span className="font-semibold">{formatCurrency(account.price || 0)}</span>
                    </div>
                    {account.link && (
                      <a href={account.link} target="_blank" rel="noopener noreferrer" 
                         className="inline-flex items-center gap-1 text-sm text-[var(--morandi-cloud)] hover:text-[var(--morandi-sage)] mt-2">
                        <Eye size={14} />
                        查看主页
                      </a>
                    )}
                  </div>
                </div>
              ))}
              {stats.creatorAccounts.length === 0 && (
                <div className="col-span-full text-center py-8 text-[var(--morandi-mist)]">
                  暂无平台账号信息
                </div>
              )}
            </div>
          </div>

          {/* 数据图表 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 粉丝分布饼图 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--morandi-pearl)]">
              <h4 className="text-base font-semibold text-[var(--morandi-stone)] mb-4">
                粉丝分布
              </h4>
              {stats.platformData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <RePieChart>
                    <Pie
                      data={stats.platformData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={MORANDI_COLORS[index % MORANDI_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => formatNumber(Number(value))} />
                  </RePieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-[var(--morandi-mist)]">
                  暂无数据
                </div>
              )}
            </div>

            {/* 业配趋势折线图 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--morandi-pearl)]">
              <h4 className="text-base font-semibold text-[var(--morandi-stone)] mb-4">
                业配趋势
              </h4>
              {stats.dealTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={stats.dealTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--morandi-pearl)" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="var(--morandi-cloud)" 
                      strokeWidth={3}
                      dot={{ fill: 'var(--morandi-sage)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-[var(--morandi-mist)]">
                  暂无数据
                </div>
              )}
            </div>
          </div>

          {/* 最近业配记录 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[var(--morandi-stone)] mb-4 flex items-center gap-2">
              <Briefcase size={20} />
              最近业配记录
            </h3>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-[var(--morandi-pearl)]">
              <table className="w-full">
                <thead className="bg-[var(--morandi-pearl)]/30">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--morandi-stone)]">日期</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--morandi-stone)]">合作方</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--morandi-stone)]">金额</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--morandi-stone)]">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--morandi-pearl)]">
                  {stats.creatorDeals.slice(0, 5).map((deal) => (
                    <tr key={deal.id} className="hover:bg-[var(--morandi-pearl)]/10">
                      <td className="px-4 py-3 text-sm">{new Date(deal.date).toLocaleDateString('zh-CN')}</td>
                      <td className="px-4 py-3 text-sm">{deal.partner}</td>
                      <td className="px-4 py-3 text-sm font-medium">{formatCurrency(deal.amount || 0)}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          deal.transferStatus === '已转账' ? 'bg-green-100 text-green-800' :
                          deal.transferStatus === '待转账' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {deal.transferStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {stats.creatorDeals.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-[var(--morandi-mist)]">
                        暂无业配记录
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 基本信息 */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--morandi-stone)] mb-4 flex items-center gap-2">
              <User size={20} />
              基本信息
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="博主ID" value={creator.id} />
              <InfoItem label="真实姓名" value={creator.realName || '未设置'} />
              <InfoItem label="微信名" value={creator.wechatName || '未设置'} />
              <InfoItem label="联系方式" value={creator.contactMethod || '未设置'} />
              <InfoItem label="城市" value={creator.city || '未设置'} />
              <InfoItem label="赛道" value={creator.category || '未设置'} />
              <InfoItem label="分成比例" value={creator.commission ? `${(creator.commission * 100).toFixed(0)}%` : '未设置'} />
              <InfoItem label="签约状态" value={creator.contractStatus || '未签约'} />
              <InfoItem label="合同开始" value={creator.contractStartDate || '未设置'} />
              <InfoItem label="合同结束" value={creator.contractEndDate || '未设置'} />
              <InfoItem label="转账账号" value={creator.transferAccount || '未设置'} />
              <InfoItem label="备注" value={creator.notes || '无'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 统计卡片组件
function StatCard({ icon: Icon, title, value, color }: any) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--morandi-pearl)]">
      <div className="flex items-center justify-between mb-3">
        <Icon size={24} style={{ color }} />
        <span className="text-sm text-[var(--morandi-mist)]">{title}</span>
      </div>
      <div className="text-2xl font-bold text-[var(--morandi-stone)]">{value}</div>
    </div>
  );
}

// 信息项组件
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-lg p-3 border border-[var(--morandi-pearl)]">
      <span className="text-sm text-[var(--morandi-mist)]">{label}</span>
      <p className="font-medium text-[var(--morandi-stone)] mt-1">{value}</p>
    </div>
  );
}

export default CreatorDetail;
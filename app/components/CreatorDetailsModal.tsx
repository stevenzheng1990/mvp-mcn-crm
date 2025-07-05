// app/components/CreatorDetailsModal.tsx
import React, { useMemo } from 'react';
import {
  X, Users, Eye, DollarSign, Calendar, TrendingUp,
  Award, MapPin, MessageSquare, Briefcase, ChevronRight
} from 'lucide-react';
import type { Creator, Account, Deal } from '../types';
import { utils } from './Dashboard';

interface CreatorDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: Creator | null;
  accounts: Account[];
  deals: Deal[];
}

// 统计卡片组件
function StatCard({ icon: Icon, title, value, subValue, color }: {
  icon: any;
  title: string;
  value: string | number;
  subValue?: string;
  color: string;
}) {
  return (
    <div className={`card-morandi p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[var(--morandi-mist)] text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-[var(--morandi-stone)] mt-2">{value}</p>
          {subValue && (
            <p className="text-sm text-[var(--morandi-sage)] mt-1">{subValue}</p>
          )}
        </div>
        <Icon size={32} className="text-[var(--morandi-cloud)] opacity-50" />
      </div>
    </div>
  );
}

// 平台账号卡片
function PlatformCard({ platform, account }: { platform: string; account: Account }) {
  const platformIcons: Record<string, string> = {
    '抖音': '🎵',
    '小红书': '📕',
    'B站': '📺',
    '微博': '📱',
    '快手': '⚡',
    '视频号': '🎬',
  };

  return (
    <div className="card-morandi p-6 hover:shadow-lg transition-all">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-3xl">{platformIcons[platform] || '📱'}</span>
        <h4 className="text-lg font-semibold text-[var(--morandi-stone)]">{platform}</h4>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[var(--morandi-mist)]">粉丝数</span>
          <span className="font-bold text-[var(--morandi-stone)]">
            {utils.formatNumber(account.followers)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[var(--morandi-mist)]">报价</span>
          <span className="font-bold text-[var(--morandi-rose)]">
            {utils.formatCurrency(account.price)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[var(--morandi-mist)]">更新时间</span>
          <span className="text-sm text-[var(--morandi-ash)]">
            {utils.formatDate(account.updateDate)}
          </span>
        </div>
        {account.link && (
          <a 
            href={account.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[var(--morandi-cloud)] hover:text-[var(--morandi-sage)] transition-colors mt-3"
          >
            查看主页 <ChevronRight size={16} />
          </a>
        )}
      </div>
    </div>
  );
}

// 业配记录表格
function DealsTable({ deals }: { deals: Deal[] }) {
  const sortedDeals = [...deals].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--morandi-pearl)]">
            <th className="text-left py-3 px-4 text-[var(--morandi-mist)] font-medium">日期</th>
            <th className="text-left py-3 px-4 text-[var(--morandi-mist)] font-medium">合作方</th>
            <th className="text-left py-3 px-4 text-[var(--morandi-mist)] font-medium">类型</th>
            <th className="text-right py-3 px-4 text-[var(--morandi-mist)] font-medium">金额</th>
            <th className="text-right py-3 px-4 text-[var(--morandi-mist)] font-medium">博主分成</th>
            <th className="text-center py-3 px-4 text-[var(--morandi-mist)] font-medium">状态</th>
          </tr>
        </thead>
        <tbody>
          {sortedDeals.map((deal) => (
            <tr key={deal.id} className="border-b border-[var(--morandi-pearl)] hover:bg-[var(--morandi-pearl)]/20">
              <td className="py-3 px-4">{utils.formatDate(deal.date)}</td>
              <td className="py-3 px-4">{deal.partner}</td>
              <td className="py-3 px-4">{deal.type || '-'}</td>
              <td className="py-3 px-4 text-right font-medium">
                {utils.formatCurrency(deal.amount)}
              </td>
              <td className="py-3 px-4 text-right text-[var(--morandi-sage)]">
                {utils.formatCurrency(deal.creatorShare)}
              </td>
              <td className="py-3 px-4 text-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  deal.transferStatus === '已转账' ? 'status-success' :
                  deal.transferStatus === '待转账' ? 'status-warning' :
                  'status-default'
                }`}>
                  {deal.transferStatus}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CreatorDetailsModal({
  isOpen,
  onClose,
  creator,
  accounts,
  deals
}: CreatorDetailsModalProps) {
  // 计算统计数据
  const stats = useMemo(() => {
    if (!creator) return null;

    const creatorAccounts = accounts.filter(acc => acc.creatorId === creator.id);
    const creatorDeals = deals.filter(deal => deal.creatorId === creator.id);

    // 总粉丝数
    const totalFollowers = creatorAccounts.reduce((sum, acc) => sum + (acc.followers || 0), 0);
    
    // 总收入
    const totalRevenue = creatorDeals.reduce((sum, deal) => sum + (deal.amount || 0), 0);
    
    // 已转账金额
    const paidAmount = creatorDeals
      .filter(deal => deal.transferStatus === '已转账')
      .reduce((sum, deal) => sum + (deal.creatorShare || 0), 0);
    
    // 待转账金额
    const pendingAmount = creatorDeals
      .filter(deal => deal.transferStatus === '待转账')
      .reduce((sum, deal) => sum + (deal.creatorShare || 0), 0);

    // 平台分布
    const platformStats = creatorAccounts.reduce((acc, account) => {
      acc[account.platform] = account;
      return acc;
    }, {} as Record<string, Account>);

    // 月度业配数
    const currentMonth = new Date().getMonth();
    const monthlyDeals = creatorDeals.filter(deal => 
      new Date(deal.date).getMonth() === currentMonth
    );

    return {
      totalFollowers,
      totalRevenue,
      paidAmount,
      pendingAmount,
      platformStats,
      monthlyDeals: monthlyDeals.length,
      totalDeals: creatorDeals.length,
      creatorAccounts,
      creatorDeals
    };
  }, [creator, accounts, deals]);

  if (!isOpen || !creator || !stats) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-[var(--morandi-cloud)] to-[var(--morandi-sage)] p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2">{creator.realName || creator.id}</h2>
              <div className="flex items-center gap-6 text-white/90">
                <span className="flex items-center gap-2">
                  <MessageSquare size={16} />
                  {creator.wechatName || '未设置微信'}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={16} />
                  {creator.city || '未知城市'}
                </span>
                <span className="flex items-center gap-2">
                  <Briefcase size={16} />
                  {creator.category || '未分类'}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X size={28} />
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Users}
              title="总粉丝数"
              value={utils.formatNumber(stats.totalFollowers)}
              subValue={`${stats.creatorAccounts.length} 个平台`}
              color="border-[var(--morandi-cloud)]"
            />
            <StatCard
              icon={DollarSign}
              title="总收入"
              value={utils.formatCurrency(stats.totalRevenue)}
              subValue={`${stats.totalDeals} 笔业配`}
              color="border-[var(--morandi-sage)]"
            />
            <StatCard
              icon={Award}
              title="已结算"
              value={utils.formatCurrency(stats.paidAmount)}
              subValue={`分成比例: ${(creator.commission * 100).toFixed(0)}%`}
              color="border-[var(--morandi-dust)]"
            />
            <StatCard
              icon={TrendingUp}
              title="待结算"
              value={utils.formatCurrency(stats.pendingAmount)}
              subValue={`本月业配: ${stats.monthlyDeals} 笔`}
              color="border-[var(--morandi-rose)]"
            />
          </div>

          {/* 签约信息 */}
          <div className="card-morandi p-6 mb-8">
            <h3 className="text-xl font-semibold text-[var(--morandi-stone)] mb-4">签约信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-[var(--morandi-mist)] text-sm">签约状态</p>
                <p className="text-[var(--morandi-stone)] font-medium mt-1">
                  {creator.contractStatus || '未签约'}
                </p>
              </div>
              <div>
                <p className="text-[var(--morandi-mist)] text-sm">合同期限</p>
                <p className="text-[var(--morandi-stone)] font-medium mt-1">
                  {creator.contractStartDate && creator.contractEndDate
                    ? `${utils.formatDate(creator.contractStartDate)} - ${utils.formatDate(creator.contractEndDate)}`
                    : '未设置'}
                </p>
              </div>
              <div>
                <p className="text-[var(--morandi-mist)] text-sm">面试信息</p>
                <p className="text-[var(--morandi-stone)] font-medium mt-1">
                  {creator.interviewer ? `${creator.interviewer} · ${utils.formatDate(creator.interviewDate)}` : '未面试'}
                </p>
              </div>
            </div>
          </div>

          {/* 平台账号 */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-[var(--morandi-stone)] mb-4">平台账号</h3>
            {stats.creatorAccounts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(stats.platformStats).map(([platform, account]) => (
                  <PlatformCard key={platform} platform={platform} account={account} />
                ))}
              </div>
            ) : (
              <div className="card-morandi p-8 text-center text-[var(--morandi-mist)]">
                暂无平台账号信息
              </div>
            )}
          </div>

          {/* 业配记录 */}
          <div>
            <h3 className="text-xl font-semibold text-[var(--morandi-stone)] mb-4">业配记录</h3>
            {stats.creatorDeals.length > 0 ? (
              <div className="card-morandi">
                <DealsTable deals={stats.creatorDeals} />
              </div>
            ) : (
              <div className="card-morandi p-8 text-center text-[var(--morandi-mist)]">
                暂无业配记录
              </div>
            )}
          </div>

          {/* 备注信息 */}
          {creator.notes && (
            <div className="card-morandi p-6 mt-8">
              <h3 className="text-xl font-semibold text-[var(--morandi-stone)] mb-4">备注</h3>
              <p className="text-[var(--morandi-stone)] whitespace-pre-wrap">{creator.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import React, { useState, useMemo } from 'react';
import type { Creator, Account, Deal, ProcessedData, Pagination } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Users, TrendingUp, DollarSign, Download, Edit, X, Plus, Search, 
  RefreshCw, Loader2, Calendar, AlertTriangle, Upload, FileText, 
  LogOut, BarChart3, UserCheck, Trash2, Eye, EyeOff, LucideIcon 
} from 'lucide-react';

// ============ 类型定义 ============
// 数据项联合类型
type DataItem = Creator | Account | Deal;

// DataTable 组件的 Props 类型
interface DataTableProps {
  data: DataItem[];
  type: 'creators' | 'accounts' | 'deals';
  onEdit?: (item: DataItem) => void;
  onDelete?: (id: string) => void;
  creators?: Creator[];
}

// 统计卡片 Props
interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: 'primary' | 'green' | 'yellow' | 'purple';
}

// 控制栏 Props
interface ControlBarProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onRefresh: () => void;
  onOpenModal?: () => void;
  refreshing: boolean;
  totalCount: number;
  filteredCount: number;
  searchPlaceholder?: string;
  filters?: Array<{ value: string; label: string }>;
  newButtonText?: string;
  newButtonAction: () => void;
  extraInfo?: string;
}

// 提醒卡片 Props
interface AlertCardProps {
  type: 'warning' | 'error';
  icon: LucideIcon;
  title: string;
  content: string;
  action: () => void;
  actionText: string;
}

// 空状态 Props
interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action: () => void;
  actionText: string;
}

// 分页 Props
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

// Tab 组件的基础 Props
interface BaseTabProps {
  onRefresh: () => void;
  onOpenModal: (type: string, isNew: boolean, data?: any) => void;
  refreshing: boolean;
  pagination: Pagination;
  setPagination: (pagination: Pagination) => void;
}

// 带搜索功能的 Tab Props
interface SearchableTabProps extends BaseTabProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
}

// 博主管理 Tab Props
interface CreatorsTabProps extends SearchableTabProps {
  creators: Creator[];
  onDelete: (id: string) => void;
  totalCount: number;
}

// 账号管理 Tab Props
interface AccountsTabProps extends BaseTabProps {
  accounts: Account[];
  creators: Creator[];
  onDelete: (id: string) => void;
  totalCount: number;
}

// 业配记录 Tab Props
interface DealsTabProps extends SearchableTabProps {
  deals: Deal[];
  creators: Creator[];
  onDelete: (id: string) => void;
  totalCount: number;
}

// ============ 常量 ============
const MORANDI_COLORS = ['#a8b5c8', '#9caf88', '#d4b5a0', '#c7b299', '#d4a5a5', '#b8b5b1'];

// ============ 工具函数 ============
export const utils = {
  formatNumber: (num: number) => {
    if (num >= 10000) return `${(num / 10000).toFixed(1)}万`;
    return num.toLocaleString();
  },
  formatCurrency: (amount: number) => `¥${amount.toLocaleString()}`,
  formatDate: (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('zh-CN');
  },
  isOverdue: (deal: Deal) => {
    if (deal.transferStatus === '已转账') return false;
    const transferDate = new Date(deal.transferDate);
    return transferDate < new Date();
  },
  generateId: () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${year}${month}${random}`;
  },
  calculateShares: (amount: number, commission: number) => {
    const companyShare = Math.round(amount * (1 - commission));
    const creatorShare = amount - companyShare;
    return { companyShare, creatorShare };
  },
};

// ============ 主组件 ============
export function Dashboard({
  creators, accounts, deals, filteredData, processedData,
  activeTab, loading, refreshing, searchTerm, statusFilter, pagination,
  onTabChange, onSearchChange, onStatusFilterChange, onPaginationChange,
  onLogout, onOpenModal, onRefresh, onDeleteCreator, onDeleteAccount, onDeleteDeal
}: {
  creators: Creator[];
  accounts: Account[];
  deals: Deal[];
  filteredData: any;
  processedData: ProcessedData;
  activeTab: string;
  loading: boolean;
  refreshing: boolean;
  searchTerm: string;
  statusFilter: string;
  pagination: any;
  onTabChange: (tab: string) => void;
  onSearchChange: (term: string) => void;
  onStatusFilterChange: (filter: string) => void;
  onPaginationChange: (type: string, pagination: any) => void;
  onLogout: () => void;
  onOpenModal: (type: string, isNew?: boolean, data?: any) => void;
  onRefresh: () => void;
  onDeleteCreator: (id: string) => void;
  onDeleteAccount: (id: string) => void;
  onDeleteDeal: (id: string) => void;
}) {
  return (
    <>
      <Header onLogout={onLogout} onOpenModal={onOpenModal} />
      <Navigation activeTab={activeTab} onTabChange={onTabChange} />
      
      <main className="max-w-[1400px] mx-auto px-8 py-10">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="animate-morandi-fade-in">
            {activeTab === 'overview' && (
              <OverviewTab 
                stats={processedData.stats}
                monthlyData={processedData.monthlyData}
                chartData={processedData.chartData}
                onTabChange={onTabChange}
              />
            )}

            {activeTab === 'creators' && (
              <CreatorsTab
                creators={filteredData.creators}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                onSearchChange={onSearchChange}
                onStatusFilterChange={onStatusFilterChange}
                onRefresh={onRefresh}
                onOpenModal={onOpenModal}
                onDelete={onDeleteCreator}
                refreshing={refreshing}
                totalCount={creators.length}
                pagination={pagination.creators}
                setPagination={(p: Pagination) => onPaginationChange('creators', p)}
              />
            )}

            {activeTab === 'accounts' && (
              <AccountsTab 
                accounts={accounts} 
                creators={creators}
                onRefresh={onRefresh}
                onOpenModal={onOpenModal}
                onDelete={onDeleteAccount}
                refreshing={refreshing}
                totalCount={accounts.length}
                pagination={pagination.accounts}
                setPagination={(p: Pagination) => onPaginationChange('accounts', p)}
              />
            )}

            {activeTab === 'deals' && (
              <DealsTab
                deals={filteredData.deals}
                creators={creators}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                onSearchChange={onSearchChange}
                onStatusFilterChange={onStatusFilterChange}
                onRefresh={onRefresh}
                onOpenModal={onOpenModal}
                onDelete={onDeleteDeal}
                refreshing={refreshing}
                totalCount={deals.length}
                pagination={pagination.deals}
                setPagination={(p: Pagination) => onPaginationChange('deals', p)}
              />
            )}
          </div>
        )}
      </main>
    </>
  );
}

// ============ 子组件 ============

// Header 组件
function Header({ onLogout, onOpenModal }: { 
  onLogout: () => void; 
  onOpenModal: (type: string, isNew?: boolean) => void;
}) {
  return (
    <header className="bg-morandi-header-gradient backdrop-blur-md border-b border-morandi-mist/20 sticky top-0 z-40">
      <div className="max-w-[1400px] mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-morandi-stone mb-1">十方众声 MCN 管理系统</h1>
            <p className="text-morandi-mist text-sm">Mega Volume Production Creator Management</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onOpenModal('import')} 
              className="btn-morandi-secondary"
            >
              <Upload size={18} />
              批量导入
            </button>
            <button 
              onClick={() => onOpenModal('export')} 
              className="btn-morandi-secondary"
            >
              <Download size={18} />
              导出数据
            </button>
            <button 
              onClick={onLogout} 
              className="btn-morandi-secondary"
            >
              <LogOut size={18} />
              退出登录
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// Navigation 组件
function Navigation({ activeTab, onTabChange }: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  const tabs = [
    { id: 'overview', label: '数据概览', icon: BarChart3 },
    { id: 'creators', label: '博主管理', icon: Users },
    { id: 'accounts', label: '账号管理', icon: UserCheck },
    { id: 'deals', label: '业配记录', icon: FileText },
  ];

  return (
    <nav className="sticky top-[85px] z-30 bg-morandi-nav-gradient backdrop-blur-sm border-b border-morandi-mist/20">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex space-x-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                nav-tab-morandi
                ${activeTab === tab.id ? 'active' : ''}
              `}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

// LoadingSpinner 组件
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center">
        <Loader2 size={48} className="animate-morandi-spin text-morandi-cloud mx-auto mb-4" />
        <p className="text-morandi-mist">加载数据中...</p>
      </div>
    </div>
  );
}

// StatCard 组件
function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    primary: 'from-morandi-sage/10 to-morandi-sage/5 border-morandi-sage/20 text-morandi-sage',
    green: 'from-green-500/10 to-green-500/5 border-green-500/20 text-green-600',
    yellow: 'from-amber-500/10 to-amber-500/5 border-amber-500/20 text-amber-600',
    purple: 'from-purple-500/10 to-purple-500/5 border-purple-500/20 text-purple-600',
  };

  return (
    <div className={`stat-card-morandi bg-gradient-to-br ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-4">
        <Icon size={24} />
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <div className="text-sm text-morandi-mist">{label}</div>
    </div>
  );
}

// AlertCard 组件
function AlertCard({ type, icon: Icon, title, content, action, actionText }: AlertCardProps) {
  const typeClass = type === 'warning' ? 
    'from-amber-500/10 to-amber-500/5 border-amber-500/20' : 
    'from-red-500/10 to-red-500/5 border-red-500/20';

  return (
    <div className={`alert-card-morandi bg-gradient-to-r ${typeClass}`}>
      <div className="flex items-start gap-4">
        <Icon size={20} className={type === 'warning' ? 'text-amber-600' : 'text-red-600'} />
        <div className="flex-1">
          <h4 className="font-semibold text-morandi-stone mb-1">{title}</h4>
          <p className="text-sm text-morandi-mist">{content}</p>
        </div>
        <button onClick={action} className="btn-morandi-secondary px-4 py-2 text-sm">
          {actionText}
        </button>
      </div>
    </div>
  );
}

// EmptyState 组件
function EmptyState({ icon: Icon, title, description, action, actionText }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <Icon size={48} className="text-morandi-mist/30 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-morandi-stone mb-2">{title}</h3>
      <p className="text-morandi-mist mb-6">{description}</p>
      <button onClick={action} className="btn-morandi-primary mx-auto">
        <Plus size={18} />
        {actionText}
      </button>
    </div>
  );
}

// ControlBar 组件
function ControlBar(props: ControlBarProps) {
  const {
    searchTerm, statusFilter, onSearchChange, onStatusFilterChange,
    onRefresh, refreshing, totalCount, filteredCount,
    searchPlaceholder = "搜索...", filters = [], newButtonText = "新增",
    newButtonAction, extraInfo
  } = props;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="search-morandi">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-morandi pl-12 w-80"
          />
        </div>
        
        {filters.length > 0 && (
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="input-morandi w-40"
          >
            {filters.map(filter => (
              <option key={filter.value} value={filter.value}>{filter.label}</option>
            ))}
          </select>
        )}
        
        <button onClick={onRefresh} disabled={refreshing} className="btn-morandi-secondary">
          <RefreshCw size={18} className={refreshing ? 'animate-morandi-spin' : ''} />
          刷新
        </button>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-sm text-morandi-mist">
          显示 {filteredCount} / {totalCount} 条记录
          {extraInfo && <span className="ml-2">• {extraInfo}</span>}
        </div>
        
        <button onClick={newButtonAction} className="btn-morandi-primary">
          <Plus size={18} />
          {newButtonText}
        </button>
      </div>
    </div>
  );
}

// Pagination 组件
function Pagination(props: PaginationProps) {
  const { currentPage, totalPages, onPageChange, totalItems, pageSize, onPageSizeChange } = props;
  
  return (
    <div className="flex items-center justify-between mt-6 pt-6 border-t border-morandi-mist/10">
      <div className="flex items-center gap-4">
        <span className="text-sm text-morandi-mist">
          共 {totalItems} 条记录
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-morandi-mist">每页显示</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="input-morandi w-20 py-1"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-morandi-mist">条</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn-morandi"
        >
          上一页
        </button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`pagination-number-morandi ${currentPage === pageNum ? 'active' : ''}`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn-morandi"
        >
          下一页
        </button>
      </div>
    </div>
  );
}

// DataTable 组件 - 使用严格类型
function DataTable({ data, type, onEdit, onDelete, creators }: DataTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof DataItem];
      const bValue = b[sortConfig.key as keyof DataItem];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  const getColumns = () => {
    switch (type) {
      case 'creators':
        return [
          { label: '博主ID', key: 'id' },
          { label: '真实姓名', key: 'realName' },
          { label: '微信名', key: 'wechatName' },
          { label: '所在城市', key: 'city' },
          { label: '签约状态', key: 'contractStatus' },
          { label: '分成比例', key: 'commission' },
          { label: '面试日期', key: 'interviewDate' },
          { label: '操作', key: null }
        ];
      case 'accounts':
        return [
          { label: '博主', key: null },
          { label: '平台', key: 'platform' },
          { label: '粉丝数', key: 'followers' },
          { label: '报价', key: 'price' },
          { label: '更新日期', key: 'updateDate' },
          { label: '链接', key: null },
          { label: '操作', key: null }
        ];
      case 'deals':
        return [
          { label: '业配ID', key: 'id' },
          { label: '博主', key: null },
          { label: '合作方', key: 'partner' },
          { label: '金额', key: 'amount' },
          { label: '转账状态', key: 'transferStatus' },
          { label: '广告日期', key: 'date' },
          { label: '操作', key: null }
        ];
      default:
        return [];
    }
  };

  const getCreatorName = (creatorId: string) => {
    const creator = creators?.find(c => c.id === creatorId);
    return creator ? creator.realName : creatorId;
  };

  const renderRow = (item: DataItem) => {
    switch (type) {
      case 'creators':
        const creator = item as Creator;
        return (
          <tr key={creator.id} className="table-morandi-row">
            <td className="px-8 py-6 font-mono text-sm">{creator.id || '-'}</td>
            <td className="px-8 py-6 font-medium">{creator.realName || '-'}</td>
            <td className="px-8 py-6">{creator.wechatName || '-'}</td>
            <td className="px-8 py-6">{creator.city || '-'}</td>
            <td className="px-8 py-6">
              <div className="flex flex-wrap gap-2">
                {creator.contractStatus ? 
                  creator.contractStatus.split(',').map((status: string, index: number) => (
                    <span 
                      key={index}
                      className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        status.trim().includes('已经签') ? 'status-success' : 'status-warning'
                      }`}
                    >
                      {status.trim()}
                    </span>
                  )) : 
                  <span className="px-2 py-1 rounded-full text-xs font-medium status-warning">未设置</span>
                }
              </div>
            </td>
            <td className="px-8 py-6">{creator.commission ? `${(creator.commission * 100).toFixed(0)}%` : '-'}</td>
            <td className="px-8 py-6">{utils.formatDate(creator.interviewDate)}</td>
            <td className="px-8 py-6">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onEdit?.(creator)} 
                  className="text-morandi-cloud hover:text-morandi-sage transition-colors"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => onDelete?.(creator.id)} 
                  className="text-morandi-rose hover:text-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </td>
          </tr>
        );
      
      case 'accounts':
        const account = item as Account;
        return (
          <tr key={`${account.creatorId}-${account.platform}`} className="table-morandi-row">
            <td className="px-8 py-6 font-medium">{getCreatorName(account.creatorId)}</td>
            <td className="px-8 py-6">{account.platform || '-'}</td>
            <td className="px-8 py-6">{account.followers ? utils.formatNumber(account.followers) : '-'}</td>
            <td className="px-8 py-6">{account.price ? utils.formatCurrency(account.price) : '-'}</td>
            <td className="px-8 py-6">{utils.formatDate(account.updateDate)}</td>
            <td className="px-8 py-6">
              {account.link ? (
                <a href={account.link} target="_blank" rel="noopener noreferrer" className="text-morandi-cloud hover:underline">
                  查看
                </a>
              ) : '-'}
            </td>
            <td className="px-8 py-6">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onEdit?.(account)} 
                  className="text-morandi-cloud hover:text-morandi-sage transition-colors"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => onDelete?.(`${account.creatorId}-${account.platform}`)} 
                  className="text-morandi-rose hover:text-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </td>
          </tr>
        );
      
      case 'deals':
        const deal = item as Deal;
        return (
          <tr key={deal.id} className="table-morandi-row">
            <td className="px-8 py-6 font-mono text-sm">{deal.id || '-'}</td>
            <td className="px-8 py-6 font-medium">{getCreatorName(deal.creatorId)}</td>
            <td className="px-8 py-6">{deal.partner || '-'}</td>
            <td className="px-8 py-6 font-medium text-morandi-cloud">
              {deal.amount ? utils.formatCurrency(deal.amount) : '-'}
            </td>
            <td className="px-8 py-6">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                deal.transferStatus === '已转账' ? 'status-success' :
                deal.transferStatus === '处理中' ? 'status-info' :
                utils.isOverdue(deal) ? 'status-error' : 'status-warning'
              }`}>
                {deal.transferStatus || '-'}
              </span>
            </td>
            <td className="px-8 py-6">{utils.formatDate(deal.date)}</td>
            <td className="px-8 py-6">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onEdit?.(deal)} 
                  className="text-morandi-cloud hover:text-morandi-sage transition-colors"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => onDelete?.(deal.id)} 
                  className="text-morandi-rose hover:text-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </td>
          </tr>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-morandi">
        <thead>
          <tr>
            {getColumns().map(column => (
              <th 
                key={column.label}
                onClick={() => column.key && handleSort(column.key)}
                className={column.key ? 'cursor-pointer hover:bg-morandi-pearl/50' : ''}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.key && sortConfig?.key === column.key && (
                    <span className="text-morandi-cloud">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map(item => renderRow(item))}
        </tbody>
      </table>
    </div>
  );
}

// ============ Tab 组件 ============

// 数据概览Tab
function OverviewTab({ stats, monthlyData, chartData, onTabChange }: {
  stats: any;
  monthlyData: any;
  chartData: any;
  onTabChange: (tab: string) => void;
}) {
  const { pendingTransfers, overdueTransfers } = monthlyData;

  return (
    <div className="space-y-10">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard icon={Users} label="签约博主" value={stats.totalCreators} color="primary" />
        <StatCard icon={TrendingUp} label="总粉丝数" value={utils.formatNumber(stats.totalFollowers)} color="green" />
        <StatCard icon={DollarSign} label="总营收" value={utils.formatCurrency(stats.totalRevenue)} color="yellow" />
        <StatCard icon={FileText} label="业配数量" value={stats.totalDeals} color="purple" />
      </div>

      {/* 财务提醒 */}
      {(pendingTransfers.length > 0 || overdueTransfers.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pendingTransfers.length > 0 && (
            <AlertCard
              type="warning"
              icon={Calendar}
              title="待转账提醒"
              content={`有 ${pendingTransfers.length} 笔业配待转账`}
              action={() => onTabChange('deals')}
              actionText="查看详情"
            />
          )}
          
          {overdueTransfers.length > 0 && (
            <AlertCard
              type="error"
              icon={AlertTriangle}
              title="逾期提醒"
              content={`有 ${overdueTransfers.length} 笔业配转账逾期`}
              action={() => onTabChange('deals')}
              actionText="立即处理"
            />
          )}
        </div>
      )}

      {/* 图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="营收趋势" type="line" data={chartData.revenue} />
        <ChartCard title="转账状态分布" type="pie" data={chartData.status} />
        <ChartCard title="博主赛道分布" type="bar" data={chartData.category} />
        <ChartCard title="平台分布" type="pie" data={chartData.platform} />
      </div>
    </div>
  );
}

// 博主管理Tab
function CreatorsTab(props: CreatorsTabProps) {
  const {
    creators, searchTerm, statusFilter, onSearchChange, onStatusFilterChange,
    onRefresh, onOpenModal, onDelete, refreshing, totalCount, pagination, setPagination
  } = props;

  const startIndex = (pagination.page - 1) * pagination.size;
  const endIndex = startIndex + pagination.size;
  const paginatedCreators = creators.slice(startIndex, endIndex);
  const totalPages = Math.ceil(creators.length / pagination.size);

  const filters = [
    { value: 'all', label: '全部状态' },
    { value: 'signed', label: '已签约' },
    { value: 'unsigned', label: '未签约' },
    { value: 'interview', label: '面试中' },
  ];

  return (
    <div className="space-y-8">
      <ControlBar
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={onSearchChange}
        onStatusFilterChange={onStatusFilterChange}
        onRefresh={onRefresh}
        refreshing={refreshing}
        totalCount={totalCount}
        filteredCount={creators.length}
        searchPlaceholder="搜索博主姓名、ID、城市..."
        filters={filters}
        newButtonText="新增博主"
        newButtonAction={() => onOpenModal('edit', true)}
      />

      <div className="card-morandi">
        {paginatedCreators.length > 0 ? (
          <>
            <DataTable 
              data={paginatedCreators} 
              type="creators" 
              onEdit={(creator) => onOpenModal('edit', false, creator)}
              onDelete={onDelete}
            />
            <Pagination
              currentPage={pagination.page}
              totalPages={totalPages}
              onPageChange={(page) => setPagination({ ...pagination, page })}
              totalItems={creators.length}
              pageSize={pagination.size}
              onPageSizeChange={(size) => setPagination({ page: 1, size })}
            />
          </>
        ) : (
          <EmptyState
            icon={Users}
            title="暂无博主数据"
            description="开始添加您的第一个博主信息"
            action={() => onOpenModal('edit', true)}
            actionText="添加博主"
          />
        )}
      </div>
    </div>
  );
}

// 账号管理Tab
function AccountsTab(props: AccountsTabProps) {
  const { accounts, creators, onRefresh, onOpenModal, onDelete, refreshing, totalCount, pagination, setPagination } = props;
  const startIndex = (pagination.page - 1) * pagination.size;
  const endIndex = startIndex + pagination.size;
  const paginatedAccounts = accounts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(accounts.length / pagination.size);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-morandi-stone">账号管理</h2>
          <p className="text-morandi-mist mt-1">管理博主的平台账号信息</p>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={onRefresh} disabled={refreshing} className="btn-morandi-secondary">
            <RefreshCw size={18} className={refreshing ? 'animate-morandi-spin' : ''} />
            刷新
          </button>
          <div className="text-sm text-morandi-mist">
            共 {totalCount} 个平台账号
          </div>
          <button onClick={() => onOpenModal('account', true)} className="btn-morandi-primary">
            <Plus size={18} />
            新增账号
          </button>
        </div>
      </div>

      <div className="card-morandi">
        {paginatedAccounts.length > 0 ? (
          <>
            <DataTable 
              data={paginatedAccounts} 
              type="accounts" 
              onEdit={(account) => onOpenModal('account', false, account)}
              onDelete={onDelete}
              creators={creators}
            />
            <Pagination
              currentPage={pagination.page}
              totalPages={totalPages}
              onPageChange={(page) => setPagination({ ...pagination, page })}
              totalItems={accounts.length}
              pageSize={pagination.size}
              onPageSizeChange={(size) => setPagination({ page: 1, size })}
            />
          </>
        ) : (
          <EmptyState
            icon={UserCheck}
            title="暂无账号数据"
            description="开始添加博主的平台账号信息"
            action={() => onOpenModal('account', true)}
            actionText="添加账号"
          />
        )}
      </div>
    </div>
  );
}

// 业配记录Tab
function DealsTab(props: DealsTabProps) {
  const {
    deals, creators, searchTerm, statusFilter, onSearchChange, onStatusFilterChange,
    onRefresh, onOpenModal, onDelete, refreshing, totalCount, pagination, setPagination
  } = props;

  const startIndex = (pagination.page - 1) * pagination.size;
  const endIndex = startIndex + pagination.size;
  const paginatedDeals = deals.slice(startIndex, endIndex);
  const totalPages = Math.ceil(deals.length / pagination.size);

  const filters = [
    { value: 'all', label: '全部状态' },
    { value: '待转账', label: '待转账' },
    { value: '处理中', label: '处理中' },
    { value: '已转账', label: '已转账' },
    { value: 'overdue', label: '已逾期' },
  ];

  const overdueCount = deals.filter(deal => utils.isOverdue(deal)).length;

  return (
    <div className="space-y-8">
      <ControlBar
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={onSearchChange}
        onStatusFilterChange={onStatusFilterChange}
        onRefresh={onRefresh}
        refreshing={refreshing}
        totalCount={totalCount}
        filteredCount={deals.length}
        searchPlaceholder="搜索业配ID、博主、合作方..."
        filters={filters}
        newButtonText="新增业配"
        newButtonAction={() => onOpenModal('deal', true)}
        extraInfo={overdueCount > 0 ? `${overdueCount} 笔逾期` : undefined}
      />

      <div className="card-morandi">
        {paginatedDeals.length > 0 ? (
          <>
            <DataTable 
              data={paginatedDeals} 
              type="deals" 
              onEdit={(deal) => onOpenModal('deal', false, deal)}
              onDelete={onDelete}
              creators={creators}
            />
            <Pagination
              currentPage={pagination.page}
              totalPages={totalPages}
              onPageChange={(page) => setPagination({ ...pagination, page })}
              totalItems={deals.length}
              pageSize={pagination.size}
              onPageSizeChange={(size) => setPagination({ page: 1, size })}
            />
          </>
        ) : (
          <EmptyState
            icon={FileText}
            title="暂无业配记录"
            description="开始记录您的第一个业配信息"
            action={() => onOpenModal('deal', true)}
            actionText="添加业配"
          />
        )}
      </div>
    </div>
  );
}

// ChartCard Props
interface ChartCardProps {
  title: string;
  type: 'line' | 'bar' | 'pie';
  data: Array<{ name: string; value: number }>;
}

// ChartCard 组件
function ChartCard({ title, type, data }: ChartCardProps) {
  // 根据类型直接返回对应的图表，避免函数调用的类型推断问题
  const chart = React.useMemo(() => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--morandi-mist)" opacity={0.2} />
            <XAxis dataKey="name" stroke="var(--morandi-mist)" />
            <YAxis stroke="var(--morandi-mist)" />
            <Tooltip contentStyle={{ backgroundColor: 'var(--morandi-pearl)', border: 'none', borderRadius: '8px' }} />
            <Line type="monotone" dataKey="value" stroke="var(--morandi-cloud)" strokeWidth={2} />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--morandi-mist)" opacity={0.2} />
            <XAxis dataKey="name" stroke="var(--morandi-mist)" />
            <YAxis stroke="var(--morandi-mist)" />
            <Tooltip contentStyle={{ backgroundColor: 'var(--morandi-pearl)', border: 'none', borderRadius: '8px' }} />
            <Bar dataKey="value" fill="var(--morandi-sage)" />
          </BarChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={MORANDI_COLORS[index % MORANDI_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: 'var(--morandi-pearl)', border: 'none', borderRadius: '8px' }} />
          </PieChart>
        );
      default:
        return null;
    }
  }, [type, data]);

  if (!chart) {
    return null;
  }
  
  return (
    <div className="card-morandi">
      <h3 className="text-lg font-semibold text-morandi-stone mb-6">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {chart}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
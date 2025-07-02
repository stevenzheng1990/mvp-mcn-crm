import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Users, TrendingUp, DollarSign, Download, Edit, X, Plus, Search, 
  RefreshCw, Loader2, Calendar, AlertTriangle, Upload, FileText, 
  LogOut, BarChart3, UserCheck, Trash2, Eye, EyeOff 
} from 'lucide-react';
import type { Creator, Account, Deal, ProcessedData } from '../types';

// 莫兰迪色系
const MORANDI_COLORS = ['#a8b5c8', '#9caf88', '#d4b5a0', '#c7b299', '#d4a5a5', '#b8b5b1'];

// 工具函数
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

// 主仪表板组件
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
                setPagination={(p) => onPaginationChange('creators', p)}
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
                setPagination={(p) => onPaginationChange('accounts', p)}
              />
            )}

            {activeTab === 'deals' && (
              <DealsTab
                deals={filteredData.deals}
                monthlyData={processedData.monthlyData}
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
                setPagination={(p) => onPaginationChange('deals', p)}
              />
            )}
          </div>
        )}
      </main>
    </>
  );
}

// Header组件
function Header({ onLogout, onOpenModal }: { 
  onLogout: () => void; 
  onOpenModal: (type: string) => void;
}) {
  return (
    <header className="header-morandi sticky top-0 z-40">
      <div className="max-w-[1400px] mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="logo-container">
            <img src="/mvplogo.png" alt="MVP Logo" className="h-10 w-auto" />
            <div>
              <h1 className="text-xl font-semibold text-[var(--morandi-stone)]">十方众声 MCN</h1>
              <p className="text-sm text-[var(--morandi-mist)] mt-0.5">Mega Volume Production</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={() => onOpenModal('import')} className="btn-morandi-primary">
              <Upload size={18} />
              导入数据
            </button>
            <button onClick={() => onOpenModal('export')} className="btn-morandi-secondary">
              <Download size={18} />
              导出数据
            </button>
            <button onClick={onLogout} className="btn-morandi-secondary">
              <LogOut size={18} />
              退出
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// Navigation组件
function Navigation({ activeTab, onTabChange }: { 
  activeTab: string; 
  onTabChange: (tab: string) => void;
}) {
  const tabs = [
    { id: 'overview', label: '数据概览', icon: BarChart3 },
    { id: 'creators', label: '博主管理', icon: Users },
    { id: 'accounts', label: '账号管理', icon: UserCheck },
    { id: 'deals', label: '业配记录', icon: FileText }
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-[var(--morandi-pearl)]">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex space-x-2">
          {tabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`nav-tab-morandi flex items-center gap-3 ${
                  activeTab === tab.id ? 'active' : ''
                }`}
              >
                <IconComponent size={18} className="icon-morandi" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

// 加载组件
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center animate-morandi-fade-in">
        <div className="animate-morandi-spin mb-6">
          <Loader2 size={48} className="text-[var(--morandi-cloud)] mx-auto" />
        </div>
        <p className="text-[var(--morandi-stone)] font-medium">加载数据中...</p>
      </div>
    </div>
  );
}

// 统计卡片组件
function StatCard({ icon: Icon, label, value, color }: {
  icon: any;
  label: string;
  value: string | number;
  color: string;
}) {
  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      primary: 'text-[var(--morandi-cloud)]',
      green: 'text-[var(--morandi-sage)]',
      yellow: 'text-[var(--morandi-dust)]',
      purple: 'text-[var(--morandi-rose)]',
    };
    return colorMap[color] || 'text-[var(--morandi-cloud)]';
  };

  return (
    <div className="card-morandi stat-card-morandi">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--morandi-mist)] mb-2">{label}</p>
          <p className="text-2xl font-semibold text-[var(--morandi-stone)]">{value}</p>
        </div>
        <div className={`p-4 rounded-2xl bg-gradient-to-br from-white to-gray-50 ${getColorClass(color)}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

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

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="营收趋势" data={chartData.revenue} type="line" />
        <ChartCard title="业配状态分布" data={chartData.status} type="pie" />
        <ChartCard title="赛道分布" data={chartData.category} type="bar" />
        <ChartCard title="平台分布" data={chartData.platform} type="pie" />
      </div>
    </div>
  );
}

// 博主管理Tab
function CreatorsTab(props: any) {
  const { creators, onOpenModal, onDelete, pagination, setPagination, searchTerm, statusFilter, onSearchChange, onStatusFilterChange, onRefresh, refreshing, totalCount } = props;
  const startIndex = (pagination.page - 1) * pagination.size;
  const endIndex = startIndex + pagination.size;
  const paginatedCreators = creators.slice(startIndex, endIndex);
  const totalPages = Math.ceil(creators.length / pagination.size);

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
        searchPlaceholder="搜索博主ID、姓名、微信名、城市或类别..."
        filters={[
          { value: 'all', label: '全部状态' },
          { value: 'signed', label: '已签约' },
          { value: 'pending', label: '签约意向' },
        ]}
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
function AccountsTab(props: any) {
  const { accounts, creators, onRefresh, onOpenModal, onDelete, refreshing, totalCount, pagination, setPagination } = props;
  const startIndex = (pagination.page - 1) * pagination.size;
  const endIndex = startIndex + pagination.size;
  const paginatedAccounts = accounts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(accounts.length / pagination.size);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[var(--morandi-stone)]">账号管理</h2>
          <p className="text-[var(--morandi-mist)] mt-1">管理博主的平台账号信息</p>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={onRefresh} disabled={refreshing} className="btn-morandi-secondary">
            <RefreshCw size={18} className={refreshing ? 'animate-morandi-spin' : ''} />
            刷新
          </button>
          <div className="text-sm text-[var(--morandi-mist)]">
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
              creators={creators}
              onEdit={(account) => onOpenModal('account', false, account)}
              onDelete={onDelete}
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
            description="开始添加您的第一个平台账号"
            action={() => onOpenModal('account', true)}
            actionText="添加账号"
          />
        )}
      </div>
    </div>
  );
}

// 业配记录Tab
function DealsTab(props: any) {
  const { deals, monthlyData, onOpenModal, onDelete, pagination, setPagination, searchTerm, statusFilter, onSearchChange, onStatusFilterChange, onRefresh, refreshing, totalCount } = props;
  const { pendingTransfers, overdueTransfers } = monthlyData;
  const startIndex = (pagination.page - 1) * pagination.size;
  const endIndex = startIndex + pagination.size;
  const paginatedDeals = deals.slice(startIndex, endIndex);
  const totalPages = Math.ceil(deals.length / pagination.size);

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
        searchPlaceholder="搜索博主、合作方或业配ID..."
        filters={[
          { value: 'all', label: '全部状态' },
          { value: 'pending', label: '待转账' },
          { value: 'processing', label: '处理中' },
          { value: 'completed', label: '已转账' },
          { value: 'overdue', label: '逾期' },
        ]}
        newButtonText="新增业配"
        newButtonAction={() => onOpenModal('deal', true)}
        extraInfo={`待转账 ${pendingTransfers.length} 个，逾期 ${overdueTransfers.length} 个`}
      />

      {/* 快速统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={DollarSign} label="本月业配" value={monthlyData.deals.length} color="primary" />
        <StatCard icon={TrendingUp} label="本月营收" value={utils.formatCurrency(monthlyData.revenue)} color="green" />
        <StatCard icon={Calendar} label="待转账" value={pendingTransfers.length} color="yellow" />
        <StatCard icon={AlertTriangle} label="逾期转账" value={overdueTransfers.length} color="purple" />
      </div>

      <div className="card-morandi">
        {paginatedDeals.length > 0 ? (
          <>
            <DataTable 
              data={paginatedDeals} 
              type="deals" 
              onEdit={(deal) => onOpenModal('deal', false, deal)}
              onDelete={onDelete}
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

// 控制栏组件
function ControlBar({ 
  searchTerm, statusFilter, onSearchChange, onStatusFilterChange, 
  onRefresh, onOpenModal, refreshing, totalCount, filteredCount,
  searchPlaceholder = "搜索...", filters = [], newButtonText = "新增",
  newButtonAction, extraInfo 
}: any) {
  const defaultFilters = filters.length > 0 ? filters : [
    { value: 'all', label: '全部' },
  ];

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
            {filters.map((filter: any) => (
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
        <div className="text-sm text-[var(--morandi-mist)]">
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

// 其他辅助组件
function AlertCard({ type, icon: Icon, title, content, action, actionText }: any) {
  const typeClass = type === 'warning' ? 'status-warning' : 'status-error';
  
  return (
    <div className={`card-morandi ${typeClass} text-white`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Icon size={24} />
          <div>
            <h3 className="font-semibold mb-1">{title}</h3>
            <p className="text-sm opacity-90">{content}</p>
          </div>
        </div>
        <button onClick={action} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-colors">
          {actionText}
        </button>
      </div>
    </div>
  );
}

function ChartCard({ title, type, data }: any) {
  const renderChart = () => {
    if (type === 'line') {
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--morandi-pearl)" />
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip formatter={(value: any) => [`¥${Number(value).toLocaleString()}`, '营收']} />
          <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} />
        </LineChart>
      );
    }
    
    if (type === 'bar') {
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="name" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
          <YAxis stroke="#6b7280" />
          <Tooltip formatter={(value: any) => [Number(value).toLocaleString(), '数量']} />
          <Bar dataKey="value" fill="#0ea5e9" />
        </BarChart>
      );
    }
    
    if (type === 'pie') {
      return (
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={MORANDI_COLORS[index % MORANDI_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      );
    }
    
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-semibold text-[var(--morandi-stone)] mb-6">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function DataTable({ data, type, onEdit, onDelete, creators }: any) {
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
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

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
          { label: '微信名', key: 'wechatName' },
          { label: '城市', key: 'city' },
          { label: '类别', key: 'category' },
          { label: '签约状态', key: 'contractStatus' },
          { label: '分成比例', key: 'commission' },
          { label: '面试时间', key: 'interviewDate' },
          { label: '操作', key: null }
        ];
      case 'accounts':
        return [
          { label: '博主姓名', key: 'creatorId' },
          { label: '平台', key: 'platform' },
          { label: '粉丝数', key: 'followers' },
          { label: '报价', key: 'price' },
          { label: '更新时间', key: 'updateDate' },
          { label: '链接', key: 'link' },
          { label: '操作', key: null }
        ];
      case 'deals':
        return [
          { label: '业配ID', key: 'id' },
          { label: '博主', key: 'creatorId' },
          { label: '合作方', key: 'partner' },
          { label: '金额', key: 'amount' },
          { label: '转账状态', key: 'transferStatus' },
          { label: '业配日期', key: 'date' },
          { label: '操作', key: null }
        ];
      default:
        return [];
    }
  };

  const getCreatorName = (creatorId: string) => {
    if (!creatorId || !creators) return creatorId || '-';
    const creator = creators.find((c: Creator) => c && c.id === creatorId);
    if (!creator) return creatorId;
    return creator.realName || creator.id || '-';
  };

  const renderRow = (item: any, index: number) => {
    switch (type) {
      case 'creators':
        return (
          <tr key={item.id || index} className="table-morandi-row">
            <td className="px-8 py-6 font-medium">{item.id || '-'}</td>
            <td className="px-8 py-6">{item.wechatName || '-'}</td>
            <td className="px-8 py-6">{item.city || '-'}</td>
            <td className="px-8 py-6">
              <div className="flex flex-wrap gap-1">
                {item.category ? 
                  item.category.split(',').map((cat: string, index: number) => (
                    <span 
                      key={index}
                      className="px-2 py-1 rounded-full text-xs font-medium bg-[var(--morandi-pearl)] text-[var(--morandi-stone)]"
                    >
                      {cat.trim()}
                    </span>
                  )) : 
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-[var(--morandi-pearl)] text-[var(--morandi-stone)]">
                    未分类
                  </span>
                }
              </div>
            </td>
            <td className="px-8 py-6">
              <div className="flex flex-wrap gap-1">
                {item.contractStatus ? 
                  item.contractStatus.split(',').map((status: string, index: number) => (
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
            <td className="px-8 py-6">{item.commission ? `${(item.commission * 100).toFixed(0)}%` : '-'}</td>
            <td className="px-8 py-6">{utils.formatDate(item.interviewDate)}</td>
            <td className="px-8 py-6">
              <div className="flex items-center gap-2">
                <button onClick={() => onEdit?.(item)} className="text-[var(--morandi-cloud)] hover:text-[var(--morandi-sage)] transition-colors">
                  <Edit size={18} />
                </button>
                <button onClick={() => onDelete?.(item.id)} className="text-[var(--morandi-rose)] hover:text-red-600 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </td>
          </tr>
        );
      case 'accounts':
        return (
          <tr key={`${item.creatorId}-${item.platform}`} className="table-morandi-row">
            <td className="px-8 py-6 font-medium">{getCreatorName(item.creatorId)}</td>
            <td className="px-8 py-6">{item.platform || '-'}</td>
            <td className="px-8 py-6">{item.followers ? utils.formatNumber(item.followers) : '-'}</td>
            <td className="px-8 py-6">{item.price ? utils.formatCurrency(item.price) : '-'}</td>
            <td className="px-8 py-6">{utils.formatDate(item.updateDate)}</td>
            <td className="px-8 py-6">
              {item.link ? (
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-[var(--morandi-cloud)] hover:underline">
                  查看
                </a>
              ) : '-'}
            </td>
            <td className="px-8 py-6">
              <div className="flex items-center gap-2">
                <button onClick={() => onEdit?.(item)} className="text-[var(--morandi-cloud)] hover:text-[var(--morandi-sage)] transition-colors">
                  <Edit size={18} />
                </button>
                <button onClick={() => onDelete?.(`${item.creatorId}-${item.platform}`)} className="text-[var(--morandi-rose)] hover:text-red-600 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </td>
          </tr>
        );
      case 'deals':
        return (
          <tr key={item.id} className="table-morandi-row">
            <td className="px-8 py-6 font-mono text-sm">{item.id || '-'}</td>
            <td className="px-8 py-6 font-medium">{getCreatorName(item.creatorId)}</td>
            <td className="px-8 py-6">{item.partner || '-'}</td>
            <td className="px-8 py-6 font-medium text-[var(--morandi-cloud)]">
              {item.amount ? utils.formatCurrency(item.amount) : '-'}
            </td>
            <td className="px-8 py-6">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                item.transferStatus === '已转账' ? 'status-success' :
                item.transferStatus === '处理中' ? 'status-info' :
                utils.isOverdue(item) ? 'status-error' : 'status-warning'
              }`}>
                {item.transferStatus || '-'}
              </span>
            </td>
            <td className="px-8 py-6">{utils.formatDate(item.date)}</td>
            <td className="px-8 py-6">
              <div className="flex items-center gap-2">
                <button onClick={() => onEdit?.(item)} className="text-[var(--morandi-cloud)] hover:text-[var(--morandi-sage)] transition-colors">
                  <Edit size={18} />
                </button>
                <button onClick={() => onDelete?.(item.id)} className="text-[var(--morandi-rose)] hover:text-red-600 transition-colors">
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
                className={column.key ? 'cursor-pointer hover:bg-[var(--morandi-pearl)]/50' : ''}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.key && sortConfig?.key === column.key && (
                    <span className="text-[var(--morandi-cloud)]">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map(renderRow)}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description, action, actionText }: any) {
  return (
    <div className="text-center py-20">
      <Icon size={64} className="text-[var(--morandi-mist)] mx-auto mb-6" />
      <h3 className="text-xl font-medium text-[var(--morandi-stone)] mb-3">{title}</h3>
      <p className="text-[var(--morandi-mist)] mb-8">{description}</p>
      {action && actionText && (
        <button onClick={action} className="btn-morandi-primary">
          <Plus size={18} />
          {actionText}
        </button>
      )}
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange, totalItems, pageSize, onPageSizeChange }: any) {
  const pages = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between mt-6 pt-6 border-t border-[var(--morandi-pearl)]">
      <div className="text-sm text-[var(--morandi-mist)]">
        共 {totalItems} 条记录
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn-morandi-secondary px-3 py-2 disabled:opacity-50"
        >
          上一页
        </button>
        
        {startPage > 1 && (
          <>
            <button onClick={() => onPageChange(1)} className="btn-morandi-secondary px-3 py-2">1</button>
            {startPage > 2 && <span className="px-2 text-[var(--morandi-mist)]">...</span>}
          </>
        )}
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded-xl transition-colors ${
              page === currentPage
                ? 'btn-morandi-primary'
                : 'btn-morandi-secondary'
            }`}
          >
            {page}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2 text-[var(--morandi-mist)]">...</span>}
            <button onClick={() => onPageChange(totalPages)} className="btn-morandi-secondary px-3 py-2">
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn-morandi-secondary px-3 py-2 disabled:opacity-50"
        >
          下一页
        </button>
      </div>
    </div>
  );
}

// 登录表单组件
export function LoginForm({ onLogin }: { onLogin: (password: string) => void }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (password === '2024sfzs@MVP') {
        onLogin(password);
      } else {
        setError('密码错误，请重试');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full animate-morandi-fade-in">
        <div className="card-morandi text-center">
          <div className="logo-container justify-center mb-8">
            <img src="/mvplogo.png" alt="MVP Logo" className="h-12 w-auto" />
            <div>
              <h1 className="text-2xl font-semibold text-[var(--morandi-stone)]">十方众声 MCN</h1>
              <p className="text-[var(--morandi-mist)] text-sm mt-1">管理系统登录</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-left">
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-3">系统密码</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-morandi"
                  placeholder="请输入系统密码"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--morandi-mist)] hover:text-[var(--morandi-cloud)] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {error && <p className="text-[var(--morandi-rose)] text-sm mt-3">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="btn-morandi-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-morandi-spin" />
                  验证中...
                </>
              ) : (
                '进入系统'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-[var(--morandi-mist)]">Mega Volume Production MCN Management System</p>
          </div>
        </div>
      </div>
    </div>
  );
}
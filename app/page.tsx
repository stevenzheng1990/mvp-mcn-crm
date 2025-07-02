'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, TrendingUp, DollarSign, Download, Edit, Save, X, Plus, Search, Filter, RefreshCw, Loader2, Calendar, AlertTriangle, Upload, Database, FileText, CheckCircle, Lock, Eye, EyeOff, LogOut, Home, Settings, BarChart3, UserCheck, Trash2, MoreHorizontal } from 'lucide-react';
import fileDownload from 'js-file-download';

// 数据类型定义
type ModalType = 'edit' | 'deal' | 'import' | 'export' | 'account';

interface Creator {
  id: string;
  realName: string;
  wechatName: string;
  contactMethod: string;
  city: string;
  inGroup: string;
  interviewStatus: string;
  interviewer: string;
  interviewDate: string;
  contractStatus: string;
  contractStartDate: string;
  contractEndDate: string;
  commission: number;
  category: string;
  notes: string;
  transferAccount: string;
}

interface Account {
  creatorId: string;
  platform: string;
  link: string;
  followers: number;
  price: number;
  updateDate: string;
}

interface Deal {
  id: string;
  creatorId: string;
  partner: string;
  type: string;
  date: string;
  channel: string;
  amount: number;
  transferCycle: string;
  transferDate: string;
  transferStatus: string;
  receivedAmount: number;
  companyShare: number;
  creatorShare: number;
  unallocated: string;
  informalDetails: string;
}

// 莫兰迪色系
const MORANDI_COLORS = ['#a8b5c8', '#9caf88', '#d4b5a0', '#c7b299', '#d4a5a5', '#b8b5b1'];

// 工具函数
const utils = {
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
  validateEmail: (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },
  validatePhone: (phone: string) => {
    const re = /^1[3-9]\d{9}$/;
    return re.test(phone);
  },
  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },
  calculateShares: (amount: number, commission: number) => {
    const creatorShare = amount * commission;
    const companyShare = amount - creatorShare;
    return { creatorShare, companyShare };
  }
};

// 数据处理Hook
function useDataProcessing(creators: Creator[], accounts: Account[], deals: Deal[]) {
  return React.useMemo(() => {
    // 过滤和清理数据
    const validCreators = creators.filter(c => c && typeof c === 'object' && c.id);
    const validAccounts = accounts.filter(a => a && typeof a === 'object' && a.creatorId);
    const validDeals = deals.filter(d => d && typeof d === 'object' && d.id);

    const stats = {
      totalCreators: validCreators.filter(c => 
        c.contractStatus && typeof c.contractStatus === 'string' && c.contractStatus.includes('签约')
      ).length,
      totalFollowers: validAccounts.reduce((sum, acc) => sum + (acc.followers || 0), 0),
      totalRevenue: validDeals.reduce((sum, deal) => sum + (deal.receivedAmount || 0), 0),
      totalDeals: validDeals.length,
    };

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyDeals = validDeals.filter(deal => {
      if (!deal.date) return false;
      const dealDate = new Date(deal.date);
      return dealDate.getMonth() === currentMonth && dealDate.getFullYear() === currentYear;
    });

    const pendingTransfers = validDeals.filter(deal => 
      deal.transferStatus === '待转账' && !utils.isOverdue(deal)
    );
    
    const overdueTransfers = validDeals.filter(utils.isOverdue);

    const monthlyData = {
      deals: monthlyDeals,
      revenue: monthlyDeals.reduce((sum, deal) => sum + (deal.receivedAmount || 0), 0),
      pendingTransfers,
      overdueTransfers,
    };

    // 生成图表数据
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toLocaleDateString('zh-CN', { month: 'short' });
    }).reverse();

    const revenueData = last6Months.map(month => {
      const monthDeals = validDeals.filter(deal => {
        if (!deal.date) return false;
        const dealMonth = new Date(deal.date).toLocaleDateString('zh-CN', { month: 'short' });
        return dealMonth === month;
      });
      return {
        name: month,
        value: monthDeals.reduce((sum, deal) => sum + (deal.receivedAmount || 0), 0)
      };
    });

    const chartData = {
      revenue: revenueData,
      
      status: Object.entries(validDeals.reduce((acc, deal) => {
        const status = deal.transferStatus || '未知';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)).map(([name, value]) => ({ name, value })),
      
      category: Object.entries(validCreators.reduce((acc, creator) => {
        const category = creator.category || '未分类';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)).map(([name, value]) => ({ name, value })),
      
      platform: Object.entries(validAccounts.reduce((acc, account) => {
        const platform = account.platform || '未知平台';
        acc[platform] = (acc[platform] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)).map(([name, value]) => ({ name, value })),
    };

    return { stats, monthlyData, chartData };
  }, [creators, accounts, deals]);
}

// 主组件
export default function MCNManagement() {
  // 状态管理
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // 数据状态
  const [creators, setCreators] = useState<Creator[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  
  // 模态框状态
  const [modals, setModals] = useState({
    edit: { open: false, isNew: false, data: null as any },
    deal: { open: false, isNew: false, data: null as any },
    import: { open: false },
    export: { open: false },
    account: { open: false, isNew: false, data: null as any },
  });

  // 分页状态
  const [pagination, setPagination] = useState({
    creators: { page: 1, size: 20 },
    accounts: { page: 1, size: 20 },
    deals: { page: 1, size: 20 },
  });

  // 处理后的数据
  const processedData = useDataProcessing(creators, accounts, deals);

  // 认证检查
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('mcn_authenticated');
    if (savedAuth === 'true') setIsAuthenticated(true);
    setIsAuthLoading(false);
  }, []);

  // 数据获取
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const [creatorsRes, accountsRes, dealsRes] = await Promise.all([
          fetch('/api/creators'),
          fetch('/api/accounts'),
          fetch('/api/deals')
        ]);

        const [creatorsData, accountsData, dealsData] = await Promise.all([
          creatorsRes.json(),
          accountsRes.json(),
          dealsRes.json()
        ]);

        if (creatorsData.success) setCreators(creatorsData.data || []);
        if (accountsData.success) setAccounts(accountsData.data || []);
        if (dealsData.success) setDeals(dealsData.data || []);
      } catch (error) {
        console.error('获取数据失败:', error);
        alert('获取数据失败，请检查网络连接');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // 数据过滤
  const filteredData = {
    creators: creators.filter(creator => {
      if (!creator || typeof creator !== 'object') return false;
      
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (creator.id && creator.id.toLowerCase().includes(searchLower)) ||
                           (creator.realName && creator.realName.toLowerCase().includes(searchLower)) ||
                           (creator.wechatName && creator.wechatName.toLowerCase().includes(searchLower)) ||
                           (creator.city && creator.city.toLowerCase().includes(searchLower)) ||
                           (creator.category && creator.category.toLowerCase().includes(searchLower));
      
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'signed' && creator.contractStatus && creator.contractStatus.includes('签约')) ||
                           (statusFilter === 'pending' && creator.contractStatus && creator.contractStatus.includes('意向'));
      return matchesSearch && matchesStatus;
    }),

    deals: deals.filter(deal => {
      if (!deal || typeof deal !== 'object') return false;
      
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (deal.id && deal.id.toLowerCase().includes(searchLower)) ||
                           (deal.creatorId && deal.creatorId.toLowerCase().includes(searchLower)) ||
                           (deal.partner && deal.partner.toLowerCase().includes(searchLower));
      
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'pending' && deal.transferStatus === '待转账') ||
                           (statusFilter === 'processing' && deal.transferStatus === '处理中') ||
                           (statusFilter === 'completed' && deal.transferStatus === '已转账') ||
                           (statusFilter === 'overdue' && utils.isOverdue(deal));
      return matchesSearch && matchesStatus;
    })
  };

  // 通用处理函数
  const handlers = {
    login: (password: string) => {
      if (password === '2024sfzs@MVP') {
        setIsAuthenticated(true);
        sessionStorage.setItem('mcn_authenticated', 'true');
      }
    },

    logout: () => {
      setIsAuthenticated(false);
      sessionStorage.removeItem('mcn_authenticated');
      setCreators([]);
      setAccounts([]);
      setDeals([]);
      setActiveTab('overview');
    },

    openModal: (type: ModalType, isNew = false, data = null) => {
      setModals(prev => ({ ...prev, [type]: { open: true, isNew, data } }));
    },

    closeModal: (type: ModalType) => {
      setModals(prev => ({ ...prev, [type]: { open: false, isNew: false, data: null } }));
    },

    refresh: async () => {
      setRefreshing(true);
      try {
        const [creatorsRes, accountsRes, dealsRes] = await Promise.all([
          fetch('/api/creators'),
          fetch('/api/accounts'),
          fetch('/api/deals')
        ]);

        const [creatorsData, accountsData, dealsData] = await Promise.all([
          creatorsRes.json(),
          accountsRes.json(),
          dealsRes.json()
        ]);

        if (creatorsData.success) setCreators(creatorsData.data || []);
        if (accountsData.success) setAccounts(accountsData.data || []);
        if (dealsData.success) setDeals(dealsData.data || []);
        
        alert('数据刷新成功');
      } catch (error) {
        console.error('刷新数据失败:', error);
        alert('刷新数据失败，请检查网络连接');
      } finally {
        setRefreshing(false);
      }
    },

    saveCreator: async (creatorData: Creator) => {
      try {
        const { isNew } = modals.edit;
        const method = isNew ? 'POST' : 'PUT';
        const body = isNew ? JSON.stringify(creatorData) : JSON.stringify({ 
          creatorId: creatorData.id, 
          updatedData: creatorData 
        });

        const response = await fetch('/api/creators', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body,
        });

        const result = await response.json();
        if (result.success) {
          if (isNew) {
            setCreators(prev => [...prev, creatorData]);
          } else {
            setCreators(prev => prev.map(creator => 
              creator.id === creatorData.id ? creatorData : creator
            ));
          }
          alert(isNew ? '博主添加成功' : '博主信息更新成功');
          handlers.closeModal('edit');
        } else {
          throw new Error(result.message || '保存失败');
        }
      } catch (error) {
        console.error('保存博主信息失败:', error);
        alert('保存失败，请重试');
      }
    },

    saveDeal: async (dealData: Deal) => {
      try {
        const { isNew } = modals.deal;
        const method = isNew ? 'POST' : 'PUT';
        const body = isNew ? JSON.stringify(dealData) : JSON.stringify({
          dealId: dealData.id,
          updatedData: dealData
        });

        const response = await fetch('/api/deals', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body,
        });

        const result = await response.json();
        if (result.success) {
          if (isNew) {
            setDeals(prev => [...prev, dealData]);
          } else {
            setDeals(prev => prev.map(deal => 
              deal.id === dealData.id ? dealData : deal
            ));
          }
          alert(isNew ? '业配记录添加成功' : '业配记录更新成功');
          handlers.closeModal('deal');
        } else {
          throw new Error(result.message || '保存失败');
        }
      } catch (error) {
        console.error('保存业配记录失败:', error);
        alert('保存失败，请重试');
      }
    },

    deleteCreator: async (creatorId: string) => {
      if (!confirm('确认删除该博主吗？此操作不可恢复。')) return;
      
      try {
        const response = await fetch('/api/creators', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ creatorId }),
        });

        const result = await response.json();
        if (result.success) {
          setCreators(prev => prev.filter(creator => creator.id !== creatorId));
          alert('博主删除成功');
        } else {
          throw new Error(result.message || '删除失败');
        }
      } catch (error) {
        console.error('删除博主失败:', error);
        alert('删除失败，请重试');
      }
    },

    deleteDeal: async (dealId: string) => {
      if (!confirm('确认删除该业配记录吗？此操作不可恢复。')) return;
      
      try {
        const response = await fetch('/api/deals', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dealId }),
        });

        const result = await response.json();
        if (result.success) {
          setDeals(prev => prev.filter(deal => deal.id !== dealId));
          alert('业配记录删除成功');
        } else {
          throw new Error(result.message || '删除失败');
        }
      } catch (error) {
        console.error('删除业配记录失败:', error);
        alert('删除失败，请重试');
      }
    },

    saveAccount: async (accountData: Account) => {
      try {
        const { isNew } = modals.account;
        const method = isNew ? 'POST' : 'PUT';
        const body = isNew ? JSON.stringify(accountData) : JSON.stringify({
          accountId: `${accountData.creatorId}-${accountData.platform}`,
          updatedData: accountData
        });

        const response = await fetch('/api/accounts', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body,
        });

        const result = await response.json();
        if (result.success) {
          if (isNew) {
            setAccounts(prev => [...prev, accountData]);
          } else {
            setAccounts(prev => prev.map(account => 
              account.creatorId === accountData.creatorId && account.platform === accountData.platform 
                ? accountData : account
            ));
          }
          alert(isNew ? '账号添加成功' : '账号信息更新成功');
          handlers.closeModal('account');
        } else {
          throw new Error(result.message || '保存失败');
        }
      } catch (error) {
        console.error('保存账号信息失败:', error);
        alert('保存失败，请重试');
      }
    },

    deleteAccount: async (accountId: string) => {
      if (!confirm('确认删除该账号吗？此操作不可恢复。')) return;
      
      try {
        const response = await fetch('/api/accounts', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accountId }),
        });

        const result = await response.json();
        if (result.success) {
          const [creatorId, platform] = accountId.split('-');
          setAccounts(prev => prev.filter(account => 
            !(account.creatorId === creatorId && account.platform === platform)
          ));
          alert('账号删除成功');
        } else {
          throw new Error(result.message || '删除失败');
        }
      } catch (error) {
        console.error('删除账号失败:', error);
        alert('删除失败，请重试');
      }
    },
  };

  // 登录界面
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-morandi-fade-in">
          <div className="animate-morandi-spin mb-6">
            <Loader2 size={48} className="text-[var(--morandi-cloud)] mx-auto" />
          </div>
          <p className="text-[var(--morandi-stone)] font-medium">系统初始化中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handlers.login} />;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header onLogout={handlers.logout} onOpenModal={handlers.openModal} />

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-8 py-12">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="animate-morandi-fade-in">
            {activeTab === 'overview' && (
              <OverviewTab 
                stats={processedData.stats}
                monthlyData={processedData.monthlyData}
                chartData={processedData.chartData}
                onTabChange={setActiveTab}
              />
            )}

            {activeTab === 'creators' && (
              <CreatorsTab
                creators={filteredData.creators}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                onSearchChange={setSearchTerm}
                onStatusFilterChange={setStatusFilter}
                onRefresh={handlers.refresh}
                onOpenModal={handlers.openModal}
                onDelete={handlers.deleteCreator}
                refreshing={refreshing}
                totalCount={creators.length}
                pagination={pagination.creators}
                setPagination={(newPagination) => setPagination(prev => ({ ...prev, creators: newPagination }))}
              />
            )}

            {activeTab === 'accounts' && (
              <AccountsTab 
                accounts={accounts} 
                creators={creators}
                onRefresh={handlers.refresh}
                onOpenModal={handlers.openModal}
                onDelete={handlers.deleteAccount}
                refreshing={refreshing}
                totalCount={accounts.length}
                pagination={pagination.accounts}
                setPagination={(newPagination) => setPagination(prev => ({ ...prev, accounts: newPagination }))}
              />
            )}

            {activeTab === 'deals' && (
              <DealsTab
                deals={filteredData.deals}
                monthlyData={processedData.monthlyData}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                onSearchChange={setSearchTerm}
                onStatusFilterChange={setStatusFilter}
                onRefresh={handlers.refresh}
                onOpenModal={handlers.openModal}
                onDelete={handlers.deleteDeal}
                refreshing={refreshing}
                totalCount={deals.length}
                pagination={pagination.deals}
                setPagination={(newPagination) => setPagination(prev => ({ ...prev, deals: newPagination }))}
              />
            )}
          </div>
        )}
      </main>

      {/* 模态框组件 */}
      {modals.edit.open && (
        <EditModal
          isOpen={modals.edit.open}
          onClose={() => handlers.closeModal('edit')}
          creator={modals.edit.data}
          onSave={handlers.saveCreator}
          isNew={modals.edit.isNew}
        />
      )}

      {modals.deal.open && (
        <DealModal
          isOpen={modals.deal.open}
          onClose={() => handlers.closeModal('deal')}
          deal={modals.deal.data}
          onSave={handlers.saveDeal}
          creators={creators}
          isNew={modals.deal.isNew}
        />
      )}

      {modals.account.open && (
        <AccountModal
          isOpen={modals.account.open}
          onClose={() => handlers.closeModal('account')}
          account={modals.account.data}
          onSave={handlers.saveAccount}
          creators={creators}
          isNew={modals.account.isNew}
        />
      )}

      {modals.import.open && (
        <ImportModal
          isOpen={modals.import.open}
          onClose={() => handlers.closeModal('import')}
          onImportSuccess={handlers.refresh}
        />
      )}

      {modals.export.open && (
        <ExportModal
          isOpen={modals.export.open}
          onClose={() => handlers.closeModal('export')}
          creators={creators}
          accounts={accounts}
          deals={deals}
        />
      )}
    </div>
  );
}

// 登录组件
function LoginForm({ onLogin }: { onLogin: (password: string) => void }) {
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
          {/* Logo区域 */}
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

// Header组件
function Header({ onLogout, onOpenModal }: { onLogout: () => void; onOpenModal: (type: ModalType) => void }) {
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
function Navigation({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
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
    const colorMap = {
      primary: 'text-[var(--morandi-cloud)]',
      green: 'text-[var(--morandi-sage)]',
      yellow: 'text-[var(--morandi-dust)]',
      purple: 'text-[var(--morandi-rose)]',
    };
    return colorMap[color as keyof typeof colorMap] || 'text-[var(--morandi-cloud)]';
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

// 提醒卡片组件
function AlertCard({ type, icon: Icon, title, content, action, actionText }: {
  type: 'warning' | 'error';
  icon: any;
  title: string;
  content: string;
  action: () => void;
  actionText: string;
}) {
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

// 图表卡片组件
function ChartCard({ title, type, data }: {
  title: string;
  type: 'line' | 'bar' | 'pie';
  data: any[];
}) {
  const renderChart = () => {
    if (type === 'line') {
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--morandi-pearl)" />
          <XAxis dataKey="month" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip formatter={(value) => [`¥${Number(value).toLocaleString()}`, '营收']} />
          <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} />
        </LineChart>
      );
    }
    
    if (type === 'bar') {
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip formatter={(value) => [Number(value).toLocaleString(), '数量']} />
          <Bar dataKey="count" fill="#0ea5e9" />
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
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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

// 博主管理Tab
function CreatorsTab({ creators, searchTerm, statusFilter, onSearchChange, onStatusFilterChange, onRefresh, onOpenModal, onDelete, refreshing, totalCount, pagination, setPagination }: {
  creators: Creator[];
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (term: string) => void;
  onStatusFilterChange: (filter: string) => void;
  onRefresh: () => void;
  onOpenModal: (type: ModalType, isNew?: boolean, data?: any) => void;
  onDelete: (id: string) => void;
  refreshing: boolean;
  totalCount: number;
  pagination: { page: number; size: number };
  setPagination: (pagination: { page: number; size: number }) => void;
}) {
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
        onOpenModal={onOpenModal}
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
function AccountsTab({ accounts, creators, onRefresh, onOpenModal, onDelete, refreshing, totalCount, pagination, setPagination }: { 
  accounts: Account[]; 
  creators: Creator[];
  onRefresh: () => void;
  onOpenModal: (type: ModalType, isNew?: boolean, data?: any) => void;
  onDelete: (id: string) => void;
  refreshing: boolean;
  totalCount: number;
  pagination: { page: number; size: number };
  setPagination: (pagination: { page: number; size: number }) => void;
}) {
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
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="btn-morandi-secondary"
          >
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
function DealsTab({ deals, monthlyData, searchTerm, statusFilter, onSearchChange, onStatusFilterChange, onRefresh, onOpenModal, onDelete, refreshing, totalCount, pagination, setPagination }: {
  deals: Deal[];
  monthlyData: any;
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (term: string) => void;
  onStatusFilterChange: (filter: string) => void;
  onRefresh: () => void;
  onOpenModal: (type: ModalType, isNew?: boolean, data?: any) => void;
  onDelete: (id: string) => void;
  refreshing: boolean;
  totalCount: number;
  pagination: { page: number; size: number };
  setPagination: (pagination: { page: number; size: number }) => void;
}) {
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
        onOpenModal={onOpenModal}
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
function ControlBar({ searchTerm, statusFilter, onSearchChange, onStatusFilterChange, onRefresh, onOpenModal, refreshing, totalCount, filteredCount, searchPlaceholder, filters, newButtonText, newButtonAction, extraInfo }: {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (term: string) => void;
  onStatusFilterChange: (filter: string) => void;
  onRefresh: () => void;
  onOpenModal: (type: ModalType) => void;
  refreshing: boolean;
  totalCount: number;
  filteredCount: number;
  searchPlaceholder: string;
  filters: { value: string; label: string }[];
  newButtonText: string;
  newButtonAction: () => void;
  extraInfo?: string;
}) {
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
        
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="input-morandi w-40"
        >
          {filters.map(filter => (
            <option key={filter.value} value={filter.value}>{filter.label}</option>
          ))}
        </select>
        
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="btn-morandi-secondary"
        >
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

// 分页组件
function Pagination({ currentPage, totalPages, onPageChange, totalItems, pageSize, onPageSizeChange }: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}) {
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
      <div className="flex items-center gap-4">
        <span className="text-sm text-[var(--morandi-mist)]">
          每页显示
        </span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="input-morandi w-20 text-sm py-2"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-sm text-[var(--morandi-mist)]">
          条，共 {totalItems} 条
        </span>
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
            <button
              onClick={() => onPageChange(1)}
              className="btn-morandi-secondary px-3 py-2"
            >
              1
            </button>
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
            <button
              onClick={() => onPageChange(totalPages)}
              className="btn-morandi-secondary px-3 py-2"
            >
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

// 数据表格组件
function DataTable({ data, type, onEdit, onDelete, creators }: {
  data: any[];
  type: 'creators' | 'accounts' | 'deals';
  onEdit?: (item: any) => void;
  onDelete?: (id: string) => void;
  creators?: Creator[];
}) {
  const getColumns = () => {
    switch (type) {
      case 'creators':
        return ['博主ID', '微信名', '城市', '类别', '签约状态', '分成比例', '面试时间', '操作'];
      case 'accounts':
        return ['博主姓名', '平台', '粉丝数', '报价', '更新时间', '链接', '操作'];
      case 'deals':
        return ['业配ID', '博主', '合作方', '金额', '转账状态', '业配日期', '操作'];
      default:
        return [];
    }
  };

  const getCreatorName = (creatorId: string) => {
    if (!creatorId || !creators) return creatorId || '-';
    const creator = creators.find(c => c && c.id === creatorId);
    if (!creator) return creatorId;
    return creator.realName && typeof creator.realName === 'string' ? creator.realName : (creator.id || '-');
  };

  const renderRow = (item: any, index: number) => {
    switch (type) {
      case 'creators':
        return (
          <tr key={item.id || index} className="table-morandi-row">
            <td className="px-8 py-6 font-medium">
              {item.id && typeof item.id === 'string' ? item.id : '-'}
            </td>
            <td className="px-8 py-6">
              {item.wechatName && typeof item.wechatName === 'string' ? item.wechatName : '-'}
            </td>
            <td className="px-8 py-6">
              {item.city && typeof item.city === 'string' ? item.city : '-'}
            </td>
            <td className="px-8 py-6">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--morandi-pearl)] text-[var(--morandi-stone)]">
                {item.category && typeof item.category === 'string' ? item.category : '-'}
              </span>
            </td>
            <td className="px-8 py-6">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                item.contractStatus && typeof item.contractStatus === 'string' && item.contractStatus.includes('签约') ? 'status-success' : 'status-warning'
              }`}>
                {item.contractStatus && typeof item.contractStatus === 'string' ? item.contractStatus : '-'}
              </span>
            </td>
            <td className="px-8 py-6 font-medium">
              {item.commission && typeof item.commission === 'number' ? (item.commission * 100).toFixed(0) + '%' : '-'}
            </td>
            <td className="px-8 py-6">{utils.formatDate(item.interviewDate)}</td>
            <td className="px-8 py-6">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onEdit?.(item)} 
                  className="text-[var(--morandi-cloud)] hover:text-[var(--morandi-sage)] transition-colors"
                  title="编辑"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => onDelete?.(item.id)} 
                  className="text-[var(--morandi-rose)] hover:text-red-600 transition-colors"
                  title="删除"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </td>
          </tr>
        );
      case 'accounts':
        return (
          <tr key={`${item.creatorId}-${item.platform}-${index}`} className="table-morandi-row">
            <td className="px-8 py-6 font-medium">{getCreatorName(item.creatorId)}</td>
            <td className="px-8 py-6">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--morandi-pearl)] text-[var(--morandi-stone)]">
                {item.platform || '-'}
              </span>
            </td>
            <td className="px-8 py-6 font-medium">{item.followers ? utils.formatNumber(item.followers) : '-'}</td>
            <td className="px-8 py-6 font-medium text-[var(--morandi-cloud)]">{item.price ? utils.formatCurrency(item.price) : '-'}</td>
            <td className="px-8 py-6">{utils.formatDate(item.updateDate)}</td>
            <td className="px-8 py-6">
              {item.link && (
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[var(--morandi-cloud)] hover:text-[var(--morandi-sage)] transition-colors text-sm"
                >
                  查看链接
                </a>
              )}
            </td>
            <td className="px-8 py-6">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onEdit?.(item)} 
                  className="text-[var(--morandi-cloud)] hover:text-[var(--morandi-sage)] transition-colors"
                  title="编辑"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => onDelete?.(`${item.creatorId}-${item.platform}`)} 
                  className="text-[var(--morandi-rose)] hover:text-red-600 transition-colors"
                  title="删除"
                >
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
            <td className="px-8 py-6 font-medium text-[var(--morandi-cloud)]">{item.amount ? utils.formatCurrency(item.amount) : '-'}</td>
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
                <button 
                  onClick={() => onEdit?.(item)} 
                  className="text-[var(--morandi-cloud)] hover:text-[var(--morandi-sage)] transition-colors"
                  title="编辑"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => onDelete?.(item.id)} 
                  className="text-[var(--morandi-rose)] hover:text-red-600 transition-colors"
                  title="删除"
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
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(renderRow)}
        </tbody>
      </table>
    </div>
  );
}

// 空状态组件
function EmptyState({ icon: Icon, title, description, action, actionText }: {
  icon: any;
  title: string;
  description: string;
  action?: () => void;
  actionText?: string;
}) {
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

// 编辑模态框组件
function EditModal({ isOpen, onClose, creator, onSave, isNew }: {
  isOpen: boolean;
  onClose: () => void;
  creator: Creator | null;
  onSave: (data: Creator) => void;
  isNew: boolean;
}) {
  const [formData, setFormData] = useState<Creator>(
    creator || {
      id: utils.generateId(),
      realName: '',
      wechatName: '',
      contactMethod: '',
      city: '',
      inGroup: '',
      interviewStatus: '',
      interviewer: '',
      interviewDate: '',
      contractStatus: '',
      contractStartDate: '',
      contractEndDate: '',
      commission: 0.7,
      category: '',
      notes: '',
      transferAccount: ''
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (creator) {
      setFormData(creator);
    }
  }, [creator]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.realName.trim()) newErrors.realName = '请输入真实姓名';
    if (!formData.wechatName.trim()) newErrors.wechatName = '请输入微信名';
    if (!formData.city.trim()) newErrors.city = '请输入所在城市';
    if (!formData.category.trim()) newErrors.category = '请选择账号类别';
    if (formData.commission < 0 || formData.commission > 1) {
      newErrors.commission = '分成比例应在0-1之间';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = (field: keyof Creator, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-morandi">
      <div className="modal-content-morandi max-w-4xl">
        <div className="flex items-center justify-between p-8 border-b border-[var(--morandi-pearl)]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--morandi-cloud)]/10 rounded-2xl">
              <Users className="h-6 w-6 text-[var(--morandi-cloud)]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--morandi-stone)]">
                {isNew ? '新增博主' : '编辑博主信息'}
              </h2>
              <p className="text-sm text-[var(--morandi-mist)] mt-1">
                {isNew ? '填写博主的基本信息' : '修改博主的信息'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-[var(--morandi-mist)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                真实姓名 *
              </label>
              <input
                type="text"
                value={formData.realName}
                onChange={(e) => handleChange('realName', e.target.value)}
                className="input-morandi"
                placeholder="请输入真实姓名"
              />
              {errors.realName && <p className="text-[var(--morandi-rose)] text-sm mt-1">{errors.realName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                微信账号名 *
              </label>
              <input
                type="text"
                value={formData.wechatName}
                onChange={(e) => handleChange('wechatName', e.target.value)}
                className="input-morandi"
                placeholder="请输入微信账号名"
              />
              {errors.wechatName && <p className="text-[var(--morandi-rose)] text-sm mt-1">{errors.wechatName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                建联方式
              </label>
              <select
                value={formData.contactMethod}
                onChange={(e) => handleChange('contactMethod', e.target.value)}
                className="input-morandi"
              >
                <option value="">请选择建联方式</option>
                <option value="MVP主动BD">MVP主动BD</option>
                <option value="博主主动联系">博主主动联系</option>
                <option value="朋友介绍">朋友介绍</option>
                <option value="其他">其他</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                所在城市 *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="input-morandi"
                placeholder="请输入所在城市"
              />
              {errors.city && <p className="text-[var(--morandi-rose)] text-sm mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                是否在商单群
              </label>
              <select
                value={formData.inGroup}
                onChange={(e) => handleChange('inGroup', e.target.value)}
                className="input-morandi"
              >
                <option value="">请选择</option>
                <option value="DC1群">DC1群</option>
                <option value="DC2群">DC2群</option>
                <option value="未加入">未加入</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                面试情况
              </label>
              <select
                value={formData.interviewStatus}
                onChange={(e) => handleChange('interviewStatus', e.target.value)}
                className="input-morandi"
              >
                <option value="">请选择面试情况</option>
                <option value="Zoom已面">Zoom已面</option>
                <option value="待面试">待面试</option>
                <option value="面试通过">面试通过</option>
                <option value="面试未通过">面试未通过</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                面试人
              </label>
              <input
                type="text"
                value={formData.interviewer}
                onChange={(e) => handleChange('interviewer', e.target.value)}
                className="input-morandi"
                placeholder="请输入面试人"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                面试日期
              </label>
              <input
                type="date"
                value={formData.interviewDate}
                onChange={(e) => handleChange('interviewDate', e.target.value)}
                className="input-morandi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                签约情况
              </label>
              <select
                value={formData.contractStatus}
                onChange={(e) => handleChange('contractStatus', e.target.value)}
                className="input-morandi"
              >
                <option value="">请选择签约情况</option>
                <option value="有全账号签约意向">有全账号签约意向</option>
                <option value="已签约">已签约</option>
                <option value="拒绝签约">拒绝签约</option>
                <option value="考虑中">考虑中</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                合同开始日期
              </label>
              <input
                type="date"
                value={formData.contractStartDate}
                onChange={(e) => handleChange('contractStartDate', e.target.value)}
                className="input-morandi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                合同结束日期
              </label>
              <input
                type="date"
                value={formData.contractEndDate}
                onChange={(e) => handleChange('contractEndDate', e.target.value)}
                className="input-morandi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                分成比例 *
              </label>
              <input
                type="number"
                value={formData.commission}
                onChange={(e) => handleChange('commission', parseFloat(e.target.value))}
                className="input-morandi"
                placeholder="0.7"
                min="0"
                max="1"
                step="0.01"
              />
              {errors.commission && <p className="text-[var(--morandi-rose)] text-sm mt-1">{errors.commission}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                账号类别 *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="input-morandi"
              >
                <option value="">请选择账号类别</option>
                <option value="美食探店">美食探店</option>
                <option value="生活方式">生活方式</option>
                <option value="时尚穿搭">时尚穿搭</option>
                <option value="旅行攻略">旅行攻略</option>
                <option value="母婴育儿">母婴育儿</option>
                <option value="其他">其他</option>
              </select>
              {errors.category && <p className="text-[var(--morandi-rose)] text-sm mt-1">{errors.category}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                转账账户信息
              </label>
              <textarea
                value={formData.transferAccount}
                onChange={(e) => handleChange('transferAccount', e.target.value)}
                className="input-morandi h-20 resize-none"
                placeholder="请输入银行账户信息"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                备注
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="input-morandi h-20 resize-none"
                placeholder="请输入备注信息"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-[var(--morandi-pearl)]">
            <button type="button" onClick={onClose} className="btn-morandi-secondary">
              取消
            </button>
            <button type="submit" className="btn-morandi-primary">
              <Save size={18} />
              {isNew ? '添加博主' : '保存修改'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 业配模态框组件
function DealModal({ isOpen, onClose, deal, onSave, creators, isNew }: {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal | null;
  onSave: (data: Deal) => void;
  creators: Creator[];
  isNew: boolean;
}) {
  const [formData, setFormData] = useState<Deal>(
    deal || {
      id: utils.generateId(),
      creatorId: '',
      partner: '',
      type: '',
      date: '',
      channel: '',
      amount: 0,
      transferCycle: '',
      transferDate: '',
      transferStatus: '待转账',
      receivedAmount: 0,
      companyShare: 0,
      creatorShare: 0,
      unallocated: '',
      informalDetails: ''
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (deal) {
      setFormData(deal);
    }
  }, [deal]);

  useEffect(() => {
    // 自动计算分成
    if (formData.amount && formData.creatorId) {
      const creator = creators.find(c => c.id === formData.creatorId);
      if (creator) {
        const { creatorShare, companyShare } = utils.calculateShares(formData.amount, creator.commission);
        setFormData(prev => ({ ...prev, creatorShare, companyShare }));
      }
    }
  }, [formData.amount, formData.creatorId, creators]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.creatorId) newErrors.creatorId = '请选择博主';
    if (!formData.partner.trim()) newErrors.partner = '请输入合作方';
    if (!formData.date) newErrors.date = '请选择业配日期';
    if (formData.amount <= 0) newErrors.amount = '请输入有效的金额';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = (field: keyof Deal, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-morandi">
      <div className="modal-content-morandi max-w-4xl">
        <div className="flex items-center justify-between p-8 border-b border-[var(--morandi-pearl)]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--morandi-cloud)]/10 rounded-2xl">
              <FileText className="h-6 w-6 text-[var(--morandi-cloud)]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--morandi-stone)]">
                {isNew ? '新增业配记录' : '编辑业配记录'}
              </h2>
              <p className="text-sm text-[var(--morandi-mist)] mt-1">
                {isNew ? '添加新的业配合作记录' : '修改业配记录信息'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-[var(--morandi-mist)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                选择博主 *
              </label>
              <SearchableSelect
                creators={creators.filter(c => c.contractStatus && c.contractStatus.includes('签约'))}
                value={formData.creatorId}
                onChange={(value) => handleChange('creatorId', value)}
                placeholder="搜索博主ID、姓名、微信名或城市..."
              />
              {errors.creatorId && <p className="text-[var(--morandi-rose)] text-sm mt-1">{errors.creatorId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                合作方 *
              </label>
              <input
                type="text"
                value={formData.partner}
                onChange={(e) => handleChange('partner', e.target.value)}
                className="input-morandi"
                placeholder="请输入合作方名称"
              />
              {errors.partner && <p className="text-[var(--morandi-rose)] text-sm mt-1">{errors.partner}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                业配类型
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="input-morandi"
              >
                <option value="">请选择业配类型</option>
                <option value="探店">探店</option>
                <option value="产品推广">产品推广</option>
                <option value="品牌合作">品牌合作</option>
                <option value="活动推广">活动推广</option>
                <option value="其他">其他</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                业配日期 *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="input-morandi"
              />
              {errors.date && <p className="text-[var(--morandi-rose)] text-sm mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                指定渠道
              </label>
              <input
                type="text"
                value={formData.channel}
                onChange={(e) => handleChange('channel', e.target.value)}
                className="input-morandi"
                placeholder="小红书/抖音/微信等"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                合作总金额 *
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
                className="input-morandi"
                placeholder="0"
                min="0"
                step="0.01"
              />
              {errors.amount && <p className="text-[var(--morandi-rose)] text-sm mt-1">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                转账周期
              </label>
              <select
                value={formData.transferCycle}
                onChange={(e) => handleChange('transferCycle', e.target.value)}
                className="input-morandi"
              >
                <option value="">请选择转账周期</option>
                <option value="即时">即时</option>
                <option value="3天内">3天内</option>
                <option value="7天内">7天内</option>
                <option value="15天内">15天内</option>
                <option value="30天内">30天内</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                应转账日期
              </label>
              <input
                type="date"
                value={formData.transferDate}
                onChange={(e) => handleChange('transferDate', e.target.value)}
                className="input-morandi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                转账状态
              </label>
              <select
                value={formData.transferStatus}
                onChange={(e) => handleChange('transferStatus', e.target.value)}
                className="input-morandi"
              >
                <option value="待转账">待转账</option>
                <option value="处理中">处理中</option>
                <option value="已转账">已转账</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                已收金额
              </label>
              <input
                type="number"
                value={formData.receivedAmount}
                onChange={(e) => handleChange('receivedAmount', parseFloat(e.target.value))}
                className="input-morandi"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                公司分成
              </label>
              <input
                type="number"
                value={formData.companyShare}
                readOnly
                className="input-morandi bg-[var(--morandi-pearl)]"
                placeholder="自动计算"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                博主分成
              </label>
              <input
                type="number"
                value={formData.creatorShare}
                readOnly
                className="input-morandi bg-[var(--morandi-pearl)]"
                placeholder="自动计算"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                业配详情
              </label>
              <textarea
                value={formData.informalDetails}
                onChange={(e) => handleChange('informalDetails', e.target.value)}
                className="input-morandi h-20 resize-none"
                placeholder="请输入业配的详细信息..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-[var(--morandi-pearl)]">
            <button type="button" onClick={onClose} className="btn-morandi-secondary">
              取消
            </button>
            <button type="submit" className="btn-morandi-primary">
              <Save size={18} />
              {isNew ? '添加记录' : '保存修改'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 导入模态框组件
function ImportModal({ isOpen, onClose, onImportSuccess }: {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [validationResults, setValidationResults] = useState<any>(null);
  const [importing, setImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    // 预览文件内容
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/import/preview', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setPreviewData(result.data || []);
        setValidationResults(result.validation || {});
      } else {
        alert('文件解析失败: ' + result.message);
      }
    } catch (error) {
      console.error('文件预览失败:', error);
      alert('文件预览失败，请检查文件格式');
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/import/creators', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setImportComplete(true);
        onImportSuccess();
        alert(`导入成功！共导入 ${result.count || 0} 条记录`);
      } else {
        throw new Error(result.message || '导入失败');
      }
    } catch (error) {
      console.error('导入失败:', error);
      alert('导入失败，请重试');
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreviewData([]);
    setValidationResults(null);
    setImportComplete(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const downloadTemplate = () => {
    const template = [
      ['博主ID', '真实姓名', '微信账号名', '建联方式', '所在城市', '在DC商单群', '面试情况', '面试人', '面试日期', '签约情况', '合同开始日期', '合同结束日期', '分成比例', '账号类别', '备注', '转账账户信息'],
      ['示例博主1', '张三', 'zhangsan123', 'MVP主动BD', '多伦多', 'DC1群', 'Zoom已面', 'Theresa', '2025-06-29', '有全账号签约意向', '', '', '0.7', '美食探店', '备注信息', '银行账户信息'],
    ];

    const csvContent = template.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '博主信息导入模板.csv';
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-morandi">
      <div className="modal-content-morandi max-w-6xl">
        <div className="flex items-center justify-between p-8 border-b border-[var(--morandi-pearl)]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--morandi-cloud)]/10 rounded-2xl">
              <Upload className="h-6 w-6 text-[var(--morandi-cloud)]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--morandi-stone)]">批量导入博主数据</h2>
              <p className="text-sm text-[var(--morandi-mist)] mt-1">支持Excel和CSV文件格式</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-[var(--morandi-mist)]" />
          </button>
        </div>

        <div className="p-8">
          {!file && !importComplete && (
            <div className="text-center">
              <div className="border-2 border-dashed border-[var(--morandi-mist)]/30 rounded-2xl p-12 hover:border-[var(--morandi-cloud)]/50 transition-colors">
                <Upload size={48} className="mx-auto text-[var(--morandi-mist)] mb-6" />
                <h3 className="text-lg font-medium text-[var(--morandi-stone)] mb-2">选择文件上传</h3>
                <p className="text-[var(--morandi-mist)] mb-6">支持 .xlsx, .xls, .csv 格式</p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <button onClick={() => fileInputRef.current?.click()} className="btn-morandi-primary">
                  选择文件
                </button>
                
                <div className="mt-8 pt-6 border-t border-[var(--morandi-pearl)]">
                  <p className="text-sm text-[var(--morandi-mist)] mb-4">没有模板？下载标准格式模板</p>
                  <button onClick={downloadTemplate} className="btn-morandi-secondary">
                    <Download size={18} />
                    下载模板
                  </button>
                </div>
              </div>
            </div>
          )}

          {file && previewData.length > 0 && !importComplete && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-[var(--morandi-stone)]">文件预览</h3>
                  <p className="text-sm text-[var(--morandi-mist)]">
                    文件：{file.name}，共 {previewData.length} 行数据
                  </p>
                </div>
                
                {validationResults && (
                  <div className="flex items-center gap-4">
                    {validationResults.valid > 0 && (
                      <span className="status-success px-3 py-1 rounded-full text-sm">
                        有效：{validationResults.valid}
                      </span>
                    )}
                    {validationResults.invalid > 0 && (
                      <span className="status-error px-3 py-1 rounded-full text-sm">
                        无效：{validationResults.invalid}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-[var(--morandi-pearl)] rounded-2xl p-6 mb-6 max-h-80 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--morandi-mist)]/20">
                      <th className="text-left py-2 text-[var(--morandi-stone)]">姓名</th>
                      <th className="text-left py-2 text-[var(--morandi-stone)]">微信名</th>
                      <th className="text-left py-2 text-[var(--morandi-stone)]">城市</th>
                      <th className="text-left py-2 text-[var(--morandi-stone)]">类别</th>
                      <th className="text-left py-2 text-[var(--morandi-stone)]">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(0, 10).map((row, index) => (
                      <tr key={index} className="border-b border-[var(--morandi-mist)]/10">
                        <td className="py-2 text-[var(--morandi-stone)]">{row.realName || '-'}</td>
                        <td className="py-2 text-[var(--morandi-stone)]">{row.wechatName || '-'}</td>
                        <td className="py-2 text-[var(--morandi-stone)]">{row.city || '-'}</td>
                        <td className="py-2 text-[var(--morandi-stone)]">{row.category || '-'}</td>
                        <td className="py-2">
                          {row.valid ? (
                            <CheckCircle size={16} className="text-[var(--morandi-sage)]" />
                          ) : (
                            <X size={16} className="text-[var(--morandi-rose)]" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {previewData.length > 10 && (
                  <p className="text-center text-[var(--morandi-mist)] mt-4">
                    还有 {previewData.length - 10} 行数据...
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-4">
                <button onClick={handleClose} className="btn-morandi-secondary">
                  取消
                </button>
                <button 
                  onClick={handleImport} 
                  disabled={importing || (validationResults && validationResults.valid === 0)}
                  className="btn-morandi-primary disabled:opacity-50"
                >
                  {importing ? (
                    <>
                      <Loader2 size={18} className="animate-morandi-spin" />
                      导入中...
                    </>
                  ) : (
                    <>
                      <Database size={18} />
                      确认导入
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {importComplete && (
            <div className="text-center py-12">
              <CheckCircle size={64} className="text-[var(--morandi-sage)] mx-auto mb-6" />
              <h3 className="text-xl font-medium text-[var(--morandi-stone)] mb-3">导入完成</h3>
              <p className="text-[var(--morandi-mist)] mb-8">博主数据已成功导入系统</p>
              <button onClick={handleClose} className="btn-morandi-primary">
                完成
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 导出模态框组件
function ExportModal({ isOpen, onClose, creators, accounts, deals }: {
  isOpen: boolean;
  onClose: () => void;
  creators: Creator[];
  accounts: Account[];
  deals: Deal[];
}) {
  const [exportType, setExportType] = useState('creators');
  const [format, setFormat] = useState('excel');
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);

    try {
      let data: any[] = [];
      let filename = '';

      switch (exportType) {
        case 'creators':
          data = creators;
          filename = `博主数据_${new Date().toISOString().split('T')[0]}`;
          break;
        case 'accounts':
          data = accounts;
          filename = `账号数据_${new Date().toISOString().split('T')[0]}`;
          break;
        case 'deals':
          data = deals;
          filename = `业配数据_${new Date().toISOString().split('T')[0]}`;
          break;
        default:
          throw new Error('无效的导出类型');
      }

      if (format === 'json') {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        fileDownload(blob, `${filename}.json`);
      } else {
        // Excel/CSV 导出需要调用API
        const response = await fetch('/api/export', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: exportType, format, data }),
        });

        if (response.ok) {
          const blob = await response.blob();
          fileDownload(blob, `${filename}.${format === 'excel' ? 'xlsx' : 'csv'}`);
        } else {
          throw new Error('导出失败');
        }
      }

      alert('导出成功！');
      onClose();
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-morandi">
      <div className="modal-content-morandi max-w-2xl">
        <div className="flex items-center justify-between p-8 border-b border-[var(--morandi-pearl)]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--morandi-sage)]/10 rounded-2xl">
              <Download className="h-6 w-6 text-[var(--morandi-sage)]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--morandi-stone)]">导出数据</h2>
              <p className="text-sm text-[var(--morandi-mist)] mt-1">选择要导出的数据类型和格式</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-[var(--morandi-mist)]" />
          </button>
        </div>

        <div className="p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-3">
                数据类型
              </label>
              <div className="grid grid-cols-1 gap-3">
                <label className="flex items-center gap-3 p-4 border border-[var(--morandi-pearl)] rounded-2xl hover:border-[var(--morandi-cloud)] transition-colors cursor-pointer">
                  <input
                    type="radio"
                    value="creators"
                    checked={exportType === 'creators'}
                    onChange={(e) => setExportType(e.target.value)}
                    className="text-[var(--morandi-cloud)]"
                  />
                  <div>
                    <div className="font-medium text-[var(--morandi-stone)]">博主数据</div>
                    <div className="text-sm text-[var(--morandi-mist)]">包含 {creators.length} 条博主记录</div>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 p-4 border border-[var(--morandi-pearl)] rounded-2xl hover:border-[var(--morandi-cloud)] transition-colors cursor-pointer">
                  <input
                    type="radio"
                    value="accounts"
                    checked={exportType === 'accounts'}
                    onChange={(e) => setExportType(e.target.value)}
                    className="text-[var(--morandi-cloud)]"
                  />
                  <div>
                    <div className="font-medium text-[var(--morandi-stone)]">账号数据</div>
                    <div className="text-sm text-[var(--morandi-mist)]">包含 {accounts.length} 条账号记录</div>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 p-4 border border-[var(--morandi-pearl)] rounded-2xl hover:border-[var(--morandi-cloud)] transition-colors cursor-pointer">
                  <input
                    type="radio"
                    value="deals"
                    checked={exportType === 'deals'}
                    onChange={(e) => setExportType(e.target.value)}
                    className="text-[var(--morandi-cloud)]"
                  />
                  <div>
                    <div className="font-medium text-[var(--morandi-stone)]">业配数据</div>
                    <div className="text-sm text-[var(--morandi-mist)]">包含 {deals.length} 条业配记录</div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-3">
                导出格式
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="input-morandi"
              >
                <option value="excel">Excel (.xlsx)</option>
                <option value="csv">CSV (.csv)</option>
                <option value="json">JSON (.json)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-[var(--morandi-pearl)]">
            <button onClick={onClose} className="btn-morandi-secondary">
              取消
            </button>
            <button 
              onClick={handleExport} 
              disabled={exporting}
              className="btn-morandi-primary disabled:opacity-50"
            >
              {exporting ? (
                <>
                  <Loader2 size={18} className="animate-morandi-spin" />
                  导出中...
                </>
              ) : (
                <>
                  <Download size={18} />
                  开始导出
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 可搜索选择组件
function SearchableSelect({ creators, value, onChange, placeholder, disabled = false }: {
  creators: Creator[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayValue, setDisplayValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 根据选中的value更新显示文本
  useEffect(() => {
    if (value) {
      const selectedCreator = creators.find(c => c.id === value);
      if (selectedCreator) {
        setDisplayValue(`${selectedCreator.realName} (${selectedCreator.wechatName})`);
        setSearchTerm(`${selectedCreator.realName} (${selectedCreator.wechatName})`);
      }
    } else {
      setDisplayValue('');
      setSearchTerm('');
    }
  }, [value, creators]);

  // 过滤博主列表
  const filteredCreators = creators.filter(creator => {
    const searchLower = searchTerm.toLowerCase();
    return (creator.id && creator.id.toLowerCase().includes(searchLower)) ||
           (creator.realName && creator.realName.toLowerCase().includes(searchLower)) ||
           (creator.wechatName && creator.wechatName.toLowerCase().includes(searchLower)) ||
           (creator.city && creator.city.toLowerCase().includes(searchLower));
  });

  // 点击外部关闭下拉框
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // 如果没有选中值，清空搜索框
        if (!value) {
          setSearchTerm('');
          setDisplayValue('');
        } else {
          // 恢复显示选中的值
          const selectedCreator = creators.find(c => c.id === value);
          if (selectedCreator) {
            setSearchTerm(`${selectedCreator.realName} (${selectedCreator.wechatName})`);
          }
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value, creators]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setDisplayValue(newValue);
    setIsOpen(true);
    
    // 如果清空了输入，也清空选中值
    if (!newValue.trim()) {
      onChange('');
    }
  };

  const handleSelectCreator = (creator: Creator) => {
    const displayText = `${creator.realName} (${creator.wechatName})`;
    setSearchTerm(displayText);
    setDisplayValue(displayText);
    onChange(creator.id);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        className="input-morandi"
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
      />
      
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-[var(--morandi-pearl)] max-h-60 overflow-y-auto">
          {filteredCreators.length > 0 ? (
            filteredCreators.map(creator => (
              <div
                key={creator.id}
                onClick={() => handleSelectCreator(creator)}
                className="px-4 py-3 hover:bg-[var(--morandi-pearl)] cursor-pointer transition-colors border-b border-[var(--morandi-pearl)]/50 last:border-b-0"
              >
                <div className="font-medium text-[var(--morandi-stone)]">
                  {creator.realName}
                </div>
                <div className="text-sm text-[var(--morandi-mist)]">
                  {creator.wechatName} • {creator.city} • {creator.category}
                </div>
                <div className="text-xs text-[var(--morandi-mist)] mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    creator.contractStatus && creator.contractStatus.includes('签约') 
                      ? 'bg-[var(--morandi-sage)]/20 text-[var(--morandi-sage)]' 
                      : 'bg-[var(--morandi-dust)]/20 text-[var(--morandi-dust)]'
                  }`}>
                    {creator.contractStatus || '未知状态'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-[var(--morandi-mist)]">
              {searchTerm ? '未找到匹配的博主' : '暂无已签约博主'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 账号模态框组件
function AccountModal({ isOpen, onClose, account, onSave, creators, isNew }: {
  isOpen: boolean;
  onClose: () => void;
  account: Account | null;
  onSave: (data: Account) => void;
  creators: Creator[];
  isNew: boolean;
}) {
  const [formData, setFormData] = useState<Account>(
    account || {
      creatorId: '',
      platform: '',
      link: '',
      followers: 0,
      price: 0,
      updateDate: new Date().toISOString().split('T')[0]
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (account) {
      setFormData(account);
    }
  }, [account]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.creatorId) newErrors.creatorId = '请选择博主';
    if (!formData.platform.trim()) newErrors.platform = '请输入平台名称';
    if (formData.followers < 0) newErrors.followers = '粉丝数不能为负数';
    if (formData.price < 0) newErrors.price = '报价不能为负数';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = (field: keyof Account, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-morandi">
      <div className="modal-content-morandi max-w-2xl">
        <div className="flex items-center justify-between p-8 border-b border-[var(--morandi-pearl)]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--morandi-sage)]/10 rounded-2xl">
              <UserCheck className="h-6 w-6 text-[var(--morandi-sage)]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--morandi-stone)]">
                {isNew ? '新增平台账号' : '编辑平台账号'}
              </h2>
              <p className="text-sm text-[var(--morandi-mist)] mt-1">
                {isNew ? '为博主添加新的平台账号' : '修改平台账号信息'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-[var(--morandi-mist)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                选择博主 *
              </label>
              <SearchableSelect
                creators={creators.filter(c => c.contractStatus && c.contractStatus.includes('签约'))}
                value={formData.creatorId}
                onChange={(value) => handleChange('creatorId', value)}
                placeholder="搜索博主姓名、微信名或城市..."
                disabled={!isNew} // 编辑时不允许修改博主
              />
              {errors.creatorId && <p className="text-[var(--morandi-rose)] text-sm mt-1">{errors.creatorId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                平台名称 *
              </label>
              <input
                type="text"
                value={formData.platform}
                onChange={(e) => handleChange('platform', e.target.value)}
                className="input-morandi"
                placeholder="小红书/抖音/微信公众号等"
                disabled={!isNew} // 编辑时不允许修改平台
              />
              {errors.platform && <p className="text-[var(--morandi-rose)] text-sm mt-1">{errors.platform}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                账号链接
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => handleChange('link', e.target.value)}
                className="input-morandi"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                粉丝数
              </label>
              <input
                type="number"
                value={formData.followers}
                onChange={(e) => handleChange('followers', parseInt(e.target.value) || 0)}
                className="input-morandi"
                placeholder="0"
                min="0"
              />
              {errors.followers && <p className="text-[var(--morandi-rose)] text-sm mt-1">{errors.followers}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                平台报价 (¥)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                className="input-morandi"
                placeholder="0"
                min="0"
                step="0.01"
              />
              {errors.price && <p className="text-[var(--morandi-rose)] text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
                数据更新日期
              </label>
              <input
                type="date"
                value={formData.updateDate}
                onChange={(e) => handleChange('updateDate', e.target.value)}
                className="input-morandi"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-[var(--morandi-pearl)]">
            <button type="button" onClick={onClose} className="btn-morandi-secondary">
              取消
            </button>
            <button type="submit" className="btn-morandi-primary">
              <Save size={18} />
              {isNew ? '添加账号' : '保存修改'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
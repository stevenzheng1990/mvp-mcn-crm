import { useState, useEffect, useMemo, useCallback } from 'react';
import { utils } from '../components/Dashboard';
import type { Creator, Account, Deal, ProcessedData, ModalType } from '../types';

// 数据处理 Hook
function useDataProcessing(creators: Creator[], accounts: Account[], deals: Deal[]): ProcessedData {
  return useMemo(() => {
    // 过滤有效数据
    const validCreators = creators.filter(c => c && c.id);
    const validAccounts = accounts.filter(a => a && a.creatorId);
    const validDeals = deals.filter(d => d && d.id);

    // 获取当月数据
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyDeals = validDeals.filter(deal => {
      if (!deal.date) return false;
      const dealDate = new Date(deal.date);
      return dealDate.getMonth() === currentMonth && dealDate.getFullYear() === currentYear;
    });

    const pendingTransfers = validDeals.filter(deal => 
      deal.transferStatus === '待转账'
    );

    const overdueTransfers = validDeals.filter(deal => 
      utils.isOverdue(deal)
    );

    // 统计数据
    const stats = {
      totalCreators: validCreators.filter(c => c.contractStatus === '已签约').length,
      totalFollowers: validAccounts.reduce((sum, acc) => sum + (acc.followers || 0), 0),
      totalRevenue: validDeals.reduce((sum, deal) => sum + (deal.receivedAmount || 0), 0),
      totalDeals: validDeals.length,
    };

    // 月度数据
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
        const categories = creator.category ? creator.category.split(',').map(c => c.trim()) : ['未分类'];
        categories.forEach(category => {
          if (category) {
            acc[category] = (acc[category] || 0) + 1;
          }
        });
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

// 主数据管理 Hook
export function useDataManagement(isAuthenticated: boolean) {
  // 状态管理
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
    creators: { page: 1, size: 50 },
    accounts: { page: 1, size: 50 },
    deals: { page: 1, size: 50 },
  });

  // 数据处理
  const processedData = useDataProcessing(creators, accounts, deals);

  // 过滤数据
  const filteredData = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return {
      creators: creators.filter(creator => {
        if (!creator || !creator.id) return false;
        
        const matchesSearch = !searchTerm || 
          (creator.id?.toLowerCase().includes(lowerSearchTerm)) ||
          (creator.realName?.toLowerCase().includes(lowerSearchTerm)) ||
          (creator.wechatName?.toLowerCase().includes(lowerSearchTerm)) ||
          (creator.city?.toLowerCase().includes(lowerSearchTerm)) ||
          (creator.category?.toLowerCase().includes(lowerSearchTerm));
        
        const matchesStatus = statusFilter === 'all' ||
          (statusFilter === 'signed' && creator.contractStatus === '已签约') ||
          (statusFilter === 'pending' && creator.contractStatus === '签约意向');
        
        return matchesSearch && matchesStatus;
      }),
      
      deals: deals.filter(deal => {
        if (!deal || !deal.id) return false;
        
        const creator = creators.find(c => c && c.id === deal.creatorId);
        const creatorName = creator?.realName || '';
        
        const matchesSearch = !searchTerm ||
          (deal.id?.toLowerCase().includes(lowerSearchTerm)) ||
          (deal.partner?.toLowerCase().includes(lowerSearchTerm)) ||
          (creatorName.toLowerCase().includes(lowerSearchTerm));
        
        const matchesStatus = statusFilter === 'all' ||
          (statusFilter === 'pending' && deal.transferStatus === '待转账') ||
          (statusFilter === 'processing' && deal.transferStatus === '处理中') ||
          (statusFilter === 'completed' && deal.transferStatus === '已转账') ||
          (statusFilter === 'overdue' && utils.isOverdue(deal));
        
        return matchesSearch && matchesStatus;
      })
    };
  }, [creators, deals, searchTerm, statusFilter]);

  // 获取数据
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

  // 设置分页
  const setPaginationForType = useCallback((type: string, newPagination: any) => {
    setPagination(prev => ({ ...prev, [type]: newPagination }));
  }, []);

  // 先定义独立的 closeModal 函数
  const closeModal = useCallback((type: ModalType) => {
    setModals(prev => ({ ...prev, [type]: { open: false, isNew: false, data: null } }));
  }, []);

  // 处理函数
  const handlers = {
    openModal: useCallback((type: ModalType, isNew = false, data = null) => {
      setModals(prev => ({ ...prev, [type]: { open: true, isNew, data } }));
    }, []),

    closeModal,  // 使用上面定义的函数

    resetData: useCallback(() => {
      setCreators([]);
      setAccounts([]);
      setDeals([]);
    }, []),

    refresh: useCallback(async () => {
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
      } catch (error) {
        console.error('刷新数据失败:', error);
        alert('刷新数据失败，请检查网络连接');
      } finally {
        setRefreshing(false);
      }
    }, []),

    saveCreator: useCallback(async (creatorData: Creator) => {
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
          closeModal('edit');  // 使用独立定义的函数
        } else {
          throw new Error(result.message || '保存失败');
        }
      } catch (error) {
        console.error('保存博主信息失败:', error);
        alert('保存失败，请重试');
      }
    }, [modals.edit, closeModal]),

    saveDeal: useCallback(async (dealData: Deal) => {
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
          closeModal('deal');  // 使用独立定义的函数
        } else {
          throw new Error(result.message || '保存失败');
        }
      } catch (error) {
        console.error('保存业配记录失败:', error);
        alert('保存失败，请重试');
      }
    }, [modals.deal, closeModal]),

    saveAccount: useCallback(async (accountData: Account) => {
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
            // 立即添加到本地状态
            setAccounts(prev => [...prev, accountData]);
            
            // 延迟刷新以确保 Google Sheets 已更新
            setTimeout(async () => {
              setRefreshing(true);
              try {
                const accountsRes = await fetch('/api/accounts');
                const accountsData = await accountsRes.json();
                if (accountsData.success) {
                  setAccounts(accountsData.data || []);
                }
              } catch (error) {
                console.error('刷新账号数据失败:', error);
              } finally {
                setRefreshing(false);
              }
            }, 2000);
          } else {
            setAccounts(prev => prev.map(account => 
              account.creatorId === accountData.creatorId && account.platform === accountData.platform
                ? accountData : account
            ));
          }
          alert(isNew ? '账号添加成功' : '账号信息更新成功');
          closeModal('account');  // 使用独立定义的函数
        } else {
          throw new Error(result.message || '保存失败');
        }
      } catch (error) {
        console.error('保存账号信息失败:', error);
        alert('保存失败，请重试');
      }
    }, [modals.account, closeModal]),

    deleteCreator: useCallback(async (creatorId: string) => {
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
    }, []),

    deleteDeal: useCallback(async (dealId: string) => {
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
    }, []),

    deleteAccount: useCallback(async (accountId: string) => {
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
    }, []),
  };

  return {
    // 状态
    activeTab,
    loading,
    refreshing,
    searchTerm,
    statusFilter,
    creators,
    accounts,
    deals,
    modals,
    pagination,
    
    // 计算属性
    filteredData,
    processedData,
    
    // 方法
    setActiveTab,
    setSearchTerm,
    setStatusFilter,
    setPagination: setPaginationForType,
    handlers,
  };
}
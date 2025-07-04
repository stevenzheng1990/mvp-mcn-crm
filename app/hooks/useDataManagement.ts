// app/hooks/useDataManagement.ts
// 🔧 修复排序和数据重复问题

import { useState, useEffect, useMemo, useCallback } from 'react';
import { utils } from '../components/Dashboard';
import type { Creator, Account, Deal, ProcessedData, ModalType } from '../types';

// 排序配置类型
interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

// 🔧 数据去重函数
const deduplicateAccounts = (accounts: Account[]): Account[] => {
  const seen = new Set<string>();
  return accounts.filter(account => {
    const key = `${account.creatorId}-${account.platform}`;
    if (seen.has(key)) {
      console.warn('🔧 Duplicate account found:', key, account);
      return false;
    }
    seen.add(key);
    return true;
  });
};

const deduplicateCreators = (creators: Creator[]): Creator[] => {
  const seen = new Set<string>();
  return creators.filter(creator => {
    if (seen.has(creator.id)) {
      console.warn('🔧 Duplicate creator found:', creator.id, creator);
      return false;
    }
    seen.add(creator.id);
    return true;
  });
};

const deduplicateDeals = (deals: Deal[]): Deal[] => {
  const seen = new Set<string>();
  return deals.filter(deal => {
    if (seen.has(deal.id)) {
      console.warn('🔧 Duplicate deal found:', deal.id, deal);
      return false;
    }
    seen.add(deal.id);
    return true;
  });
};

// 数据处理 Hook
function useDataProcessing(creators: Creator[], accounts: Account[], deals: Deal[]): ProcessedData {
  return useMemo(() => {
    // 过滤有效数据并去重
    const validCreators = deduplicateCreators(creators.filter(c => c && c.id));
    const validAccounts = deduplicateAccounts(accounts.filter(a => a && a.creatorId));
    const validDeals = deduplicateDeals(deals.filter(d => d && d.id));

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
        const categories = creator.category ? 
          creator.category.split(',').map(c => c.trim()) : ['未分类'];
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

// 🔧 修复：改进的排序函数
const sortDataFixed = (data: any[], sortConfig: SortConfig | null) => {
  if (!sortConfig || !data || data.length === 0) {
    console.log('🔧 Debug: No sort config or empty data, returning original data', { 
      sortConfig, 
      dataLength: data?.length 
    });
    return data;
  }

  console.log('🔧 Debug: Sorting data', { 
    key: sortConfig.key, 
    direction: sortConfig.direction, 
    dataLength: data.length,
    sampleValue: data[0]?.[sortConfig.key]
  });

  try {
    const sortedData = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // 处理null/undefined值
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;
      
      // 🔧 改进：更精确的数字字段处理
      if (['followers', 'price', 'amount', 'receivedAmount'].includes(sortConfig.key)) {
        // 将值转换为数字，移除所有非数字字符（除了小数点）
        const aNum = parseFloat(String(aValue).replace(/[^\d.]/g, '')) || 0;
        const bNum = parseFloat(String(bValue).replace(/[^\d.]/g, '')) || 0;
        
        console.log('🔧 Debug: Number comparison', { 
          key: sortConfig.key,
          aValue, bValue, aNum, bNum 
        });
        
        comparison = aNum - bNum;
      } 
      // 🔧 改进：commission字段特殊处理（可能是小数）
      else if (sortConfig.key === 'commission') {
        const aNum = parseFloat(String(aValue)) || 0;
        const bNum = parseFloat(String(bValue)) || 0;
        comparison = aNum - bNum;
      }
      // 特殊处理日期字段
      else if (['interviewDate', 'updateDate', 'date', 'transferDate'].includes(sortConfig.key)) {
        const aDate = new Date(aValue || 0).getTime();
        const bDate = new Date(bValue || 0).getTime();
        comparison = aDate - bDate;
      }
      // 默认字符串排序
      else {
        comparison = String(aValue).localeCompare(String(bValue), 'zh-CN');
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    console.log('🔧 Debug: Sorted data length', sortedData.length);
    console.log('🔧 Debug: First 3 sorted values:', sortedData.slice(0, 3).map(item => ({
      [sortConfig.key]: item[sortConfig.key]
    })));
    
    return sortedData;
  } catch (error) {
    console.error('🔧 Error in sortData:', error);
    return data; // 出错时返回原始数据
  }
};

// 主数据管理 Hook - 修复版本
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
  
  // 排序状态
  const [sortConfigs, setSortConfigs] = useState<{
    creators: SortConfig | null;
    accounts: SortConfig | null;
    deals: SortConfig | null;
  }>({
    creators: null,
    accounts: null,
    deals: null,
  });
  
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

  // 设置分页的方法
  const setPaginationForType = useCallback((type: 'creators' | 'accounts' | 'deals', newPagination: any) => {
    setPagination(prev => ({
      ...prev,
      [type]: { ...prev[type], ...newPagination }
    }));
  }, []);

  // 排序处理函数
  const handleSort = useCallback((type: 'creators' | 'accounts' | 'deals', key: string) => {
    console.log('🔧 Debug: handleSort called', { type, key });
    
    try {
      setSortConfigs(prev => {
        const currentSort = prev[type];
        let direction: 'asc' | 'desc' = 'asc';
        
        if (currentSort && currentSort.key === key && currentSort.direction === 'asc') {
          direction = 'desc';
        }
        
        const newConfig = {
          ...prev,
          [type]: { key, direction }
        };
        
        console.log('🔧 Debug: New sort config', newConfig);
        return newConfig;
      });
      
      // 排序后重置到第一页
      setPaginationForType(type, { page: 1 });
      console.log('🔧 Debug: Reset pagination to page 1');
      
    } catch (error) {
      console.error('🔧 Error in handleSort:', error);
    }
  }, [setPaginationForType]);

  // 数据处理
  const processedData = useDataProcessing(creators, accounts, deals);

  // 🔧 修复：过滤和排序数据 - 使用修复后的排序函数
  const filteredAndSortedData = useMemo(() => {
    console.log('🔧 Debug: Recalculating filtered and sorted data');
    console.log('🔧 Debug: Raw data counts', { 
      creators: creators.length, 
      accounts: accounts.length, 
      deals: deals.length 
    });

    const lowerSearchTerm = searchTerm.toLowerCase();
    
    try {
      // 1. 先去重再过滤
      const dedupedCreators = deduplicateCreators(creators);
      const dedupedAccounts = deduplicateAccounts(accounts);
      const dedupedDeals = deduplicateDeals(deals);

      console.log('🔧 Debug: After deduplication', { 
        creators: dedupedCreators.length, 
        accounts: dedupedAccounts.length, 
        deals: dedupedDeals.length 
      });

      const filteredCreators = dedupedCreators.filter(creator => {
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
      });

      const filteredAccounts = dedupedAccounts.filter(account => {
        if (!account || !account.creatorId) return false;
        
        const creator = dedupedCreators.find(c => c && c.id === account.creatorId);
        const creatorName = creator?.realName || '';
        
        const matchesSearch = !searchTerm ||
          (creatorName.toLowerCase().includes(lowerSearchTerm)) ||
          (account.platform?.toLowerCase().includes(lowerSearchTerm));
        
        return matchesSearch;
      });

      const filteredDeals = dedupedDeals.filter(deal => {
        if (!deal || !deal.id) return false;
        
        const creator = dedupedCreators.find(c => c && c.id === deal.creatorId);
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
      });

      console.log('🔧 Debug: Filtered data counts', { 
        creators: filteredCreators.length, 
        accounts: filteredAccounts.length, 
        deals: filteredDeals.length 
      });

      // 2. 使用修复后的排序函数
      const sortedCreators = sortDataFixed(filteredCreators, sortConfigs.creators);
      const sortedAccounts = sortDataFixed(filteredAccounts, sortConfigs.accounts);
      const sortedDeals = sortDataFixed(filteredDeals, sortConfigs.deals);

      console.log('🔧 Debug: Sorted data counts', { 
        creators: sortedCreators.length, 
        accounts: sortedAccounts.length, 
        deals: sortedDeals.length 
      });

      // 3. 最后分页
      const creatorsStartIndex = (pagination.creators.page - 1) * pagination.creators.size;
      const accountsStartIndex = (pagination.accounts.page - 1) * pagination.accounts.size;
      const dealsStartIndex = (pagination.deals.page - 1) * pagination.deals.size;

      const paginatedCreators = sortedCreators.slice(
        creatorsStartIndex, 
        creatorsStartIndex + pagination.creators.size
      );
      const paginatedAccounts = sortedAccounts.slice(
        accountsStartIndex, 
        accountsStartIndex + pagination.accounts.size
      );
      const paginatedDeals = sortedDeals.slice(
        dealsStartIndex, 
        dealsStartIndex + pagination.deals.size
      );

      console.log('🔧 Debug: Paginated data counts', { 
        creators: paginatedCreators.length, 
        accounts: paginatedAccounts.length, 
        deals: paginatedDeals.length 
      });

      const result = {
        filtered: {
          creators: sortedCreators,
          accounts: sortedAccounts,
          deals: sortedDeals,
        },
        paginated: {
          creators: paginatedCreators,
          accounts: paginatedAccounts,
          deals: paginatedDeals,
        }
      };

      return result;

    } catch (error) {
      console.error('🔧 Error in filteredAndSortedData:', error);
      // 出错时返回去重后的原始数据
      return {
        filtered: {
          creators: deduplicateCreators(creators),
          accounts: deduplicateAccounts(accounts),
          deals: deduplicateDeals(deals),
        },
        paginated: {
          creators: deduplicateCreators(creators).slice(0, 50),
          accounts: deduplicateAccounts(accounts).slice(0, 50),
          deals: deduplicateDeals(deals).slice(0, 50),
        }
      };
    }
  }, [creators, accounts, deals, searchTerm, statusFilter, sortConfigs, pagination]);

  // 获取数据 - 🔧 添加去重处理
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

        // 🔧 在设置数据时立即去重
        if (creatorsData.success) {
          const dedupedCreators = deduplicateCreators(creatorsData.data || []);
          setCreators(dedupedCreators);
        }
        if (accountsData.success) {
          const dedupedAccounts = deduplicateAccounts(accountsData.data || []);
          setAccounts(dedupedAccounts);
        }
        if (dealsData.success) {
          const dedupedDeals = deduplicateDeals(dealsData.data || []);
          setDeals(dedupedDeals);
        }
      } catch (error) {
        console.error('获取数据失败:', error);
        alert('获取数据失败，请检查网络连接');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // 先定义独立的 closeModal 函数
  const closeModal = useCallback((type: ModalType) => {
    setModals(prev => ({ ...prev, [type]: { open: false, isNew: false, data: null } }));
  }, []);

  // 处理函数 - 🔧 在保存时也要去重
  const handlers = {
    openModal: useCallback((type: ModalType, isNew = false, data = null) => {
      setModals(prev => ({ ...prev, [type]: { open: true, isNew, data } }));
    }, []),

    closeModal,

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

        // 🔧 刷新时也要去重
        if (creatorsData.success) {
          const dedupedCreators = deduplicateCreators(creatorsData.data || []);
          setCreators(dedupedCreators);
        }
        if (accountsData.success) {
          const dedupedAccounts = deduplicateAccounts(accountsData.data || []);
          setAccounts(dedupedAccounts);
        }
        if (dealsData.success) {
          const dedupedDeals = deduplicateDeals(dealsData.data || []);
          setDeals(dedupedDeals);
        }
      } catch (error) {
        console.error('刷新数据失败:', error);
        alert('刷新数据失败，请检查网络连接');
      } finally {
        setRefreshing(false);
      }
    }, []),

    // 其他handlers保持不变，但在添加数据时确保去重
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
            setCreators(prev => deduplicateCreators([...prev, creatorData]));
          } else {
            setCreators(prev => deduplicateCreators(prev.map(creator => 
              creator.id === creatorData.id ? creatorData : creator
            )));
          }
          alert(isNew ? '博主添加成功' : '博主信息更新成功');
          closeModal('edit');
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
    
    // 统一数据格式
    const requestData = isNew 
      ? dealData 
      : {
          dealId: dealData.id,
          updatedData: dealData
        };

    console.log('Sending deal data:', requestData);

    const response = await fetch('/api/deals', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('API error:', result);
      throw new Error(result.error || result.message || '保存失败');
    }

    if (result.success) {
      if (isNew) {
        setDeals(prev => deduplicateDeals([...prev, dealData]));
      } else {
        setDeals(prev => deduplicateDeals(prev.map(deal => 
          deal.id === dealData.id ? dealData : deal
        )));
      }
      alert(isNew ? '业配记录添加成功' : '业配记录更新成功');
      closeModal('deal');
    } else {
      throw new Error(result.message || '保存失败');
    }
  } catch (error) {
    console.error('保存业配记录失败:', error);
    alert(error instanceof Error ? error.message : '保存失败，请重试');
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
            setAccounts(prev => deduplicateAccounts([...prev, accountData]));
            
            // 延迟刷新确保同步
            setTimeout(async () => {
              setRefreshing(true);
              try {
                const accountsRes = await fetch('/api/accounts');
                const accountsData = await accountsRes.json();
                if (accountsData.success) {
                  setAccounts(deduplicateAccounts(accountsData.data || []));
                }
              } catch (error) {
                console.error('刷新账号数据失败:', error);
              } finally {
                setRefreshing(false);
              }
            }, 2000);
          } else {
            setAccounts(prev => deduplicateAccounts(prev.map(account => 
              account.creatorId === accountData.creatorId && account.platform === accountData.platform
                ? accountData : account
            )));
          }
          alert(isNew ? '账号添加成功' : '账号信息更新成功');
          closeModal('account');
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
    sortConfigs,
    
    // 计算属性
    filteredData: filteredAndSortedData.filtered,
    paginatedData: filteredAndSortedData.paginated,
    processedData,
    
    // 方法
    setActiveTab,
    setSearchTerm,
    setStatusFilter,
    setPagination: setPaginationForType,
    handleSort,
    handlers,
  };
}
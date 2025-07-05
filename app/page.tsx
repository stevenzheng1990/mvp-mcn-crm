// app/page.tsx
// 🔧 修复版本 - 添加缺失的Hook返回值

'use client';

import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import { useDataManagement } from './hooks/useDataManagement';
import { EditModal, DealModal, AccountModal, ImportModal, ExportModal } from './components/Modals';
import type { ModalType } from './types';
import { CreatorDetailsModal } from './components/CreatorDetailsModal'; // 新增导入


export default function MCNManagement() {
  // 认证状态
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // 🔧 修复：添加缺失的Hook返回值
  const {
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
    sortConfigs, // 🆕 新增
    
    // 计算属性
    filteredData,
    paginatedData, // 🆕 新增 - 这是缺失的关键属性！
    processedData,
    
    // 方法
    setActiveTab,
    setSearchTerm,
    setStatusFilter,
    setPagination, // 🔧 这个已经在Hook中更名为setPaginationForType
    handleSort, // 🆕 新增
    handlers,
  } = useDataManagement(isAuthenticated);

  // 认证检查
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('mcn_authenticated');
    if (savedAuth === 'true') setIsAuthenticated(true);
    setIsAuthLoading(false);
  }, []);

  // 登录处理
  const handleLogin = (password: string) => {
    if (password === '2024sfzs@MVP') {
      setIsAuthenticated(true);
      sessionStorage.setItem('mcn_authenticated', 'true');
    }
  };

  // 登出处理
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('mcn_authenticated');
    handlers.resetData();
    setActiveTab('overview');
  };

  // 加载中状态
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--morandi-cloud)] mx-auto"></div>
          <p className="mt-4 text-[var(--morandi-mist)]">加载中...</p>
        </div>
      </div>
    );
  }

  // 未认证状态
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // 已认证状态 - 主应用
  return (
    <div className="min-h-screen bg-morandi-gradient">
      <Dashboard
        // 数据
        creators={creators}
        accounts={accounts}
        deals={deals}
        filteredData={filteredData}
        paginatedData={paginatedData} // 🆕 传递分页数据
        processedData={processedData}
        
        // 状态
        activeTab={activeTab}
        loading={loading}
        refreshing={refreshing}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        pagination={pagination}
        sortConfigs={sortConfigs} // 🆕 传递排序配置
        
        // 方法
        onTabChange={setActiveTab}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
        setPaginationForType={setPagination} // 🔧 使用Hook返回的方法名
        handleSort={handleSort} // 🆕 传递排序处理函数
        onLogout={handleLogout}
        onOpenModal={handlers.openModal}
        onRefresh={handlers.refreshData}
        onDeleteCreator={handlers.deleteCreator}
        onDeleteAccount={handlers.deleteAccount}
        onDeleteDeal={handlers.deleteDeal} 
        onViewCreatorDetails={handlers.viewCreatorDetails}
      />
      
      {/* 模态框组件保持不变 */}
      <EditModal
        isOpen={modals.edit.open}
        isNew={modals.edit.isNew}
        creator={modals.edit.data}
        onClose={() => handlers.closeModal('edit')}
        onSave={handlers.saveCreator}
      />

      <DealModal
        isOpen={modals.deal.open}
        isNew={modals.deal.isNew}
        deal={modals.deal.data}
        creators={creators}
        onClose={() => handlers.closeModal('deal')}
        onSave={handlers.saveDeal}
      />

      <AccountModal
        isOpen={modals.account.open}
        isNew={modals.account.isNew}
        account={modals.account.data}
        creators={creators}
        onClose={() => handlers.closeModal('account')}
        onSave={handlers.saveAccount}
      />

      <ImportModal
        isOpen={modals.import.open}
        onClose={() => handlers.closeModal('import')}
        onImportSuccess={handlers.refreshData}
      />

      <ExportModal
        isOpen={modals.export.open}
        onClose={() => handlers.closeModal('export')}
        creators={creators}
        accounts={accounts}
        deals={deals}
      />
      <CreatorDetailsModal
        isOpen={modals.details.open}
        onClose={() => handlers.closeModal('details')}
        creator={modals.details.data}
        accounts={accounts}
        deals={deals}
      />
    </div>
  );
}
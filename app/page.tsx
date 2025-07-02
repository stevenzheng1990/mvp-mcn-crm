'use client';

'use client';

import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import { useDataManagement } from './hooks/useDataManagement';
import { EditModal, DealModal, AccountModal, ImportModal, ExportModal } from './components/Modals';
import type { ModalType } from './types';

export default function MCNManagement() {
  // 认证状态
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // 使用自定义 Hook 管理所有数据和业务逻辑
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
    
    // 计算属性
    filteredData,
    processedData,
    
    // 方法
    setActiveTab,
    setSearchTerm,
    setStatusFilter,
    setPagination,
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
        processedData={processedData}
        
        // 状态
        activeTab={activeTab}
        loading={loading}
        refreshing={refreshing}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        pagination={pagination}
        
        // 方法
        onTabChange={setActiveTab}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
        onPaginationChange={setPagination}
        onLogout={handleLogout}
        onOpenModal={handlers.openModal}
        onRefresh={handlers.refresh}
        onDeleteCreator={handlers.deleteCreator}
        onDeleteAccount={handlers.deleteAccount}
        onDeleteDeal={handlers.deleteDeal}
      />

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
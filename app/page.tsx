// app/page.tsx
// 🔧 完整修改版本 - 保留所有原有功能，仅添加着陆页

'use client';

import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import LandingPage from './components/LandingPage'; // 🆕 新增：着陆页组件
import { useDataManagement } from './hooks/useDataManagement';
import { EditModal, DealModal, AccountModal, ImportModal, ExportModal } from './components/Modals';
import type { ModalType } from './types';
import { CreatorDetailsModal } from './components/CreatorDetailsModal';

// 🆕 新增：页面状态类型
type PageState = 'landing' | 'login' | 'dashboard';

export default function MCNManagement() {
  // 🆕 新增：页面状态管理
  const [currentPage, setCurrentPage] = useState<PageState>('landing');
  
  // 原有：认证状态
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // 原有：完整的Hook返回值（保持不变）
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
    sortConfigs,
    
    // 计算属性
    filteredData,
    paginatedData,
    processedData,
    
    // 方法
    setActiveTab,
    setSearchTerm,
    setStatusFilter,
    setPagination,
    handleSort,
    handlers,
  } = useDataManagement(isAuthenticated);

  // 原有：认证检查（保持不变）
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('mcn_authenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      setCurrentPage('dashboard'); // 🔧 修改：如果已登录，直接跳转到仪表板
    }
    setIsAuthLoading(false);
  }, []);

  // 🆕 新增：从着陆页导航到登录页
  const handleNavigateToSystem = () => {
    setCurrentPage('login');
  };

  // 🔧 修改：登录处理 - 添加页面跳转
  const handleLogin = (password: string) => {
    if (password === '2024sfzs@MVP') {
      setIsAuthenticated(true);
      setCurrentPage('dashboard'); // 🆕 新增：登录成功后跳转到仪表板
      sessionStorage.setItem('mcn_authenticated', 'true');
    }
  };

  // 🔧 修改：登出处理 - 返回着陆页
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('landing'); // 🔧 修改：登出后返回着陆页而不是登录页
    sessionStorage.removeItem('mcn_authenticated');
    handlers.resetData();
    setActiveTab('overview');
  };

  // 原有：加载中状态（保持不变）
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

  // 🆕 新增：根据页面状态渲染不同组件
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigateToSystem={handleNavigateToSystem} />;
      
      case 'login':
        return <LoginForm onLogin={handleLogin} />;
      
      case 'dashboard':
        // 原有：完整的仪表板渲染逻辑（保持不变）
        return (
          <div className="min-h-screen bg-morandi-gradient">
            <Dashboard
              // 原有：数据props（保持不变）
              creators={creators}
              accounts={accounts}
              deals={deals}
              filteredData={filteredData}
              paginatedData={paginatedData}
              processedData={processedData}
              
              // 原有：状态props（保持不变）
              activeTab={activeTab}
              loading={loading}
              refreshing={refreshing}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              pagination={pagination}
              sortConfigs={sortConfigs}
              
              // 原有：方法props（保持不变）
              onTabChange={setActiveTab}
              onSearchChange={setSearchTerm}
              onStatusFilterChange={setStatusFilter}
              setPaginationForType={setPagination}
              handleSort={handleSort}
              onLogout={handleLogout} // 🔧 修改：使用新的登出处理函数
              onOpenModal={handlers.openModal}
              onRefresh={handlers.refreshData}
              onDeleteCreator={handlers.deleteCreator}
              onDeleteAccount={handlers.deleteAccount}
              onDeleteDeal={handlers.deleteDeal} 
              onViewCreatorDetails={handlers.viewCreatorDetails}
            />
            
            {/* 原有：所有模态框组件（保持不变） */}
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
      
      default:
        return <LandingPage onNavigateToSystem={handleNavigateToSystem} />;
    }
  };

  // 🆕 新增：主渲染逻辑
  return (
    <main>
      {renderCurrentPage()}
    </main>
  );
}
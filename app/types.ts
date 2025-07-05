// 数据模型类型定义
export interface Creator {
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

export interface Account {
  creatorId: string;
  platform: string;
  link: string;
  followers: number;
  price: number;
  updateDate: string;
}

export interface Deal {
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

// 模态框类型
export type ModalType = 'edit' | 'deal' | 'import' | 'export' | 'account' | 'details';

// 处理后的数据类型
export interface ProcessedData {
  stats: {
    totalCreators: number;
    totalFollowers: number;
    totalRevenue: number;
    totalDeals: number;
  };
  monthlyData: {
    deals: Deal[];
    revenue: number;
    pendingTransfers: Deal[];
    overdueTransfers: Deal[];
  };
  chartData: {
    revenue: Array<{ name: string; value: number }>;
    status: Array<{ name: string; value: number }>;
    category: Array<{ name: string; value: number }>;
    platform: Array<{ name: string; value: number }>;
  };
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分页类型
export interface Pagination {
  page: number;
  size: number;
}

// 模态框状态类型
export interface ModalState<T = any> {
  open: boolean;
  isNew: boolean;
  data: T | null;
}

// 导入预览结果类型
export interface ImportPreviewResult {
  success: boolean;
  data: any[];
  totalRows: number;
  validRows: number;
  warnings?: string[];
}
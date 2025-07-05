# MCN CRM 管理系统

## 项目概述

十方众声 MCN (Mega Volume Production) 管理系统是一个专为MCN机构设计的博主管理CRM系统。系统采用Next.js 14构建，使用Google Sheets作为数据存储，提供博主信息管理、平台账号管理和业配记录跟踪等核心功能。

## 技术架构

### 技术栈
- **前端框架**: Next.js 14.0.0 + React 18.2.0
- **开发语言**: TypeScript 5.2.2
- **样式方案**: Tailwind CSS 3.3.5
- **数据存储**: Google Sheets API
- **图表库**: Recharts 2.8.0
- **图标库**: Lucide React
- **数据处理**: XLSX, PapaParse

### 项目结构
```
mvp-mcn-crm/
├── app/                      # Next.js 应用目录
│   ├── api/                  # API 路由
│   │   ├── accounts/         # 账号管理 API
│   │   ├── creators/         # 博主管理 API
│   │   ├── deals/            # 业配记录 API
│   │   ├── export/           # 数据导出 API
│   │   └── import/           # 数据导入 API
│   ├── components/           # React 组件
│   │   ├── Dashboard.tsx     # 主仪表板组件
│   │   ├── LoginForm.tsx     # 登录表单组件
│   │   └── Modals.tsx        # 各类模态框组件
│   ├── hooks/                # 自定义 Hooks
│   │   ├── useDataManagement.ts  # 数据管理主Hook
│   │   └── useDataProcessing.ts  # 数据处理Hook
│   ├── types.ts              # TypeScript 类型定义
│   ├── globals.css           # 全局样式
│   ├── layout.tsx            # 应用布局
│   ├── page.tsx              # 主页面
│   └── ClientProvider.tsx    # 客户端提供器
├── lib/                      # 工具库
│   ├── googleSheets.ts       # Google Sheets 服务
│   └── utils.ts              # 通用工具函数
├── public/                   # 静态资源
│   └── mvplogo.png          # 公司Logo
├── package.json              # 项目依赖
├── tailwind.config.js        # Tailwind 配置
└── .env.local               # 环境变量（需创建）
```

## 核心功能

### 1. 数据概览
- 实时统计数据展示（博主总数、粉丝总量、收入等）
- 月度数据分析（业配统计、待转账提醒）
- 多维度数据图表（收入趋势、博主分布、平台占比）

### 2. 博主管理
- 博主信息录入与编辑
- 合同状态跟踪
- 面试记录管理
- 批量数据导入导出

### 3. 账号管理
- 多平台账号信息维护
- 粉丝数据跟踪
- 报价管理
- 账号链接管理

### 4. 业配记录
- 业配订单管理
- 转账状态跟踪
- 收入分成计算
- 逾期提醒功能

## 数据模型

### Creator（博主）
```typescript
{
  id: string;                // 博主ID
  realName: string;          // 真实姓名
  wechatName: string;        // 微信名
  contactMethod: string;     // 联系方式
  city: string;              // 所在城市
  inGroup: string;           // 是否在群
  interviewStatus: string;   // 面试状态
  interviewer: string;       // 面试人
  interviewDate: string;     // 面试日期
  contractStatus: string;    // 签约状态
  contractStartDate: string; // 合同开始日期
  contractEndDate: string;   // 合同结束日期
  commission: number;        // 分成比例
  category: string;          // 账号类别
  notes: string;             // 备注
  transferAccount: string;   // 转账账户
}
```

### Account（账号）
```typescript
{
  creatorId: string;   // 博主ID
  platform: string;    // 平台名称
  link: string;        // 账号链接
  followers: number;   // 粉丝数
  price: number;       // 报价
  updateDate: string;  // 更新日期
}
```

### Deal（业配）
```typescript
{
  id: string;              // 业配ID
  creatorId: string;       // 博主ID
  partner: string;         // 合作伙伴
  type: string;            // 业配类型
  date: string;            // 业配日期
  channel: string;         // 渠道
  amount: number;          // 金额
  transferCycle: string;   // 转账周期
  transferDate: string;    // 转账日期
  transferStatus: string;  // 转账状态
  receivedAmount: number;  // 已收金额
  companyShare: number;    // 公司分成
  creatorShare: number;    // 博主分成
  unallocated: string;     // 未分配说明
  informalDetails: string; // 非正式备注
}
```

## 关键特性

### 设计风格
- 采用莫兰迪色系设计，营造专业优雅的视觉体验
- 响应式布局，支持多设备访问
- 流畅的动画过渡效果

### 数据管理
- 实时数据同步与刷新
- 支持搜索、筛选和排序
- 分页加载优化性能
- 批量导入导出功能

### 安全特性
- 密码保护登录（默认密码：2024sfzs@MVP）
- Session认证管理
- API请求验证

## 部署配置

### 环境变量
在项目根目录创建 `.env.local` 文件：

```env
# Google Sheets 配置
GOOGLE_SHEET_ID=your_google_sheet_id
GOOGLE_SHEETS_CLIENT_EMAIL=your_service_account_email
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Google Sheets 设置
系统需要包含以下三个工作表：
1. **博主信息 (Creators)** - 存储博主基本信息
2. **平台账号 (Accounts)** - 存储账号数据
3. **业配记录 (Deals)** - 存储业配订单

### 运行步骤
```bash
# 安装依赖
npm install

# 开发环境运行
npm run dev

# 生产环境构建
npm run build
npm run start
```

## 核心组件说明

### Dashboard.tsx
主仪表板组件，负责：
- 页面布局和导航
- 数据展示和图表渲染
- 用户交互处理

### useDataManagement.ts
核心数据管理Hook，提供：
- 数据状态管理
- API调用封装
- 数据过滤、排序和分页
- 模态框状态控制

### googleSheets.ts
Google Sheets服务封装：
- 认证初始化
- 数据读写操作
- 错误处理

## 维护指南

### 添加新功能
1. 在 `types.ts` 中定义数据类型
2. 在 `api/` 目录创建对应的API路由
3. 在 `components/` 中创建UI组件
4. 在 `useDataManagement.ts` 中添加状态管理

### 修改样式
- 全局样式在 `globals.css` 中定义
- 组件样式使用Tailwind工具类
- 自定义颜色在 `tailwind.config.js` 中配置

### 数据结构变更
1. 更新 Google Sheets 表格结构
2. 修改对应的类型定义
3. 更新API路由中的数据映射
4. 调整前端组件的数据展示

## 注意事项

1. **数据同步**：系统直接操作Google Sheets，大量数据操作可能有延迟
2. **并发控制**：避免多用户同时编辑同一数据
3. **数据备份**：定期备份Google Sheets数据
4. **API限制**：注意Google Sheets API的调用限制
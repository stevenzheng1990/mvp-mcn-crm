# 十方众声 MCN 管理系统

基于 Next.js 开发的 MCN 博主管理系统，集成 Google Sheets 作为数据存储。

## 项目结构

```
mvp-mcn-crm/
├── app/                          # Next.js App Router
│   ├── api/                      # API 路由
│   │   ├── creators/             # 博主管理 API
│   │   ├── accounts/             # 平台账号 API
│   │   ├── deals/                # 业配记录 API
│   │   └── import/               # 数据导入 API
│   │       ├── preview/          # 导入预览
│   │       └── creators/         # 博主批量导入
│   ├── globals.css               # 全局样式
│   ├── layout.tsx                # 根布局组件
│   └── page.tsx                  # 主应用页面
├── lib/                          # 工具库
│   └── googleSheets.ts           # Google Sheets API 封装
├── .env.local                    # 环境变量 (需手动创建)
├── next.config.js                # Next.js 配置
├── tailwind.config.js            # Tailwind CSS 配置
└── package.json                  # 项目依赖
```

## 核心功能模块

### 1. 数据概览 (`page.tsx` - overview tab)
- 统计卡片：博主数量、粉丝总数、月度营收、业配数量
- 图表展示：营收趋势、业配状态分布、赛道分布、平台分布
- 财务提醒：待转账和逾期转账警告

### 2. 博主管理 (`page.tsx` - creators tab)
- 博主列表展示和分页
- 搜索和筛选功能
- 在线编辑博主信息
- 批量导入 Excel 数据

### 3. 账号管理 (`page.tsx` - accounts tab)
- 平台账号信息展示
- 粉丝数和报价统计

### 4. 业配记录 (`page.tsx` - deals tab)
- 业配记录的 CRUD 操作
- 财务计算（自动分成计算）
- 转账状态追踪
- 逾期检测和提醒

### 5. 数据导入导出
- Excel 文件批量导入博主信息
- 多格式数据导出 (JSON/Excel/CSV)
- 数据验证和错误处理

## 数据模型

### 博主信息 (Creators)
```typescript
interface Creator {
  id: string;                    // 博主ID (主键)
  realName: string;              // 真实姓名
  wechatName: string;            // 微信账号名
  contactMethod: string;         // 建联方式
  city: string;                  // 所在城市
  inGroup: string;               // 是否在商单群
  interviewStatus: string;       // 面试情况
  interviewer: string;           // 面试人
  interviewDate: string;         // 面试日期
  contractStatus: string;        // 签约情况
  contractStartDate: string;     // 合同开始日期
  contractEndDate: string;       // 合同结束日期
  commission: number;            // 分成比例 (0-1)
  category: string;              // 账号类别
  notes: string;                 // 备注
  transferAccount: string;       // 转账账户信息
}
```

### 平台账号 (Accounts)
```typescript
interface Account {
  creatorId: string;             // 博主ID (外键)
  platform: string;             // 平台名称
  link: string;                  // 账号链接
  followers: number;             // 粉丝数
  price: number;                 // 平台报价
  updateDate: string;            // 数据更新日期
}
```

### 业配记录 (Deals)
```typescript
interface Deal {
  id: string;                    // 合作ID (主键)
  creatorId: string;             // 博主ID (外键)
  partner: string;               // 合作方
  type: string;                  // 业配类型
  date: string;                  // 广告日期
  channel: string;               // 制定渠道
  amount: number;                // 合作总金额
  transferCycle: string;         // 转账周期
  transferDate: string;          // 应转账日期
  transferStatus: string;        // 转账状态
  receivedAmount: number;        // 已收金额
  companyShare: number;          // 公司分成
  creatorShare: number;          // 博主分成
  unallocated: string;           // 未分配比例/金额
  informalDetails: string;       // 业配详情
}
```

## API 接口

### GET /api/creators
获取博主列表，返回格式化的博主数据

### PUT /api/creators
更新博主信息，需要 `creatorId` 和 `updatedData`

### GET /api/accounts
获取平台账号列表

### GET /api/deals
获取业配记录列表

### POST /api/deals
创建新业配记录

### PUT /api/deals
更新业配记录

### POST /api/import/preview
预览导入文件，验证数据格式

### POST /api/import/creators
批量导入博主数据

## 数据流

1. **数据存储**：Google Sheets 作为数据库
2. **数据读取**：`lib/googleSheets.ts` → API 路由 → 前端组件
3. **数据更新**：前端编辑 → API 路由 → Google Sheets
4. **数据同步**：实时双向同步，编辑后立即生效

## 关键文件说明

### `lib/googleSheets.ts`
- Google Sheets API 的封装类
- 提供 CRUD 操作方法
- 处理数据格式转换和字段映射
- 单例模式，避免重复实例化

### `app/page.tsx`
- 主应用组件，包含所有功能模块
- 状态管理：使用 React useState 管理数据
- 组件内嵌：EditModal 和 DealModal 组件直接定义在文件内
- 数据处理：包含搜索、筛选、统计计算逻辑

### API 路由 (`app/api/**/route.ts`)
- 遵循 Next.js App Router 规范
- 错误处理：统一的错误响应格式
- 数据验证：输入参数验证和格式检查
- 日志记录：console.log 记录关键操作

## 技术栈

- **框架**：Next.js 14 (App Router)
- **UI**：React 18 + Tailwind CSS
- **图表**：Recharts
- **图标**：Lucide React
- **数据存储**：Google Sheets API
- **文件处理**：xlsx (Excel 导入)
- **类型检查**：TypeScript

## 环境变量

```bash
# .env.local
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL="service-account@project.iam.gserviceaccount.com"
GOOGLE_SHEET_ID="Google表格ID"
```

## 开发注意事项

### 1. Google Sheets 权限
- 服务账号需要对目标表格有编辑权限
- 私钥中的 `\n` 必须保留，不能删除

### 2. 数据格式
- 日期格式统一使用 `YYYY-MM-DD`
- 分成比例存储为 0-1 之间的小数
- 金额字段去除货币符号，存储为数字

### 3. 性能考虑
- 大数据表格显示限制为前 50 条
- 图表数据在前端计算，避免重复 API 调用
- 使用 React 状态管理，减少不必要的重新渲染

### 4. 错误处理
- API 错误统一返回 `{success: false, error: string, message: string}` 格式
- 前端使用 try-catch 处理异步操作
- 用户操作失败时显示友好提示信息

### 5. 扩展开发
- 新增功能优先考虑在现有组件内添加
- 大型功能模块可考虑拆分为独立组件文件
- API 扩展遵循 RESTful 设计原则
- 数据库扩展需要在 Google Sheets 中添加新工作表

## 部署

推荐使用 Vercel 部署：
1. 连接 GitHub 仓库
2. 配置环境变量
3. 自动部署和 HTTPS

## 维护

- 定期检查 Google Sheets API 配额使用情况
- 监控系统性能和错误日志
- 根据业务需求迭代功能
import { google } from 'googleapis';

// Google Sheets API配置
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

class GoogleSheetsService {
  private sheets: any;
  private auth: any;

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      // 从环境变量读取配置
      const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
      const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;

      if (!privateKey || !clientEmail) {
        throw new Error('Google Sheets credentials not found in environment variables');
      }

      this.auth = new google.auth.GoogleAuth({
        credentials: {
          type: 'service_account',
          private_key: privateKey,
          client_email: clientEmail,
        },
        scopes: SCOPES,
      });

      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    } catch (error) {
      console.error('Failed to initialize Google Sheets auth:', error);
      throw error;
    }
  }

  // 读取数据
  async readSheet(sheetName: string, range?: string): Promise<any[][]> {
    try {
      const spreadsheetId = process.env.GOOGLE_SHEET_ID;
      if (!spreadsheetId) {
        throw new Error('Google Sheet ID not found in environment variables');
      }

      const fullRange = range ? `${sheetName}!${range}` : sheetName;
      
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: fullRange,
      });

      return response.data.values || [];
    } catch (error) {
      console.error(`Error reading sheet ${sheetName}:`, error);
      throw error;
    }
  }

  // 写入数据
  async writeSheet(sheetName: string, range: string, values: any[][]): Promise<void> {
    try {
      const spreadsheetId = process.env.GOOGLE_SHEET_ID;
      if (!spreadsheetId) {
        throw new Error('Google Sheet ID not found in environment variables');
      }

      await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!${range}`,
        valueInputOption: 'RAW',
        requestBody: {
          values,
        },
      });
    } catch (error) {
      console.error(`Error writing to sheet ${sheetName}:`, error);
      throw error;
    }
  }

  // 追加数据
  async appendSheet(sheetName: string, values: any[][]): Promise<void> {
    try {
      const spreadsheetId = process.env.GOOGLE_SHEET_ID;
      if (!spreadsheetId) {
        throw new Error('Google Sheet ID not found in environment variables');
      }

      await this.sheets.spreadsheets.values.append({
        spreadsheetId,
        range: sheetName,
        valueInputOption: 'RAW',
        requestBody: {
          values,
        },
      });
    } catch (error) {
      console.error(`Error appending to sheet ${sheetName}:`, error);
      throw error;
    }
  }

  // 清空数据
  async clearSheet(sheetName: string, range?: string): Promise<void> {
    try {
      const spreadsheetId = process.env.GOOGLE_SHEET_ID;
      if (!spreadsheetId) {
        throw new Error('Google Sheet ID not found in environment variables');
      }

      const fullRange = range ? `${sheetName}!${range}` : sheetName;

      await this.sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: fullRange,
      });
    } catch (error) {
      console.error(`Error clearing sheet ${sheetName}:`, error);
      throw error;
    }
  }

  // 获取博主信息
  async getCreators() {
    const data = await this.readSheet('博主信息 (Creators)');
    if (data.length === 0) return [];

    const headers = data[0];
    return data.slice(1).map(row => {
      const creator: any = {};
      headers.forEach((header, index) => {
        creator[this.mapHeaderToField(header)] = row[index] || '';
      });
      return creator;
    });
  }

  // 获取平台账号信息
  async getAccounts() {
    const data = await this.readSheet('平台账号 (Accounts)');
    if (data.length === 0) return [];

    const headers = data[0];
    return data.slice(1).map(row => {
      const account: any = {};
      headers.forEach((header, index) => {
        account[this.mapHeaderToField(header)] = row[index] || '';
      });
      return account;
    });
  }

  // 获取业配记录
  async getDeals() {
    const data = await this.readSheet('业配记录 (Deals)');
    if (data.length === 0) return [];

    const headers = data[0];
    return data.slice(1).map(row => {
      const deal: any = {};
      headers.forEach((header, index) => {
        deal[this.mapHeaderToField(header)] = row[index] || '';
      });
      return deal;
    });
  }

  // 更新博主信息
  async updateCreator(creatorId: string, updatedData: any) {
    try {
      const data = await this.readSheet('博主信息 (Creators)');
      if (data.length === 0) throw new Error('No data found in sheet');

      const headers = data[0];
      const rows = data.slice(1);
      
      // 找到要更新的行
      const rowIndex = rows.findIndex(row => row[0] === creatorId);
      if (rowIndex === -1) {
        throw new Error(`Creator with ID ${creatorId} not found`);
      }

      // 构建更新的行数据
      const updatedRow = headers.map(header => {
        const field = this.mapHeaderToField(header);
        return updatedData[field] !== undefined ? updatedData[field] : '';
      });

      // 更新到Google Sheets (rowIndex + 2 因为要跳过标题行，且索引从1开始)
      const range = `博主信息 (Creators)!A${rowIndex + 2}:${String.fromCharCode(65 + headers.length - 1)}${rowIndex + 2}`;
      await this.writeSheet('博主信息 (Creators)', range.split('!')[1], [updatedRow]);
      
      return true;
    } catch (error) {
      console.error('Error updating creator:', error);
      throw error;
    }
  }

  // 字段映射（中文表头到英文字段名）
  private mapHeaderToField(header: string): string {
    const mapping: { [key: string]: string } = {
      '博主ID': 'id',
      '真实姓名': 'realName',
      '微信账号名': 'wechatName',
      '建联方式': 'contactMethod',
      '所在城市': 'city',
      '在DC商单群': 'inGroup',
      '面试情况': 'interviewStatus',
      '面试人': 'interviewer',
      '面试日期': 'interviewDate',
      '签约情况': 'contractStatus',
      '合同开始日期': 'contractStartDate',
      '合同结束日期': 'contractEndDate',
      '分成比例': 'commission',
      '账号类别': 'category',
      '备注': 'notes',
      '转账账户信息': 'transferAccount',
      '平台名称': 'platform',
      '账号链接': 'link',
      '粉丝数': 'followers',
      '平台报价': 'price',
      '数据更新日期': 'updateDate',
      '合作ID': 'dealId',
      '合作方': 'partner',
      '业配类型': 'type',
      '广告日期': 'date',
      '制定渠道': 'channel',
      '合作总金额': 'amount',
      '转账周期': 'transferCycle',
      '应转账日期': 'transferDate',
      '转账状态': 'transferStatus',
      '已收金额': 'receivedAmount',
      '公司分成': 'companyShare',
      '博主分成': 'creatorShare',
      '未分配比例/金额': 'unallocated',
      '非官方业配细节': 'informalDetails'
    };

    return mapping[header] || header.toLowerCase().replace(/\s+/g, '');
  }
}

// 创建单例实例
export const googleSheetsService = new GoogleSheetsService();
export default googleSheetsService;
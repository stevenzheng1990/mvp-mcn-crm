import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/googleSheets';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // 读取文件内容
    const buffer = await file.arrayBuffer();
    
    // 动态导入 xlsx
    const XLSX = await import('xlsx');
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    
    // 获取第一个工作表
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // 转换为JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (jsonData.length <= 1) {
      return NextResponse.json(
        { success: false, error: 'No data found in file' },
        { status: 400 }
      );
    }

    // 获取标题行和数据行
    const headers = jsonData[0] as string[];
    const dataRows = jsonData.slice(1);

    // 映射字段名
    const fieldMapping: { [key: string]: string } = {
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
      '转账账户信息': 'transferAccount'
    };

    // 获取现有博主数据，避免重复
    const existingCreators = await googleSheetsService.getCreators();
    const existingIds = new Set(existingCreators.map(creator => creator.id));

    // 处理数据
    const validRows = [];
    let addedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i] as (string | number)[];
      
      // 跳过空行
      if (!row || row.every(cell => !cell || cell.toString().trim() === '')) {
        continue;
      }

      const rowData: any = {};

      // 映射数据
      headers.forEach((header, index) => {
        const fieldName = fieldMapping[header];
        if (fieldName) {
          rowData[fieldName] = row[index] || '';
        }
      });

      // 验证必填字段
      if (!rowData.id || !rowData.city || !rowData.category) {
        continue; // 跳过无效数据
      }

      // 检查是否已存在
      if (existingIds.has(rowData.id)) {
        skippedCount++;
        continue;
      }

      // 处理分成比例
      if (rowData.commission) {
        const commission = parseFloat(rowData.commission.toString());
        if (!isNaN(commission) && commission >= 0 && commission <= 1) {
          rowData.commission = commission;
        } else {
          rowData.commission = 0;
        }
      } else {
        rowData.commission = 0;
      }

      // 处理日期格式
      if (rowData.interviewDate && rowData.interviewDate !== '') {
        const date = new Date(rowData.interviewDate);
        if (!isNaN(date.getTime())) {
          rowData.interviewDate = date.toISOString().split('T')[0];
        } else {
          rowData.interviewDate = '';
        }
      }

      // 构建要添加到Google Sheets的行数据
      const sheetRow = [
        rowData.id,
        rowData.realName || '',
        rowData.wechatName || '',
        rowData.contactMethod || '',
        rowData.city,
        rowData.inGroup || '',
        rowData.interviewStatus || '',
        rowData.interviewer || '',
        rowData.interviewDate || '',
        rowData.contractStatus || '',
        rowData.contractStartDate || '',
        rowData.contractEndDate || '',
        rowData.commission || '',
        rowData.category,
        rowData.notes || '',
        rowData.transferAccount || ''
      ];

      validRows.push(sheetRow);
      addedCount++;
    }

    // 批量添加到Google Sheets
    if (validRows.length > 0) {
      await googleSheetsService.appendSheet('博主信息 (Creators)', validRows);
    }

    return NextResponse.json({
      success: true,
      message: `成功导入 ${addedCount} 条数据，跳过 ${skippedCount} 条重复数据`,
      stats: {
        added: addedCount,
        skipped: skippedCount,
        total: addedCount + skippedCount
      }
    });

  } catch (error) {
    console.error('Error importing data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to import data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
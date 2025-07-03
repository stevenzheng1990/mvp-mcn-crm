import { NextRequest, NextResponse } from 'next/server';

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

    // 验证文件类型
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Please upload Excel file.' },
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
    
    if (jsonData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'File is empty' },
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

    const requiredFields = ['博主ID'];  // 只有博主ID是必填的
    const missingFields = requiredFields.filter(field => !headers.includes(field));
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing required columns: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // 处理数据
    const processedData = [];
    const errors = [];
    let validCount = 0;
    let invalidCount = 0;

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i] as (string | number)[];
      const rowData: any = {};
      
      // 跳过空行
      if (!row || row.every(cell => !cell || cell.toString().trim() === '')) {
        continue;
      }

      let isValid = true;
      const rowErrors = [];

      // 映射数据
      headers.forEach((header, index) => {
        const fieldName = fieldMapping[header];
        if (fieldName) {
          rowData[fieldName] = row[index] || '';
        }
      });

      // 验证必填字段 - 只有博主ID是必填的
      if (!rowData.id || rowData.id.toString().trim() === '') {
        rowErrors.push(`第${i + 2}行：博主ID不能为空`);
        isValid = false;
      }

      // 验证分成比例格式（如果有填写）
      if (rowData.commission) {
        const commission = parseFloat(rowData.commission.toString());
        if (isNaN(commission) || commission < 0 || commission > 1) {
          rowErrors.push(`第${i + 2}行：分成比例格式错误（应为0-1之间的小数）`);
          isValid = false;
        } else {
          rowData.commission = commission;
        }
      } else {
        rowData.commission = 0.7;  // 默认值
      }

      // 验证日期格式（如果有填写）
      if (rowData.interviewDate && rowData.interviewDate !== '') {
        const date = new Date(rowData.interviewDate);
        if (isNaN(date.getTime())) {
          rowErrors.push(`第${i + 2}行：面试日期格式错误`);
          isValid = false;
        } else {
          rowData.interviewDate = date.toISOString().split('T')[0];
        }
      }

      if (isValid) {
        validCount++;
        processedData.push(rowData);
      } else {
        invalidCount++;
        errors.push(...rowErrors);
      }
    }

    // 返回验证结果和预览数据
    return NextResponse.json({
      success: true,
      validation: {
        valid: validCount,
        invalid: invalidCount,
        errors: errors
      },
      preview: processedData.slice(0, 10), // 返回前10行作为预览
      total: processedData.length
    });

  } catch (error) {
    console.error('Error processing preview:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process file',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
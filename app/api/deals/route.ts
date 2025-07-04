import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/googleSheets';

export async function GET() {
  try {
    const deals = await googleSheetsService.getDeals();
    
    // 过滤掉空行和无效数据
    const validDeals = deals.filter(deal => 
      deal.dealId && deal.dealId.trim() !== ''
    );

    // 格式化数据
    const formattedDeals = validDeals.map(deal => ({
      id: deal.dealId || '',
      creatorId: deal.id || '',
      partner: deal.partner || '',
      type: deal.type || '',
      date: deal.date || '',
      channel: deal.channel || '',
      amount: deal.amount ? parseFloat(deal.amount.toString().replace(/[,¥$]/g, '')) || 0 : 0,
      transferCycle: deal.transferCycle || '',
      transferDate: deal.transferDate || '',
      transferStatus: deal.transferStatus || '',
      receivedAmount: deal.receivedAmount ? parseFloat(deal.receivedAmount.toString().replace(/[,¥$]/g, '')) || 0 : 0,
      companyShare: deal.companyShare ? parseFloat(deal.companyShare.toString().replace(/[,¥$]/g, '')) || 0 : 0,
      creatorShare: deal.creatorShare ? parseFloat(deal.creatorShare.toString().replace(/[,¥$]/g, '')) || 0 : 0,
      unallocated: deal.unallocated || '',
      informalDetails: deal.informalDetails || ''
    }));

    return NextResponse.json({
      success: true,
      data: formattedDeals,
      total: formattedDeals.length
    });

  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch deals data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const dealData = await request.json();
    
    // 添加详细的日志
    console.log('Received deal data:', dealData);
    
    // 修复验证逻辑：检查必填字段
    if (!dealData.creatorId || !dealData.creatorId.trim()) {
      return NextResponse.json(
        { success: false, error: 'Creator ID is required' },
        { status: 400 }
      );
    }
    
    if (!dealData.partner || !dealData.partner.trim()) {
      return NextResponse.json(
        { success: false, error: 'Partner is required' },
        { status: 400 }
      );
    }
    
    // 修复：amount 可以是 0，但必须是有效的数字
    if (dealData.amount === undefined || dealData.amount === null || isNaN(dealData.amount)) {
      return NextResponse.json(
        { success: false, error: 'Valid amount is required' },
        { status: 400 }
      );
    }

    // 构建要添加到Google Sheets的行数据
    const rowData = [
      dealData.id || '',
      dealData.creatorId || '',
      dealData.partner || '',
      dealData.type || '',
      dealData.date || '',
      dealData.channel || '',
      dealData.amount || 0,
      dealData.transferCycle || '',
      dealData.transferDate || '',
      dealData.transferStatus || '待转账',
      dealData.receivedAmount || 0,
      dealData.companyShare || 0,
      dealData.creatorShare || 0,
      dealData.unallocated || '',
      dealData.informalDetails || ''
    ];

    console.log('Row data to save:', rowData);

    await googleSheetsService.appendSheet('业配记录 (Deals)', [rowData]);
    
    return NextResponse.json({
      success: true,
      message: 'Deal created successfully'
    });

  } catch (error) {
    console.error('Error creating deal:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create deal',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { dealId, updatedData } = await request.json();
    
    if (!dealId) {
      return NextResponse.json(
        { success: false, error: 'Deal ID is required' },
        { status: 400 }
      );
    }

    // 读取现有数据
    const data = await googleSheetsService.readSheet('业配记录 (Deals)');
    if (data.length === 0) throw new Error('No data found in sheet');

    const headers = data[0];
    const rows = data.slice(1);
    
    // 找到要更新的行
    const rowIndex = rows.findIndex(row => row[0] === dealId);
    if (rowIndex === -1) {
      throw new Error(`Deal with ID ${dealId} not found`);
    }

    // 构建更新的行数据
    const updatedRow = [
      updatedData.id || dealId,
      updatedData.creatorId || '',
      updatedData.partner || '',
      updatedData.type || '',
      updatedData.date || '',
      updatedData.channel || '',
      updatedData.amount || 0,
      updatedData.transferCycle || '',
      updatedData.transferDate || '',
      updatedData.transferStatus || '待转账',
      updatedData.receivedAmount || 0,
      updatedData.companyShare || 0,
      updatedData.creatorShare || 0,
      updatedData.unallocated || '',
      updatedData.informalDetails || ''
    ];

    // 更新到Google Sheets
    const range = `A${rowIndex + 2}:${String.fromCharCode(65 + headers.length - 1)}${rowIndex + 2}`;
    await googleSheetsService.writeSheet('业配记录 (Deals)', range, [updatedRow]);
    
    return NextResponse.json({
      success: true,
      message: 'Deal updated successfully'
    });

  } catch (error) {
    console.error('Error updating deal:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update deal',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { dealId } = await request.json();
    
    if (!dealId) {
      return NextResponse.json(
        { success: false, error: 'Deal ID is required' },
        { status: 400 }
      );
    }

    // 读取现有数据
    const data = await googleSheetsService.readSheet('业配记录 (Deals)');
    if (data.length === 0) throw new Error('No data found in sheet');

    const rows = data.slice(1);
    
    // 找到要删除的行
    const rowIndex = rows.findIndex(row => row[0] === dealId);
    
    if (rowIndex === -1) {
      throw new Error(`Deal with ID ${dealId} not found`);
    }

    // 删除行（通过清空内容）
    const range = `A${rowIndex + 2}:O${rowIndex + 2}`;
    await googleSheetsService.clearSheet('业配记录 (Deals)', range);
    
    return NextResponse.json({
      success: true,
      message: 'Deal deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting deal:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete deal',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
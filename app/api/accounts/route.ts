import { NextResponse, NextRequest } from 'next/server';
import { googleSheetsService } from '@/lib/googleSheets';

export async function GET() {
  try {
    console.log('Fetching accounts from Google Sheets...');
    const accounts = await googleSheetsService.getAccounts();
    console.log('Raw accounts data:', accounts);
    
    // 注意：这里过滤的是 account.id（对应 Google Sheets 中的"博主ID"列）
    const validAccounts = accounts.filter(account => 
      account.id && account.id.trim() !== ''
    );
    console.log('Valid accounts after filtering:', validAccounts);

    const formattedAccounts = validAccounts.map(account => ({
      creatorId: account.id || '',  // 注意这里：把 id 映射到 creatorId
      platform: account.platform || '',
      link: account.link || '',
      followers: account.followers ? parseInt(account.followers.toString().replace(/,/g, ''), 10) || 0 : 0,
      price: account.price ? parseFloat(account.price.toString().replace(/[,¥$]/g, '')) || 0 : 0,
      updateDate: account.updateDate || ''
    }));

    console.log('Formatted accounts:', formattedAccounts);

    return NextResponse.json({
      success: true,
      data: formattedAccounts,
      total: formattedAccounts.length
    });

  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch accounts data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const accountData = await request.json();
    console.log('Received account data:', accountData);
    
    if (!accountData.creatorId || !accountData.platform) {
      return NextResponse.json(
        { success: false, error: 'Creator ID and platform are required' },
        { status: 400 }
      );
    }

    // 构建要保存到 Google Sheets 的数据
    // 顺序必须与 Google Sheets 中的列顺序一致
    const rowData = [
      accountData.creatorId,  // 第一列：博主ID
      accountData.platform || '',
      accountData.link || '',
      accountData.followers || 0,
      accountData.price || 0,
      accountData.updateDate || new Date().toISOString().split('T')[0]
    ];

    console.log('Row data to append:', rowData);

    await googleSheetsService.appendSheet('平台账号 (Accounts)', [rowData]);
    console.log('Successfully appended to Google Sheets');
    
    // 立即读取最新数据以验证
    const updatedAccounts = await googleSheetsService.getAccounts();
    console.log('Updated accounts count:', updatedAccounts.length);
    
    return NextResponse.json({
      success: true,
      message: 'Account created successfully'
    });

  } catch (error) {
    console.error('Error creating account:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create account',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { accountId, updatedData } = await request.json();
    console.log('Updating account:', accountId, updatedData);
    
    if (!accountId) {
      return NextResponse.json(
        { success: false, error: 'Account ID is required' },
        { status: 400 }
      );
    }

    // 解析 accountId (格式: creatorId-platform)
    const [creatorId, platform] = accountId.split('-');

    // 读取现有数据
    const data = await googleSheetsService.readSheet('平台账号 (Accounts)');
    if (data.length === 0) throw new Error('No data found in sheet');

    const headers = data[0];
    const rows = data.slice(1);
    
    // 找到要更新的行（第一列是博主ID）
    const rowIndex = rows.findIndex(row => 
      row[0] === creatorId && row[1] === platform
    );
    
    if (rowIndex === -1) {
      throw new Error(`Account for creator ${creatorId} on ${platform} not found`);
    }

    // 构建更新的行数据
    const updatedRow = [
      updatedData.creatorId,
      updatedData.platform,
      updatedData.link || '',
      updatedData.followers || 0,
      updatedData.price || 0,
      updatedData.updateDate || new Date().toISOString().split('T')[0]
    ];

    // 更新到Google Sheets
    const range = `A${rowIndex + 2}:F${rowIndex + 2}`;
    await googleSheetsService.writeSheet('平台账号 (Accounts)', range, [updatedRow]);
    
    return NextResponse.json({
      success: true,
      message: 'Account updated successfully'
    });

  } catch (error) {
    console.error('Error updating account:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update account',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { accountId } = await request.json();
    console.log('Deleting account:', accountId);
    
    if (!accountId) {
      return NextResponse.json(
        { success: false, error: 'Account ID is required' },
        { status: 400 }
      );
    }

    // 解析 accountId (格式: creatorId-platform)
    const [creatorId, platform] = accountId.split('-');

    // 读取现有数据
    const data = await googleSheetsService.readSheet('平台账号 (Accounts)');
    if (data.length === 0) throw new Error('No data found in sheet');

    const rows = data.slice(1);
    
    // 找到要删除的行
    const rowIndex = rows.findIndex(row => 
      row[0] === creatorId && row[1] === platform
    );
    
    if (rowIndex === -1) {
      throw new Error(`Account for creator ${creatorId} on ${platform} not found`);
    }

    // 删除行（通过清空内容）
    const range = `A${rowIndex + 2}:F${rowIndex + 2}`;
    await googleSheetsService.clearSheet('平台账号 (Accounts)', range);
    
    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete account',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
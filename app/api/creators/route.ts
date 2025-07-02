import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/googleSheets';

export async function GET() {
  try {
    const creators = await googleSheetsService.getCreators();
    
    // 过滤掉空行和无效数据
    const validCreators = creators.filter(creator => 
      creator.id && creator.id.trim() !== ''
    );

    // 格式化数据
    const formattedCreators = validCreators.map(creator => ({
      id: creator.id || '',
      realName: creator.realName || '',
      wechatName: creator.wechatName || '',
      contactMethod: creator.contactMethod || '',
      city: creator.city || '',
      inGroup: creator.inGroup || '',
      interviewStatus: creator.interviewStatus || '',
      interviewer: creator.interviewer || '',
      interviewDate: creator.interviewDate || '',
      contractStatus: creator.contractStatus || '',
      contractStartDate: creator.contractStartDate || '',
      contractEndDate: creator.contractEndDate || '',
      commission: creator.commission ? parseFloat(creator.commission) : 0,
      category: creator.category || '',
      notes: creator.notes || '',
      transferAccount: creator.transferAccount || ''
    }));

    return NextResponse.json({
      success: true,
      data: formattedCreators,
      total: formattedCreators.length
    });

  } catch (error) {
    console.error('Error fetching creators:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch creators data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { creatorId, updatedData } = await request.json();
    
    if (!creatorId) {
      return NextResponse.json(
        { success: false, error: 'Creator ID is required' },
        { status: 400 }
      );
    }

    await googleSheetsService.updateCreator(creatorId, updatedData);
    
    return NextResponse.json({
      success: true,
      message: 'Creator updated successfully'
    });

  } catch (error) {
    console.error('Error updating creator:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update creator',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const creatorData = await request.json();
    
    if (!creatorData.id) {
      return NextResponse.json(
        { success: false, error: 'Creator ID is required' },
        { status: 400 }
      );
    }

    const rowData = [
      creatorData.id,
      creatorData.realName || '',
      creatorData.wechatName || '',
      creatorData.contactMethod || '',
      creatorData.city || '',
      creatorData.inGroup || '',
      creatorData.interviewStatus || '',
      creatorData.interviewer || '',
      creatorData.interviewDate || '',
      creatorData.contractStatus || '',
      creatorData.contractStartDate || '',
      creatorData.contractEndDate || '',
      creatorData.commission || 0,
      creatorData.category || '',
      creatorData.notes || '',
      creatorData.transferAccount || ''
    ];

    await googleSheetsService.appendSheet('博主信息 (Creators)', [rowData]);
    
    return NextResponse.json({
      success: true,
      message: 'Creator created successfully'
    });

  } catch (error) {
    console.error('Error creating creator:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create creator',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

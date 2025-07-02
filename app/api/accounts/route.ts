import { NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/googleSheets';

export async function GET() {
  try {
    const accounts = await googleSheetsService.getAccounts();
    
    const validAccounts = accounts.filter(account => 
      account.id && account.id.trim() !== ''
    );

    const formattedAccounts = validAccounts.map(account => ({
      creatorId: account.id || '',
      platform: account.platform || '',
      link: account.link || '',
      followers: account.followers ? parseInt(account.followers.toString().replace(/,/g, ''), 10) || 0 : 0,
      price: account.price ? parseFloat(account.price.toString().replace(/[,¥$]/g, '')) || 0 : 0,
      updateDate: account.updateDate || ''
    }));

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

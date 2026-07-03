import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    const response = await axios.get(
      `${process.env.API_URL}/api/speczifikacziya-produktov?locale=${locale}`,
      {
        headers: {
          Accept: 'application/json',
        },
        timeout: 10000,
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error getting product specifications:', error);
    return NextResponse.json(
      { error: 'Failed to get product specifications' },
      { status: 500 }
    );
  }
}

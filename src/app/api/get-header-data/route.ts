import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get locale from search params
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    const response = await axios.get(
      `${process.env.API_URL}/api/header?populate[links][populate]=links&populate[logo][populate]=*&populate[contactButton][populate]=*&populate[locales][populate]=*&populate[logoMobile][populate]=*&locale=${locale}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      }
    );

    const res = NextResponse.json(response.data);

    return res;
  } catch (error) {
    console.error('Error getting header data:', error);
    return NextResponse.json({ error: 'Failed to get header data' }, { status: 500 });
  }
} 
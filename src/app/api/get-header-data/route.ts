import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('API route - full URL:', request.url);
    // Get locale from search params
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    console.log('API route - extracted locale:', locale);

    const response = await axios.get(
      `${process.env.API_URL}/api/header?populate[links][populate]=links&populate[logo][populate]=*&populate[contactButton][populate]=*&populate[locales][populate]=*&populate[logoMobile][populate]=*&locale=${locale}`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    const res = NextResponse.json(response.data);

    res.headers.set('Cache-Control', 'no-store');
    
    return res;
  } catch (error) {
    console.error('Error getting header data:', error);
    return NextResponse.json({ error: 'Failed to get header data' }, { status: 500 });
  }
} 
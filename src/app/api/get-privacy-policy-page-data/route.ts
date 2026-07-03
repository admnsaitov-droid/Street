import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // Cache for 5 minutes

export async function GET(request: NextRequest) {
  try {
    // Get locale from search params
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    const response = await axios.get(
      `${process.env.API_URL}/api/privacy-policy-page/get-privacy-policy-page-data?locale=${locale}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      }
    );

    const res = NextResponse.json(response.data);

    // Enable caching for 5 minutes
    res.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    
    return res;
  } catch (error) {
    console.error('Error getting home data:', error);
    return NextResponse.json({ error: 'Failed to get home data' }, { status: 500 });
  }
} 
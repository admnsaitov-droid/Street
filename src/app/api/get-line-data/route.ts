import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get locale from search params
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    const slug = searchParams.get('slug') || '';

    const response = await axios.get(
      `${process.env.API_URL}/api/lines/get-line?locale=${locale}&slug=${slug}`,
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
    console.error('Error getting home data:', error);
    return NextResponse.json({ error: 'Failed to get home data' }, { status: 500 });
  }
} 
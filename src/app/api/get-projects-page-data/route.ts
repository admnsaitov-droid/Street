import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get locale from search params
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    const response = await axios.get(
      `${process.env.API_URL}/api/projects-page/get-projects-page-data?locale=${locale}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error getting home data:', error);
    return NextResponse.json({ error: 'Failed to get home data' }, { status: 500 });
  }
} 
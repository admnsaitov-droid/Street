import { NextResponse, NextRequest } from 'next/server';
import { fetchStrapi } from '../_lib/fetchStrapi';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = encodeURIComponent(searchParams.get('locale') || 'en');

    // Served from the Next data cache (5 min, purged on Strapi publish) — see fetchStrapi.
    const data = await fetchStrapi(`/api/news-page/get-news-page-data?locale=${locale}`);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error getting news page data:', error);
    return NextResponse.json({ error: 'Failed to get news page data' }, { status: 500 });
  }
}

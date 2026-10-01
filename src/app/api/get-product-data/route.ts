import { NextResponse, NextRequest } from 'next/server';
import { fetchStrapi } from '../_lib/fetchStrapi';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = encodeURIComponent(searchParams.get('locale') || 'en');
    const slug = encodeURIComponent(searchParams.get('slug') || '');

    // Served from the Next data cache (5 min, purged on Strapi publish) — see fetchStrapi.
    const data = await fetchStrapi(`/api/products/get-product?locale=${locale}&slug=${slug}`);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error getting product data:', error);
    return NextResponse.json({ error: 'Failed to get product data' }, { status: 500 });
  }
}

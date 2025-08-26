import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mediaUrl = searchParams.get('url');
    
    if (!mediaUrl) {
      return new NextResponse('Missing URL parameter', { status: 400 });
    }

    // Fetch the media from your HTTP Strapi server
    const response = await fetch(mediaUrl);
    
    if (!response.ok) {
      return new NextResponse('Media not found', { status: 404 });
    }

    // Get the content type from the original response
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    
    // Stream the response back with proper headers
    const mediaBuffer = await response.arrayBuffer();
    
    return new NextResponse(mediaBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
      },
    });
    
  } catch (error) {
    console.error('Media proxy error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

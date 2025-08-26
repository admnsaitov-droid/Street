export const getMediaStrapiPath = (media: any) => {
    if (!media?.url) {
        console.warn('getMediaStrapiPath: No media URL provided', media);
        return '/placeholder.jpg'; // Fallback image
    }
    
    let baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
    if (!baseUrl) {
        console.error('getMediaStrapiPath: NEXT_PUBLIC_IMAGE_URL is not defined');
        return media.url; // Return relative URL as fallback
    }
    
    // Handle cases where media.url already includes the base URL
    if (media.url.startsWith('http')) {
        return media.url;
    }
    
    // Only add port if it's missing AND the URL doesn't already work
    // Remove this automatic port addition since it's causing issues
    // if (baseUrl === 'http://153.92.1.45' || baseUrl === 'https://153.92.1.45') {
    //     baseUrl = baseUrl + ':1337';
    // }
    
    const fullUrl = `${baseUrl}${media.url}`;
    
    // In production (HTTPS), use Next.js image proxy to avoid mixed content
    if (typeof window !== 'undefined' && window.location.protocol === 'https:' && baseUrl.startsWith('http:')) {
        console.log('🔄 Using Next.js image proxy to avoid mixed content');
        // Encode the HTTP URL so Next.js can proxy it over HTTPS
        const encodedUrl = encodeURIComponent(fullUrl);
        return `/_next/image?url=${encodedUrl}&w=1200&q=75`;
    }
    
    // Debug logging
    console.log('Image URL generated:', {
        mediaUrl: media.url,
        baseUrl,
        fullUrl,
        isProduction: typeof window !== 'undefined' && window.location.protocol === 'https:'
    });
    
    return fullUrl;
}
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
    
    // Fix incomplete base URL (missing port)
    if (baseUrl === 'http://153.92.1.45' || baseUrl === 'https://153.92.1.45') {
        baseUrl = baseUrl + ':1337';
    }
    
    // Force HTTPS in production to avoid mixed content errors
    if (typeof window !== 'undefined' && window.location.protocol === 'https:' && baseUrl.startsWith('http:')) {
        baseUrl = baseUrl.replace('http:', 'https:');
        console.warn('Converted HTTP to HTTPS for production:', baseUrl);
    }
    
    const fullUrl = `${baseUrl}${media.url}`;
    
    // Debug logging to track image URL generation
    console.log('Image URL generated:', {
        mediaUrl: media.url,
        originalBaseUrl: process.env.NEXT_PUBLIC_IMAGE_URL,
        correctedBaseUrl: baseUrl,
        fullUrl,
        isProduction: typeof window !== 'undefined' && window.location.protocol === 'https:',
        currentProtocol: typeof window !== 'undefined' ? window.location.protocol : 'unknown'
    });
    
    return fullUrl;
}
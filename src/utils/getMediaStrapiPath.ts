export const getMediaStrapiPath = (media: any) => {
    if (!media?.url) {
        console.warn('getMediaStrapiPath: No media URL provided', media);
        return '/placeholder.jpg'; // Fallback image
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
    if (!baseUrl) {
        console.error('getMediaStrapiPath: NEXT_PUBLIC_IMAGE_URL is not defined');
        return media.url; // Return relative URL as fallback
    }
    
    // Handle cases where media.url already includes the base URL
    if (media.url.startsWith('http')) {
        return media.url;
    }
    
    const fullUrl = `${baseUrl}${media.url}`;
    
    // Debug logging to track image URL generation
    console.log('Image URL generated:', {
        mediaUrl: media.url,
        baseUrl,
        fullUrl,
        mediaObject: media
    });
    
    return fullUrl;
}
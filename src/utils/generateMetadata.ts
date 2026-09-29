/**
 * @fileoverview Utility function to generate standardized metadata for pages
 * 
 * This function generates metadata for Next.js pages including:
 * 1. Basic meta tags (title, description, keywords)
 * 2. OpenGraph metadata for social sharing
 * 3. Twitter card metadata
 * 4. Canonical URL and alternates
 * 5. Author and publisher information
 * 
 * @param {MetadataProps} props - Configuration object containing:
 *   - title: Page title
 *   - description: Page description 
 *   - keywords: Meta keywords
 *   - url: Canonical URL
 *   - ogImage: OpenGraph image URL
 *   - twitterHandle: Twitter username
 *   - author: Content author
 *   - themeColor: Theme color
 *   - siteName: Site name
 * 
 * @returns {Metadata} Next.js Metadata object with configured meta tags
 */


import { Metadata } from 'next'

interface MetadataProps {
    title?: string;
    description?: string;
    keywords?: string;
    url?: string;
    ogImage?: string;
    twitterHandle?: string;
    author?: string;
    themeColor?: string;
    siteName?: string;
    locale?: string;
    ogType?: 'website' | 'article';
}

const BRAND_PREFIX = 'Street Barbell'

function formatTitle(title: string): string {
    return title.toLowerCase().startsWith(BRAND_PREFIX.toLowerCase())
        ? title
        : `${BRAND_PREFIX}: ${title}`
}

export function generateMetadata({
    title = 'Street Barbell',
    description = 'Street Barbell',
    keywords = 'Street Barbell',
    url = '',
    ogImage = '/open-graph.png',
    twitterHandle = '@streetbarbell',
    author = 'Street Barbell',
    themeColor = '#000',
    siteName = 'Street Barbell',
    locale = 'en_US',
    ogType = 'website',
}: MetadataProps): Metadata {
    const formattedTitle = formatTitle(title)
    return {
        title: formattedTitle,
        description,
        keywords,
        authors: [{ name: author }],
        creator: author,
        publisher: author,
        themeColor,
        metadataBase: url ? new URL(url) : null,
        alternates: {
            canonical: url || undefined,
            languages: {}, // Will be populated by hreflang utility
        },
        openGraph: {
            title: formattedTitle,
            description,
            url: url || undefined,
            siteName,
            images: [
                {
                    url: ogImage,
                    width: 1080,
                    height: 720,
                }
            ],
            locale: locale,
            type: ogType,
        },
        twitter: {
            card: 'summary_large_image',
            title: formattedTitle,
            description,
            site: twitterHandle,
            creator: twitterHandle,
            images: [ogImage],
        },
        icons: {
            icon: [
                { url: '/favicon.ico' },
                { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
                { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            ],
            apple: [
                { url: '/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
            ],
        },
        manifest: '/manifest.json',
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        verification: {
            // Add your verification codes here when available
            // google: 'your-google-verification-code',
            // bing: 'your-bing-verification-code',
        },
        other: {
            'distribution': 'web',
            'language': 'english',
            'revisit-after': '7 days',
            'rating': 'general',
        }
    }
}
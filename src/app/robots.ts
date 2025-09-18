import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASEURL || 'https://www.streetbarbell.com'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/_next/',
        '/api/',
        '/static/',
        '/server/',
        '/assets/',
        '/admin/',
        '/login/',
        '/dashboard/',
        '/cart/',
        '/checkout/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

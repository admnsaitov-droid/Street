import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASEURL || 'https://www.streetbarbell.com'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/login/',
        '/dashboard/',
        // The robot form's internal paths (ADR-0121); crawlers read it under /[locale].
        '/robot-doc/',
        '/*/robot-view/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

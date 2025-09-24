/**
 * @fileoverview Utility to generate JSON-LD structured data for SEO
 * 
 * This utility generates structured data in JSON-LD format for different content types:
 * 1. Organization schema for company information
 * 2. WebSite schema with search action
 * 3. BreadcrumbList schema for navigation
 * 4. Article schema for blog posts
 * 5. Product schema for products
 * 6. LocalBusiness schema for location-based content
 * 
 * @example
 * const organizationSchema = generateOrganizationSchema({
 *   name: 'Street Barbell',
 *   url: 'https://www.streetbarbell.com',
 *   logo: 'https://www.streetbarbell.com/logo.png'
 * })
 */

interface OrganizationData {
  name: string
  url: string
  logo?: string
  description?: string
  sameAs?: string[] // Social media URLs
  contactPoint?: {
    telephone?: string
    email?: string
    contactType?: string
  }
}

interface WebSiteData {
  name: string
  url: string
  description?: string
  potentialAction?: {
    target: string
    queryInput: string
  }
}

interface BreadcrumbItem {
  name: string
  url: string
}

interface ArticleData {
  headline: string
  description: string
  url: string
  datePublished: string
  dateModified?: string
  author?: {
    name: string
    type?: 'Person' | 'Organization'
  }
  publisher?: {
    name: string
    logo?: string
  }
  image?: string[]
}

interface ProductData {
  name: string
  description: string
  image?: string[]
  brand?: string
  sku?: string
  category?: string
  material?: string
  weight?: string
  dimensions?: string
  offers?: {
    price?: string
    currency?: string
    availability?: string
    url?: string
  }
}

export function generateOrganizationSchema(data: OrganizationData) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": data.name,
    "url": data.url,
    ...(data.logo && { "logo": data.logo }),
    ...(data.description && { "description": data.description }),
    ...(data.sameAs && { "sameAs": data.sameAs }),
    ...(data.contactPoint && {
      "contactPoint": {
        "@type": "ContactPoint",
        ...data.contactPoint
      }
    })
  }
}

export function generateWebSiteSchema(data: WebSiteData) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": data.name,
    "url": data.url,
    ...(data.description && { "description": data.description }),
    ...(data.potentialAction && {
      "potentialAction": {
        "@type": "SearchAction",
        "target": data.potentialAction.target,
        "query-input": data.potentialAction.queryInput
      }
    })
  }
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }
}

export function generateArticleSchema(data: ArticleData) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": data.headline,
    "description": data.description,
    "url": data.url,
    "datePublished": data.datePublished,
    ...(data.dateModified && { "dateModified": data.dateModified }),
    ...(data.author && {
      "author": {
        "@type": data.author.type || "Person",
        "name": data.author.name
      }
    }),
    ...(data.publisher && {
      "publisher": {
        "@type": "Organization",
        "name": data.publisher.name,
        ...(data.publisher.logo && {
          "logo": {
            "@type": "ImageObject",
            "url": data.publisher.logo
          }
        })
      }
    }),
    ...(data.image && { "image": data.image })
  }
}

export function generateProductSchema(data: ProductData) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": data.name,
    "description": data.description,
    ...(data.image && { "image": data.image }),
    ...(data.brand && {
      "brand": {
        "@type": "Brand",
        "name": data.brand
      }
    }),
    ...(data.sku && { "sku": data.sku }),
    ...(data.category && { "category": data.category }),
    ...(data.material && { "material": data.material }),
    ...(data.weight && { "weight": data.weight }),
    ...(data.dimensions && { "dimensions": data.dimensions }),
    ...(data.offers && {
      "offers": {
        "@type": "Offer",
        ...data.offers
      }
    })
  }
}

/**
 * Generates a script tag with JSON-LD structured data
 */
export function generateStructuredDataScript(schema: any): string {
  return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`
}

/**
 * Combines multiple schemas into a single JSON-LD script
 */
export function combineSchemas(schemas: any[]): any {
  return {
    "@context": "https://schema.org",
    "@graph": schemas
  }
}

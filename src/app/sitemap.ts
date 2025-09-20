import { MetadataRoute } from 'next'
import { getLocaleCodes } from '@/utils/locales'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASEURL || 'https://www.streetbarbell.com'
  const locales = await getLocaleCodes()
  
  // Static pages that exist for all locales
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/products',
    '/packages',
    '/lines',
    '/projects',
    '/distribution',
    '/articles',
    '/privacy-policy',
    '/terms-of-use',
    '/cookie-policy'
  ]
  
  const sitemapEntries: MetadataRoute.Sitemap = []
  
  // Generate entries for each locale and page combination
  for (const locale of locales) {
    for (const page of staticPages) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? 1 : 0.8, // Home page gets highest priority
      })
    }
  }
  
  // Add dynamic pages from APIs
  // Always try to fetch dynamic content in development and runtime
  console.log('Sitemap generation - Environment:', process.env.NODE_ENV)
  console.log('Sitemap generation - Base URL:', baseUrl)
  
  // Try to fetch dynamic content
  try {
    console.log('Attempting to fetch dynamic content for sitemap...')
      
      const results = await Promise.allSettled([
        addDynamicPages(sitemapEntries, baseUrl, locales, 'lines', 0.7),
        addDynamicPages(sitemapEntries, baseUrl, locales, 'packages', 0.7),
        // Articles with limit to avoid performance issues
        addDynamicPages(sitemapEntries, baseUrl, locales, 'articles', 0.6, 100),
        // Products are extracted from lines, so we'll add them separately
        addProductsFromLines(sitemapEntries, baseUrl, locales, 0.7),
      ])
      
      const successful = results.filter(r => r.status === 'fulfilled').length
      const failed = results.filter(r => r.status === 'rejected').length
      
      console.log(`Sitemap dynamic content: ${successful} successful, ${failed} failed`)
      
      if (failed > 0) {
        console.log('Failed dynamic content fetches:')
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            const contentTypes = ['lines', 'packages', 'articles', 'products-from-lines']
            console.log(`- ${contentTypes[index]}: ${result.reason}`)
          }
        })
      }
  } catch (error) {
    console.error('Error fetching dynamic pages for sitemap:', error)
    // Continue with static pages if dynamic fetching fails
  }
  
  return sitemapEntries
}

/**
 * Add products from lines to sitemap entries
 */
async function addProductsFromLines(
  sitemapEntries: MetadataRoute.Sitemap,
  baseUrl: string,
  locales: string[],
  priority: number
) {
  try {
    const apiUrl = `${baseUrl}/api/get-lines?locale=${locales[0]}`
    
    console.log(`Fetching products from lines: ${apiUrl}`)
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Sitemap-Generator',
      },
      signal: AbortSignal.timeout(10000),
    })
    
    if (!response.ok) {
      console.warn(`API response not ok for products from lines: ${response.status}`)
      return
    }
    
    const data = await response.json()
    
    if (!data?.linesPageData?.lines) {
      console.warn('No lines data found for extracting products')
      return
    }
    
    const lines = data.linesPageData.lines
    const allProducts: any[] = []
    
    // Extract all products from all lines
    for (const line of lines) {
      if (line.products && Array.isArray(line.products)) {
        allProducts.push(...line.products)
      }
    }
    
    if (allProducts.length === 0) {
      console.warn('No products found in lines data')
      return
    }
    
    for (const product of allProducts) {
      const slug = product.slug
      if (!slug) {
        console.warn('Missing slug for product:', product.name || product.id)
        continue
      }
      
      const updatedAt = product.updatedAt || product.createdAt || new Date().toISOString()
      
      // Add entry for each locale
      for (const locale of locales) {
        const url = `${baseUrl}/${locale}/products/${slug}`
        
        sitemapEntries.push({
          url,
          lastModified: new Date(updatedAt),
          changeFrequency: 'monthly',
          priority,
        })
      }
    }
    
    console.log(`Added ${allProducts.length} products from lines to sitemap`)
  } catch (error) {
    console.error('Error fetching products from lines for sitemap:', error)
  }
}

/**
 * Add dynamic pages to sitemap entries
 */
async function addDynamicPages(
  sitemapEntries: MetadataRoute.Sitemap,
  baseUrl: string,
  locales: string[],
  contentType: string,
  priority: number,
  limit?: number
) {
  try {
    // Use the first locale to get the content structure
    const apiEndpoint = getApiEndpoint(contentType)
    const apiUrl = `${baseUrl}/api/${apiEndpoint}?locale=${locales[0]}`
    
    console.log(`Fetching ${contentType} from: ${apiUrl}`)
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Sitemap-Generator',
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000), // 10 second timeout for sitemap generation
    })
    
    if (!response.ok) {
      console.warn(`API response not ok for ${contentType}: ${response.status}`)
      return
    }
    
    const data = await response.json()
    
    if (!data) {
      console.warn(`No data found for ${contentType}`)
      return
    }
    
    // Extract items based on your API response structure
    const items = extractItemsFromResponse(data, contentType)
    
    if (!items || items.length === 0) {
      console.warn(`No items found in ${contentType} response`)
      return
    }
    
    // Apply limit if specified (for articles)
    const limitedItems = limit ? items.slice(0, limit) : items
    
    for (const item of limitedItems) {
      const slug = extractSlugFromItem(item, contentType)
      if (!slug) {
        console.warn(`Missing slug for ${contentType} item:`, item)
        continue
      }
      
      const updatedAt = extractUpdatedAtFromItem(item, contentType)
      
      // Add entry for each locale
      for (const locale of locales) {
        const url = getUrlForContentType(baseUrl, locale, contentType, slug)
        
        sitemapEntries.push({
          url,
          lastModified: new Date(updatedAt),
          changeFrequency: getChangeFrequency(contentType),
          priority,
        })
      }
    }
    
    console.log(`Added ${limitedItems.length} ${contentType} entries to sitemap`)
  } catch (error) {
    console.error(`Error fetching ${contentType} for sitemap:`, error)
  }
}

/**
 * Get API endpoint for different content types
 */
function getApiEndpoint(contentType: string): string {
  switch (contentType) {
    case 'lines':
      return 'get-lines'
    case 'packages':
      return 'get-packages-data'
    case 'articles':
      return 'get-articles'
    default:
      return `get-${contentType}`
  }
}

/**
 * Extract items from API response based on content type
 */
function extractItemsFromResponse(data: any, contentType: string): any[] {
  // Handle the actual API response structure based on the API call results
  
  switch (contentType) {
    case 'lines':
      // From /api/get-lines - data.linesPageData.lines
      if (data.linesPageData?.lines) {
        return data.linesPageData.lines
      }
      break
      
    case 'packages':
      // From /api/get-packages-data - data.package (note: singular!)
      if (data.package) {
        return data.package
      }
      if (data.packages) {
        return data.packages
      }
      if (data.packagesData?.packages) {
        return data.packagesData.packages
      }
      break
      
    case 'articles':
      // From /api/get-articles - returns array directly
      if (Array.isArray(data)) {
        return data
      }
      if (data.articles) {
        return data.articles
      }
      if (data.articlesData?.articles) {
        return data.articlesData.articles
      }
      break
      
  }
  
  // Generic fallbacks
  if (data.data) {
    return Array.isArray(data.data) ? data.data : [data.data]
  }
  
  // Fallback: assume the data itself is an array or single item
  return Array.isArray(data) ? data : [data]
}

/**
 * Extract slug from item based on content type and API structure
 */
function extractSlugFromItem(item: any, contentType: string): string | null {
  // Try different possible slug locations
  if (item.slug) return item.slug
  if (item.attributes?.slug) return item.attributes.slug
  if (item.data?.attributes?.slug) return item.data.attributes.slug
  
  // For some APIs, the slug might be in a different field
  if (item.url_slug) return item.url_slug
  if (item.permalink) return item.permalink
  
  return null
}

/**
 * Extract updatedAt from item based on content type and API structure
 */
function extractUpdatedAtFromItem(item: any, contentType: string): string {
  // Try different possible date locations
  if (item.updatedAt) return item.updatedAt
  if (item.attributes?.updatedAt) return item.attributes.updatedAt
  if (item.data?.attributes?.updatedAt) return item.data.attributes.updatedAt
  if (item.publishedAt) return item.publishedAt
  if (item.attributes?.publishedAt) return item.attributes.publishedAt
  if (item.data?.attributes?.publishedAt) return item.data.attributes.publishedAt
  if (item.updated_at) return item.updated_at
  if (item.published_at) return item.published_at
  
  // Fallback to current date
  return new Date().toISOString()
}

/**
 * Generate URL for different content types
 */
function getUrlForContentType(baseUrl: string, locale: string, contentType: string, slug: string): string {
  switch (contentType) {
    case 'packages':
      return `${baseUrl}/${locale}/packages/${slug}`
    case 'products':
      return `${baseUrl}/${locale}/products/${slug}`
    case 'lines':
      return `${baseUrl}/${locale}/lines/${slug}`
    case 'articles':
      return `${baseUrl}/${locale}/articles/${slug}`
    default:
      return `${baseUrl}/${locale}/${contentType}/${slug}`
  }
}

/**
 * Get appropriate change frequency for content type
 */
function getChangeFrequency(contentType: string): 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' {
  switch (contentType) {
    case 'articles':
      return 'weekly' // Articles might be updated frequently
    case 'products':
    case 'packages':
      return 'monthly' // Products change less frequently
    case 'lines':
      return 'monthly' // Lines are more stable
    default:
      return 'monthly'
  }
}

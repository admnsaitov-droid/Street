/**
 * @fileoverview Component to inject JSON-LD structured data into pages
 * 
 * This component renders structured data as JSON-LD script tags in the document head.
 * It supports multiple schemas and automatically combines them when needed.
 * 
 * @example
 * <StructuredData
 *   schemas={[
 *     generateOrganizationSchema({ name: 'Street Barbell', url: 'https://...' }),
 *     generateWebSiteSchema({ name: 'Street Barbell', url: 'https://...' })
 *   ]}
 * />
 */

interface StructuredDataProps {
  schemas: any[]
}

export function StructuredData({ schemas }: StructuredDataProps) {
  if (!schemas || schemas.length === 0) {
    return null
  }

  // If there's only one schema, render it directly
  if (schemas.length === 1) {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemas[0], null, 0)
        }}
      />
    )
  }

  // If there are multiple schemas, combine them into a graph
  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": schemas
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(combinedSchema, null, 0)
      }}
    />
  )
}

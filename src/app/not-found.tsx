'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function GlobalNotFound() {
  const pathname = usePathname()
  
  // Try to extract locale from pathname, fallback to 'en'
  const segments = pathname?.split('/').filter(Boolean) || []
  const possibleLocale = segments[0]
  const locale = ['en', 'es'].includes(possibleLocale) ? possibleLocale : 'en'

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{
        fontSize: '4rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#fff'
      }}>
        404
      </h1>
      <h2 style={{
        fontSize: '1.5rem',
        marginBottom: '1rem',
        color: '#ccc'
      }}>
        Page Not Found
      </h2>
      <p style={{
        fontSize: '1rem',
        marginBottom: '2rem',
        maxWidth: '600px',
        lineHeight: '1.6',
        color: '#999'
      }}>
        Sorry, we couldn&apos;t find the page you&apos;re looking for. The page may have been moved, deleted, or you may have entered an incorrect URL.
      </p>
      <Link 
        href={`/${locale}`}
        style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#fff',
          color: '#000',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: '500',
          transition: 'all 0.2s ease',
        }}
      >
        Return to Homepage
      </Link>
    </div>
  )
}

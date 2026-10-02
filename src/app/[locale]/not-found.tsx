import Link from 'next/link'
import { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { getStrapiData } from '@/utils/strapi'
import { resolveUiStrings } from '@/config/uiStrings'

export const metadata: Metadata = {
  title: '404 - Page Not Found | Street Barbell',
  description: 'The page you are looking for could not be found. Return to Street Barbell homepage.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function NotFound() {
  // The visitor's locale (the link used to be hard-wired to /en) and that
  // locale's interface texts from Strapi; English if either is unavailable.
  let locale = 'en';
  try {
    locale = await getLocale();
  } catch {
    // keep the default
  }
  const ui = resolveUiStrings((await getStrapiData('get-ui-strings', locale))?.data);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .home-link:hover {
            background-color: #f0f0f0 !important;
          }
        `
      }} />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#000',
        color: '#fff'
      }}>
      <p style={{
        fontSize: '4rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#fff'
      }}>
        404
      </p>
      <h1 style={{
        fontSize: '1.5rem',
        marginBottom: '1rem',
        color: '#ccc'
      }}>
        {ui.notFoundTitle}
      </h1>
      <p style={{
        fontSize: '1rem',
        marginBottom: '2rem',
        maxWidth: '600px',
        lineHeight: '1.6',
        color: '#999'
      }}>
        {ui.notFoundText}
      </p>
      <Link 
        href={`/${locale}`}
        className="home-link"
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
        {ui.notFoundButton}
      </Link>
    </div>
    </>
  )
}

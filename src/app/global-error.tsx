'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
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
          <h1 style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#fff'
          }}>
            Something went wrong!
          </h1>
          <p style={{
            fontSize: '1rem',
            marginBottom: '2rem',
            maxWidth: '600px',
            lineHeight: '1.6',
            color: '#999'
          }}>
            An unexpected error has occurred. Please try again.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}

'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <head>
        <title>Something went wrong | Street Barbell</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{
          __html: `
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
              color: #ffffff;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 2rem;
            }
            
            .error-container {
              text-align: center;
              max-width: 600px;
              width: 100%;
              padding: 3rem 2rem;
              background: rgba(255, 255, 255, 0.05);
              border-radius: 16px;
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255, 255, 255, 0.1);
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            
            .error-icon {
              font-size: 4rem;
              margin-bottom: 1.5rem;
              color: #FF0021;
              display: block;
            }
            
            .error-title {
              font-size: 2.5rem;
              font-weight: 700;
              margin-bottom: 1rem;
              color: #ffffff;
              line-height: 1.2;
            }
            
            .error-subtitle {
              font-size: 1.25rem;
              margin-bottom: 1rem;
              color: #B7BCCA;
              font-weight: 500;
            }
            
            .error-description {
              font-size: 1rem;
              line-height: 1.6;
              margin-bottom: 2.5rem;
              color: #868D9C;
              max-width: 500px;
              margin-left: auto;
              margin-right: auto;
            }
            
            .error-actions {
              display: flex;
              gap: 1rem;
              justify-content: center;
              flex-wrap: wrap;
            }
            
            .error-button {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 1rem;
              text-decoration: none;
              transition: all 0.3s ease;
              border: none;
              cursor: pointer;
              min-width: 140px;
            }
            
            .error-button-primary {
              background: #0040DD;
              color: white;
            }
            
            .error-button-primary:hover {
              background: #0035bb;
              transform: translateY(-2px);
              box-shadow: 0 8px 20px rgba(0, 64, 221, 0.3);
            }
            
            .error-button-secondary {
              background: transparent;
              color: #ffffff;
              border: 2px solid rgba(255, 255, 255, 0.2);
            }
            
            .error-button-secondary:hover {
              background: rgba(255, 255, 255, 0.1);
              border-color: rgba(255, 255, 255, 0.3);
              transform: translateY(-2px);
            }
            
            .error-details {
              margin-top: 2rem;
              padding: 1rem;
              background: rgba(255, 0, 33, 0.1);
              border-radius: 8px;
              border-left: 4px solid #FF0021;
              text-align: left;
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
              font-size: 0.875rem;
              color: #ffcccc;
              display: none;
            }
            
            .show-details {
              display: block;
            }
            
            .error-id {
              margin-top: 1rem;
              font-size: 0.875rem;
              color: #6F7685;
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            }
            
            @media (max-width: 640px) {
              .error-container {
                padding: 2rem 1.5rem;
                margin: 1rem;
              }
              
              .error-title {
                font-size: 2rem;
              }
              
              .error-subtitle {
                font-size: 1.125rem;
              }
              
              .error-actions {
                flex-direction: column;
                align-items: center;
              }
              
              .error-button {
                width: 100%;
                max-width: 280px;
              }
            }
            
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            .error-container {
              animation: fadeIn 0.6s ease-out;
            }
          `
        }} />
      </head>
      <body>
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h1 className="error-title">Something went wrong!</h1>
          <h2 className="error-subtitle">Unexpected Error</h2>
          <p className="error-description">
            We encountered an unexpected error while processing your request. 
            This issue has been logged and our team will investigate it.
          </p>
          
          <div className="error-actions">
            <button 
              onClick={() => reset()} 
              className="error-button error-button-primary"
            >
              Try Again
            </button>
            <a 
              href="/en" 
              className="error-button error-button-secondary"
            >
              Go Home
            </a>
          </div>
          
          {error.digest && (
            <div className="error-id">
              Error ID: {error.digest}
            </div>
          )}
          
          {process.env.NODE_ENV === 'development' && (
            <div className="error-details">
              <strong>Error Details (Development Only):</strong>
              <br />
              {error.message}
              {error.stack && (
                <>
                  <br /><br />
                  <strong>Stack Trace:</strong>
                  <pre>{error.stack}</pre>
                </>
              )}
            </div>
          )}
        </div>
      </body>
    </html>
  )
}

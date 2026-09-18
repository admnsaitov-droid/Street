'use client'

/**
 * The last-resort boundary: the shell itself failed, so there is no provider,
 * no styled-components and no font variable to rely on. Everything here is
 * inline and self-contained on purpose.
 *
 * `src/app/[locale]/error.tsx` is the one visitors normally see; it keeps the
 * real shell and the real design system.
 */

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'info@streetbarbell.com'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const reportHref =
        `mailto:${SUPPORT_EMAIL}` +
        `?subject=${encodeURIComponent('Street Barbell — something broke')}` +
        `&body=${encodeURIComponent(`Reference: ${error?.digest || 'n/a'}`)}`

    return (
        <html lang="en">
            <head>
                <title>Something went wrong | Street Barbell</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <style
                    dangerouslySetInnerHTML={{
                        __html: `
              *{ margin:0; padding:0; box-sizing:border-box; }
              body{
                font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;
                background:#000; color:#fff; min-height:100vh;
                display:flex; align-items:center; justify-content:center; padding:2rem;
              }
              .wrap{ width:100%; max-width:44rem; display:flex; flex-direction:column; align-items:center; text-align:center; gap:1.5rem; }
              .eyebrow{ font-size:.875rem; letter-spacing:.08em; text-transform:uppercase; color:#868D9C; }
              h1{ font-size:clamp(2.25rem,7vw,5.5rem); line-height:.85; text-transform:uppercase; letter-spacing:-.02em; font-weight:600; }
              h1 .accent{ color:#FF0021; }
              p.copy{ font-size:1.05rem; line-height:1.5; color:#B7BCCA; max-width:32rem; }
              .actions{ display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:1.25rem; margin-top:.25rem; }
              button.retry{
                font:inherit; font-size:.95rem; font-weight:500; cursor:pointer;
                background:#fff; color:#000; border:0; border-radius:.5rem; padding:.85rem 1.6rem;
                transition:opacity .3s ease;
              }
              button.retry:hover{ opacity:.85; }
              a{ color:#fff; text-decoration:underline; text-underline-offset:.25rem; font-size:.95rem; transition:opacity .3s ease; }
              a:hover{ opacity:.7; }
              a.report{ color:#868D9C; font-size:.875rem; }
              a.report:hover{ color:#fff; opacity:1; }
              .digest{ font-size:.75rem; color:#6F7685; letter-spacing:.04em; }
            `,
                    }}
                />
            </head>
            <body>
                <div className="wrap">
                    <p className="eyebrow">Error 500</p>
                    <h1>
                        Something <span className="accent">broke</span>
                    </h1>
                    <p className="copy">This page didn&apos;t load.</p>
                    <div className="actions">
                        <button className="retry" type="button" onClick={reset}>
                            Try again
                        </button>
                        <a href="/">Back to home</a>
                    </div>
                    <a className="report" href={reportHref}>
                        Report this
                    </a>
                    {error?.digest && <p className="digest">Reference {error.digest}</p>}
                </div>
            </body>
        </html>
    )
}

import { getStrapiData } from '@/utils/strapi'
import { CONTENT_REVALIDATE } from '@/config/cache'

/**
 * `/llms.txt` — a plain-markdown map of the site for language models
 * (llmstxt.org: an H1, a one-line summary in a blockquote, then sections of
 * links). Built from the footer's navigation and company data in Strapi, so it
 * follows the CMS instead of rotting as a static file. English, canonical URLs.
 * Without it, `/llms.txt` answered 200 with an HTML page.
 */
export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_BASEURL || 'https://www.streetbarbell.com'
const LOCALE = 'en'

interface NavLink { link?: string; text?: string }
interface NavGroup { links?: NavLink[] }

const absolute = (href: string) =>
    /^https?:\/\//.test(href) ? href : `${BASE_URL}/${LOCALE}${href.startsWith('/') ? href : `/${href}`}`

const section = (title: string, group: NavGroup | undefined) => {
    const links = (group?.links ?? []).filter((l) => l.link && l.text)
    if (!links.length) return ''
    return `## ${title}\n${links.map((l) => `- [${l.text}](${absolute(l.link as string)})`).join('\n')}`
}

export async function GET() {
    const [footer, home] = await Promise.all([
        getStrapiData('get-footer-data', LOCALE),
        getStrapiData('get-home-data', LOCALE),
    ])
    const f = footer?.data
    const company = f?.companyData
    const summary =
        home?.hero?.description ||
        'Street Barbell designs and manufactures professional outdoor gym equipment for parks and sports facilities.'

    const contact = company
        ? `## Contact\n${[
              company.adress && `- Address: ${company.adress}`,
              company.phone && `- Phone: ${company.phone}`,
              company.mail && `- Email: ${String(company.mail).toLowerCase()}`,
          ].filter(Boolean).join('\n')}`
        : ''

    const body = [
        '# Street Barbell',
        `> ${String(summary).trim()}`,
        `Street Barbell${company?.adress ? ` (${company.adress})` : ''} manufactures adjustable-load outdoor gym equipment for parks, municipalities, communities and sports facilities. The site is in English, Spanish, French, German and Finnish: ${BASE_URL}/en, /es, /fr, /de, /fi.`,
        `## Main pages\n- [Home](${BASE_URL}/${LOCALE}): packages, equipment lines, projects and news\n- [Packages](${BASE_URL}/${LOCALE}/packages): complete outdoor gym layouts\n- [Equipment lines](${BASE_URL}/${LOCALE}/lines): every product line and its machines\n- [Projects](${BASE_URL}/${LOCALE}/projects): installed outdoor gyms\n- [Distributors](${BASE_URL}/${LOCALE}/distribution): where to buy\n- [News](${BASE_URL}/${LOCALE}/articles)\n- [Contact](${BASE_URL}/${LOCALE}/contact)`,
        section('Packages', f?.packages),
        section('Equipment lines', f?.products),
        section('Company', f?.company),
        contact,
        section('Optional', f?.socials),
    ]
        .filter(Boolean)
        .join('\n\n') + '\n'

    return new Response(body, {
        headers: {
            'content-type': 'text/plain; charset=utf-8',
            'cache-control': `public, max-age=0, s-maxage=${CONTENT_REVALIDATE}, stale-while-revalidate=86400`,
        },
    })
}

'use client'

import { useEffect } from 'react'
import styled from 'styled-components'
import { colors, media, rm } from '@/styles'
import { fontGolosText, fontSageGrotesk } from '@/styles/fonts'
import { minHeightLvh } from '@/styles/utils'
import { AnimLink } from '@/layouts/AnimatedRouterLayout/AnimatedRouterLayout'
import { SimpleButton } from '@/components/Ui/buttons/SimpleButton'

import { useUiStrings } from "@/components/UiStrings/UiStringsProvider"
/** Where a "report this" click goes. Set NEXT_PUBLIC_SUPPORT_EMAIL to change it. */
const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'info@streetbarbell.com'

/**
 * The route-level error boundary — what a visitor sees when a page fails to
 * render. It keeps the shell (header, footer, styles), so it reads as part of
 * the site rather than as a browser error.
 *
 * `global-error.tsx` is the last resort for when the shell itself fails; it has
 * to inline its own styles because no provider is available there.
 */
export default function LocaleError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const ui = useUiStrings()
    useEffect(() => {
        // eslint-disable-next-line no-console
        console.error('Route error:', error)
    }, [error])

    const reportHref =
        `mailto:${SUPPORT_EMAIL}` +
        `?subject=${encodeURIComponent('Street Barbell — something broke')}` +
        `&body=${encodeURIComponent(
            [
                'Tell us what you were doing when this happened:',
                '',
                '',
                '---',
                `Page: ${typeof window !== 'undefined' ? window.location.href : ''}`,
                `Reference: ${error?.digest || 'n/a'}`,
            ].join('\n')
        )}`

    return (
        <StyledError>
            <div className="inner">
                <StyledEyebrow>Error 500</StyledEyebrow>
                <StyledTitle>
                    <span className="first">{ui.errorTitleFirst}</span>{' '}
                    <span className="second">{ui.errorTitleSecond}</span>
                </StyledTitle>
                <StyledCopy>{ui.errorText}</StyledCopy>

                <StyledActions>
                    <SimpleButton isSvg onClick={reset}>
                        {ui.errorTryAgain}
                    </SimpleButton>
                    <AnimLink href="/" className="home-link">
                        {ui.errorBackHome}
                    </AnimLink>
                </StyledActions>

                <StyledReport href={reportHref}>{ui.errorReport}</StyledReport>

                {error?.digest && <StyledDigest>{ui.errorReference} {error.digest}</StyledDigest>}
            </div>
        </StyledError>
    )
}

const StyledError = styled.section`
    width: 100%;
    ${minHeightLvh(100)};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${rm(120)} ${rm(50)};
    background-color: ${colors.black100};

    ${media.xsm`
        padding: ${rm(100)} ${rm(16)};
    `}

    .inner {
        width: ${rm(720)};
        max-width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: ${rm(24)};

        ${media.xsm`
            gap: ${rm(18)};
        `}
    }
`

const StyledEyebrow = styled.p`
    ${fontGolosText(500)};
    font-size: ${rm(14)};
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${colors.gray90};
`

const StyledTitle = styled.h1`
    margin: 0;
    font-size: ${rm(90)};
    line-height: 85%;
    text-transform: uppercase;
    letter-spacing: -0.02em;

    ${media.lg`
        font-size: ${rm(72)};
    `}

    ${media.md`
        font-size: ${rm(52)};
    `}

    ${media.xsm`
        font-size: ${rm(38)};
    `}

    .first {
        color: ${colors.white100};
        ${fontGolosText(600)};
    }

    .second {
        color: ${colors.red};
        ${fontSageGrotesk(400)};
    }
`

const StyledCopy = styled.p`
    ${fontGolosText(400)};
    font-size: ${rm(18)};
    line-height: 150%;
    color: ${colors.gray700};
    width: ${rm(520)};
    max-width: 100%;

    ${media.xsm`
        font-size: ${rm(15)};
    `}
`

const StyledActions = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${rm(24)};
    margin-top: ${rm(8)};

    ${media.xsm`
        width: 100%;
        flex-direction: column;
        align-items: stretch;
        gap: ${rm(14)};
    `}

    .home-link {
        ${fontGolosText(500)};
        font-size: ${rm(16)};
        color: ${colors.white100};
        text-decoration: underline;
        text-underline-offset: ${rm(4)};
        transition: opacity 0.3s ease;

        &:hover {
            opacity: 0.7;
        }

        ${media.xsm`
            text-align: center;
        `}
    }
`

const StyledReport = styled.a`
    ${fontGolosText(400)};
    font-size: ${rm(14)};
    color: ${colors.gray90};
    text-decoration: underline;
    text-underline-offset: ${rm(4)};
    transition: color 0.3s ease;

    &:hover {
        color: ${colors.white100};
    }
`

const StyledDigest = styled.p`
    ${fontGolosText(400)};
    font-size: ${rm(12)};
    color: ${colors.gray};
    letter-spacing: 0.04em;
`

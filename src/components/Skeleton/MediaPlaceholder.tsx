'use client'

import styled from 'styled-components'
import { colors } from '@/styles/colors'
import { SkeletonLoader } from './SkeletonLoader'

interface MediaPlaceholderProps {
    /** Hidden (faded out) once the real media can be shown. */
    $hidden?: boolean
    /**
     * `light` is the default and is what almost everything wants — a faint
     * shade on a light surface. `dark` exists only for slots that sit over
     * dark art, where a light block would flash bright before the media lands.
     */
    tone?: 'light' | 'dark'
    className?: string
}

/**
 * The shade that holds a media slot until its image or video is ready.
 *
 * It renders on the **first** paint and fades out on load — there is no delay
 * timer. `SkeletonImage` had a `delay = 300` before it revealed the image,
 * which read as the placeholder lingering; and `MediaComponent`'s image path
 * had no placeholder at all, so a slot simply stayed empty until the bytes
 * arrived. Both are why media appeared as blank space first.
 *
 * It positions itself absolutely, so **the parent must be positioned**. Every
 * `fill` image already satisfies that, because next/image requires it.
 */
export const MediaPlaceholder = ({ $hidden = false, tone = 'light', className }: MediaPlaceholderProps) => (
    <StyledPlaceholder aria-hidden="true" className={className} $hidden={$hidden} $tone={tone}>
        <SkeletonLoader />
    </StyledPlaceholder>
)

const StyledPlaceholder = styled.div<{ $hidden: boolean; $tone: 'light' | 'dark' }>`
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    overflow: hidden;
    background-color: ${({ $tone }) => ($tone === 'dark' ? colors.mediaPlaceholderDark : colors.mediaPlaceholder)};

    /* Drives the sweep inside SkeletonLoader, which defaults to white. */
    ${({ $tone }) => ($tone === 'dark'
        ? `--color-shimmer: rgba(255, 255, 255, 0.05); --color-shimmer-peak: rgba(255, 255, 255, 0.09);`
        : `--color-shimmer: ${colors.mediaPlaceholderShimmer}; --color-shimmer-peak: ${colors.mediaPlaceholderShimmer};`)}

    opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
    /* Discrete state change on load — the narrow CSS-transition exception. */
    transition: opacity 0.4s ease;
`

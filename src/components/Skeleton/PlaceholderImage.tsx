'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import { MediaPlaceholder } from './MediaPlaceholder'

interface PlaceholderImageProps extends ImageProps {
    /** Passed through to the placeholder for slots that sit over dark art. */
    tone?: 'light' | 'dark'
}

/**
 * `next/image` that holds its slot with a shade until the image paints.
 *
 * A drop-in replacement: it renders the placeholder and the image as
 * **siblings**, adding no wrapper element, so it can be swapped in without
 * touching a single layout rule. The trade is that the parent must be
 * positioned — which every `fill` image's parent already is.
 *
 * Use this for content imagery. `MediaComponent` already has its own
 * placeholder and does not need it.
 */
export const PlaceholderImage = ({ tone = 'light', onLoad, onError, ...props }: PlaceholderImageProps) => {
    const [loaded, setLoaded] = useState(false)

    // Reset when the source changes, so a slot that swaps image — the header's
    // mega-menus do it on hover — shows the placeholder again while the new one
    // arrives. Without this the old image simply sat there until the new bytes
    // landed, which read as the hover doing nothing at all.
    const [renderedSrc, setRenderedSrc] = useState(props.src)
    if (renderedSrc !== props.src) {
        setRenderedSrc(props.src)
        setLoaded(false)
    }

    return (
        <>
            <MediaPlaceholder $hidden={loaded} tone={tone} />
            <Image
                {...props}
                onLoad={(event) => {
                    setLoaded(true)
                    onLoad?.(event)
                }}
                onError={(event) => {
                    // A slot that will never fill should not keep shimmering.
                    setLoaded(true)
                    onError?.(event)
                }}
            />
        </>
    )
}

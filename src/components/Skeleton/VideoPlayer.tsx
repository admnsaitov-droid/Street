'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useInView } from '@react-spring/web';
import Image from 'next/image';
import styled from 'styled-components';
import { MediaPlaceholder } from './MediaPlaceholder';
import { useRequireMedia } from '@/hooks/useRequireMedia';

interface Props {
    src: string
    width?: number | string
    height?: number | string
    className?: string
    poster: string,
    strategy?: 'load' | 'lazy'
    rootMargin?: string
    enableLoader?: boolean
    enableLoad?: boolean
    /** Above-the-fold posters should not be lazy — pass true for the page hero. */
    priority?: boolean
    /** `sizes` for the poster; defaults to full-viewport width. */
    sizes?: string
    /** `dark` for slots that sit over dark art. */
    placeholderTone?: 'light' | 'dark'
    style?: any
}

const StyledPlayer = styled.div`
    position: relative;
    overflow: hidden;

    video {
        position: absolute;
        top: 0; left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .poster-image {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 2;
        /* Discrete state change once the video can paint — narrow CSS exception. */
        transition: opacity 0.4s ease;
    }
`

const VideoPlayer = forwardRef(({
    src: _src,
    width,
    strategy = 'load',
    height,
    className,
    poster: _poster,
    rootMargin = '1000px 1000px',
    enableLoader = true,
    enableLoad = true,
    priority = false,
    sizes = '100vw',
    placeholderTone = 'light',
    ...props
}: Props, outerRef: any) => {
    const videoRef = useRef<any>(null);
    const [canPlay, setCanPlay] = useState(false)
    const [posterLoaded, setPosterLoaded] = useState(false)
    const [src, setSrc] = useState('')
    // Seeded from the prop rather than set in an effect. As effect-set state the
    // poster was absent from the server-rendered HTML, so `priority` had nothing
    // to preload and the request did not start until after hydration — measured
    // at +2.6s on the home hero, which is the LCP element. Seeding it puts the
    // <img> in the first HTML and Next emits its preload link.
    const [poster, setPoster] = useState(strategy === 'load' ? _poster : '')
    const [ref, inView] = useInView({ rootMargin })
    useImperativeHandle(outerRef, () => videoRef.current)

    useEffect(() => {
        setSrc('')
        setCanPlay(false)
    }, [_src])

    const seededPoster = useRef(_poster)
    useEffect(() => {
        // only on a genuine change of source, not on mount
        if (seededPoster.current === _poster) return
        seededPoster.current = _poster
        setPoster('')
        setPosterLoaded(false)
    }, [_poster])

    useEffect(() => {
        if (strategy === 'load') {
            setSrc(_src)
            if (!poster) setPoster(_poster)
            return
        }
        if (inView && strategy === 'lazy' && !poster && _poster) {
            setPoster(_poster)
        }
        if (inView && strategy === 'lazy' && !src && enableLoad) {
            setSrc(_src)
            setTimeout(() => { videoRef.current?.play() }, 10)
            return
        }
    }, [strategy, inView, enableLoad, _src, _poster])

    useEffect(() => {
        if (!videoRef.current) return
        if (inView) {
            if (videoRef.current.paused) {
                videoRef.current?.play()
            }
        } else {
            if (!videoRef.current.paused) {
                videoRef.current.pause()
            }
        }
    }, [inView, src])

    // A usable poster is a valid remote/absolute path; the `/placeholder.jpg`
    // fallback getMediaStrapiPath returns for missing media is not one.
    const hasPoster = Boolean(poster) && poster !== '/placeholder.jpg'

    // Above-the-fold posters hold the loader curtain until they have painted.
    useRequireMedia(poster, priority && hasPoster, posterLoaded || canPlay)

    return (
        <StyledPlayer ref={ref} className={className} style={{ width: width, height: height }} {...props}>
            {/*
              The poster goes through next/image rather than the <video poster>
              attribute. As a raw attribute the browser fetched the Strapi
              original — 8.1MB of PNG for the home hero, ~3.2s on the wire —
              because `poster` is not optimisable. Through the optimiser it is a
              width-appropriate AVIF/WebP.
            */}
            {hasPoster && (
                <Image
                    className="poster-image"
                    src={poster}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes={sizes}
                    priority={priority}
                    style={{ opacity: canPlay ? 0 : 1 }}
                    onLoad={() => setPosterLoaded(true)}
                    onError={() => setPosterLoaded(true)}
                />
            )}
            {/*
              `src` is only set once it is a real URL. Rendering `src=""` makes
              the browser throw `NotSupportedError: The element has no supported
              sources`, which surfaced on every page carrying a poster-only
              media slot.
            */}
            <video
                onCanPlay={() => setCanPlay(true)}
                onCanPlayThrough={() => setCanPlay(true)}
                ref={videoRef}
                {...(src ? { src } : {})}
                preload="metadata"
                playsInline
                loop
                muted
            />
            {enableLoader ? <MediaPlaceholder $hidden={posterLoaded || canPlay} tone={placeholderTone} /> : null}
        </StyledPlayer>
    );
});

VideoPlayer.displayName = 'VideoPlayer'

export default VideoPlayer;

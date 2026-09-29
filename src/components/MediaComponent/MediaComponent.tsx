import { useVideoPlayerStore } from "@/store/store";
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath";
import { useSpringTrigger } from "@/hooks/useSpringTrigger";
import { animated } from "@react-spring/web";
import Image from "next/image";
import styled from "styled-components";
import { useRef, useState } from "react";
import VideoPlayer from "../Skeleton/VideoPlayer";
import { MediaPlaceholder } from "../Skeleton/MediaPlaceholder";
import { useRequireMedia } from "@/hooks/useRequireMedia";
import { colors } from "@/styles/colors";

interface MediaComponentProps {
    media: any;
    className?: string;
    isExtendable?: boolean;
    parallax?: boolean;
    imageGallery?: string[];
    imageFit?: 'contain' | 'cover';
    priority?: boolean;
    /**
     * How wide this slot actually is, as a `sizes` string. Without it every
     * `fill` image asks the optimiser for the largest device width (2048/3840),
     * which is both a slower encode and a bigger download than the slot needs.
     */
    sizes?: string;
    /** `dark` for slots that sit over dark art — the home hero video. */
    placeholderTone?: 'light' | 'dark';
}

export const MediaComponent = ({ media, className, isExtendable = true, parallax = true, imageGallery, imageFit = 'cover', priority = false, sizes = '100vw', placeholderTone = 'light' }: MediaComponentProps) => {
    const { openVideo, openImage } = useVideoPlayerStore();
    const elementRef = useRef<HTMLDivElement>(null);
    const [posterLoaded, setPosterLoaded] = useState(false);


    const poster = media?.poster;
    const video = media?.video;

    // Above-the-fold imagery holds the loader curtain until it has painted, so
    // the reveal shows a finished hero rather than a placeholder.
    const posterPath = poster ? getMediaStrapiPath(poster) : undefined;
    useRequireMedia(posterPath, priority && Boolean(poster) && !video, posterLoaded);

    // Parallax effect using useSpringTrigger
    const { springs } = useSpringTrigger({
        elementRef,
        start: "top bottom",
        end: "bottom top",
        from: { y: '-4%' },
        to: { y: '4%' },
        disableOnMobile: true,
    });

    const handleOpenVideo = () => {
        if (isExtendable) {
            openVideo(getMediaStrapiPath(video), getMediaStrapiPath(poster));
        }
    };
    const handleOpenImage = () => {
        if (isExtendable) {
            openImage(getMediaStrapiPath(poster), imageGallery, { imageFit });
        }
    };


    return (
        <StyledMediaComponent ref={elementRef} className={className} $isExtendable={isExtendable} $parallax={parallax}>
            <div className="media-wrapper">
                {poster && !video && (
                    <animated.div 
                        className="parallax-wrapper"
                        style={parallax ? springs : {}}
                    >
                        <Image
                            className="media"
                            src={getMediaStrapiPath(poster)}
                            alt="Poster"
                            fill
                            sizes={sizes}
                            priority={priority}
                            onClick={handleOpenImage}
                            onLoad={() => setPosterLoaded(true)}
                            onError={() => setPosterLoaded(true)}
                        />
                    </animated.div>
                )}
                {/*
                  The image path had no placeholder at all: the slot stayed
                  empty until the bytes landed, which is the blank space the
                  media was reported as leaving behind.
                */}
                {poster && !video && <MediaPlaceholder $hidden={posterLoaded} tone={placeholderTone} />}
                {video && (
                    <animated.div 
                        className="parallax-wrapper"
                        style={parallax ? springs : {}}
                        onClick={handleOpenVideo}
                    >
                        <VideoPlayer
                            className="media"
                            src={getMediaStrapiPath(video)}
                            poster={getMediaStrapiPath(poster)}
                            priority={priority}
                            sizes={sizes}
                            placeholderTone={placeholderTone}
                        />
                    </animated.div>
                )}
            </div>
        </StyledMediaComponent>
    )
};

const StyledMediaComponent = styled.div<{ $isExtendable: boolean; $parallax: boolean }>`
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    cursor: ${({ $isExtendable }) => $isExtendable ? "pointer" : "default"};

    &:hover {
        ${({ $isExtendable, $parallax }) => $isExtendable && !$parallax && `
            img, video {
                transform: scale(1.02);
            }
        `}


    }

    img, video {
        transition: ${({ $parallax }) => $parallax ? "none" : "transform 0.3s ease"};
    }

    .media {
        width: 105% !important;
        height: 105% !important;
        object-fit: cover;
        position: absolute;
        top: 0;
        left: 0;
    }

    .media-wrapper {
        width: 100%;
        height: 100%;
        position: relative;

        transition: transform 0.3s ease;

        &:hover {
            ${({ $isExtendable }) => $isExtendable && `
                transform: scale(1.02);
            `}
        }
    }

    .parallax-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        cursor: ${({ $isExtendable }) => $isExtendable ? "pointer" : "default"};
    }
`;
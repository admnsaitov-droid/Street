import { useVideoPlayerStore } from "@/store/store";
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath";
import { useSpringTrigger } from "@/hooks/useSpringTrigger";
import { animated } from "@react-spring/web";
import Image from "next/image";
import styled from "styled-components";
import { useRef } from "react";
import VideoPlayer from "../Skeleton/VideoPlayer";
import { colors } from "@/styles/colors";

interface MediaComponentProps {
    media: any;
    className?: string;
    isExtendable?: boolean;
    parallax?: boolean;
    imageGallery?: string[];
    imageFit?: 'contain' | 'cover';
    priority?: boolean;
}

export const MediaComponent = ({ media, className, isExtendable = true, parallax = true, imageGallery, imageFit = 'cover', priority = false }: MediaComponentProps) => {
    const { openVideo, openImage } = useVideoPlayerStore();
    const elementRef = useRef<HTMLDivElement>(null);

    const poster = media?.poster;
    const video = media?.video;

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
                        <Image className="media" src={getMediaStrapiPath(poster)} alt="Poster" fill priority={priority} onClick={handleOpenImage} />
                    </animated.div>
                )}
                {video && (
                    <animated.div 
                        className="parallax-wrapper"
                        style={parallax ? springs : {}}
                        onClick={handleOpenVideo}
                    >
                        <VideoPlayer className="media" src={getMediaStrapiPath(video)} poster={getMediaStrapiPath(poster)} />
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
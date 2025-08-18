import { useVideoPlayerStore } from "@/store/store";
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath";
import Image from "next/image";
import styled from "styled-components";
import VideoPlayer from "../Skeleton/VideoPlayer";

interface MediaComponentProps {
    media: any;
    className?: string;
    isExtendable?: boolean;
}

export const MediaComponent = ({ media, className, isExtendable = true }: MediaComponentProps) => {
    const { openVideo, openImage } = useVideoPlayerStore();

    const poster = media?.poster;
    const video = media?.video;

    const handleOpenVideo = () => {
        if (isExtendable) {
            openVideo(getMediaStrapiPath(video), getMediaStrapiPath(poster));
        }
    };
    const handleOpenImage = () => {
        if (isExtendable) {
            openImage(getMediaStrapiPath(poster));
        }
    };

    return (
        <StyledMediaComponent className={className} $isExtendable={isExtendable}>
            <div className="media-wrapper">
                {poster && !video && <Image className="media" src={getMediaStrapiPath(poster)} alt="Poster" fill onClick={handleOpenImage} />}
                {video && <div onClick={handleOpenVideo} className="media-wrapper"><VideoPlayer className="media" src={getMediaStrapiPath(video)} poster={getMediaStrapiPath(poster)} /></div>}
            </div>
        </StyledMediaComponent>
    )
};

const StyledMediaComponent = styled.div<{ $isExtendable: boolean }>`
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    cursor: ${({ $isExtendable }) => $isExtendable ? "pointer" : "default"};

    &:hover {
        ${({ $isExtendable }) => $isExtendable && `
            img, video {
                transform: scale(1.02);
            }
        `}
    }

    img, video {
        transition: transform 0.3s ease;
    }

    .media {
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .media-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
    }
`;
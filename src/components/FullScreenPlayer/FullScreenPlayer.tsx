"use client";

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { animated, useSpring, easings } from '@react-spring/web';
import { useVideoPlayerStore } from '@/store/store';
import { useScroll } from '@/layouts/ScrollLayout/useScroll';
import { colors } from '@/styles/colors';
import { rm } from '@/styles';

export const FullScreenPlayer: React.FC = () => {
    const { content, poster, contentType, isOpen, closePlayer } = useVideoPlayerStore();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    const stopScroll = useScroll((state) => state.stop);
    const startScroll = useScroll((state) => state.start);

    // Handle scroll prevention when modal is open
    useEffect(() => {
        if (isOpen) {
            stopScroll();
        } else {
            startScroll();
        }
    }, [isOpen, stopScroll, startScroll]);

    // Handle keyboard events
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isOpen) return;
            
            switch (event.key) {
                case 'Escape':
                    handleClose();
                    break;
                case ' ':
                    event.preventDefault();
                    togglePlayPause();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Auto-hide controls (only for videos)
    useEffect(() => {
        if (!isOpen || !isPlaying || contentType !== 'video') return;

        const hideControls = () => {
            setShowControls(false);
        };

        if (controlsTimeout) {
            clearTimeout(controlsTimeout);
        }

        const timeout = setTimeout(hideControls, 3000);
        setControlsTimeout(timeout);

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [isOpen, isPlaying, showControls, contentType]);

    // Reset states when content changes
    useEffect(() => {
        setIsLoading(true);
        setIsPlaying(false);
        setImageLoaded(false);
        setShowControls(true);
    }, [content, contentType]);

    // Animation springs
    const overlaySpring = useSpring({
        opacity: isOpen ? 1 : 0,
        config: {
            duration: 400,
            easing: easings.easeInOutCubic,
        },
    });

    const playerSpring = useSpring({
        scale: isOpen ? 1 : 0.9,
        opacity: isOpen ? 1 : 0,
        config: {
            duration: 600,
            easing: easings.easeInOutCubic,
        },
    });

    const controlsSpring = useSpring({
        opacity: showControls ? 1 : 0,
        transform: showControls ? 'translateY(0px)' : 'translateY(20px)',
        config: {
            duration: 300,
            easing: easings.easeInOutCubic,
        },
    });

    const handleClose = () => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
        setIsPlaying(false);
        setIsLoading(true);
        closePlayer();
    };

    const togglePlayPause = () => {
        if (contentType !== 'video' || !videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleVideoLoad = () => {
        setIsLoading(false);
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleImageLoad = () => {
        setImageLoaded(true);
        setIsLoading(false);
    };

    const handleVideoPlay = () => {
        setIsPlaying(true);
    };

    const handleVideoPause = () => {
        setIsPlaying(false);
    };

    const handleMouseMove = () => {
        if (contentType === 'video') {
            setShowControls(true);
            if (controlsTimeout) {
                clearTimeout(controlsTimeout);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <StyledFullScreenPlayer
            style={{
                pointerEvents: isOpen ? 'auto' : 'none',
                userSelect: isOpen ? 'auto' : 'none'
            }}
            onMouseMove={handleMouseMove}
        >
            <StyledOverlay style={overlaySpring} onClick={handleClose} />
            
            <StyledPlayerContainer style={playerSpring}>
                <StyledContentWrapper>
                    {contentType === 'video' && content && (
                        <StyledVideo
                            ref={videoRef}
                            src={content}
                            poster={poster || undefined}
                            onLoadedData={handleVideoLoad}
                            onCanPlayThrough={handleVideoLoad}
                            onPlay={handleVideoPlay}
                            onPause={handleVideoPause}
                            playsInline
                            onClick={togglePlayPause}
                        />
                    )}

                    {contentType === 'image' && content && (
                        <StyledImage
                            src={content}
                            onLoad={handleImageLoad}
                            alt="Full screen image"
                        />
                    )}
                    
                    {isLoading && (
                        <StyledLoader>
                            <StyledSpinner />
                        </StyledLoader>
                    )}
                </StyledContentWrapper>

                {contentType === 'video' && (
                    <StyledControls style={controlsSpring}>
                        <StyledControlButton onClick={togglePlayPause}>
                            {isPlaying ? (
                                <PauseIcon />
                            ) : (
                                <PlayIcon />
                            )}
                        </StyledControlButton>
                        
                        <StyledCloseButton onClick={handleClose}>
                            <CloseIcon />
                        </StyledCloseButton>
                    </StyledControls>
                )}

                {contentType === 'image' && (
                    <StyledImageCloseButton onClick={handleClose}>
                        <CloseIcon />
                    </StyledImageCloseButton>
                )}
            </StyledPlayerContainer>
        </StyledFullScreenPlayer>
    );
};

// Icons
const PlayIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M8 5v14l11-7z" fill="currentColor"/>
    </svg>
);

const PauseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor"/>
    </svg>
);

const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// Styled Components
const StyledFullScreenPlayer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const StyledOverlay = styled(animated.div)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
    z-index: 1000;
`;

const StyledPlayerContainer = styled(animated.div)`
    position: relative;
    width: 90vw;
    height: 90vh;
    max-width: 1200px;
    max-height: 800px;
    z-index: 1001;
    display: flex;
    flex-direction: column;
`;

const StyledContentWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: ${rm(12)};
    overflow: hidden;
    background-color: ${colors.black100};
    display: flex;
    align-items: center;
    justify-content: center;
`;

const StyledVideo = styled.video`
    width: 100%;
    height: 100%;
    object-fit: contain;
    cursor: pointer;
`;

const StyledImage = styled.img`
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: ${rm(8)};
`;

const StyledLoader = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1002;
`;

const StyledSpinner = styled.div`
    width: ${rm(40)};
    height: ${rm(40)};
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid ${colors.white100};
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

const StyledControls = styled(animated.div)`
    position: absolute;
    bottom: ${rm(20)};
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: ${rm(16)};
    z-index: 1003;
`;

const StyledControlButton = styled.button`
    width: ${rm(48)};
    height: ${rm(48)};
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.7);
    color: ${colors.white100};
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover {
        background-color: rgba(0, 0, 0, 0.9);
        transform: scale(1.1);
    }
`;

const StyledCloseButton = styled.button`
    position: absolute;
    top: ${rm(-60)};
    right: ${rm(-20)};
    width: ${rm(40)};
    height: ${rm(40)};
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.7);
    color: ${colors.white100};
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover {
        background-color: rgba(0, 0, 0, 0.9);
        transform: scale(1.1);
    }
`;

const StyledImageCloseButton = styled.button`
    position: absolute;
    top: ${rm(20)};
    right: ${rm(20)};
    width: ${rm(48)};
    height: ${rm(48)};
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.7);
    color: ${colors.white100};
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    z-index: 1004;

    &:hover {
        background-color: rgba(0, 0, 0, 0.9);
        transform: scale(1.1);
    }
`;

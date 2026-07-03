"use client";

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { animated, useSpring, easings } from '@react-spring/web';
import { useVideoPlayerStore } from '@/store/store';
import { useScroll } from '@/layouts/ScrollLayout/useScroll';
import { colors } from '@/styles/colors';
import { rm, media } from '@/styles';
import { fontSageGrotesk } from '@/styles/fonts';

export const FullScreenPlayer: React.FC = () => {
    const { content, poster, contentType, isOpen, closePlayer, imageGallery, currentImageIndex, nextImage, previousImage, imageFit } = useVideoPlayerStore();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [volume, setVolume] = useState<number>(0.5);
    const [time, setTime] = useState<string[]>(['00', '00', '00', '00']);
    const [isMouseMoving, setIsMouseMoving] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    const stopScroll = useScroll((state) => state.stop);
    const startScroll = useScroll((state) => state.start);

    // Handle scroll prevention when modal is open
    useEffect(() => {
        if (isOpen) {
            stopScroll();
            setShouldRender(true);
        } else {
            startScroll();
            // Delay unmounting to allow closing animation to complete
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 400); // Match animation duration
            return () => clearTimeout(timer);
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
                    if (contentType === 'video') {
                        togglePlayPause();
                    }
                    break;
                case 'ArrowLeft':
                    if (contentType === 'image' && imageGallery && imageGallery.length > 1) {
                        event.preventDefault();
                        previousImage();
                    }
                    break;
                case 'ArrowRight':
                    if (contentType === 'image' && imageGallery && imageGallery.length > 1) {
                        event.preventDefault();
                        nextImage();
                    }
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, contentType, imageGallery]);

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
        setTime(['00', '00', '00', '00']);
    }, [content, contentType]);

    // Update time display for videos
    useEffect(() => {
        if (!isPlaying || contentType !== 'video') return;

        const interval = setInterval(() => {
            if (videoRef.current) {
                setTime(formatTime(videoRef.current.currentTime.toString()));
            }
        }, 100);

        return () => clearInterval(interval);
    }, [isPlaying, contentType]);

    // Animation springs
    const overlaySpring = useSpring({
        opacity: isOpen ? 1 : 0,
        config: {
            duration: 400,
            easing: easings.easeInOutCubic,
        },
    });

    const playerSpring = useSpring({
        scale: isOpen ? 1 : 0.98,
        opacity: isOpen ? 1 : 0,
        config: {
            duration: 400,
            easing: easings.easeInOutCubic,
        },
    });

    const formatTime = (time: string) => {
        let [mil = '0', sec = '0', mins = '0', hours = '0'] = time.split('.').reverse();
        mil = mil.slice(0, 2);
        const timeValues: string[] = [
            +hours < 10 ? '0' + hours : hours, 
            +mins < 10 ? '0' + mins : mins, 
            +sec < 10 ? '0' + sec : sec, 
            mil
        ];
        return timeValues;
    };

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
            setIsMouseMoving(true);
            if (controlsTimeout) {
                clearTimeout(controlsTimeout);
            }
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = +e.target.value;
        setVolume(newVolume);

        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value;
        if (videoRef.current) {
            const newCurrentTime = +newTime * videoRef.current.duration;
            videoRef.current.currentTime = newCurrentTime;
            setTime(formatTime(newCurrentTime.toString()));
        }
    };

    if (!shouldRender) return null;

    return (
        <StyledFullScreenPlayer
            style={{
                pointerEvents: isOpen ? 'auto' : 'none',
                userSelect: isOpen ? 'auto' : 'none'
            }}
            onMouseMove={isOpen ? handleMouseMove : undefined}
        >
            <StyledOverlay style={overlaySpring} onClick={isOpen ? handleClose : undefined} />
            
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
                            onClick={isOpen ? togglePlayPause : undefined}
                        />
                    )}

                    {contentType === 'image' && content && (
                        <StyledImage
                            $imageFit={imageFit}
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
                    <StyledCloseButton onClick={isOpen ? handleClose : undefined}>
                        <CloseIcon />
                    </StyledCloseButton>
                )}

                {contentType === 'video' && (
                    <StyledVideoMenu data-is-shown={isMouseMoving || !isPlaying}>
                        <StyledVideoMenuContent>
                            <StyledVolumeMenu>
                                <VolumeIcon />
                                <StyledVolumeInput 
                                    type="range" 
                                    value={volume} 
                                    min="0" 
                                    max="1" 
                                    step="0.01" 
                                    onChange={handleVolumeChange}
                                    style={{ '--fill': `${volume * 100}%` } as React.CSSProperties}
                                />
                            </StyledVolumeMenu>
                            
                            <StyledTimeMenu>
                                <StyledTimeButton onClick={isOpen ? togglePlayPause : undefined}>
                                    {isPlaying ? (
                                        <PauseIconSmall />
                                    ) : (
                                        <PlayIconSmall />
                                    )}
                                </StyledTimeButton>
                                <StyledTimeDisplay>
                                    [
                                    <StyledTimeValues>
                                        {time.slice(1, 3).map((timeValue, i) => (
                                            <React.Fragment key={i}>
                                                <StyledTimeValue>{timeValue}</StyledTimeValue>
                                                {i !== 1 && <StyledColon>:</StyledColon>}
                                            </React.Fragment>
                                        ))}
                                    </StyledTimeValues>
                                    ]
                                </StyledTimeDisplay>
                                <StyledTimeSlider
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.001"
                                    value={videoRef.current ? videoRef.current.currentTime / videoRef.current.duration : 0}
                                    onChange={handleTimeChange}
                                    style={{ '--fill': videoRef.current ? `${(videoRef.current.currentTime / videoRef.current.duration) * 100}%` : '0%' } as React.CSSProperties}
                                />
                            </StyledTimeMenu>
                        </StyledVideoMenuContent>
                    </StyledVideoMenu>
                )}

                {contentType === 'image' && (
                    <StyledImageCloseButton onClick={isOpen ? handleClose : undefined}>
                        <CloseIcon />
                    </StyledImageCloseButton>
                )}

                {contentType === 'image' && imageGallery && imageGallery.length > 1 && (
                    <>
                        <StyledPrevButton onClick={isOpen ? previousImage : undefined}>
                            <ArrowLeftIcon />
                        </StyledPrevButton>
                        <StyledNextButton onClick={isOpen ? nextImage : undefined}>
                            <ArrowRightIcon />
                        </StyledNextButton>
                        <StyledImageCounter>
                            {currentImageIndex + 1} / {imageGallery.length}
                        </StyledImageCounter>
                    </>
                )}
            </StyledPlayerContainer>
        </StyledFullScreenPlayer>
    );
};

const PlayIconSmall = () => (
    <svg width="8" height="10" viewBox="0 0 8 10" fill="none">
        <path d="M6.93333 4.2C7.46667 4.6 7.46667 5.4 6.93333 5.8L1.6 9.8C0.940764 10.2944 3.95697e-08 9.82405 6.72981e-08 9L3.3649e-07 1C3.64219e-07 0.175955 0.940764 -0.294427 1.6 0.2L6.93333 4.2Z" fill="black" />
    </svg>
);

const PauseIconSmall = () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <rect width="2" height="10" rx="1" fill="black" />
        <rect x="8" width="2" height="10" rx="1" fill="black" />
    </svg>
);

const VolumeIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <g clipPath="url(#clip0_1435_382)">
            <path d="M7.00421 11.3645C7.00425 11.4852 6.96989 11.6034 6.90516 11.7053C6.84042 11.8072 6.748 11.8885 6.63871 11.9397C6.52949 11.9911 6.4079 12.0103 6.28817 11.9951C6.16843 11.9799 6.05551 11.9309 5.96262 11.8538L2.48692 8.9737H0.635762C0.552274 8.97374 0.469596 8.95733 0.392454 8.9254C0.315312 8.89347 0.245217 8.84666 0.186175 8.78763C0.127134 8.7286 0.080302 8.65852 0.0483572 8.58138C0.0164123 8.50425 -1.97613e-05 8.42158 1.78348e-08 8.33809V5.80512C1.31137e-08 5.63649 0.0669771 5.47477 0.186201 5.35552C0.305425 5.23627 0.467133 5.16925 0.635762 5.16921H2.48707L5.96277 2.2891C6.05563 2.21197 6.16858 2.16294 6.28834 2.14777C6.4081 2.1326 6.5297 2.15193 6.63886 2.20348C6.74811 2.25477 6.84051 2.33611 6.90524 2.43798C6.96996 2.53985 7.00435 2.65805 7.00436 2.77875L7.00421 11.3645ZM9.4475 10.371C9.35654 10.3776 9.26524 10.3646 9.17978 10.3327C9.09433 10.3009 9.01674 10.251 8.95228 10.1865L8.86726 10.1012C8.75935 9.99351 8.69377 9.85058 8.6825 9.69853C8.67122 9.54648 8.71501 9.39544 8.80587 9.273C9.27987 8.63718 9.53508 7.86489 9.53327 7.07183C9.53327 6.21321 9.24796 5.40787 8.70806 4.74276C8.60884 4.62076 8.5584 4.46629 8.56648 4.30925C8.57457 4.1522 8.64062 4.00374 8.75184 3.89257L8.83671 3.80755C8.96371 3.68055 9.1339 3.61133 9.31809 3.62232C9.40684 3.62677 9.49367 3.64976 9.573 3.6898C9.65233 3.72984 9.7224 3.78604 9.77869 3.8548C10.5276 4.7712 10.9232 5.88382 10.9232 7.07198C10.9232 8.17858 10.5734 9.23192 9.91126 10.1176C9.85663 10.1906 9.78695 10.251 9.70693 10.2948C9.62692 10.3385 9.53844 10.3645 9.4475 10.371ZM12.076 12.3358C12.0192 12.403 11.949 12.4576 11.87 12.4963C11.791 12.535 11.7048 12.5569 11.6169 12.5606C11.529 12.5643 11.4413 12.5497 11.3593 12.5178C11.2773 12.4859 11.2028 12.4374 11.1405 12.3752L11.057 12.2917C10.9445 12.1791 10.8783 12.0285 10.8714 11.8695C10.8646 11.7105 10.9176 11.5547 11.02 11.4329C12.0462 10.2113 12.6092 8.66726 12.6102 7.07183C12.6109 5.41695 12.0052 3.81916 10.9077 2.58057C10.8005 2.45946 10.7435 2.30207 10.7482 2.1404C10.753 1.97874 10.8192 1.82497 10.9333 1.71037L11.0167 1.62685C11.0773 1.56452 11.1504 1.51567 11.2311 1.48347C11.3119 1.45126 11.3985 1.43644 11.4854 1.43996C11.5721 1.44247 11.6573 1.46268 11.7359 1.49935C11.8144 1.53602 11.8847 1.58837 11.9422 1.65319C13.2688 3.14631 14.0011 5.07452 14 7.07183C13.9995 8.99847 13.318 10.8629 12.076 12.3358Z" fill="white" />
        </g>
        <defs>
            <clipPath id="clip0_1435_382">
                <rect width="14" height="14" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const ArrowLeftIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const ArrowRightIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
    width: 100vw;
    height: 100vh;
    z-index: 1001;
    display: flex;
    flex-direction: column;
`;

const StyledContentWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: ${colors.black100};
    display: flex;
    align-items: center;
    justify-content: center;
`;

const StyledVideo = styled.video`
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
`;

const StyledImage = styled.img<{ $imageFit: 'contain' | 'cover' }>`
    width: 100%;
    height: 100%;
    object-fit: ${({ $imageFit }) => $imageFit};

    ${({ $imageFit }) => $imageFit === 'contain' && `
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
    `}
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



const StyledCloseButton = styled.button`
    position: absolute;
    top: ${rm(40)};
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
    backdrop-filter: blur(4px);
    z-index: 1004;

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
    backdrop-filter: blur(4px);

    &:hover {
        background-color: rgba(0, 0, 0, 0.9);
        transform: scale(1.1);
    }
`;

// Enhanced Video Controls with VideoBlock styling
const StyledVideoMenu = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: ${rm(20)};
    opacity: 0;
    transition: opacity 0.7s linear;
    pointer-events: none;

    &[data-is-shown="true"] {
        opacity: 1;
        pointer-events: auto;
    }

    ${media.xsm`
        padding: ${rm(10)} 0;
    `}
`;

const StyledVideoMenuContent = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const StyledVolumeMenu = styled.div`
    display: flex;
    gap: ${rm(15)};
    align-items: center;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(4px);
    padding: ${rm(15)};
    width: fit-content;
    border-radius: ${rm(30)};
    align-self: flex-start;
    margin-top: ${rm(20)};
    margin-left: ${rm(20)};

    svg {
        color: white;
    }
`;

const StyledVolumeInput = styled.input`
    -webkit-appearance: none;
    appearance: none;
    width: ${rm(80)};
    height: ${rm(4)};
    background: rgba(255, 255, 255, 0.5); 
    border-radius: ${rm(2)};
    outline: none;

    &::-webkit-slider-runnable-track {
        height: ${rm(4)};
        background: linear-gradient(to right, white 0%, white var(--fill, 50%), transparent var(--fill, 50%), transparent 100%);
        border-radius: ${rm(2)};
    }

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: ${rm(12)};
        height: ${rm(12)};
        background: white;
        border-radius: 50%;
        cursor: pointer;
        margin-top: ${rm(-4)};
    }

    &::-moz-range-track {
        height: ${rm(4)};
        background: rgba(255, 255, 255, 0.5);
        border-radius: ${rm(2)};
    }

    &::-moz-range-progress {
        height: ${rm(4)};
        background: white;
        border-radius: ${rm(2)};
    }

    &::-moz-range-thumb {
        width: ${rm(12)};
        height: ${rm(12)};
        background: white;
        border-radius: 50%;
        cursor: pointer;
        border: none;
    }
`;

const StyledTimeMenu = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: ${rm(20)};
    align-items: center;
    color: white;
    ${fontSageGrotesk(400)};
    padding-bottom: ${rm(20)};
    padding-left: ${rm(20)};
    padding-right: ${rm(20)};
`;

const StyledTimeButton = styled.div`
    background-color: white;
    border-radius: 100px;
    white-space: nowrap;
    transition: transform 0.3s ease-in-out;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: ${rm(50)};
    height: ${rm(50)};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
        transform: scale(1.05);
    }

    svg {
        margin: auto;
    }
`;

const StyledTimeDisplay = styled.div`
    display: flex;
    align-items: center;
    font-size: ${rm(16)};
    color: white;
`;

const StyledTimeValues = styled.div`
    display: flex;
    gap: ${rm(1)};
    padding: 0 ${rm(4)};
`;

const StyledTimeValue = styled.div`
    width: ${rm(18)};
    text-align: center;
`;

const StyledColon = styled.div`
    margin: 0 ${rm(2)};
`;

const StyledTimeSlider = styled.input`
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: ${rm(3)};
    background: rgba(255, 255, 255, 0.5); 
    border-radius: ${rm(2)};
    outline: none;
    cursor: pointer;

    &::-webkit-slider-runnable-track {
        height: 100%;
        background: linear-gradient(to right, white 0%, white var(--fill, 50%), transparent var(--fill, 50%), transparent 100%);
        border-radius: ${rm(2)};
    }

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        background: white;
        cursor: pointer;
        height: ${rm(12)};
        width: ${rm(12)};
        border-radius: 50%;
        margin-top: ${rm(-4.5)};
    }

    &::-moz-range-track {
        height: ${rm(3)};
        background: rgba(255, 255, 255, 0.5);
        border-radius: ${rm(2)};
    }

    &::-moz-range-progress {
        height: ${rm(3)};
        background: white;
        border-radius: ${rm(2)};
    }

    &::-moz-range-thumb {
        background: white;
        cursor: pointer;
        border: none;
        height: ${rm(12)};
        width: ${rm(12)};
        border-radius: 50%;
    }
`;

const StyledPrevButton = styled.button`
    position: absolute;
    left: ${rm(20)};
    top: 50%;
    transform: translateY(-50%);
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
    backdrop-filter: blur(4px);
    z-index: 1004;

    &:hover {
        background-color: ${colors.blue90};
        transform: translateY(-50%) scale(1.1);
    }
`;

const StyledNextButton = styled.button`
    position: absolute;
    right: ${rm(20)};
    top: 50%;
    transform: translateY(-50%);
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
    backdrop-filter: blur(4px);
    z-index: 1004;

    &:hover {
        background-color: rgba(0, 0, 0, 0.9);
        transform: translateY(-50%) scale(1.1);
    }
`;

const StyledImageCounter = styled.div`
    position: absolute;
    bottom: ${rm(20)};
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.7);
    color: ${colors.white100};
    padding: ${rm(8)} ${rm(16)};
    border-radius: ${rm(20)};
    font-size: ${rm(14)};
    ${fontSageGrotesk(400)};
    backdrop-filter: blur(4px);
    z-index: 1004;
`;

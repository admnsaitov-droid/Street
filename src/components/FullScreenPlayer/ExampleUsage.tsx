"use client";

import React from 'react';
import styled from 'styled-components';
import { useVideoPlayerStore } from '@/store/store';
import { colors } from '@/styles/colors';
import { rm } from '@/styles';

/**
 * Example component demonstrating how to use the FullScreenPlayer
 * This component shows how to trigger both image and video display modes
 */
export const VideoPlayerExample: React.FC = () => {
    const { openVideo, openImage } = useVideoPlayerStore();

    const handleOpenVideo = () => {
        // Example: Open video with poster thumbnail
        openVideo(
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg'
        );
    };

    const handleOpenVideoOnly = () => {
        // Example: Open video without poster
        openVideo(
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
        );
    };

    const handleOpenImage = () => {
        // Example: Open image full-screen
        openImage(
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg'
        );
    };

    const handleOpenAnotherImage = () => {
        // Example: Open another image
        openImage(
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
        );
    };

    return (
        <StyledExampleContainer>
            <h2>FullScreenPlayer Example</h2>
            <p>Click the buttons below to test both image and video full-screen modes:</p>
            
            <StyledSection>
                <h3>Video Mode</h3>
                <p>Videos will play with optional poster thumbnails</p>
                <StyledButtonGroup>
                    <StyledButton onClick={handleOpenVideo}>
                        Video with Poster
                    </StyledButton>
                    
                    <StyledButton onClick={handleOpenVideoOnly}>
                        Video Only
                    </StyledButton>
                </StyledButtonGroup>
            </StyledSection>

            <StyledSection>
                <h3>Image Mode</h3>
                <p>Images will display full-screen</p>
                <StyledButtonGroup>
                    <StyledButton onClick={handleOpenImage}>
                        Open Sample Image
                    </StyledButton>
                    
                    <StyledButton onClick={handleOpenAnotherImage}>
                        Open Landscape Image
                    </StyledButton>
                </StyledButtonGroup>
            </StyledSection>

            <StyledInstructions>
                <h3>How to use in your components:</h3>
                <StyledCodeBlock>
{`import { useVideoPlayerStore } from '@/store/store';

const YourComponent = () => {
    const { openVideo, openImage } = useVideoPlayerStore();
    
    const handleVideoClick = () => {
        // Open video with optional poster
        openVideo(
            'your-video-url.mp4',
            'your-poster-image.jpg' // optional
        );
    };
    
    const handleImageClick = () => {
        // Open image full-screen
        openImage('your-image-url.jpg');
    };
    
    return (
        <div>
            <button onClick={handleVideoClick}>
                Play Video
            </button>
            <button onClick={handleImageClick}>
                View Image
            </button>
        </div>
    );
};`}
                </StyledCodeBlock>
            </StyledInstructions>
        </StyledExampleContainer>
    );
};

const StyledExampleContainer = styled.div`
    padding: ${rm(40)};
    max-width: ${rm(800)};
    margin: 0 auto;

    h2 {
        margin-bottom: ${rm(16)};
        color: ${colors.black100};
    }

    p {
        margin-bottom: ${rm(24)};
        color: ${colors.gray};
        line-height: 1.5;
    }

    h3 {
        margin-bottom: ${rm(12)};
        color: ${colors.black100};
        font-size: ${rm(18)};
    }
`;

const StyledSection = styled.div`
    margin-bottom: ${rm(32)};
    padding: ${rm(24)};
    background-color: ${colors.bgGray};
    border-radius: ${rm(8)};

    h3 {
        margin-bottom: ${rm(8)};
        color: ${colors.black100};
        font-size: ${rm(18)};
    }

    p {
        margin-bottom: ${rm(16)};
        color: ${colors.gray};
        font-size: ${rm(14)};
    }
`;

const StyledButtonGroup = styled.div`
    display: flex;
    gap: ${rm(16)};
    flex-wrap: wrap;
`;

const StyledButton = styled.button`
    padding: ${rm(12)} ${rm(24)};
    background-color: ${colors.blue};
    color: ${colors.white100};
    border: none;
    border-radius: ${rm(6)};
    cursor: pointer;
    font-size: ${rm(16)};
    transition: all 0.3s ease;

    &:hover {
        background-color: ${colors.blue90};
        transform: translateY(-2px);
    }

    &:active {
        transform: translateY(0);
    }
`;

const StyledInstructions = styled.div`
    background-color: ${colors.white100};
    padding: ${rm(24)};
    border-radius: ${rm(8)};
    border: 1px solid ${colors.bgGray};
    margin-top: ${rm(24)};
`;

const StyledCodeBlock = styled.pre`
    background-color: ${colors.black100};
    color: ${colors.white100};
    padding: ${rm(16)};
    border-radius: ${rm(4)};
    overflow-x: auto;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: ${rm(14)};
    line-height: 1.4;
    white-space: pre-wrap;
`;
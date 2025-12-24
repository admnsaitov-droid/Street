/**
 * @fileoverview 3D Scene loading skeleton component
 * 
 * This component provides a loading skeleton specifically designed for 3D scenes:
 * 1. Animated shimmer effect while scene loads
 * 2. Matches scene styling and positioning
 * 3. Smooth fade out when scene is ready
 * 4. Optimized for performance with viewport detection
 */

'use client'

import { useInView } from "@react-spring/web"
import styled from "styled-components"
import { SkeletonIcon } from "./SkeletonIcon"
import { media, rm } from "@/styles"
import Image from "next/image"

const StyledSceneSkeleton = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f8f9fc 0%, #e9ecef 100%);
    overflow: hidden;
    z-index: 2;
    transition: opacity 0.3s ease-out;

    &.-hidden {
        opacity: 0;
        pointer-events: none;
    }
`

const LoaderContainer = styled.div<{ $position: 'left' | 'right' | 'center', $theme: 'light' | 'dark', $translateBottom: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${rm(20)};
    position: absolute;
    top: 50%;

    .preview {
        position: absolute;
        top: 0;
        right: 0;
        width ${ rm(1139)};
        height: 100%;
    }
    
    ${props => {
        switch (props.$position) {
            case 'left':
                return `
                    left: 33%;
                    transform: translate(-50%, 0%);
                `;
            case 'right':
                return `
                    right: 30%;
                    transform: translate(50%, -50%);
                `;
            case 'center':
            default:
                return `
                    left: 50%;
                    transform: translate(-50%, -50%);
                `;
        }
    }}

    ${media.xsm`
        ${({ $translateBottom }: { $translateBottom: boolean }) => $translateBottom ? `transform: translate(-50%, 0%);` : ''}
    `}
`

const IconContainer = styled.div`
    position: relative;
    width: ${rm(127)};
    height: ${rm(127)};
    display: flex;
    align-items: center;
    justify-content: center;
    
    > svg:first-child {
        width: ${rm(103)};
        height: ${rm(103)};
        z-index: 2;
    }
`

const ProgressRing = styled.div<{ $progress: number, $theme: 'light' | 'dark' }>`
    position: absolute;
    top: 0;
    left: 0;
    width: ${rm(127)};
    height: ${rm(127)};
    z-index: 1;
    opacity: ${(props) => props.$progress > 0 ? 1 : 0};
    transition: opacity 0.2s ease;

    svg {
        width: 100%;
        height: 100%;
        transform: rotate(90deg);
        
        circle {
            fill: none;
            stroke: ${(props) => props.$theme === 'light' ? 'white' : 'black'};
            stroke-width: 2;
            stroke-dasharray: ${2 * Math.PI * 61.5};
            stroke-dashoffset: ${(props) => 2 * Math.PI * 61.5 * (1 - props.$progress / 100)};
            stroke-linecap: round;
            transition: stroke-dashoffset 0.3s ease;
        }
    }
`

const PercentageText = styled.div<{ $theme: 'light' | 'dark' }>`
    font-size: ${rm(14)};
    font-weight: 600;
    color: ${(props) => props.$theme === 'light' ? 'white' : 'black'};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`

const StyledIconsContainer = styled.div`
    width: ${rm(127)};
    height: ${rm(127)};
    position: relative;
`

interface SceneSkeletonProps {
    isLoading: boolean
    progress?: number // Progress percentage (0-100)
    className?: string
    position?: 'left' | 'right' | 'center' // Position of the loader
    theme?: 'light' | 'dark'
    previewSrc?: string
    label?: string
    translateBottom?: boolean
}

export const SceneSkeleton = ({ isLoading, progress = 0, className, position = 'center', theme = 'light', previewSrc, label = 'globe', translateBottom = false }: SceneSkeletonProps) => {
    const [ref, inView] = useInView()
    
    return (
        <StyledSceneSkeleton 
            ref={ref}
            className={`
                ${className || ''} 
                ${!isLoading ? '-hidden' : ''}
            `}
        >
            <LoaderContainer $position={position} $theme={theme} $translateBottom={translateBottom}>
                <StyledIconsContainer>
                    <IconContainer>
                        <SkeletonIcon label={label} />
                        <ProgressRing $progress={progress} $theme={theme}>
                            <svg viewBox="0 0 127 127">
                                <circle cx="63.5" cy="63.5" r="61.5" />
                            </svg>
                        </ProgressRing>
                    </IconContainer>
                </StyledIconsContainer>
                {previewSrc && <Image className="preview" src={previewSrc} alt="Preview" width={127} height={127} />}
                <PercentageText $theme={theme}>{Math.round(progress)}%</PercentageText>
            </LoaderContainer>
        </StyledSceneSkeleton>
    )
}

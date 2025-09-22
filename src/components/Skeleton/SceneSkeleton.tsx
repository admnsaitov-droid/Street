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

    &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 60px;
        height: 60px;
        margin: -30px 0 0 -30px;
        border: 3px solid rgba(0, 0, 0, 0.1);
        border-top: 3px solid #007bff;
        border-radius: 50%;
    }

    &::after {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
        background: linear-gradient(
            90deg, 
            rgba(255, 255, 255, 0) 0%, 
            rgba(255, 255, 255, 0.2) 20%, 
            rgba(255, 255, 255, 0.4) 60%, 
            rgba(255, 255, 255, 0) 100%
        );
        content: '';
    }

    &.-animate {
        &::before {
            animation: spin 1s linear infinite;
        }
        
        // &::after {
        //     animation: shimmer 2s infinite;
        // }
    }

    &.-hidden {
        opacity: 0;
        pointer-events: none;
    }

    @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
    }

    // @keyframes shimmer {
    //     0% { transform: translateX(-100%); }
    //     100% { transform: translateX(100%); }
    // }
`

interface SceneSkeletonProps {
    isLoading: boolean
    className?: string
}

export const SceneSkeleton = ({ isLoading, className }: SceneSkeletonProps) => {
    const [ref, inView] = useInView()
    
    return (
        <StyledSceneSkeleton 
            ref={ref}
            className={`
                ${className || ''} 
                ${inView ? '-animate' : ''} 
                ${!isLoading ? '-hidden' : ''}
            `}
        />
    )
}

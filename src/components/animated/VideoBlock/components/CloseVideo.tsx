'use client'

import useLoadingStore from "@/store/store";
import { rm } from "@/styles"
import styled from "styled-components"
import { forwardRef } from 'react'

interface CloseVideoProps {
    handleClickClose: () => void
}

const CloseVideo = forwardRef<HTMLDivElement, CloseVideoProps>(({ handleClickClose }: CloseVideoProps, ref) => {
    const setCurrentCursor = useLoadingStore((state: any) => state.setCurrentCursor);
    const setIsAboutVideoPlaying = useLoadingStore((state: any) => state.setIsAboutVideoPlaying);

    return (
        <StyledCloseVideo 
            ref={ref}
            onClick={(e) => {
                e.stopPropagation();
                handleClickClose();
                setIsAboutVideoPlaying(false);
            }} 
            onMouseEnter={(e) => {
                e.stopPropagation();
                setCurrentCursor({
                    type: 'default',
                })
            }}
            onMouseLeave={(e) => {
                e.stopPropagation();
            }}
        >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 17L17 1M17 17L1 1" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </StyledCloseVideo>
    )
});

CloseVideo.displayName = 'CloseVideo';

export default CloseVideo;

const StyledCloseVideo = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    width: ${rm(50)};
    height: ${rm(50)};
    background-color: black;
    border-radius: ${rm(9999)};
    display: flex;
    align-items: center;
    z-index: 1000;

    &:hover {
        opacity: 0.7;
    }

    transition: opacity 0.3s ease-in-out;

    svg {
        margin: auto;
    }
`;
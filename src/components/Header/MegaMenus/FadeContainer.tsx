'use client'

import useLoadingStore from "@/store/store";
import styled from "styled-components"

export const FadeContainer = () => {
    const isMegaMenuOpen = useLoadingStore((state: any) => state.isMegaMenuOpen);
    const setIsMegaMenuOpen = useLoadingStore((state: any) => state.setIsMegaMenuOpen);

    return (
        <StyledFadeContainer onClick={() => setIsMegaMenuOpen(false)} style={{opacity: isMegaMenuOpen ? 1 : 0, pointerEvents: isMegaMenuOpen ? 'all' : 'none'}}>
        </StyledFadeContainer>
    )
}

const StyledFadeContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: opacity 0.3s ease;
    z-index: 10;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(6px);
`
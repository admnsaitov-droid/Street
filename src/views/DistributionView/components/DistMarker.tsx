import { rm } from "@/styles"
import styled from "styled-components"

interface DistMarkerProps {
    isActive?: boolean
}

export const DistMarker = ({ isActive = false }: DistMarkerProps) => {
    return (
        <StyledMapMarker $isActive={isActive}>
            <StyledInnerSquare $isActive={isActive}>
            </StyledInnerSquare>
        </StyledMapMarker>
    )
}

const StyledMapMarker = styled.div<{ $isActive: boolean }>`
    width: ${rm(24)};
    height: ${rm(24)};
    background-color: ${({ $isActive }) => $isActive ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.2)'};
    border: 1px solid ${({ $isActive }) => $isActive ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.2)'};
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotate(45deg);
    transition: all 0.3s ease;
    
    ${({ $isActive }) => $isActive && `
        box-shadow: 0 0 12px rgba(255, 255, 255, 0.4);
    `}
`

const StyledInnerSquare = styled.div<{ $isActive: boolean }>`
    width: ${rm(10)};
    height: ${rm(10)};
    background-color: ${({ $isActive }) => $isActive ? 'rgba(255, 255, 255, 1)' : 'white'};
    transition: all 0.3s ease;
    
    ${({ $isActive }) => $isActive && `
        box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
    `}
`
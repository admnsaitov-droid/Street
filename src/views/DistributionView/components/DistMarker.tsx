import { rm } from "@/styles"
import styled from "styled-components"

export const DistMarker = () => {
    return (
        <StyledMapMarker>
            <StyledInnerSquare>
            </StyledInnerSquare>
        </StyledMapMarker>
    )
}

const StyledMapMarker = styled.div`
    width: ${rm(24)};
    height: ${rm(24)};
    background-color: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba( 255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotate(45deg);
`

const StyledInnerSquare = styled.div`
    width: ${rm(10)};
    height: ${rm(10)};
    background-color: white;
`
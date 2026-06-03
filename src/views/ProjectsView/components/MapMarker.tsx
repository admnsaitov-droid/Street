import { rm } from "@/styles"
import styled from "styled-components"

export const MapMarker = () => {
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
    background-color: rgba(237, 30, 42, 0.16);
    border: 1px solid rgba(237, 30, 42, 0.16);
    display: flex;
    align-items: center;
    justify-content: center;
`

const StyledInnerSquare = styled.div`
    width: ${rm(10)};
    height: ${rm(10)};
    background-color: #ED1E2A;
`
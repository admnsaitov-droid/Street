import { rm } from "@/styles"
import styled from "styled-components"

interface ColorVariantProps {
    color: string
    colorName: string
    setActiveColor: (color: {
        name: string
        color: string
    }) => void
    activeColor: {
        name: string
        color: string
    }
}

export const ColorVariant = ({ color, colorName, setActiveColor, activeColor }: ColorVariantProps) => {
    return (
        <StyledColorVariant active={activeColor.name === colorName} onClick={() => setActiveColor({ name: colorName, color })}>
            <StyledColor style={{ backgroundColor: color }}></StyledColor>
            <svg className="checkedIcon" style={{ display: activeColor.name === colorName ? "block" : "none" }} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.4395 3.16406C12.6429 3.16406 12.8369 3.25045 12.9785 3.40137C13.1198 3.55204 13.1982 3.75558 13.1982 3.96582C13.1981 4.17588 13.1197 4.37873 12.9785 4.5293L6.08887 11.8721C5.79183 12.1887 5.30874 12.1887 5.01172 11.8721L2.29004 8.97168C2.22001 8.89703 2.16452 8.80855 2.12695 8.71191C2.08939 8.61525 2.07031 8.51149 2.07031 8.40723C2.07033 8.19711 2.14888 7.99438 2.29004 7.84375C2.43163 7.69283 2.62566 7.60645 2.8291 7.60645C3.03246 7.60651 3.22565 7.69288 3.36719 7.84375L5.54688 10.167L11.9014 3.40137C12.0429 3.25063 12.2362 3.1641 12.4395 3.16406Z" fill="white" stroke="white" stroke-width="0.218182"/>
            </svg>
        </StyledColorVariant>
    )
}

const StyledColorVariant = styled.div<{ active: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    border: ${rm(5)} solid #FFFFFFE5;
    position: relative;
    cursor: pointer;
    border-radius: ${rm(4)};

    transition: border-color 0.3s ease-in-out;

    border-color: ${({ active }) => active ? "#0040DD1A" : "#FFFFFFE5"};

    .checkedIcon{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: ${rm(16)};
        height: ${rm(16)};
    }
`

const StyledColor = styled.div`
    width: ${rm(24)};
    height: ${rm(24)};
    border-radius: ${rm(2)};
`
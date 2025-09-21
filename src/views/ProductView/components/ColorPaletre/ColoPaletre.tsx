import { media, rm } from "@/styles"
import styled from "styled-components"
import { ColorVariant } from "./components/ColorVariant"
import { useColorStore } from "@/store/store"

interface ColorPaletreProps {
    colors: {
        name: string
        color: string
    }[]
}

export const ColorPaletre = ({ colors }: ColorPaletreProps) => {    

    const { activeColor, setActiveColor } = useColorStore()

    return (
        <StyledColorPaletre>
            {colors.map((color) => (
                <ColorVariant key={color.name} color={color.color} colorName={color.name} setActiveColor={setActiveColor} activeColor={activeColor || { name: "", color: "" }} />
            ))}
        </StyledColorPaletre>
    )
}

const StyledColorPaletre = styled.div`
    background-color: #FFFFFFE5;
    padding: ${rm(12)} ${rm(15)};
    display: flex;
    gap: ${rm(8)};
    border: 1px solid #B7BCCA33;
    border-radius: ${rm(4)};
    position: absolute;
    left: ${rm(50)};
    bottom: ${rm(50)};
    z-index: 2;

    ${media.xsm`
        left: 50%;
        transform: translateX(-50%);
        max-width: 90%;
        width: 90%
        flex-wrap: wrap;
    `}
`
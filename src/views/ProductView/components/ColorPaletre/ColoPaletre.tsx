import { media, rm } from "@/styles"
import styled from "styled-components"
import { ColorVariant } from "./components/ColorVariant"
import { useColorStore } from "@/store/store"
import { fontGolosText } from "@/styles/fonts"
import { useEffect } from "react"

interface ColorPaletreProps {
    mainColors: {
        name: string
        color: string
    }[]
    accentColors: {
        name: string
        color: string
    }[]
}

export const ColorPaletre = ({ mainColors, accentColors }: ColorPaletreProps) => {    
    const { 
        activeMainColor, 
        activeAccentColor, 
        colorMode,
        materialAccentColor,
        setActiveMainColor, 
        setActiveAccentColor,
        setColorMode 
    } = useColorStore()

    // Check if there's an initial material accent color
    const hasAccentColor = materialAccentColor && materialAccentColor.color

    // If no accent color and mode is accent, switch to main
    useEffect(() => {
        if (!hasAccentColor && colorMode === 'accent') {
            setColorMode('main')
        }
    }, [hasAccentColor, colorMode, setColorMode])

    const currentColors = colorMode === 'main' ? mainColors : accentColors
    const activeColor = colorMode === 'main' ? activeMainColor : activeAccentColor
    const setActiveColor = colorMode === 'main' ? setActiveMainColor : setActiveAccentColor

    // Debug logging
    if (colorMode === 'accent') {
        console.log('ColorPaletre accentColors:', accentColors)
        console.log('ColorPaletre currentColors:', currentColors)
    }

    return (
        <StyledColorPaletre>
            <StyledTop>
                <StyledText 
                    isActive={colorMode === 'main'} 
                    onClick={() => setColorMode('main')}
                >
                    Main Color
                </StyledText>
                {hasAccentColor && (
                    <>
                        <div className="divider"></div>
                        <StyledText 
                            isActive={colorMode === 'accent'} 
                            onClick={() => setColorMode('accent')}
                        >
                            Accent color
                        </StyledText>
                    </>
                )}
            </StyledTop>
            <StyledColorsWrapper>
                {currentColors.map((color, index) => (
                    <ColorVariant 
                        key={`${colorMode}-${color.color}-${index}`} 
                        color={color.color} 
                        colorName={color.name} 
                        setActiveColor={setActiveColor} 
                        activeColor={activeColor || { name: "", color: "" }} 
                    />
                ))}
            </StyledColorsWrapper>
        </StyledColorPaletre>
    )
}

const StyledColorPaletre = styled.div`
    gap: ${rm(8)};
    position: absolute;
    left: ${rm(50)};
    bottom: ${rm(50)};
    z-index: 2;
    display: flex;
    flex-direction: column;
    width: fit-content;
    min-width: unset;

    ${media.xsm`
        position: relative;
        left: 0;
        bottom: 0;
        backdrop-filter: blur(32px);
        padding: ${rm(16)} ${rm(0)};
        width: 100%;
        max-width: 100%;
        overflow-x: hidden;
    `}
`

const StyledTop = styled.div`
    display: flex;
    gap: ${rm(10)};
    align-items: center;

    .divider{
        width: ${rm(4)};
        height: ${rm(4)};
        background-color: black;
    }
`

const StyledText = styled.p<{ isActive: boolean }>`
    font-size: ${rm(16)};
    ${fontGolosText(400)};
    color: ${({ isActive }) => isActive ? 'black' : '#868D9C'};
    transition: color 0.3s ease-in-out;
    text-transform: uppercase;
    cursor: pointer;

    &:hover {
        color: black;
    }
`

const StyledColorsWrapper = styled.div`
    background-color: #FFFFFFCC;
    padding: ${rm(10)} ${rm(13)};
    display: flex;
    gap: ${rm(8)};
    border: 1px solid #B7BCCA33;
    border-radius: ${rm(4)};
    z-index: 2;
    width: fit-content;
    min-width: unset;

    ${media.xsm`
        overflow-x: auto;
        overflow-y: hidden;
        width: 100%;
        max-width: 100%;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: thin;
        background-color: transparent;
        box-shadow: 0px 4px 30px 0px #0000000D;
        
        &::-webkit-scrollbar {
            height: 4px;
        }
        
        &::-webkit-scrollbar-track {
            background: transparent;
        }
        
        &::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 2px;
        }
    `}
`
import { useEffect } from "react"
import { AnimatedText } from "@/components/animated/AnimatedText/AnimatedText"
import { AccordionText } from "@/components/animated/AccordionText/AccordionText"
import UnderlineLink from "@/components/animated/UnderlineLink/UnderlineLink"
import { media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import styled from "styled-components"
import { usePreview } from "./Preview"
import { animated, useInView, useSpring } from "@react-spring/web"
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath"
import { AnimLink } from "@/layouts/AnimatedRouterLayout/AnimatedRouterLayout"

interface LineProps {
    line: any
    index: number
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export const Line = ({ line, index, onMouseEnter, onMouseLeave }: LineProps) => {
    const setUrl = usePreview(state => state.setUrl)
    const setPoster = usePreview(state => state.setPoster)
    const setRef = usePreview(state => state.setRef)
    const setRoute = usePreview(state => state.setRoute)
    const setIndex = usePreview(state => state.setIndex)
    const activeIndex = usePreview(state => state.index)

    const [ref, inView] = useInView()



    const handleEnter = () => {
        if (window.innerWidth <= 576) { return }
        onMouseEnter?.()
        set()
    }
    const handleLeave = () => {
        if (window.innerWidth <= 576) { return }
        unset()
        onMouseLeave?.()
    }

    const set = () => {
        if (window.innerWidth <= 576) { return }
        setTimeout(() => {
            setUrl('poster-only') // Just use a constant to indicate poster mode
            setPoster(getMediaStrapiPath(line?.poster))
            setRef(ref.current)
            setRoute(line?.slug || '')
            setIndex(index)
            console.log('enter', line?.poster, ref.current)
        }, 0)
    }
    const unset = () => {
        if (window.innerWidth <= 576) { return }
        setUrl('')
        setPoster('')
        setRoute('')
        setIndex(-1)
    }

    const exploreSpring = useSpring({
        opacity: index === activeIndex ? 1 : 0,
        config: { tension: 280, friction: 60 },
    })


    return (
        <StyledLine ref={ref} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
            <StyledHiddenLink href={`/lines/${line.slug}`}></StyledHiddenLink>
            <StyledType>
                <div className="square"></div>
                <div className="text">
                    {line.type}
                </div>
            </StyledType>
            <StyledTitle className="title">{line.name}</StyledTitle>
            <StyledDescriptionContainer>
                <AccordionText 
                    className="description"
                    enabled={index === activeIndex}
                    duration={600}
                    stagger={120}
                    textClassName="description-text"
                >
                    {line.description}
                </AccordionText>
            </StyledDescriptionContainer>
            <StyledExploreButton style={exploreSpring}>
                <UnderlineLink href={`/lines/${line.slug}`} lineColor="#0040DD" text="Explore"></UnderlineLink>
            </StyledExploreButton>
        </StyledLine>
    )
}   


const StyledLine = styled.div`
    display: flex;
    cursor: pointer;
    position: relative;
    border-top: 1px dashed #B7BCCA;
    padding: ${rm(20)} 0;
    width: 100%;

    transition: border-color 0.3s ease-in-out;

    &:hover{
        border-color: #0040DD;

        .title, .text{
            color: #0040DD;
        }

        .square{
            background-color: #0040DD;
        }
    }
`

const StyledType = styled.div`
    width: ${rm(260)};
    display: flex;
    align-items: center;
    height: fit-content;
    gap: ${rm(5)};

    ${media.lg`
        width: ${rm(215)};
    `}

    ${media.md`
        width: ${rm(340)};
    `}

    .square{
        width: ${rm(6)};
        height: ${rm(6)};
        background-color: #6F7685;

        transition: color 0.3s ease-in-out;
    }

    .text{
        font-size: ${rm(20)};
        line-height: 110%;
        ${fontGolosText(400)};
        color: #6F7685;
        text-transform: uppercase;

        transition: color 0.3s ease-in-out;

        ${media.lg`
            font-size: ${rm(16)};
        `}
    }
`

const StyledTitle = styled.p`
    font-size: ${rm(48)};
    line-height: 100%;
    ${fontGolosText(400)};
    color: #B7BCCA;
    letter-spacing: -0.06em;
    width: ${rm(410)};
    margin-left: ${rm(528)};
    margin-right: ${rm(30)};

    transition: color 0.3s ease-in-out;

    ${media.lg`
        width: ${rm(327)};
        font-size: ${rm(40)};
        margin-left: ${rm(348)};
        margin-right: ${rm(10)};
    `}

    ${media.md`
        font-size: ${rm(24)};
        margin-left: ${rm(58)};
        margin-right: ${rm(10)};
    `}
`

const StyledDescriptionContainer = styled.div`
    ${fontGolosText(400)};
    color: #6F7685;
    width: ${rm(370)};
    margin-right: ${rm(170)};

    transition: color 0.3s ease-in-out;

    ${media.lg`
        width: ${rm(328)};
        margin-right: ${rm(60)};
    `}

    .description-text {
        font-size: ${rm(16)};
        line-height: 130%;
        
        ${media.lg`
            font-size: ${rm(14)};
        `}
    }
`

const StyledExploreButton = styled(animated.div)`
    font-size: ${rm(16)};
    line-height: 130%;
    ${fontGolosText(400)};
    color: #0040DD;
    height: fit-content;

    ${media.lg`
        font-size: ${rm(14)};
    `}
`

const StyledHiddenLink = styled(AnimLink)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
`
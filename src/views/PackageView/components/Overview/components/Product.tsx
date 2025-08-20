import { fontGolosText } from "@/styles/fonts"
import { colors, media, rm } from "@/styles"
import styled from "styled-components"
import { animated, useInView, useSpring } from "@react-spring/web"
import UnderlineLink from "@/components/animated/UnderlineLink/UnderlineLink"
import { useProductPreview } from "./ProductPreview"
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath"
import { AccordionText } from "@/components/animated/AccordionText/AccordionText"
import { AnimLink } from "@/layouts/AnimatedRouterLayout/AnimatedRouterLayout"

interface ProductProps {
    product: any
    index: number
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export const Product = ({ product, index, onMouseEnter, onMouseLeave }: ProductProps) => {
    const activeIndex = useProductPreview(state => state.index)
    const setUrl = useProductPreview(state => state.setUrl)
    const setPoster = useProductPreview(state => state.setPoster)
    const setRef = useProductPreview(state => state.setRef)
    const setRoute = useProductPreview(state => state.setRoute)
    const setIndex = useProductPreview(state => state.setIndex)
    const [ref, inView] = useInView()


    const exploreSpring = useSpring({
        opacity: index === activeIndex ? 1 : 0,
        config: { tension: 280, friction: 60 },
    })

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
            setPoster(getMediaStrapiPath(product?.previewImage))
            setRef(ref.current)
            setRoute(product?.slug || '')
            setIndex(index)
            console.log('enter', product?.previewImage, ref.current)
        }, 0)
    }
    const unset = () => {
        if (window.innerWidth <= 576) { return }
        setUrl('')
        setPoster('')
        setRoute('')
        setIndex(-1)
    }

    return (
        <StyledProduct onMouseEnter={handleEnter} onMouseLeave={handleLeave} ref={ref}>
            <StyledHiddenLink href={`/products/${product.slug}`} />
            <StyledTopContainer>
                <div className="left">
                    <StyledModel>{product?.model}</StyledModel>
                    <StyledProductName>{product?.name}</StyledProductName>
                </div>
                <StyledExploreButton style={exploreSpring}>
                    <UnderlineLink href={`/products/${product.slug}`} lineColor="#0040DD" text="Explore"></UnderlineLink>
                </StyledExploreButton>
            </StyledTopContainer>
            <StyledDescriptionContainer>
                <AccordionText 
                    className="description"
                    enabled={index === activeIndex}
                    duration={600}
                    stagger={120}
                    textClassName="description-text"
                >
                    {product?.previewDescription}
                </AccordionText>
            </StyledDescriptionContainer>
        </StyledProduct>
    )
}

const StyledProduct = styled.div`
    display: flex;
    flex-direction: column;
    cursor: pointer;
    padding: ${rm(20)} 0;
    position: relative;

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            z-index: 1;
            opacity: 0;
            background-image: 
                radial-gradient(circle 1px at 4px 0.5px, ${colors.blue} 100%, transparent 100%),
                radial-gradient(circle 1px at 12px 0.5px, ${colors.blue} 100%, transparent 100%),
                radial-gradient(circle 1px at 20px 0.5px, ${colors.blue} 100%, transparent 100%),
                radial-gradient(circle 1px at 28px 0.5px, ${colors.blue} 100%, transparent 100%),
                radial-gradient(circle 1px at 36px 0.5px, ${colors.blue} 100%, transparent 100%),
                radial-gradient(circle 1px at 44px 0.5px, ${colors.blue} 100%, transparent 100%),
                radial-gradient(circle 1px at 52px 0.5px, ${colors.blue} 100%, transparent 100%),
                radial-gradient(circle 1px at 60px 0.5px, ${colors.blue} 100%, transparent 100%);
            background-size: 16px 1px;
            background-repeat: repeat-x;
            transition: opacity 0.3s ease-in-out;
        }

        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background-image: 
                radial-gradient(circle 1px at 4px 0.5px, #B7BCCA 100%, transparent 100%),
                radial-gradient(circle 1px at 12px 0.5px, #B7BCCA 100%, transparent 100%),
                radial-gradient(circle 1px at 20px 0.5px, #B7BCCA 100%, transparent 100%),
                radial-gradient(circle 1px at 28px 0.5px, #B7BCCA 100%, transparent 100%),
                radial-gradient(circle 1px at 36px 0.5px, #B7BCCA 100%, transparent 100%),
                radial-gradient(circle 1px at 44px 0.5px, #B7BCCA 100%, transparent 100%),
                radial-gradient(circle 1px at 52px 0.5px, #B7BCCA 100%, transparent 100%),
                radial-gradient(circle 1px at 60px 0.5px, #B7BCCA 100%, transparent 100%);
            background-size: 16px 1px;
            background-repeat: repeat-x;
            transition: opacity 0.3s ease-in-out;
        }

    &:hover{
        .left{
            p{
                color: ${colors.blue};
            }
        }

        &::before{
            opacity: 1;
        }
    }
`

const StyledTopContainer = styled.div`
    display: flex;
    justify-content: space-between;
    gap: ${rm(340)};

    ${media.lg`
        gap: ${rm(270)};
    `}

    .left{
        display: flex;
        gap: ${rm(10)};
    }
`

const StyledModel = styled.p`
    font-size: ${rm(20)};
    line-height: 110%;
    ${fontGolosText(400)};
    color: ${colors.gray};
    text-transform: uppercase;
    width: ${rm(142)};
    transition: color 0.3s ease-in-out;

    ${media.lg`
        font-size: ${rm(16)};
        width: ${rm(102)};
    `}
`

const StyledProductName = styled.p`
    font-size: ${rm(24)};
    line-height: 100%;
    ${fontGolosText(400)};
    color: ${colors.black100};
    text-transform: uppercase;
    width: ${rm(407)};
    transition: color 0.3s ease-in-out;

    ${media.lg`
        font-size: ${rm(20)};
        width: ${rm(327)};
    `}
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

const StyledDescriptionContainer = styled.div`
    padding-left: ${rm(152)};

    ${media.lg`
        padding-left: ${rm(112)};
    `}

    .description-text {
        font-size: ${rm(16)};
        line-height: 130%;
        ${fontGolosText(400)};
        color: #6F7685;
        width: ${rm(407)};

        ${media.lg`
            font-size: ${rm(14)};
            width: ${rm(327)};
        `}
    }
`

const StyledHiddenLink = styled(AnimLink)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
`
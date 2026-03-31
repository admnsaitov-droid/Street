import { fontGolosText } from "@/styles/fonts"
import { colors, media, rm } from "@/styles"
import styled from "styled-components"
import { animated, useInView, useSpring } from "@react-spring/web"
import UnderlineLink from "@/components/animated/UnderlineLink/UnderlineLink"
import { useProductPreview } from "./ProductPreview"
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath"
import { AccordionText } from "@/components/animated/AccordionText/AccordionText"
import { AnimLink } from "@/layouts/AnimatedRouterLayout/AnimatedRouterLayout"
import { useWindowWidth } from "@react-hook/window-size"

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

    const width = useWindowWidth()


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
            <StyledHiddenLink href={`/products/${product.slug}`} aria-label={`View ${product.name} product details`} />
            <StyledTopContainer>
                <div className="left">
                    {product?.model && <StyledModel as="p">{product?.model}</StyledModel>}
                    {product?.name && <StyledProductName as="h5">{product?.name}</StyledProductName>}
                </div>
                {width > 768 && <StyledExploreButton style={exploreSpring}>
                    <UnderlineLink href={`/products/${product.slug}`} lineColor="#0040DD" text="Explore"></UnderlineLink>
                </StyledExploreButton>}
            </StyledTopContainer>
            <StyledDescriptionContainer>
                {product?.previewDescription && 
                    <p className="description-text">
                        {product?.previewDescription}
                    </p>
                }
                {width <= 768 && <StyledExploreButton>
                    <UnderlineLink href={`/products/${product.slug}`} lineColor="#0040DD" text="Explore"></UnderlineLink>
                </StyledExploreButton>}
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

    ${media.md`
        padding: ${rm(16)} 0;
    `}

    ${media.xsm`
        padding: ${rm(20)} 0;
    `}

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            z-index: 1;
            opacity: 0;
            background-image: repeating-linear-gradient(
                to right,
                ${colors.blue} 0,
                ${colors.blue} 1px,
                transparent 1px,
                transparent 5px
            );
            background-size: auto;
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
            background-image: repeating-linear-gradient(
                to right,
                #B7BCCA 0,
                #B7BCCA 1px,
                transparent 1px,
                transparent 5px
            );
            background-size: auto;
            background-repeat: repeat-x;
            transition: opacity 0.3s ease-in-out;
        }

    &:hover{
        .left{
            p{
                color: ${colors.blue};
            }

            h5{
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

    ${media.md`
        gap: ${rm(0)};
    `}

    ${media.xsm`
        flex-direction: column-reverse;
        gap: ${rm(4)};
    `}

    .left{
        display: flex;
        gap: ${rm(10)};

        ${media.xsm`
            gap: ${rm(4)};
            flex-direction: column-reverse;
        `}
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

    ${media.md`
        width: ${rm(111)};
    `}

    ${media.xsm`
        font-size: ${rm(14)};
        width: 100%;
    `}
`

const StyledProductName = styled.p`
    font-size: ${rm(24)};
    line-height: 100%;
    ${fontGolosText(400)};
    color: ${colors.blue};
    text-transform: uppercase;
    width: ${rm(407)};
    transition: color 0.3s ease-in-out;

    ${media.lg`
        font-size: ${rm(20)};
        width: ${rm(327)};
    `}

    ${media.md`
        font-size: ${rm(18)};
        width: ${rm(354)};
    `}

    ${media.xsm`
        font-size: ${rm(14)};
        width: 100%;
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

    ${media.md`
        margin-top: ${rm(10)};
    `}

    ${media.xsm`
        font-size: ${rm(12)};
    `}
`

const StyledDescriptionContainer = styled.div`
    padding-left: ${rm(152)};

    ${media.lg`
        padding-left: ${rm(112)};
    `}

    ${media.md`
        padding-left: ${rm(121)};
        margin-top: ${rm(10)};
    `}

    ${media.xsm`
        padding-left: 0;
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

        ${media.md`
            font-size: ${rm(14)};
            width: 100%;
        `}

        ${media.xsm`
            font-size: ${rm(12)};
            width: 100%;
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
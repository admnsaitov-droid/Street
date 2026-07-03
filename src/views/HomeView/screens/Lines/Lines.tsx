import { ProductPreview, useProductPreview } from "@/views/PackageView/components/Overview/components/ProductPreview";
import { Product } from "@/views/PackageView/components/Overview/components/Product";
import { colors, media, rm } from "@/styles";
import { fontGolosText } from "@/styles/fonts";
import styled from "styled-components";
import { useEffect, useMemo } from "react";
import { AnimatedText } from "@/components/animated/AnimatedText/AnimatedText";
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath";
import Image from "next/image";
import { animated } from "@react-spring/web";
import UnderlineLink from "@/components/animated/UnderlineLink/UnderlineLink";
import { LinesGrid } from "@/components/LinesGrid/LinesGrid";

interface LinesProps {
  linesData: any;
  isTop?: boolean;
  exploreLineText?: string;
  isHome?: boolean;
}

export const Lines = ({ linesData, isTop = true, isHome = false, exploreLineText }: LinesProps) => {
    const setAllUrls = useProductPreview(state => state.setAllUrls)
    const containerRef = useProductPreview(state => state.containerRef)

    const lines = linesData?.lines || []

    const allProducts = useMemo(() => (
        Array.isArray(lines)
            ? isHome
                ? lines.flatMap((line: any) => line?.produkties?.slice(0, 3) || [])
                : lines.flatMap((line: any) => line?.produkties || [])
            : []
    ), [lines, isHome])

    useEffect(() => {
        setAllUrls(allProducts)
    }, [allProducts, setAllUrls])

    console.log(linesData)

  return (
    <StyledLines ref={containerRef} isTop={isTop}>
        <ProductPreview />
        {isTop && <StyledTopContainer>
            <AnimatedText className="title" tag="h2">
                {linesData?.title}
            </AnimatedText>
            <div className="right">
                <div className="descriptionMain">
                    <AnimatedText className="description-animated" tag="p">
                        {linesData?.description}
                    </AnimatedText>
                </div>
            </div>
        </StyledTopContainer>}
        <LinesGrid linesData={lines} machinesText={linesData?.machinesText} exploreText={linesData?.overviewText} isHome={isHome} />
        {/* {Array.isArray(lines) && lines.length > 0 && (
            <StyledLinesContainer>
                {lines.map((line: any, lineIndex: number) => (
                    <StyledLineGroup key={line?.id || lineIndex}>
                        <StyledLineInfo>
                            {line?.linii?.name && <StyledLineName as="h4">{line?.linii?.name}</StyledLineName>}
                            <div className="translateImageWrapper">
                                <div className="stickyWrapper" style={{ position: isHome ? 'relative' : 'sticky', top: isHome ? '0%' : '30%'}}>
                                    <div className="imageWrapper">
                                        <Image src={getMediaStrapiPath(line?.linePreviewImage)} alt={line?.linii?.name} width={440} height={282} />
                                    </div>
                                    <StyledExploreButton>
                                        <UnderlineLink href={`/lines/${line?.linii?.slug}`} lineColor="#0040DD" text={exploreLineText || 'Explore line'}></UnderlineLink>
                                    </StyledExploreButton>
                                </div>
                            </div>
                        </StyledLineInfo>
                        <StyledProducts>
                            {isHome ? line?.produkties?.slice(0, 3).map((product: any, productIndexWithinLine: number) => {
                                return (
                                    <Product key={product?.id || productIndexWithinLine} product={product} index={productIndexWithinLine} />
                                )
                            }) : line?.produkties && line?.produkties.length > 0 && line?.produkties.map((product: any, productIndexWithinLine: number) => {
                                const globalIndex = (lines
                                    .slice(0, lineIndex)
                                    .reduce((acc: number, l: any) => acc + ((l?.produkties || []).length), 0)) + productIndexWithinLine
                                return (
                                    <Product key={product?.id || globalIndex} product={product} index={globalIndex} />
                                )
                            })}
                        </StyledProducts>
                    </StyledLineGroup>
                ))}
            </StyledLinesContainer>
        )} */}
    </StyledLines>
  )
};

const StyledLines = styled.div<{ isTop: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: ${rm(150)} ${rm(50)};
  position: relative;

  ${({ isTop }) => !isTop && `
    padding: 0 !important;
    margin-top: ${rm(80)} !important;

    ${media.xsm`
        margin-top: ${rm(0)} !important;
    `}
  `}

  ${media.md`
    padding: ${rm(150)} ${rm(25)};
  `}

  ${media.xsm`
    padding: ${rm(70)} ${rm(16)};
  `}
`;

const StyledTopContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: ${rm(50)};

    ${media.xsm`
        flex-direction: column;
        gap: ${rm(30)};
        margin-bottom: ${rm(30)};
    `}

    .title{
        color: ${colors.gray};
        font-size: ${rm(20)};
        line-height: 110%;
        letter-spacing: -0.01em;
        ${fontGolosText(400)};
        text-transform: uppercase;
        height: fit-content !important;
        
        ${media.lg`
            font-size: ${rm(16)};
        `}

        ${media.xsm`
            font-size: ${rm(14)};
        `}
    }

    .right{
        width: ${rm(1100)};
        
        ${media.lg`
            width: ${rm(890)};
        `}

        ${media.md`
            width: ${rm(476)};
        `}

        ${media.xsm`
            width: 100%;
        `}

        .descriptionMain{
            color: ${colors.black100};
            font-size: ${rm(40)};
            line-height: 115%;
            letter-spacing: -0.01em;
            ${fontGolosText(400)};
            
            span:nth-child(1){
                >:nth-child(1){
                    padding-left: ${rm(113)} !important;
                }
            }
            
            ${media.lg`
                font-size: ${rm(32)};
            `}

            ${media.md`
                font-size: ${rm(24)};
                
                span:nth-child(1){
                    >:nth-child(1){
                        padding-left: ${rm(0)} !important;
                    }
                }
            `}

            ${media.xsm`
                font-size: ${rm(20)};
            `}
        }
    }
`

const StyledLinesContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: ${rm(50)};
`

const StyledLineGroup = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    width: 100%;
    padding: ${rm(0)} 0 ${rm(50)} 0;
    position: relative;

    ${media.md`
        padding-bottom: ${rm(70)};
        flex-direction: column;
    `}

    ${media.xsm`
        gap: ${rm(30)};
        padding-bottom: ${rm(0)};
    `}

    &::before {
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

        ${media.xsm`
            display: none;
        `}
    }
`

const StyledLineInfo = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    gap: ${rm(20)};
    align-self: stretch;
    
    .translateImageWrapper {
        position: relative;
        flex: 1;
        min-height: 0;

        .stickyWrapper{
            position: sticky;
            top: 30%;
            left: 0;
            z-index: 1;
            border-radius: ${rm(8)};
            overflow: hidden;
            width: ${rm(440)};
            display: flex;
            flex-direction: column;
            gap: ${rm(20)};

            ${media.md`
                width: 100%;
            `}
        }

        .imageWrapper {
            height: ${rm(282)};
            width: 100%;
            position: relative;

            img{
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }
`

const StyledLineName = styled.p`
    font-size: ${rm(30)};
    line-height: 110%;
    ${fontGolosText(400)};
    text-transform: uppercase;
    color: ${colors.black100};
    margin-top: ${rm(20)};

    ${media.lg`
        font-size: ${rm(24)};
    `}

    ${media.md`
        font-size: ${rm(18)};
    `}

    ${media.xsm`
        font-size: ${rm(20)};
    `}
`

const StyledProducts = styled.div`
    display: flex;
    flex-direction: column;
`   

const StyledExploreButton = styled(animated.div)<{ lineColor?: string }>`
    font-size: ${rm(16)};
    line-height: 130%;
    ${fontGolosText(400)};
    color: ${({ lineColor }) => lineColor || '#0040DD'};
    height: fit-content;

    ${media.lg`
        font-size: ${rm(14)};
    `}
`
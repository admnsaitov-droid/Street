import { StyledAnnotation, StyledSubtitle } from "@/views/PackagesView/screens/Package/Package"
import { fontGolosText } from "@/styles/fonts"
import { colors, media, rm } from "@/styles"
import styled from "styled-components"
import { Accordion } from "./Accordion"
import { Description } from "./Description"
import { Specifications } from "./Specifications"
import { Muscles } from "./Muscles"
import { AnimatedText } from "@/components/animated/AnimatedText/AnimatedText"

interface ProductOverviewProps {
    data: any
}

export const ProductOverview = ({ data }: ProductOverviewProps) => {
    return (
        <StyledTop>
            <StyledAnnotation tag="h2">{data?.aboutText}</StyledAnnotation>
            <div className="right">
                <StyledTitle tag="h2">{data?.productInfo?.descriptionMain}</StyledTitle>
                <div className="bottom">
                    <div className="accordions">
                        <Accordion title={data?.productInfo?.descriptionTitle}>
                            <Description model={data?.model} description={data?.productInfo?.description} />
                        </Accordion>
                        <Accordion title={data?.productInfo?.specificationsTitle}>
                            <Specifications specifications={data?.productInfo?.specification} />
                        </Accordion>
                        <Accordion title={data?.productInfo?.musclesTitle}>
                            <Muscles muscles={data?.productInfo?.muscles} />
                        </Accordion>
                    </div>
                </div>
            </div>
        </StyledTop>
    )
}

const StyledTop = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: ${rm(40)};

    ${media.xsm`
        flex-direction: column;
        gap: ${rm(30)};
    `}

    .right{
        display: flex;
        flex-direction: column;
        gap: ${rm(40)};
        width: ${rm(1100)};

        ${media.lg`
            width: ${rm(890)};    
        `}

        ${media.md`
            width: ${rm(475)};
        `}

        ${media.xsm`
            width: 100%;
        `}

        .bottom{
            width: 100%;
            padding-left: ${rm(113)};

            ${media.md`
                padding-left: 0;
            `}

            .accordions{
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: ${rm(20)};
                width: 100%;
                // width: ${rm(550)};

                // ${media.lg`
                //     width: ${rm(440)};
                // `}
            }
        }
    }
`

const StyledTitle = styled(AnimatedText)`
    font-size: ${rm(40)};
    line-height: 115%;
    ${fontGolosText(400)};
    letter-spacing: -0.01em;
    color: ${colors.black100};

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
`
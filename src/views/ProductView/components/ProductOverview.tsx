import { StyledAnnotation, StyledSubtitle } from "@/views/PackagesView/screens/Package/Package"
import { fontGolosText } from "@/styles/fonts"
import { colors, media, rm } from "@/styles"
import styled from "styled-components"
import { Accordion } from "./Accordion"
import { Description } from "./Description"
import { Specifications } from "./Specifications"
import { Muscles } from "./Muscles"

interface ProductOverviewProps {
    data: any
}

export const ProductOverview = ({ data }: ProductOverviewProps) => {
    return (
        <StyledTop>
            <StyledAnnotation>about</StyledAnnotation>
            <div className="right">
                <StyledTitle>{data?.productInfo?.descriptionMain}</StyledTitle>
                <div className="bottom">
                    <div className="accordions">
                        <Accordion title="Description">
                            <Description model={data?.model} description={data?.productInfo?.description} />
                        </Accordion>
                        <Accordion title="Specifications">
                            <Specifications specifications={data?.productInfo?.specification} />
                        </Accordion>
                        <Accordion title="Muscles">
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

    .right{
        display: flex;
        flex-direction: column;
        gap: ${rm(40)};
        width: ${rm(1100)};

        ${media.lg`
            width: ${rm(890)};    
        `}

        .bottom{
            width: 100%;
            padding-left: ${rm(113)};

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

const StyledTitle = styled.p`
    font-size: ${rm(40)};
    line-height: 100%;
    ${fontGolosText(400)};
    text-indent: ${rm(113)};
    letter-spacing: -0.01em;
    color: ${colors.black100};

    ${media.lg`
        font-size: ${rm(32)};
    `}
`
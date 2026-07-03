import { StyledAnnotation, StyledSubtitle } from "@/views/PackagesView/screens/Package/Package"
import { fontGolosText } from "@/styles/fonts"
import { colors, media, rm } from "@/styles"
import styled from "styled-components"
import { AnimatedText } from "@/components/animated/AnimatedText/AnimatedText"

interface HistoryOverviewProps {
    data: any
}

export const HistoryOverview = ({ data }: HistoryOverviewProps) => {
    return (
        <StyledTop>
            <StyledAnnotation className="blue80">{data.blockName}</StyledAnnotation>
            <div className="right">
                <StyledTitle>{data?.title}</StyledTitle>
                <div className="bottom">
                    <StyledSubtitle className="blue80">{data?.descriptionMain}</StyledSubtitle>
                </div>
            </div>
        </StyledTop>
    )
}

const StyledTop = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;

    ${media.xsm`
        flex-direction: column;
        gap: ${rm(15)};
    `}
    
    .blue80{
        color: #99B3F1;
    }

    .right{
        display: flex;
        flex-direction: column;
        gap: ${rm(20)};
        width: ${rm(1100)};

        ${media.lg`
            width: ${rm(890)};    
        `}

        ${media.md`
            width: ${rm(475)};
        `}

        ${media.xsm`
            width: 100%;
            gap: ${rm(15)};

            >:nth-child(1){
                letter-spacing: -0.03em !important;
            }
        `}

        .bottom{
            width: 100%;
            padding-left: ${rm(113)};
            display: flex;
            justify-content: space-between;
            align-items: flex-end;

            ${media.md`
                padding-left: 0;
            `}

            >:nth-child(1){
                width: ${rm(550)};

                ${media.lg`
                    width: ${rm(440)};
                `}

                ${media.md`
                    width: 100%;
                `}
            }
        }
    }
`

const StyledTitle = styled(AnimatedText)`
    font-size: ${rm(40)};
    line-height: 115%;
    ${fontGolosText(400)};
    letter-spacing: -0.01em;
    color: ${colors.white100};

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
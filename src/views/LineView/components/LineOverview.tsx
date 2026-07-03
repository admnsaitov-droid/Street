import { StyledAnnotation, StyledSubtitle } from "@/views/PackagesView/screens/Package/Package"
import { fontGolosText } from "@/styles/fonts"
import { colors, media, rm } from "@/styles"
import styled from "styled-components"
import { AnimatedText } from "@/components/animated/AnimatedText/AnimatedText"

interface LineOverviewProps {
    data: any
    overviewText: string
}

export const LineOverview = ({ data, overviewText }: LineOverviewProps) => {
    return (
        <StyledTop>
            {overviewText && <StyledAnnotation tag="h2">{overviewText}</StyledAnnotation>}
            <div className="right">
                {data?.title && <StyledTitle tag="h2">{data?.title}</StyledTitle>}
                <div className="bottom">
                    {data?.description && <StyledSubtitle tag="p">{data?.description}</StyledSubtitle>}
                </div>
            </div>
        </StyledTop>
    )
}

const StyledTop = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: ${rm(150)};

    ${media.xsm`
        margin-top: ${rm(70)};
        flex-direction: column;
        gap: ${rm(10)};
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
            gap: ${rm(20)};
        `}

        ${media.xsm`
            width: 100%;
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
import { StyledAnnotation, StyledSubtitle } from "@/views/PackagesView/screens/Package/Package"
import { fontGolosText } from "@/styles/fonts"
import { colors, media, rm } from "@/styles"
import styled from "styled-components"

interface LineOverviewProps {
    data: any
}

export const LineOverview = ({ data }: LineOverviewProps) => {
    return (
        <StyledTop>
            <StyledAnnotation>line overview</StyledAnnotation>
            <div className="right">
                <StyledTitle>{data?.title}</StyledTitle>
                <div className="bottom">
                    <StyledSubtitle>{data?.description}</StyledSubtitle>
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
            display: flex;
            justify-content: space-between;
            align-items: flex-end;

            >:nth-child(1){
                width: ${rm(550)};

                ${media.lg`
                    width: ${rm(440)};
                `}
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
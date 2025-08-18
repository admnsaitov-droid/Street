import { StyledAnnotation, StyledSubtitle } from "@/views/PackagesView/screens/Package/Package"
import { fontGolosText } from "@/styles/fonts"
import { colors, media, rm } from "@/styles"
import styled from "styled-components"

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
    
    .blue80{
        color: #99B3F1;
    }

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
    color: ${colors.white100};

    ${media.lg`
        font-size: ${rm(32)};
    `}
`
import { colors, media, rm } from "@/styles"
import styled from "styled-components"
import { HistoryOverview } from "./components/HistoryOverview"
import { StyledSubtitle } from "@/views/PackagesView/screens/Package/Package"
import { MediaComponent } from "@/components/MediaComponent/MediaComponent"

interface HistoryProps {
    data: any
}

export const History = ({ data }: HistoryProps) => {
    return (
        <StyledHistory>
            <HistoryOverview data={data} />
            <StyledBottom>
                <StyledLeft>
                    <StyledSecndaryImageContainer>
                        <MediaComponent media={data?.mediaSecondary} className="image" />
                    </StyledSecndaryImageContainer>
                    <StyledSubtitle className="blue80">
                        {data?.descriptionSecondary}
                    </StyledSubtitle>
                </StyledLeft>
                <StyledMainImageContainer>
                    <MediaComponent media={data?.mediaMain} className="image" />
                </StyledMainImageContainer>
            </StyledBottom>
        </StyledHistory>
    )
}

const StyledHistory = styled.div`
    width: 100%;
    background-color: ${colors.blue};
    padding: ${rm(150)} ${rm(50)};
`

const StyledBottom = styled.div`
    padding-right: ${rm(113)};
    justify-content: space-between;
    display: flex;
    margin-top: ${rm(40)};
`

const StyledMainImageContainer = styled.div`
    position: relative;
    width: ${rm(870)};
    height: ${rm(698)};
    border-radius: ${rm(10)};
    overflow: hidden;

    ${media.lg`
        width: ${rm(664)};
        height: ${rm(498)};    
    `}

    .image{
        width: 100%;
        height: 100%;
    }
`

const StyledLeft = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${rm(20)};
    width: ${rm(407)};

    ${media.lg`
        width: ${rm(327)};
    `}

    .blue80{
        color: #99B3F1;
    }
`

const StyledSecndaryImageContainer = styled.div`
    width: 100%;
    position: relative;
    height: ${rm(325)};
    border-radius: ${rm(10)};
    overflow: hidden;

    ${media.lg`
        height: ${rm(245)}; 
    `}

    .image{
        width: 100%;
        height: 100%;
    }
`
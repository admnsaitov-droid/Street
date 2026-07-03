import { colors, media, rm } from "@/styles"
import styled from "styled-components"
import { HistoryOverview } from "./components/HistoryOverview"
import { StyledSubtitle } from "@/views/PackagesView/screens/Package/Package"
import { MediaComponent } from "@/components/MediaComponent/MediaComponent"
import { useWindowWidth } from "@react-hook/window-size"
import { MaskImageAppear } from "@/components/animated/MaskImageAppear/MaskImageAppear"
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath"

interface HistoryProps {
    data: any
}

export const History = ({ data }: HistoryProps) => {
    const width = useWindowWidth();

    const imageGallery = [
        data?.mediaSecondary?.poster,
        data?.mediaMain?.poster
    ].filter(Boolean).map(media => getMediaStrapiPath(media));

    return (
        <StyledHistory>
            <HistoryOverview data={data} />
            <StyledBottom>
                <StyledLeft>
                    <StyledSecndaryImageContainer>
                        <MaskImageAppear className="image-container" enabled={width > 768}>
                            <MediaComponent media={data?.mediaSecondary} className="image" parallax={true} imageGallery={imageGallery} />
                        </MaskImageAppear>
                    </StyledSecndaryImageContainer>
                    {width > 768 && <StyledSubtitle className="blue80">
                        {data?.descriptionSecondary}
                    </StyledSubtitle>}
                </StyledLeft>
                <StyledMainImageContainer>
                    <MaskImageAppear className="image-container" enabled={width > 768}>
                        <MediaComponent media={data?.mediaMain} className="image" parallax={true} imageGallery={imageGallery} />
                    </MaskImageAppear>
                    {width <= 768 && <StyledSubtitle className="blue80">
                        {data?.descriptionSecondary}
                    </StyledSubtitle>}
                </StyledMainImageContainer>
            </StyledBottom>
        </StyledHistory>
    )
}

const StyledHistory = styled.div`
    width: 100%;
    background-color: ${colors.blue};
    padding: ${rm(150)} ${rm(50)};

    ${media.md`
        padding: ${rm(150)} ${rm(25)};
    `}

    ${media.xsm`
        padding: ${rm(70)} ${rm(16)};
    `}

    .blue80{
        color: #99B3F1;
    }
`

const StyledBottom = styled.div`
    padding-right: ${rm(113)};
    justify-content: space-between;
    display: flex;
    margin-top: ${rm(40)};

    ${media.md`
        padding-right: 0;
        gap: ${rm(10)};
    `}

    ${media.xsm`
        margin-top: ${rm(30)};
        flex-direction: column;
        gap: ${rm(10)};
    `}
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

    ${media.md`
        width: ${rm(475)};
        height: auto;
        display: flex;
        flex-direction: column;
        gap: ${rm(20)};

        >:nth-child(2){
            width: ${rm(354)};
        }
    `}

    ${media.xsm`
        width: 100%;

        >:nth-child(2){
            width: 100%;
        }
    `}

    .image{
        width: 100%;
        height: 100%;

        ${media.md`
            height: ${rm(356)};
        `}

        ${media.xsm`
            height: ${rm(246)};
        `}
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

    ${media.md`
        width: ${rm(233)};
    `}

    ${media.xsm`
        width: 100%;
    `}
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

    ${media.md`
        height: ${rm(175)};
    `}

    ${media.xsm`
        height: ${rm(246)};
    `}

    .image{
        width: 100%;
        height: 100%;
    }
`
import styled from "styled-components"
import { StyledSubtitle } from "@/views/PackagesView/screens/Package/Package"
import { colors, media, rm } from "@/styles"
import { fontGolosText, fontSageGrotesk } from "@/styles/fonts"
import { MediaComponent } from "@/components/MediaComponent/MediaComponent"

interface InspirationProps {
    data: any
}

export const Inspiration = ({ data }: InspirationProps) => {
    return (
        <StyledInspiration>
            <StyledTopContainer>
                <StyledAboutTitle>
                    <span>
                        {data?.title?.firstWord}
                    </span>
                    <span className="first">
                        {data?.title?.secondWord}
                    </span>
                    <span>
                        {data?.title?.thirdWord}
                    </span>
                </StyledAboutTitle>
                <div className="right">
                    <StyledSubtitle>
                        {data?.descriptionFirst}
                    </StyledSubtitle>
                    <StyledSubtitle>
                        {data?.descriptionSecond}
                    </StyledSubtitle>
                </div>
            </StyledTopContainer>
            <StyledMediaContainer>
                <MediaComponent media={data?.media} className="image" />
            </StyledMediaContainer>
        </StyledInspiration>
    )
}

const StyledInspiration = styled.div`
    width: 100%;
    padding: ${rm(150)} ${rm(50)};
`

const StyledTopContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: ${rm(50)};

    .right{
        display: flex;
        gap: ${rm(10)};

        >:nth-child(1){
            width: ${rm(540)};

            ${media.lg`
                width: ${rm(420)};
            `}
        }

        >:nth-child(2){
            width: ${rm(407)};

            ${media.lg`
                width: ${rm(327)};
            `}
        }
    }
`

export const StyledAboutTitle = styled.p`
    line-height: 90%;
    letter-spacing: -0.01em;
    font-size: ${rm(48)};
    text-transform: uppercase;
    ${fontGolosText(600)};
    color: ${colors.black100};
    gap: ${rm(10)};
    display: flex;
    width: ${rm(440)};
    flex-wrap: wrap;
    width: ${rm(540)};
    
    ${media.lg`
        font-size: ${rm(40)};
        width: ${rm(420)};
    `}

    >:nth-child(3){
        margin-top: ${rm(-40)};
    }

    .first{
        ${fontSageGrotesk(400)} !important;
        color: ${colors.red} !important;
        letter-spacing: -0.02em;
        line-height: 105%;
    }
`

const StyledMediaContainer = styled.div`
    width: 100%;
    height: ${rm(800)};
    position: relative;
    border-radius: ${rm(10)};
    overflow: hidden;

    ${media.lg`
        height: ${rm(600)};
    `}

    .image{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
`
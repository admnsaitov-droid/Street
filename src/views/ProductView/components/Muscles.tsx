import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import styled from "styled-components"
import { MediaComponent } from "@/components/MediaComponent/MediaComponent"

interface MusclesProps {
    muscles: any
}

export const Muscles = ({ muscles }: MusclesProps) => {
    return (
        <StyledMuscles>
            <StyledSubtitle>{muscles?.text}</StyledSubtitle>
            <StyledImageContainer>
                <MediaComponent media={muscles?.media} className="image" />
            </StyledImageContainer>
        </StyledMuscles>
    )
}

const StyledMuscles = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${rm(15)};
    width: ${rm(550)};

    ${media.lg`
        width: ${rm(440)};
    `}
`

const StyledSubtitle = styled.p`
    font-size: ${rm(20)};
    color: ${colors.gray};
    ${fontGolosText(400)};
    line-height: 130%;
    width: 100%;
    word-break: break-word;

    ${media.lg`
        font-size: ${rm(16)};
    `}
`

const StyledImageContainer = styled.div`
    width: 100%;
    height: ${rm(450)};
    background-color: ${colors.gray};
    position: relative;

    ${media.lg`
        height: ${rm(375)};
    `}

    .image{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
`
import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import styled from "styled-components"
import { MediaComponent } from "@/components/MediaComponent/MediaComponent"
import { MaskImageAppear } from "@/components/animated/MaskImageAppear/MaskImageAppear"
import { AnimatedText } from "@/components/animated/AnimatedText/AnimatedText"

const hasMedia = (media: any) => media && (media.poster || media.video)

interface MusclesProps {
    muscles: any
    musclesDescription?: string | null
}

export const Muscles = ({ muscles, musclesDescription }: MusclesProps) => {
    return (
        <StyledMuscles>
            {musclesDescription && <StyledDescription tag="p">{musclesDescription}</StyledDescription>}
            {hasMedia(muscles?.media) ? (
                <StyledImageContainer>
                    <MaskImageAppear className="image-container">
                        <MediaComponent media={muscles.media} className="image" imageFit="contain" />
                    </MaskImageAppear>
                </StyledImageContainer>
            ) : null}
        </StyledMuscles>
    )
}

const StyledMuscles = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${rm(15)};
    width: 100%;
`

const StyledDescription = styled(AnimatedText)`
    font-size: ${rm(20)};
    color: ${colors.gray};
    ${fontGolosText(400)};
    line-height: 130%;
    width: 100%;
    word-break: break-word;

    ${media.lg`
        font-size: ${rm(16)};
    `}

    ${media.xsm`
        font-size: ${rm(14)};
    `}
`

const StyledImageContainer = styled.div`
    width: 100%;
    height: ${rm(450)};
    position: relative;
    background: #F8F9FC;
    overflow: hidden;
    border-radius: ${rm(4)};

    width: ${rm(550)};

    ${media.lg`
        width: ${rm(440)};
    `}

    ${media.lg`
        height: ${rm(375)};
    `}

    ${media.md`
        height: ${rm(404)};
    `}

    ${media.xsm`
        height: ${rm(280)};
        width: 100%;
    `}

    .image{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
`
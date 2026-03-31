import { useMemo } from "react"
import { media, rm } from "@/styles"
import styled from "styled-components"
import { MediaComponent } from "@/components/MediaComponent/MediaComponent"
import { MaskImageAppear } from "@/components/animated/MaskImageAppear/MaskImageAppear"
import { Specifications } from "./Specifications"

const MUSCLES_SPEC_FIELDS: { textKey: string; valueKey: string }[] = [
    { textKey: "userHeightText", valueKey: "userHeightValue" },
    { textKey: "userAgeText", valueKey: "userAgeValue" },
]

const hasMedia = (media: any) => media && (media.poster || media.video)

interface MusclesProps {
    muscles: any
    data: any
    specificationTexts?: Record<string, string | null> | null
}

export const Muscles = ({ muscles, data, specificationTexts }: MusclesProps) => {
    const musclesSpecs = useMemo(() => {
        if (!data || !specificationTexts) return []
        return MUSCLES_SPEC_FIELDS.filter(({ valueKey }) => data[valueKey] != null).map(({ textKey, valueKey }) => ({
            id: valueKey,
            param: specificationTexts[textKey] ?? "",
            value: data[valueKey],
        }))
    }, [data, specificationTexts])

    return (
        <StyledMuscles>
            {musclesSpecs.length > 0 && <Specifications specifications={musclesSpecs} />}
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
import { useMemo } from "react"
import { StyledAnnotation, StyledSubtitle } from "@/views/PackagesView/screens/Package/Package"
import { fontGolosText } from "@/styles/fonts"
import { colors, media, rm } from "@/styles"
import styled from "styled-components"
import { Accordion } from "./Accordion"
import { Description } from "./Description"
import { ProductDescriptionSection } from "./ProductDescriptionSection"
import { Specifications } from "./Specifications"
import { Muscles } from "./Muscles"
import { AnimatedText } from "@/components/animated/AnimatedText/AnimatedText"

const SPEC_FIELDS: { textKey: string; valueKey: string }[] = [
    { textKey: "widthText", valueKey: "widthValue" },
    { textKey: "lengthText", valueKey: "lengthValue" },
    { textKey: "heightText", valueKey: "heightValue" },
    { textKey: "equipmentWeightText", valueKey: "equipmentWeightValue" },
    { textKey: "minimumLoadText", valueKey: "minimumLoadValue" },
    { textKey: "maximumLoadText", valueKey: "maximumLoadValue" },
    { textKey: "userHeightText", valueKey: "userHeightValue" },
    { textKey: "userAgeText", valueKey: "userAgeValue" },
]

export interface ProductOverviewProps {
    data: any
    specificationTexts?: Record<string, string | null> | null
}

export const ProductOverview = ({ data, specificationTexts }: ProductOverviewProps) => {
    const aboutText = data?.aboutText || "About"

    const specifications = useMemo(() => {
        if (!data || !specificationTexts) return []
        return SPEC_FIELDS.filter(({ valueKey }) => data[valueKey] != null).map(({ textKey, valueKey }) => ({
            id: valueKey,
            param: specificationTexts[textKey] ?? "",
            value: data[valueKey],
        }))
    }, [data, specificationTexts])

    const hasSpecifications = specifications.length > 0 && data?.productInfo?.specificationsTitle

    return (
        <StyledTop>
            <StyledAnnotation tag="h2">{aboutText}</StyledAnnotation>
            <div className="right">
                {data?.productInfo?.descriptionMain && <StyledTitle tag="h2">{data?.productInfo?.descriptionMain}</StyledTitle>}
                <div className="bottom">
                    <div className="accordions">
                        {data?.productInfo?.descriptionTitle &&
                         (data?.model && data?.productInfo?.description || data?.productInfo?.productDescriptionSection?.length > 0) && (
                            <Accordion title={data.productInfo.descriptionTitle} iconKey="description">
                                <StyledDescriptionContent>
                                    {data?.model && data?.productInfo?.description && (
                                        <Description model={data.model} description={data.productInfo.description} />
                                    )}
                                    {data?.productInfo?.productDescriptionSection?.length > 0 && (
                                        <ProductDescriptionSection items={data.productInfo.productDescriptionSection} />
                                    )}
                                </StyledDescriptionContent>
                            </Accordion>
                        )}
                        {hasSpecifications && (
                            <Accordion title={data.productInfo.specificationsTitle} iconKey="specifications">
                                <Specifications specifications={specifications} />
                            </Accordion>
                        )}
                        {data?.productInfo?.musclesTitle &&
                         (data?.productInfo?.muscles || data?.productInfo?.musclesDescription) && (
                            <Accordion title={data?.productInfo?.musclesTitle} iconKey="muscles">
                                <Muscles muscles={data.productInfo.muscles} musclesDescription={data.productInfo.musclesDescription} />
                            </Accordion>
                        )}
                    </div>
                </div>
            </div>
        </StyledTop>
    )
}

const StyledTop = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: ${rm(40)};

    ${media.xsm`
        flex-direction: column;
        gap: ${rm(30)};
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
        `}

        ${media.xsm`
            width: 100%;
        `}

        .bottom{
            width: 100%;
            padding-left: ${rm(113)};

            ${media.md`
                padding-left: 0;
            `}

            .accordions{
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: ${rm(20)};
                width: 100%;
                // width: ${rm(550)};

                // ${media.lg`
                //     width: ${rm(440)};
                // `}
            }
        }
    }
`

const StyledDescriptionContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${rm(24)};
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
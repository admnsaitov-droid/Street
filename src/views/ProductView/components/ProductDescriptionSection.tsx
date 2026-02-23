import Image from "next/image"
import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import styled from "styled-components"
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath"

const THUMB_SIZE = 80

interface ProductDescriptionSectionProps {
    items: Array<{ id: number; text: string; media?: { poster?: any } }>
}

export const ProductDescriptionSection = ({ items }: ProductDescriptionSectionProps) => {
    if (!items?.length) return null

    return (
        <StyledList>
            {items.map((item) => {
                const poster = item?.media?.poster
                if (!poster) return null
                return (
                    <StyledItem key={item.id}>
                        <StyledThumb>
                            <Image
                                src={getMediaStrapiPath(poster)}
                                alt={item.text || ""}
                                fill
                                sizes={`${THUMB_SIZE}px`}
                                style={{ objectFit: "cover" }}
                            />
                        </StyledThumb>
                        <StyledLabel>{item.text}</StyledLabel>
                    </StyledItem>
                )
            })}
        </StyledList>
    )
}

const StyledList = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${rm(20)};
    width: 100%;
`

const StyledItem = styled.div`
    display: flex;
    align-items: center;
    gap: ${rm(16)};
`

const StyledThumb = styled.div`
    position: relative;
    width: ${rm(THUMB_SIZE)};
    height: ${rm(THUMB_SIZE)};
    flex-shrink: 0;
    border-radius: ${rm(6)};
    overflow: hidden;
    background: ${colors.gray};
`

const StyledLabel = styled.span`
    font-size: ${rm(20)};
    ${fontGolosText(400)};
    line-height: 130%;
    color: ${colors.black100};

    ${media.lg`
        font-size: ${rm(16)};
    `}

    ${media.xsm`
        font-size: ${rm(14)};
    `}
`

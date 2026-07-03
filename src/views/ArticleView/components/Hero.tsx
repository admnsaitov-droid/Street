import { MediaComponent } from "@/components/MediaComponent/MediaComponent"
import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import { formatDate } from "@/utils/dateFormat"
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath"
import Image from "next/image"
import styled from "styled-components"

export const Hero = ({ data }: { data: any }) => {
    return (
        <StyledHero>
            <StyledTitle>{data.title}</StyledTitle>
            <StyledAuthor>
                <div className="imageContainer">
                    <Image src={getMediaStrapiPath(data?.author?.avatar)} alt={data?.author?.name} fill priority />
                </div>
                <span className="name">{data?.author?.name}</span>
                <div className="divider" />
                <StyledDate>
                    {formatDate(data?.date)}
                </StyledDate>
            </StyledAuthor>
            <MediaComponent media={data?.mainMedia} className="image" parallax={true} isExtendable={false} priority={true} />
        </StyledHero>
    )
}

const StyledHero = styled.div`
    width: 100%;
    padding: ${rm(50)} ${rm(112)};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    ${media.md`
        padding: ${rm(50)} ${rm(0)};
    `}

    ${media.xsm`
        padding: ${rm(35)} ${rm(0)};
    `}

    .image{
        width: 100%;
        height: ${rm(627)};
        border-radius: ${rm(4)};
        overflow: hidden;
        margin-top: ${rm(50)};

        ${media.md`
            height: ${rm(300)};
        `}

        ${media.xsm`
            height: ${rm(200)};
        `}
    }
`

const StyledTitle = styled.h1`
    font-size: ${rm(40)};
    ${fontGolosText(400)};
    color: ${colors.black100};
    line-height: 100%;
    letter-spacing: -0.01em;
    margin-bottom: ${rm(20)};
    text-align: center;
    width: ${rm(902)};

    ${media.md`
        font-size: ${rm(32)};
        width: ${rm(718)};
    `}

    ${media.xsm`
        font-size: ${rm(24)};
        width: 100%;
    `}
`

const StyledAuthor = styled.div`
    display: flex;
    align-items: center;
    gap: ${rm(5)};

    .imageContainer{
        width: ${rm(32)};
        height: ${rm(32)};
        border-radius: 50%;
        overflow: hidden;
        position: relative;

        img{
            width: 100%;
            height: 100%;
        }
    }

    .name{
        color: #868D9C;
        font-size: ${rm(16)};
        ${fontGolosText(400)};
        line-height: 130%;
    }

    .divider{
        background-color: #868D9C;
        width: ${rm(4)};
        height: ${rm(4)};
        margin: 0 ${rm(5)};
    }
`

const StyledDate = styled.div`
    font-size: ${rm(16)};
    ${fontGolosText(400)};
    line-height: 130%;
    color: #868D9C;
    text-transform: none;
    letter-spacing: 0;
`
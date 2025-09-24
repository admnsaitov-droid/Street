import { AnimLink } from "@/layouts/AnimatedRouterLayout/AnimatedRouterLayout"
import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath"
import Image from "next/image"
import styled from "styled-components"

interface ProductCardProps {
    data: any
}

export const ProductCard = ({ data }: ProductCardProps) => {
    return (
        <StyledProductCard>
            <StyledHiddenLink href={`/products/${data?.slug}`}/>
            <StyledWrapper>
                <StyledImageContainer>
                    <Image src={getMediaStrapiPath(data?.previewImage)} alt={data?.name} fill />
                </StyledImageContainer>
                <StyledContent>
                    <h3 className="title">{data?.name}</h3>
                        <p className="subtitle">{data?.model}</p>
                    </StyledContent>
                </StyledWrapper>
        </StyledProductCard>
    )
}

const StyledProductCard = styled.div`
    width: ${rm(447.5)};
    cursor: pointer;
    position: relative;

    ${media.lg`
        width: ${rm(327.5)};
    `}

    ${media.md`
        width: ${rm(233)};
    `}

    ${media.xsm`
        width: 100%;
    `}

    &:hover{
        .title{
            color: ${colors.blue};
        }

        .subtitle{
            color: ${colors.blue};
        }

        img{
            transform: scale(1.01);
        }
    }
`

const StyledWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${rm(10)};
`

const StyledImageContainer = styled.div`
    position: relative;
    width: 100%;
    height: ${rm(367.5)};
    overflow: hidden;
    border-radius: ${rm(4)};

    ${media.lg`
        height: ${rm(246)};    
    `}

    ${media.md`
        height: ${rm(175)};    
    `}

    ${media.xsm`
        height: ${rm(246)};    
    `}

    img {
        object-fit: cover;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transition: transform 0.3s ease-in-out;
    }
`

const StyledContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${rm(6)};

    .title{
        font-size: ${rm(22)};
        ${fontGolosText(500)};
        line-height: 100%;
        letter-spacing: -0.01em;
        color: ${colors.black100};
        text-transform: uppercase;
        margin: 0;
        padding: 0;
        font-weight: inherit;
        font-family: inherit;

        transition: color 0.3s ease-in-out;

        ${media.lg`
            font-size: ${rm(18)};
        `}

        ${media.xsm`
            font-size: ${rm(14)};
        `}
    }

    .subtitle{
        font-size: ${rm(16)};
        ${fontGolosText(400)};
        line-height: 130%;
        color: ${colors.gray};

        transition: color 0.3s ease-in-out;

        ${media.lg`
            font-size: ${rm(14)};
        `}

        ${media.xsm`
            font-size: ${rm(12)};
        `}
    }
`

const StyledHiddenLink = styled(AnimLink)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
`
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
            <StyledHiddenLink href={`/products/${data?.slug}`} aria-label={`View ${data?.name} product details`}/>
            <StyledWrapper>
                <StyledImageContainer>
                    <Image src={getMediaStrapiPath(data?.previewImage)} alt={data?.name} fill />
                </StyledImageContainer>
                <StyledContent>
                    {data?.name && <h3 className="title">{data?.name}</h3>}
                    {data?.model && <p className="subtitle">{data?.model}</p>}
                    </StyledContent>
                </StyledWrapper>
        </StyledProductCard>
    )
}

const StyledProductCard = styled.div`
    width: 100%;
    cursor: pointer;
    position: relative;

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
    gap: ${rm(12)};
`

const StyledImageContainer = styled.div`
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: ${rm(4)};
    background: #EAECF2;

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
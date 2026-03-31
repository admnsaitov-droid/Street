import { colors } from "@/styles/colors"
import styled from "styled-components"
import { media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import Image from "next/image"
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath"
import { formatDate } from "@/utils/dateFormat"
import { AnimLink } from "@/layouts/AnimatedRouterLayout/AnimatedRouterLayout"

interface ArticleCardProps {
    article: any
}

export const ArticleCard = ({ article }: ArticleCardProps) => {

    return (
        <StyledArticleCard>
            <StyledHiddenLink href={`/articles/${article?.slug}`} aria-label={`Read article: ${article?.title}`} />
            <div className="dividerMain" />
            <StyledContent>
                <StyledTitle>
                    <div className="square" />
                    {/* <span className="text">{article?.type}</span> */}
                    <span className="text">Event</span>
                </StyledTitle>
                <StyledDescription className="description" as="h3">
                    {article?.title}
                </StyledDescription>
                <StyledImageContainer className="imageContainer">
                    <Image src={getMediaStrapiPath(article?.poster)} alt={article?.title} fill/>
                </StyledImageContainer>
                {article?.date && (
                    <StyledDate>
                        {formatDate(article.date)}
                    </StyledDate>
                )}
            </StyledContent>
            <div className="dividerMain" />
        </StyledArticleCard>
    )
}

const StyledArticleCard = styled.div`
    width: 100%;
    cursor: pointer;
    position: relative;

    @media (min-width: 768px) {
        &:hover{
            .description{
                color: ${colors.blue};
            }

            .imageContainer{
                opacity: 0.1;

                img{
                    transform: scale(1.02);
                }
            }
        }
    }



    .dividerMain{
        width: 100%;
        height: 1px;
        background: repeating-linear-gradient(
            to right,
            ${colors.gray} 0,
            ${colors.gray} 1px,
            transparent 1px,
            transparent 5px
        );
        background-size: auto;
        border: none;
        position: relative;
    }
`

const StyledContent = styled.div`
    padding: ${rm(20)};
    margin-bottom: ${rm(12)};
    display: flex;
    flex-direction: column;
    gap: ${rm(20)};
`

const StyledTitle = styled.div`
    display: flex;
    align-items: center;
    gap: ${rm(5)};

    .square{
        width: ${rm(4)};
        height: ${rm(4)};
        background-color: ${colors.gray};
    }

    .text{
        font-size: ${rm(20)};
        ${fontGolosText(400)};
        line-height: 110%;
        text-transform: uppercase;
        color: ${colors.gray};

        ${media.lg`
            font-size: ${rm(16)};
        `}
    }
`

const StyledDescription = styled.div`
    font-size: ${rm(22)};
    ${fontGolosText(500)};
    line-height: 100%;
    color: ${colors.black100};
    letter-spacing: -0.01em;
    text-transform: uppercase;
    transition: color 0.3s ease-in-out;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    height: ${rm(44)};

    ${media.lg`
        font-size: ${rm(18)};
        height: ${rm(38)};
    `}
`

const StyledDate = styled.div`
    font-size: ${rm(16)};
    ${fontGolosText(400)};
    line-height: 130%;
    color: ${colors.gray};
    text-transform: none;
    letter-spacing: 0;

    ${media.lg`
        font-size: ${rm(14)};
    `}
`

const StyledImageContainer = styled.div`
    width: 100%;
    height: ${rm(211)};
    position: relative;
    opacity: 1;
    border-radius: ${rm(4)};
    overflow: hidden;

    transition: opacity 0.3s ease-in-out;

    img{
        width: 100%;
        height: 100%;
        object-fit: cover;

        transition: transform 0.3s ease-in-out;
    }

    ${media.lg`
        height: ${rm(161)};
    `}
`

const StyledHiddenLink = styled(AnimLink)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
`
import React from "react"
import { MediaComponent } from "@/components/MediaComponent/MediaComponent"
import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import styled from "styled-components"

interface ContentItem {
    __component: string
    id: number
    [key: string]: any
}

interface ContentRendererProps {
    content: ContentItem[]
}

export const ContentRenderer = ({ content }: ContentRendererProps) => {
    const renderContentItem = (item: ContentItem, index: number) => {
        switch (item.__component) {
            case 'article.underline-text':
                return <UnderlineText key={index} data={item} />
            case 'article.simple-text':
                return <SimpleText key={index} data={item} />
            case 'article.verse-text':
                return <VerseText key={index} data={item} />
            case 'article.media-block':
                return <MediaBlock key={index} data={item} />
            default:
                console.warn(`Unknown content component: ${item.__component}`)
                return null
        }
    }

    return (
        <StyledContentRenderer>
            {content.map((item, index) => renderContentItem(item, index))}
        </StyledContentRenderer>
    )
}

// Helper function to render rich text content
const renderRichText = (content: any): React.ReactNode => {
    if (typeof content === 'string') {
        return content
    }
    
    if (Array.isArray(content)) {
        return content.map((item, index) => renderRichText(item))
    }
    
    if (content && typeof content === 'object') {
        if (content.type === 'paragraph') {
            return (
                <p key={content.id || Math.random()}>
                    {content.children?.map((child: any, index: number) => renderRichText(child))}
                </p>
            )
        }
        
        if (content.type === 'text') {
            let textElement: React.ReactNode = content.text || ''
            
            if (content.underline) {
                textElement = <u>{textElement}</u>
            }
            if (content.italic) {
                textElement = <em>{textElement}</em>
            }
            if (content.bold) {
                textElement = <strong>{textElement}</strong>
            }
            
            return textElement
        }
        
        // Handle other rich text types
        if (content.children) {
            return content.children.map((child: any, index: number) => renderRichText(child))
        }
    }
    
    return null
}

// Underline Text Component
const UnderlineText = ({ data }: { data: any }) => {
    return (
        <StyledUnderlineText>
            {data.text?.map((textItem: any, index: number) => (
                <span key={index}>{renderRichText(textItem)}</span>
            ))}
        </StyledUnderlineText>
    )
}

// Simple Text Component
const SimpleText = ({ data }: { data: any }) => {
    return (
        <StyledSimpleText>
            {data.title && <h3>{renderRichText(data.title)}</h3>}
            {data.text?.map((textItem: any, index: number) => (
                <div key={index}>{renderRichText(textItem)}</div>
            ))}
        </StyledSimpleText>
    )
}

// Verse Text Component
const VerseText = ({ data }: { data: any }) => {
    return (
        <StyledVerseText>
            <blockquote>
                <p>{renderRichText(data.quote)}</p>
                {data.author && <cite>{renderRichText(data.author)}</cite>}
            </blockquote>
        </StyledVerseText>
    )
}

// Media Block Component
const MediaBlock = ({ data }: { data: any }) => {
    return (
        <StyledMediaBlock>
            <MediaComponent 
                media={data.media} 
                className="media" 
                parallax={false} 
                isExtendable={false} 
            />
            {data.text && <p className="caption">{renderRichText(data.text)}</p>}
        </StyledMediaBlock>
    )
}

// Styled Components
const StyledContentRenderer = styled.div`
    width: 100%;
    max-width: ${rm(800)};
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: ${rm(40)};

    ${media.md`
        width: 100%;
        max-width: 100%;
    `}

    ${media.xsm`
        gap: ${rm(10)};
    `}
`

const StyledUnderlineText = styled.div`
    font-size: ${rm(16)};
    ${fontGolosText(400)};
    color: #6F7685;
    line-height: 130%;
    position: relative;
    padding-bottom: ${rm(10)};
    margin-top: ${rm(50)};
    padding-bottom: ${rm(40)};
    margin-bottom: ${rm(40)};
    
    &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        background-image: repeating-linear-gradient(
            to right,
            #B7BCCA 0,
            #B7BCCA 1px,
            transparent 1px,
            transparent 5px
        );
        background-size: auto;
        background-repeat: repeat-x;
    }
`

const StyledSimpleText = styled.div`
    h3 {
        font-size: ${rm(32)};
        ${fontGolosText(400)};
        color: ${colors.black100};
        line-height: 130%;
        margin-bottom: ${rm(24)};

        ${media.md`
            font-size: ${rm(24)};
        `}

        ${media.xsm`
            font-size: ${rm(20)};
        `}
    }
    
    p, div {
        font-size: ${rm(16)};
        ${fontGolosText(400)};
        color: #6F7685;
        line-height: 130%;
        margin-bottom: ${rm(16)};
        
        &:last-child {
            margin-bottom: 0;
        }

        ${media.md`
            font-size: ${rm(14)};
        `}
    }
`

const StyledVerseText = styled.div`
    blockquote {
        border-left: 2px solid #0040DD;
        padding-left: ${rm(24)};
        margin: ${rm(40)} 0;
        
        p {
            font-size: ${rm(20)};
            ${fontGolosText(400)};
            color: ${colors.black100};
            line-height: 150%;
            font-style: italic;
            margin-bottom: ${rm(16)};

            ${media.md`
                font-size: ${rm(16)};
            `}
        }
        
        cite {
            font-size: ${rm(14)};
            ${fontGolosText(400)};
            color: #868D9C;
            line-height: 130%;
            font-style: normal;

            ${media.md`
                font-size: ${rm(12)};
            `}
        }
    }
`

const StyledMediaBlock = styled.div`
    .media {
        width: 100%;
        height: ${rm(400)};
        border-radius: ${rm(8)};
        overflow: hidden;
        margin-bottom: ${rm(16)};

        ${media.md`
            height: ${rm(300)};
        `}

        ${media.xsm`
            height: ${rm(200)};
        `}
    }
    
    .caption {
        font-size: ${rm(14)};
        ${fontGolosText(400)};
        color: #868D9C;
        line-height: 130%;

        ${media.md`
            font-size: ${rm(14)};
        `}
    }
`

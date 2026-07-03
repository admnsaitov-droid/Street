'use client'

import { colors, media, rm } from "@/styles";
import { fontGolosText } from "@/styles/fonts";
import styled from "styled-components"
import { useRef } from "react"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

const FlexSpan = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
`;

const TextWrapper = styled.p`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
`;

export default function CookiePolicyView({ data }: any) {
  const triggerRef = useRef<HTMLDivElement>(null);
  
  console.log(data)

  const renderText = (text: string | undefined) => {
    if (!text) return '';
    
    const parts = text.split(/(\*\*)/);  // This will keep the delimiters in the array
    return parts.map((part, index) => {
        if (part === '**') {
            return <StyledDot key={index}><div></div></StyledDot>;
        }
        return <span key={index} style={{ display: 'inline-block' }}>{part}</span>;
    });
  };

  const renderChild = (child: any, j: number) => {
    if (child.type === 'link') {
        return (
            <a key={j} href={child.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center' }}>
                {child.children.map((linkChild: any, k: number) => renderText(linkChild.text))}
            </a>
        );
    }
    return <span key={j} style={{ display: 'inline-flex', alignItems: 'center' }}>{renderText(child.text)}</span>;
  };

  const renderBlock = (block: any, i: number) => {
    if (block.type === "heading") {
        const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
        return (
              //@ts-expect-error
            <HeadingTag key={`heading-${i}`} style={{marginTop: '1rem'}}>
                <FlexSpan>
                    {block.children.map((child: any, j: number) => renderChild(child, j))}
                </FlexSpan>
            </HeadingTag>
        );
    }

    if (block.type === "paragraph") {
        return (
            <TextWrapper key={`paragraph-${i}`} className="text-base leading-relaxed">
                {block.children.map((child: any, j: number) => renderChild(child, j))}
            </TextWrapper>
        );
    }

    return null;
  };

  return (
    <StyledCookieAndPrivacyPolicy ref={triggerRef}>
        <Breadcrumbs
            items={[
                { label: "Home", slug: "" },
                { label: "Cookie policy", slug: "cookie-policy" },
            ]}
        />
      <div className="cookie-policy-wrapper">
        <div className="cookie-policy">
          <h1 className="title">{data.title}</h1>
          {data.policy.map((block: any, i: number) => renderBlock(block, i))}
          <div className="last-update">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>
    </StyledCookieAndPrivacyPolicy>
  )
}

export const StyledCookieAndPrivacyPolicy = styled.div`
  padding: ${rm(100)} ${rm(50)} ${rm(150)} ${rm(50)};
  ${fontGolosText(400)};
  width: 100%;

  ${media.xsm`
       padding: ${rm(90)} ${rm(10)} ${rm(50)};
    `}

  .cookie-policy-wrapper, .privacy-policy-wrapper {
    max-width: ${rm(700)};
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 0 auto;

    ${media.xsm`
      max-width: 100%;
    `}
  }

  .cookie-policy, .privacy-policy {
    display: flex;
    flex-direction: column;
    gap: ${rm(20)};
  }

  .title{
      font-size: ${rm(48)};
      color: ${colors.black100};
      ${fontGolosText(400)};
      line-height: 100%;
      letter-spacing: -0.01em;
      width: 100%;
      text-align: center;
      margin-bottom: ${rm(50)};
      margin-top: ${rm(30)};


      ${media.lg`
        font-size: ${rm(40)};
      `}
  }

  h1 {
    font-size: ${rm(100)};
    font-weight: 400;
    text-align: center;

    ${media.xsm`
      font-size: ${rm(50)};
    `}
  }

  .last-update {
    margin-top: ${rm(40)};
    text-transform: uppercase;
    color: ${colors.gray90};
    font-size: ${rm(20)};
    line-height: 110%;

    ${media.lg`
      font-size: ${rm(16)};
    `}
  }

  h2 {
    font-size: ${rm(30)};
    font-weight: 500;

    ${media.xsm`
      font-size: ${rm(24)};
    `}
  }

  h3{
      font-size: ${rm(40)};
      ${fontGolosText(400)};
      line-height: 100%;
      letter-spacing: -0.02em;
      width: 100%;
      text-align: left;
      // margin-bottom: ${rm(24)};
      color: ${colors.black100};

      ${media.lg`
        font-size: ${rm(32)};
      `}
  }

  p {
    line-height: 130%;
    font-size: ${rm(16)};
    color: ${colors.gray};
  }

  .link {
    margin-top: ${rm(15)};
    text-decoration: underline 1px black solid;
  }

  a {
    color: ${colors.black100};
    text-decoration: underline;
    white-space: nowrap;
  }
`;

export const StyledDot = styled.div`
    width: ${rm(16)};
    height: ${rm(16)};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: -0.15em;
    margin: 0 0.1em;

    div{
        width: ${rm(4)};
        height: ${rm(4)};
        background-color: ${colors.blue};
    }
`
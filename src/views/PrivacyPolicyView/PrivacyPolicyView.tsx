'use client'

import { colors, media, rm } from "@/styles";
import { fontGolosText } from "@/styles/fonts";
import styled from "styled-components"
import { useRef } from "react"
import { StyledCookieAndPrivacyPolicy, StyledDot } from "../CookiePolicyView/CookiePolicyView";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

import { useUiStrings } from "@/components/UiStrings/UiStringsProvider"
import { useLocale } from "next-intl"
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

export default function PrivacyPolicyView({ data, updatedAt }: any) {
  const ui = useUiStrings()
  const locale = useLocale()
  const triggerRef = useRef<HTMLDivElement>(null);
  
  console.log(data)

  const renderText = (text: string | undefined) => {
    if (!text) return '';
    
    const parts = text.split(/(\*\*)/);  // This will keep the delimiters in the array
    return parts.map((part, index) => {
        if (part === '**') {
            return <StyledDot key={index}><span /></StyledDot>;
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
                { label: ui.breadcrumbHome, slug: "" },
                { label: ui.breadcrumbPrivacyPolicy, slug: "privacy-policy" },
            ]}
        />
      <div className="cookie-policy-wrapper">
        <div className="cookie-policy">
          <h1 className="title">{data?.title}</h1>
          {data?.policy?.map((block: any, i: number) => renderBlock(block, i))}
          {/*
            The real date the page was last changed in Strapi, in the page's
            language. It used to print *today's* date, in US English, on every
            visit. UTC keeps server and browser formatting identical.
          */}
          {updatedAt && (
            <div className="last-update">
              {ui.policyLastUpdated} {new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(updatedAt))}
            </div>
          )}
        </div>
      </div>
    </StyledCookieAndPrivacyPolicy>
  )
}
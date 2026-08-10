'use client'

import { media, rm } from "@/styles"
import styled from "styled-components"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs"
import { Hero } from "./components/Hero"
import { ContentRenderer } from "./components/ContentRenderer"

export const ArticleView = ({ data }: { data: any }) => {

    console.log('data', data?.breadcrumbs)
    
    const breadcrumbs = data?.breadcrumbs?.map((breadcrumb: any) => (
        { label: breadcrumb.text, slug: breadcrumb.link }
    ))

    return (
        <StyledArticleView>
            <Breadcrumbs
                items={[
                    ...(breadcrumbs || []),
                    { label: data?.title, slug: data?.slug },
                ]}
            />
            <Hero data={data} />
            {data?.content && <ContentRenderer content={data.content} />}
        </StyledArticleView>
    )
}

const StyledArticleView = styled.div`
    width: 100%;
    height: 100%;
    padding: ${rm(100)} ${rm(50)};

    ${media.md`
        padding: ${rm(100)} ${rm(25)};
    `}

    ${media.xsm`
        padding: ${rm(90)} ${rm(16)};
    `}
`
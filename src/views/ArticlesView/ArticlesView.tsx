"use client"
import { rm } from "@/styles"
import styled from "styled-components"
import { StyledTitle } from "../PackagesView/PackagesView"
import { ArticleCard } from "../HomeView/screens/LatestNews/components/ArticleCard"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs"

interface ArticlesViewProps {
    data: any
    pageData: any
}

export const ArticlesView = ({ data, pageData }: ArticlesViewProps) => {


    const breadcrumbs = pageData?.breadcrumbs?.map((breadcrumb: any) => (
        { label: breadcrumb.text, slug: breadcrumb.link }
    ))

    console.log('pageData', data)

    return (
        <StyledArticlesView>
            <Breadcrumbs
                items={[
                    ...(breadcrumbs || [])
                ]}
            />
            <StyledTitle tag="h1">
                {pageData?.Title}
            </StyledTitle>
            <StyledArticlesGrid>
                {(Array.isArray(data) ? data : []).map((article: any) => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </StyledArticlesGrid>
        </StyledArticlesView>
    )
}

const StyledArticlesView = styled.div`
    width: 100%;
    padding: ${rm(100)} ${rm(50)} ${rm(150)} ${rm(50)};
`

const StyledArticlesGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    column-gap: ${rm(10)};
    margin-top: ${rm(50)};

    >div{
        width: 24.44%;
    }
`
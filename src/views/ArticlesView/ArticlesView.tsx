"use client"
import { rm } from "@/styles"
import styled from "styled-components"
import { StyledTitle } from "../PackagesView/PackagesView"
import { ArticleCard } from "../HomeView/screens/LatestNews/components/ArticleCard"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs"

interface ArticlesViewProps {
    data: any
}

export const ArticlesView = ({ data }: ArticlesViewProps) => {
    return (
        <StyledArticlesView>
            <Breadcrumbs
                items={[
                    { label: "Home", slug: "" },
                    { label: "Articles", slug: "articles" },
                ]}
            />
            <StyledTitle>
                last news
            </StyledTitle>
            <StyledArticlesGrid>
                {data.map((article: any) => (
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
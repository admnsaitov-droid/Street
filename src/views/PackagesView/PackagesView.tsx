'use client'
import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import styled from "styled-components"
import { Package } from "./screens/Package/Package"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs"

interface PackagesViewProps {
    data: any
}

export const PackagesView = ({ data }: PackagesViewProps) => {
    console.log(data)
    return (
        <StyledPackagesView>
            <Breadcrumbs
                items={[
                    { label: "Home", slug: "" },
                    { label: "Packages", slug: "packages" },
                ]}
            />
            <StyledTop>
                <StyledTitle>{data?.title}</StyledTitle>
                <StyledDescription>{data?.description}</StyledDescription>
            </StyledTop>
            <StyledPackages>
                {data?.package?.map((item: any, index: number) => (
                    <Package data={item} />
                ))}
            </StyledPackages>
        </StyledPackagesView>
    )
}

const StyledPackagesView = styled.div`
    width: 100%;
    padding: ${rm(100)} ${rm(50)};
    padding-bottom: ${rm(150)};
`

const StyledTop = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: ${rm(80)};
    margin-top: ${rm(40)};
`

export const StyledTitle = styled.p`
    font-size: ${rm(100)};
    line-height: 85%;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    ${fontGolosText(600)};
    color: ${colors.black100};
    margin-top: ${rm(40)};
    
    ${media.lg`
        font-size: ${rm(80)};
    `}
`

const StyledDescription = styled.p`
    font-size: ${rm(40)};
    line-height: 100%;
    ${fontGolosText(400)};
    color: ${colors.black100};
    text-indent: ${rm(113)};
    width: ${rm(1007)};


    ${media.lg`
        font-size: ${rm(32)};
        width: ${rm(777)};
    `}
`

const StyledPackages = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`
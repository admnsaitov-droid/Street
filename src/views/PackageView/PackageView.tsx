'use client'

import styled from "styled-components"
import { Hero } from "./components/Hero/Hero"
import { Overview } from "./components/Overview/Overview"

interface PackageProps {
    data: any
}

export const PackageView = ({ data }: PackageProps) => {

    const packageData = data?.package

    console.log(packageData)

    const breadcrumbs = packageData?.breadcrumbs?.map((breadcrumb: any) => (
        { label: breadcrumb.text, slug: breadcrumb.link }
    ))

    return (
        <StyledPackage>
            <Hero data={packageData} breadcrumbs={breadcrumbs} />
            <Overview data={packageData} />
        </StyledPackage>
    )
}

const StyledPackage = styled.div`
    width: 100%;
`

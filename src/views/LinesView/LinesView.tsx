'use client'
import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import styled from "styled-components"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs"
import { AnimatedText } from "@/components/animated/AnimatedText/AnimatedText"
import { Lines } from "../HomeView/screens/Lines/Lines"

interface LinesViewProps {
    data: any
}

export const LinesView = ({ data }: LinesViewProps) => {

    const breadcrumbs = data?.breadcrumbs?.map((breadcrumb: any) => (
        { label: breadcrumb.text, slug: breadcrumb.link }
    ))

    console.log('lines data', data)

    return (
        <StyledLinesView>
            <Breadcrumbs
                items={[
                    ...(breadcrumbs || [])
                ]}
            />
            <StyledTop>
                <StyledTitle tag="h1">{data?.title}</StyledTitle>
                <StyledDescription tag="p">{data?.description}</StyledDescription>
            </StyledTop>
            <Lines linesData={data} isTop={false} exploreLineText={data?.exploreLineText}/>
        </StyledLinesView>
    )
}

const StyledLinesView = styled.div`
    width: 100%;
    padding: ${rm(100)} ${rm(50)};
    padding-bottom: ${rm(150)};

    ${media.md`
        padding: ${rm(100)} ${rm(25)};
        padding-bottom: ${rm(150)};
    `}

    ${media.xsm`
        padding: ${rm(90)} ${rm(16)};
        padding-bottom: ${rm(70)};
    `}
`

const StyledTop = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: ${rm(80)};
    margin-top: ${rm(40)};

    ${media.md`
        flex-direction: column;
        gap: ${rm(20)};
        justify-content: flex-start;
    `}
    
    ${media.xsm`
        margin-top: ${rm(30)};
        gap: ${rm(15)};
        margin-bottom: ${rm(70)};
    `}
`

export const StyledTitle = styled(AnimatedText)`
    line-height: 85%;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    ${fontGolosText(600)};
    color: ${colors.black100};
    height: fit-content;
    font-size: ${rm(48)};
    width: ${rm(1003)};

    ${media.lg`
        font-size: ${rm(40)};
        width: ${rm(777)};
    `}

    ${media.xsm`
        font-size: ${rm(32)};
        width: 100%;
    `}

`

const StyledDescription = styled(AnimatedText)`
    font-size: ${rm(40)};
    line-height: 115%;
    ${fontGolosText(400)};
    color: ${colors.black100};
    width: ${rm(1007)};

    span:nth-child(1){
        >:nth-child(1){
            padding-left: ${rm(113)} !important;
        }
    }

    ${media.lg`
        font-size: ${rm(32)};
        width: ${rm(777)};
    `}

    ${media.md`
        font-size: ${rm(24)};
        width: ${rm(475)};
        letter-spacing: -0.01em;

        span:nth-child(1){
            >:nth-child(1){
                padding-left: ${rm(0)} !important;
            }
        }
    `}

    ${media.xsm`
        font-size: ${rm(20)};
        width: 100%;
    `}
`

const StyledPackages = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`
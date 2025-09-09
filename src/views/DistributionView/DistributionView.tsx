'use client'
import { media, colors, rm } from "@/styles"
import { fontGolosText, fontSageGrotesk } from "@/styles/fonts"
import { heightLvh } from "@/styles/utils"
import styled from "styled-components"
import { useState } from "react"
import { DistributionScene } from "./components/Scene"
import AnimatedGrid from "@/components/animated/AnimatedContent"
import { CountryPanel } from "./components/CountryPanel/CountryPanel"

interface DistributionViewProps {
    data: any
}

export const DistributionView = ({ data }: DistributionViewProps) => {
    const [activeFilterId, setActiveFilterId] = useState('all')

    const handleFilterChange = (filterId: string) => {
        setActiveFilterId(filterId)
    }

    return (
        <StyledDistributionView>
            <StyledContent>
                <StyledTitleContainer>
                    <AnimatedGrid
                        type="words"
                        animation={{
                            from: { opacity: 0, y: '40px' },
                            to: { opacity: 1, y: '0px' },
                            delayStep: 60
                        }}
                        overflow={true}
                        gap={{ horizontal: '0.25em', vertical: '0.25em' }}
                        containerStyle={{ overflow: 'hidden' }}
                        cellConfigs={{
                            'title-first': {
                                style: {
                                    color: colors.red,
                                    fontFamily: 'var(--font-sage-grotesk)',
                                    fontOpticalSizing: 'auto',
                                    fontWeight: 400,
                                    fontStyle: 'normal',
                                }
                            },
                            'title-second': {
                                style: {
                                    color: colors.white100,
                                    fontFamily: 'var(--font-sage-grotesk)',
                                    fontOpticalSizing: 'auto',
                                    fontWeight: 400,
                                    fontStyle: 'normal',
                                }
                            }
                        }}
                    >
                        <span id="title-first">{data?.distributionPage?.title?.textFirst}</span>
                        <span id="title-second" className="first">{data?.distributionPage?.title?.textSecond}</span>
                    </AnimatedGrid>
                </StyledTitleContainer>
            </StyledContent>
            <DistributionScene activeFilterId={activeFilterId} />
            <CountryPanel onFilterChange={handleFilterChange} />
        </StyledDistributionView>
    )
}

const StyledDistributionView = styled.div`
    width: 100%;
    ${heightLvh(100)};
    background-color: ${colors.black100};
    position: relative;
`

const StyledContent = styled.div`
    padding: ${rm(110)} ${rm(50)};
    width: 100%;
    position: relative;
    z-index: 4;

    ${media.xsm`
        padding: ${rm(100)} ${rm(16)};
    `}
`

const StyledTitleContainer = styled.div`
    width: ${rm(1000)};
    margin-bottom: ${rm(20)};
    line-height: 90%;
    font-size: ${rm(100)};
    text-transform: uppercase;

    ${media.lg`
        font-size: ${rm(80)};
        width: ${rm(780)};
    `}

    ${media.md`
        font-size: ${rm(56)};
        width: ${rm(600)};
    `}

    ${media.xsm`
        width: 100%;
        font-size: ${rm(32)};
    `}
`
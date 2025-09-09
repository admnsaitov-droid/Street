import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import styled from "styled-components"
import { useState } from "react"
import { distributionData, getFilterNames, Filter } from "../../data/distributionData"

const filters = getFilterNames()



interface CountryPanelProps {
    onFilterChange?: (filterId: string) => void
}

export const CountryPanel = ({ onFilterChange }: CountryPanelProps) => {
    const [activeFilter, setActiveFilter] = useState('All')

    const handleFilterClick = (filterName: string) => {
        setActiveFilter(filterName)
        // Find the filter ID from the name
        const filter = distributionData.find((f: Filter) => f.name === filterName)
        if (filter && onFilterChange) {
            onFilterChange(filter.id)
        }
    }

    return (
        <StyledCountryPanel>
            <StyledTopContainer>
                {filters.map((filter: string) => (
                    <div 
                        key={filter}
                        className={`filter ${activeFilter === filter ? 'active' : ''}`} 
                        onClick={() => handleFilterClick(filter)}
                    >
                        {filter}
                    </div>
                ))}
            </StyledTopContainer>
        </StyledCountryPanel>
    )
}

const StyledCountryPanel = styled.div`
    position: absolute;
    top: ${rm(110)};
    right: ${rm(50)};
    width: ${rm(440)};
    z-index: 1000;
    cursor: pointer;

    ${media.xsm`
        display: none;
    `}
`

const StyledTopContainer = styled.div`
    display: flex;
    width: 100%;
    backdrop-filter: blur(88);
    gap: ${rm(4)};

    .filter{
        width: 20%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: ${rm(14)} 0;
        background-color: transparent;
        color: ${colors.white100};
        ${fontGolosText(400)};
        font-size: ${rm(16)};
        line-height: 130%;
        border-radius: ${rm(6)};

        ${media.lg`
            font-size: ${rm(14)};
        `}

        transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
    }

    .active{
        background-color: ${colors.white100};
        color: ${colors.black100};
    }
`
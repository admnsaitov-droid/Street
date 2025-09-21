import { colors, media, rm } from "@/styles"
import { fontGolosText, fontSageGrotesk } from "@/styles/fonts"
import styled from "styled-components"
import { Location as DistributionLocation } from "../../data/distributionData"

interface LocationCardProps {
  location: DistributionLocation
  onClick?: () => void
  isExpanded?: boolean
}

export const LocationCard = ({ location, onClick, isExpanded = false }: LocationCardProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <StyledLocationCard onClick={handleClick} $isExpanded={isExpanded}>
      <StyledHeader>
        {location.name}
      </StyledHeader>
      <StyledTitle>
        {location.name}
      </StyledTitle>
      <StyledDetails>
        <StyledDetailItem>
          <StyledDetailLabel>Location</StyledDetailLabel>
          <StyledDetailValue>{location.address}</StyledDetailValue>
        </StyledDetailItem>
        <StyledDetailItem>
          <StyledDetailLabel>Email</StyledDetailLabel>
          <StyledDetailValue>{location.email}</StyledDetailValue>
        </StyledDetailItem>
      </StyledDetails>
      
      {/* Accordion content - only visible when expanded */}
      <StyledAccordionContent $isExpanded={isExpanded}>
        <StyledAccordionDetails>
          <StyledDetailItem>
            <StyledDetailLabel>Region</StyledDetailLabel>
            <StyledDetailValue>{location.region}</StyledDetailValue>
          </StyledDetailItem>
          <StyledDetailItem>
            <StyledDetailLabel>Country</StyledDetailLabel>
            <StyledDetailValue>{location.country}</StyledDetailValue>
          </StyledDetailItem>
        </StyledAccordionDetails>
        <StyledVisitButton>
          VISIT WEBSITE
        </StyledVisitButton>
      </StyledAccordionContent>
    </StyledLocationCard>
  )
}

const StyledLocationCard = styled.div<{ $isExpanded: boolean }>`
  background-color: ${colors.black100};
  border-radius: ${rm(12)};
  padding: ${rm(24)};
  margin-bottom: ${rm(16)};
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    background-color: rgba(255, 255, 255, 0.02);
  }

  &:last-child {
    margin-bottom: 0;
  }

  ${media.xsm`
    padding: ${rm(20)};
    margin-bottom: ${rm(12)};
  `}
`

const StyledHeader = styled.div`
  color: ${colors.white100};
  ${fontGolosText(400)};
  font-size: ${rm(14)};
  line-height: 130%;
  margin-bottom: ${rm(8)};
  opacity: 0.8;

  ${media.xsm`
    font-size: ${rm(12)};
  `}
`

const StyledTitle = styled.div`
  color: ${colors.white100};
  ${fontSageGrotesk(400)};
  font-size: ${rm(24)};
  font-weight: 600;
  line-height: 120%;
  text-transform: uppercase;
  margin-bottom: ${rm(20)};

  ${media.xsm`
    font-size: ${rm(20)};
    margin-bottom: ${rm(16)};
  `}
`

const StyledDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rm(16)};

  ${media.xsm`
    gap: ${rm(12)};
  `}
`

const StyledDetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rm(4)};
`

const StyledDetailLabel = styled.div`
  color: ${colors.white100};
  ${fontGolosText(400)};
  font-size: ${rm(12)};
  line-height: 130%;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${media.xsm`
    font-size: ${rm(10)};
  `}
`

const StyledDetailValue = styled.div`
  color: ${colors.white100};
  ${fontGolosText(400)};
  font-size: ${rm(14)};
  line-height: 140%;

  ${media.xsm`
    font-size: ${rm(12)};
  `}
`

const StyledAccordionContent = styled.div<{ $isExpanded: boolean }>`
  max-height: ${({ $isExpanded }) => $isExpanded ? '300px' : '0'};
  opacity: ${({ $isExpanded }) => $isExpanded ? '1' : '0'};
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${({ $isExpanded }) => $isExpanded && `
    margin-top: ${rm(20)};
  `}
`

const StyledAccordionDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rm(16)};
  margin-bottom: ${rm(24)};

  ${media.xsm`
    gap: ${rm(12)};
    margin-bottom: ${rm(20)};
  `}
`

const StyledVisitButton = styled.button`
  background: ${colors.white100};
  color: ${colors.black100};
  border: none;
  border-radius: ${rm(8)};
  padding: ${rm(12)} ${rm(24)};
  ${fontGolosText(600)};
  font-size: ${rm(14)};
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  text-align: center;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-1px);
  }

  ${media.xsm`
    font-size: ${rm(12)};
    padding: ${rm(10)} ${rm(20)};
  `}
`

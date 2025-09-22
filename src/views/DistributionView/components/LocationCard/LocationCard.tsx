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
        {location.displayName || location.name}
      </StyledTitle>
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
      </StyledAccordionContent>
      <StyledDivider />
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
      <StyledButtonContainer $isExpanded={isExpanded}>
        <StyledVisitButton>
          VISIT WEBSITE
        </StyledVisitButton>
      </StyledButtonContainer>
      {/* Accordion content - only visible when expanded */}
    </StyledLocationCard>
  )
}

const StyledLocationCard = styled.div<{ $isExpanded: boolean }>`
  border-radius: ${rm(8)};
  padding: ${rm(20)};
  margin-bottom: ${rm(10)};
  border: 1px solid #B7BCCA33;
  background-color: #6F768526;
  transition: all 0.3s ease;
  cursor: pointer;
  backdrop-filter: blur(32px);

  &:hover {
    border-color: rgba(255, 255, 255, 0.3);
    background-color: #6F768540;
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
  color: #868D9C;
  ${fontGolosText(400)};
  font-size: ${rm(14)};
  line-height: 130%;
  margin-bottom: ${rm(5)};

  ${media.xsm`
    font-size: ${rm(12)};
  `}
`

const StyledTitle = styled.div`
  color: ${colors.white100};
  ${fontSageGrotesk(500)};
  font-size: ${rm(22)};
  line-height: 100%;
  text-transform: uppercase;
  // margin-bottom: ${rm(16)};
  letter-spacing: -0.01em;
  width: 70%;

  ${media.xsm`
    font-size: ${rm(20)};
    // margin-bottom: ${rm(16)};
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
  // margin-bottom: ${rm(16)};
  position: relative;
  
  ${({ $isExpanded }) => $isExpanded && `
    margin-top: ${rm(20)};
  `}
`


const StyledDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #FFFFFF14;
  margin: ${rm(24)} 0;
`

const StyledAccordionDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rm(16)};

  ${media.xsm`
    gap: ${rm(12)};
  `}
`

const StyledButtonContainer = styled.div<{ $isExpanded: boolean }>`
  max-height: ${({ $isExpanded }) => $isExpanded ? '80px' : '0'};
  opacity: ${({ $isExpanded }) => $isExpanded ? '1' : '0'};
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: ${({ $isExpanded }) => $isExpanded ? rm(20) : '0'};
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

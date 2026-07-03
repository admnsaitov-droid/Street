import { colors, media, rm } from "@/styles"
import { fontGolosText, fontSageGrotesk } from "@/styles/fonts"
import styled from "styled-components"
import { Location as DistributionLocation } from "../../data/distributionData"
import { BlueButton } from "@/components/Ui/buttons/BlueButton"

interface LocationCardProps {
  location: DistributionLocation
  onClick?: () => void
  isExpanded?: boolean
  locationText?: string
  websiteText?: string
}

export const LocationCard = ({ location, onClick, isExpanded = false, locationText, websiteText }: LocationCardProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <StyledLocationCard onClick={isExpanded ? undefined : handleClick} $isExpanded={isExpanded}>
      <StyledTopRow>
        <div>
          <StyledHeader>{location.name}</StyledHeader>
          <StyledTitle>{location.displayName || location.name}</StyledTitle>
        </div>
        {location.logo && (
          <StyledLogo src={location.logo} alt={`${location.name} logo`} />
        )}
      </StyledTopRow>
      <StyledAccordionContent $isExpanded={isExpanded}>
        <StyledDescription>
          {location.description}
        </StyledDescription>
        <StyledImageContainer>
          <StyledImage src={location.image} alt={`${location.name} distribution center`} />
        </StyledImageContainer>
      </StyledAccordionContent>
      <StyledDivider />
      <StyledDetails>
        <StyledDetailItem>
          <StyledDetailLabel>{locationText}</StyledDetailLabel>
          <StyledDetailValue>{location.address}</StyledDetailValue>
        </StyledDetailItem>
        {location.websiteItem && (
          <StyledDetailItem>
            <StyledDetailLabel>{websiteText}</StyledDetailLabel>
            <StyledDetailValue>{location.websiteItem}</StyledDetailValue>
          </StyledDetailItem>
        )}
      </StyledDetails>
      {location.websiteItem && (
        <StyledButtonContainer $isExpanded={isExpanded}>
          <BlueButton link={location?.websiteItem} isSvg className="button">VISIT WEBSITE</BlueButton>
        </StyledButtonContainer>
      )}
      {isExpanded && (
        <StyledCloseButton onClick={() => onClick?.()}>
            <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.25 4.75L14.75 14.25M14.75 4.75L5.25 14.25" stroke="white" stroke-width="1.58333" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </StyledCloseButton>
      )}
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
  // -webkit-backdrop-filter: blur(32px);
  // backdrop-filter: blur(32px);
  cursor: ${({ $isExpanded }) => $isExpanded ? 'default' : 'pointer'};

  &:hover {
    ${({ $isExpanded }) => !$isExpanded && `
      border-color: rgba(255, 255, 255, 0.3);
      background-color: #6F768540;
    `}
  }

  &:last-child {
    margin-bottom: 0;
  }

  .button{
    width: 100%;
  }

  ${media.xsm`
    padding: ${rm(20)};
    margin-bottom: ${rm(12)};
  `}
`

const StyledTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${rm(16)};
`

const StyledLogo = styled.img`
  height: ${rm(36)};
  width: auto;
  max-width: ${rm(80)};
  object-fit: contain;
  flex-shrink: 0;
  filter: brightness(0) invert(1);
  opacity: 0.85;
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
  letter-spacing: -0.01em;
  
  /* Safari font rendering fixes */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;

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

const StyledDescription = styled.div`
  color: ${colors.white100};
  ${fontGolosText(400)};
  font-size: ${rm(16)};
  line-height: 150%;
  margin-bottom: ${rm(20)};
  opacity: 0.9;

  ${media.xsm`
    font-size: ${rm(14)};
    margin-bottom: ${rm(16)};
  `}
`

const StyledImageContainer = styled.div`
  width: 100%;
  height: ${rm(200)};
  border-radius: ${rm(8)};
  overflow: hidden;
  margin-bottom: ${rm(16)};

  ${media.xsm`
    height: ${rm(150)};
    margin-bottom: ${rm(12)};
  `}
`

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`

const StyledButtonContainer = styled.div<{ $isExpanded: boolean }>`
  max-height: ${({ $isExpanded }) => $isExpanded ? '80px' : '0'};
  opacity: ${({ $isExpanded }) => $isExpanded ? '1' : '0'};
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: ${({ $isExpanded }) => $isExpanded ? rm(20) : '0'};
`

const StyledCloseButton = styled.div`
    position: absolute;
    top: ${rm(28)};
    right: ${rm(20)};
    cursor: pointer;
    transition: opacity 0.3s ease;
    background-color: #6F768526;
    border-radius: ${rm(3)};
    width: ${rm(38)};
    height: ${rm(38)};
    z-index: 1002;
    display: flex;
    align-items: center;
    justify-content: center;

    svg{
        width: ${rm(19)};
        height: ${rm(19)};
    }

    &:hover{
        opacity: 0.7;
    }
`
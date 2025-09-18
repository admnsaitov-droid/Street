import { colors, media, rm } from "@/styles"
import { fontGolosText, fontSageGrotesk } from "@/styles/fonts"
import styled from "styled-components"
import { Location as DistributionLocation } from "../../data/distributionData"

interface LocationCardProps {
  location: DistributionLocation
  onClick?: (location: DistributionLocation) => void
}

export const LocationCard = ({ location, onClick }: LocationCardProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick(location)
    }
  }

  return (
    <StyledLocationCard onClick={handleClick}>
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
    </StyledLocationCard>
  )
}

const StyledLocationCard = styled.div`
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

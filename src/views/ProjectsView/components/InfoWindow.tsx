import { rm } from "@/styles"
import styled from "styled-components"

interface InfoWindowProps {
    image: string
    title: string
    address: string
    linkText?: string
    onLinkClick?: () => void
}

export const InfoWindow = ({ 
    image, 
    title, 
    address, 
    linkText = "View details",
    onLinkClick 
}: InfoWindowProps) => {

    console.log(image);

    return (
        <StyledInfoWindow>
            <ImageContainer>
                <Image src={image} alt={title} />
            </ImageContainer>
            <ContentContainer>
                <Title>{title}</Title>
                <Address>{address}</Address>
                <LinkButton onClick={onLinkClick}>
                    {linkText}
                </LinkButton>
            </ContentContainer>
        </StyledInfoWindow>
    )
}

const StyledInfoWindow = styled.div`
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(32px);
    border-radius: ${rm(10)};
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    border: 2px solid #B7BCCA33;
    overflow: hidden;
    width: ${rm(324)};
`

const ImageContainer = styled.div`
    width: 100%;
    height: ${rm(180)};
    overflow: hidden;
`

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`

const ContentContainer = styled.div`
    padding: ${rm(16)} ${rm(8)};
`

const Title = styled.h3`
    font-size: ${rm(18)};
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 ${rm(8)} 0;
    line-height: 1.3;
`

const Address = styled.p`
    font-size: ${rm(14)};
    color: #666;
    margin: 0 0 ${rm(12)} 0;
    line-height: 1.4;
`

const LinkButton = styled.button`
    background: none;
    border: none;
    color: #0066cc;
    font-size: ${rm(14)};
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
    font-family: inherit;
    
    &:hover {
        color: #0052a3;
    }
    
    &:focus {
        outline: 2px solid #0066cc;
        outline-offset: 2px;
    }
`

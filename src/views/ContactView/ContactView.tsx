"use client"
import { colors, media, rm } from "@/styles"
import styled from "styled-components"
import { StyledTitle } from "../PackagesView/PackagesView"
import { fontGolosText } from "@/styles/fonts"
import { ContactForm } from "./screens/ContactForm"
import { GetInTouch } from "./screens/GetInTouch"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs"
import { AnimatedText } from "@/components/animated/AnimatedText/AnimatedText"
import { ContactMap } from "./screens/ContactMap"
import { StructuredData } from "@/components/StructuredData/StructuredData"
import { generateOrganizationSchema } from "@/utils/generateStructuredData"

interface ContactViewProps {
    data: any
}

export const ContactView = ({ data }: ContactViewProps) => {
    console.log('contacs data' ,data)
    
    const mapCenter = {
        lat: parseFloat(data?.mapSettings?.mapLat) || 0,
        lng: parseFloat(data?.mapSettings?.mapLng) || 0
    }

    const zoom = parseInt(data?.mapSettings?.zoom) || 10

    const marker = {
        position: {
            lat: parseFloat(data?.mapMarker?.lat) || 0,
            lng: parseFloat(data?.mapMarker?.lng) || 0
        },
        title: data?.mapMarker?.title,
        address: data?.mapMarker?.address,
        image: data?.mapMarker?.image,
        linkText: data?.mapMarker?.linkText,
        // onLinkClick: data?.mapMarker?.onLinkClick
        onClick: () => console.log("Marker clicked")
    }

    console.log(mapCenter, zoom, marker)
    
    // Generate Organization schema for SEO
    const organizationSchema = generateOrganizationSchema({
        name: "Street Barbell",
        url: typeof window !== 'undefined' ? window.location.origin : 'https://street-barbell.vercel.app',
        description: data?.description,
        contactPoint: {
            telephone: data?.getInTouchBlock?.phone,
            email: data?.getInTouchBlock?.inquries,
            contactType: "customer service"
        }
    })
    
    return (
        <StyledContactView>
            <StructuredData schemas={[organizationSchema]} />
            <Breadcrumbs items={[
                { label: 'Home', slug: '' },
                { label: data?.title || 'Contact', href: undefined },
            ]} />
            <StyledTop>
                <StyledTitle tag="h1">
                    {data?.title}
                </StyledTitle>
                <StyledContactLeft>
                    <StyledContactDescription tag="p">
                        {data.description}
                    </StyledContactDescription>
                    <ContactForm data={data?.contactForm} buttonText={data?.buttonText} />
                </StyledContactLeft>
            </StyledTop>
            <GetInTouch data={data?.getInTouchBlock} />
            <StyledMapContainer>
                <ContactMap 
                    center={mapCenter}
                    zoom={zoom}
                    markers={[marker]}
                />
            </StyledMapContainer>
        </StyledContactView>
    )
}

const StyledContactView = styled.div`
    width: 100%;
    padding: ${rm(110)} ${rm(50)} ${rm(150)} ${rm(50)};
    min-height: 100vh;

    ${media.md`
        padding: ${rm(100)} ${rm(25)} ${rm(100)} ${rm(25)};
    `}

    ${media.xsm`
        padding: ${rm(100)} ${rm(16)} ${rm(100)} ${rm(16)};
        padding-bottom: ${rm(40)};
    `}
`

const StyledTop = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-bottom: ${rm(75)};
    position: relative;

    ${media.md`
        flex-direction: column;
        gap: ${rm(20)};
    `}

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        background-image: repeating-linear-gradient(
            to right,
            #B7BCCA 0,
            #B7BCCA 1px,
            transparent 1px,
            transparent 5px
        );
        background-size: auto;
        background-repeat: repeat-x;
        transition: opacity 0.3s ease-in-out;
    }
`

export const StyledContactLeft = styled.div`
    width: ${rm(1007)};

    ${media.lg`
        width: ${rm(777)};  
    `}

    ${media.md`
        width: 100%;
    `}

    ${media.xsm`
        width: 100%;
    `}
`

export const StyledContactDescription = styled(AnimatedText)`
    width: 100%;
    font-size: ${rm(40)};
    color: ${colors.black100};
    ${fontGolosText(400)};
    line-height: 115%;
    letter-spacing: -0.01em;
    margin-bottom: ${rm(80)};
    
    ${media.lg`
        font-size: ${rm(32)};
    `}

    ${media.md`
        font-size: ${rm(24)};
        width: ${rm(600)};
        margin-bottom: ${rm(50)};
    `}

    ${media.xsm`
        font-size: ${rm(20)};
        width: 100%;
    `}
`

const StyledMapContainer = styled.div`
    position: relative;
    overflow: hidden;
    border-radius: ${rm(16)};
    width: 100%;
    height: ${rm(800)};
    margin-top: ${rm(70)};

    ${media.lg`
        height: ${rm(600)};    
    `}

    ${media.md`
        height: ${rm(539)};    
    `}

    ${media.xsm`
        height: ${rm(246)};
        margin-top: ${rm(50)};
    `}
`
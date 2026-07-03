'use client'

import dynamic from "next/dynamic"
import { useAssetsLoader } from "@/layouts/AssetsLoaderLayout/AssetsLoaderLayout"
import styled from "styled-components"
import { fontGolosText } from "@/styles/fonts"
import { rm } from "@/styles"
import { useState, useCallback } from "react"
import { useLocale } from "next-intl"
import cookieTranslations from "./cookieTranslations"

const CookieConsent = dynamic(() => import("react-cookie-consent"), { ssr: false })

const StyledCookieConsent = styled(CookieConsent)`
    .cookieButton {
        display: none !important;
    }
`

export const Cookie = () => {
    const locale = useLocale()
    const t = cookieTranslations[locale] ?? cookieTranslations.en

    const { fullyLoaded } = useAssetsLoader()
    const [isVisible, setIsVisible] = useState(true)
    
    // Use different cookie name in development so modal stays visible for styling
    const cookieName = process.env.NODE_ENV === 'development' 
        ? 'newProjectCookie_dev' 
        : 'newProjectCookie'
    
    const handleAccept = useCallback(() => {
        // Set cookie to accept
        document.cookie = `${cookieName}=accepted; expires=${new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toUTCString()}; path=/`
        setIsVisible(false)
        
        // Here you can add any analytics or tracking initialization
        console.log('Cookies accepted')
    }, [cookieName])
    
    const handleDecline = useCallback(() => {
        // Set cookie to decline
        document.cookie = `${cookieName}=declined; expires=${new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toUTCString()}; path=/`
        setIsVisible(false)
        
        // Here you can disable any analytics or tracking
        console.log('Cookies declined')
    }, [cookieName])
    
    if (!isVisible) return null
    
    return (
        <StyledCookieConsent
            buttonText=""
            cookieName={cookieName}
            disableStyles={true}
            buttonClasses={'cookieButton'}
            containerClasses={'cookieContainer' + (fullyLoaded ? ' visible' : '')}
            contentClasses={'cookieContent'}
            expires={180}
            hideOnAccept={false}
            hideOnDecline={false}
            onAccept={handleAccept}
            onDecline={handleDecline}
        >
            <StyledTitle>{t.title}</StyledTitle>
            <StyledDescription>{t.description}{' '}
                <a href='/privacy-policy' aria-label='Go to Privacy Policy'>
                    {t.privacyPolicy}
                </a>
            </StyledDescription>
            <StyledButtonContainer>
                <StyledDeclineButton onClick={handleDecline}>
                    {t.decline}
                </StyledDeclineButton>
                <StyledAcceptButton onClick={handleAccept}>
                    {t.accept}
                </StyledAcceptButton>
            </StyledButtonContainer>
        </StyledCookieConsent>
    )
}

const StyledTitle = styled.h5`
    ${fontGolosText(400)} !important;
    font-size: ${rm(32)} !important;
    margin-bottom: ${rm(24)} !important;
    letter-spacing: -0.01em;
    line-height: 110% !important;
    color: #F8F9FC;
    max-width: ${rm(640)};
`

const StyledDescription = styled.p`
    ${fontGolosText(400)} !important;
    font-size: ${rm(16)} !important;
    letter-spacing: -0.01em;
    line-height: 125% !important;
    color: #F8F9FC;
    margin-bottom: ${rm(36)};
    max-width: ${rm(640)};

    @media (max-width: 768px) {
        font-size: ${rm(14)} !important;
    }

    a {
        text-decoration: underline !important;
        color: #F8F9FC;
    }
`

const StyledButtonContainer = styled.div`
    display: flex;
    gap: ${rm(16)};
    align-items: center;
    justify-content: flex-start;
    margin-top: ${rm(8)};
`

const StyledDeclineButton = styled.button`
    border: 1px solid #3A3D45;
    border-radius: ${rm(4)};
    padding: ${rm(20)} ${rm(0)};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: #000;
    font-size: ${rm(16)};
    ${fontGolosText(600)};
    color: #F3F4F6;
    text-transform: uppercase;
    position: relative;
    min-width: ${rm(100)};
    width: 50%;
    transition: opacity 0.3s ease;
    
    &:hover {
        opacity: 0.8;
    }
`

const StyledAcceptButton = styled.button`
    background-color: #ECECEC;
    border-radius: ${rm(4)};
    padding: ${rm(20)} ${rm(0)};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: ${rm(16)};
    ${fontGolosText(600)};
    color: black;
    text-transform: uppercase;
    position: relative;
    width: 50%;
    min-width: ${rm(100)};
    transition: opacity 0.3s ease;

    &:hover {
        opacity: 0.8;
    }
`
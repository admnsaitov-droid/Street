"use client"
import { colors } from "@/styles/colors"
import styled from "styled-components"
import useLoadingStore from "@/store/store"
import { animated, easings, useSpring } from "@react-spring/web"
import { media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import { SimpleButton } from "@/components/Ui/buttons/SimpleButton"
import { BlueButton } from "@/components/Ui/buttons/BlueButton"
import { useEffect } from "react"
import { useScroll } from "@/layouts/ScrollLayout/useScroll"
import { useLocale } from "next-intl"
import errorModalTranslations from "./errorModalTranslations"

export const ErrorModal = () => {
    const locale = useLocale()
    const t = errorModalTranslations[locale] ?? errorModalTranslations.en

    const isSubmitError = useLoadingStore((state) => state.isSubmitError)
    const setIsSubmitError = useLoadingStore((state) => state.setIsSubmitError)

    const stopScroll = useScroll((state) => state.stop)
    const startScroll = useScroll((state) => state.start)

    useEffect(() => {
        if (isSubmitError) {
            stopScroll()
        } else {
            startScroll()
        }
    }, [isSubmitError])

    const modalAppearSpring = useSpring({
        scale: isSubmitError ? 1 : 0.9,
        opacity: isSubmitError ? 1 : 0,
        config: {
            duration: 600,
            easing: easings.easeInOutCubic,
        },
    })

    const dashAppearSpring = useSpring({
        opacity: isSubmitError ? 1 : 0,
        config: {
            duration: 400,
            easing: easings.easeInOutCubic,
        },
    })

    const handleCloseModal = () => {
        setIsSubmitError(false)
    }

    return (
        <StyledErrorModal style={{pointerEvents: isSubmitError ? 'auto' : 'none', userSelect: isSubmitError ? 'auto' : 'none'}}>
            <animated.div className="dashContainer" style={dashAppearSpring} onClick={handleCloseModal}/>
            <StyledModalContent style={modalAppearSpring}>
                <svg className="successIcon" width="41" height="40" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" width="40" height="40" rx="20" fill="#17AA52" fill-opacity="0.12"/>
                    <path d="M15 20.5L18.8333 24.5L27 16.5" stroke="#0FB552" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                <svg className="closeIcon" onClick={handleCloseModal} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 6L18 18M18 6L6 18" stroke="#6F7685" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                <StyledMainText>
                    <p className="title">
                        {t.title}
                    </p>
                    <p className="description">
                        {t.description} <a href={`mailto:${t.email}`}>{t.email}</a>.
                    </p>
                </StyledMainText>

                <BlueButton isSvg onClick={handleCloseModal} className="button">
                    {t.button}
                </BlueButton>
            </StyledModalContent>
        </StyledErrorModal>
    )
}

const StyledErrorModal = styled.div`
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;

    .dashContainer {
        width: 100%;
        height: 100%;
        background-color: #00000099;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1000;
    }
`

const StyledModalContent = styled(animated.div)`
    border-radius: ${rm(10)};
    background-color: ${colors.white100};
    padding: ${rm(24)};
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1001;
    justify-content: center;
    position: relative;

    .successIcon{
        width: ${rm(40)};
        height: ${rm(40)};
        margin-bottom: ${rm(16)};
    }

    .closeIcon{
        position: absolute;
        top: ${rm(16)};
        right: ${rm(16)};
        cursor: pointer;
        transition: opacity 0.3s ease-in-out;
        width: ${rm(24)};
        height: ${rm(24)};
        z-index: 1002;
        
        &:hover{
            opacity: 0.7;
        }
    }

    .button{
        width: 100%;
        padding: ${rm(16)} 0;
    }
`       

const StyledMainText = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${rm(8)};
    width: ${rm(505)};
    justify-content: center;
    text-align: center;
    margin-bottom: ${rm(52)};

    ${media.lg`
        width: ${rm(403)};
    `}

    ${media.xsm`
        width: ${rm(292)};
        margin-bottom: ${rm(30)};
    `}

    .title{
        font-size: ${rm(40)};
        ${fontGolosText(400)};
        line-height: 100%;
        letter-spacing: -0.01em;
        color: ${colors.black100};

        ${media.lg`
            font-size: ${rm(32)};    
        `}

        ${media.xsm`
            font-size: ${rm(24)};
        `}
    }

    .description{
        font-size: ${rm(20)};
        ${fontGolosText(400)};
        line-height: 130%;
        letter-spacing: -0.01em;
        color: ${colors.gray};

        ${media.lg`
            font-size: ${rm(16)};    
        `}

        ${media.xsm`
            font-size: ${rm(14)};
        `}
    }

`
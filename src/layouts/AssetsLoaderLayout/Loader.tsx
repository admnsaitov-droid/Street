'use client'

import { media, rm } from "@/styles"
import { colors } from "@/styles/colors"
import { useRef, useEffect, useState } from "react"
import styled from "styled-components"
import useLoadingStore from "@/store/store"
import { animated, easings, useSpring } from "@react-spring/web"

interface LoaderProps {
    setFullyLoaded: (value: boolean) => void
    progress: number
    isFullyLoaded: boolean
}

export const Loader = ({ setFullyLoaded, progress, isFullyLoaded }: LoaderProps) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const progressRef = useRef(0)
    const setContentLoaded = useLoadingStore(state => state.setContentLoaded)

    const [shouldLogoAnimate, setShouldLogoAnimate] = useState(false)


    useEffect(() => {
        progressRef.current = progress
    }, [progress])

    useEffect(() => {
        if (isLoaded) {
            document.body.style.cursor = 'default'
            return
        }
        document.body.style.cursor = 'progress'
    }, [isLoaded])

    // Animate logo in shortly after mount so it's visible for the full loader duration
    useEffect(() => {
        const timer = setTimeout(() => setShouldLogoAnimate(true), 200)
        return () => clearTimeout(timer)
    }, [])

    // Fake Progress
    // Replace it with real progress/logic
    useEffect(() => {
        setTimeout(() => {
            setIsLoaded(true)
            setTimeout(() => {
                setFullyLoaded(true)
                setContentLoaded(true)
            }, 100)
        }, 1000)
    }, [progressRef.current])


    const secondSvgValues = useSpring({
        y: shouldLogoAnimate ? '0%' : '100%',
        config: {
            duration: 400,
            easing: easings.easeInOutQuad
        },
    })

    const firstSvgValues = useSpring({
        x: shouldLogoAnimate ? '0%' : '-100%',
        config: {
            duration: 400,
            easing: easings.easeInOutQuad
        },
        delay: 200
    })

    const thirdSvgValues = useSpring({
        x: shouldLogoAnimate ? '0%' : '100%',
        config: {
            duration: 400,
            easing: easings.easeInOutQuad
        },
        delay: 200
    })

    return (
        <StyledLoader>
            <StyledLogoContainer>
                <StyledFirstSvgContainer>
                    <animated.svg style={firstSvgValues} width="68" height="13" viewBox="0 0 68 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M30.7149 0.606058H26.1624H23.2695V12.9927H26.9885V9.19343H28.2078L29.9935 12.9927H34.0534L31.6681 8.59081C33.0478 8.1834 34.0534 6.91556 34.0534 5.41324V3.92048C34.0534 2.08927 32.5583 0.604996 30.7138 0.604996L30.7149 0.606058ZM26.9885 3.73694H30.3345V6.06255H26.9885V3.73694Z" fill="white"/>
                        <path d="M38.1517 0.606262H35.2578V12.994H38.1517H45.066V10.0106H38.9778V8.2759H44.3211V5.32433H38.9778V3.58967H45.066V0.606262H38.1517Z" fill="white"/>
                        <path d="M49.219 0.606262H46.3262V12.994H49.219H56.1343V10.0106H50.0451V8.2759H55.3895V5.32433H50.0451V3.58967H56.1343V0.606262H49.219Z" fill="white"/>
                        <path d="M15.1009 0.606262H11.6523V3.73714H15.1009V12.994H18.8199V3.73714H22.2684V0.606262H18.8199H15.1009Z" fill="white"/>
                        <path d="M67.6091 0.606262H64.1616H60.4416H56.9941V3.73714H60.4416V12.994H64.1616V3.73714H67.6091V0.606262Z" fill="white"/>
                        <path d="M7.67708 0.606155H3.51144C1.66693 0.606155 0.171875 2.09043 0.171875 3.92164V5.13644C0.171875 6.36396 1.06207 7.41218 2.28141 7.62013L7.29664 8.47314V9.99561H3.89188V8.57393H0.172943V9.67838C0.172943 11.5096 1.668 12.9939 3.51251 12.9939H7.67815C9.52266 12.9939 11.0177 11.5096 11.0177 9.67838V8.46359C11.0177 7.23606 10.1275 6.18784 8.90818 5.9799L3.89295 5.12688V3.60442H7.2977V5.0261H11.0166V3.92164C11.0166 2.09043 9.52159 0.606155 7.67708 0.606155Z" fill="white"/>
                    </animated.svg>
                </StyledFirstSvgContainer>
                <StyledSecondSvgContainer> 
                    <animated.svg style={secondSvgValues} width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.7614 6.4944L16.0508 3.22874L12.7614 -0.036913L9.47203 3.22875L12.7614 6.4944Z" fill="#FF0021"/>
                        <path d="M16.0491 12.3738L12.7598 9.10811L9.47039 12.3738L12.7598 15.6394L16.0491 12.3738Z" fill="white"/>
                        <path d="M17.3655 11.0656L14.0762 7.8L17.3655 4.53438L20.6548 7.8" fill="white"/>
                        <path d="M11.4453 7.79965L8.15592 4.53403L3.55105 -0.0376282L0.261719 3.22799L4.86657 7.79965L0.261719 12.3713L3.55105 15.6369L8.15592 11.0653L11.4453 7.79965Z" fill="white"/>
                    </animated.svg>
                </StyledSecondSvgContainer>
                <StyledThirdSvgContainer>
                    <animated.svg style={thirdSvgValues} width="79" height="13" viewBox="0 0 79 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.10972 6.93865V6.60657C10.1388 6.16097 11.0964 5.24219 11.0964 3.70698C11.0964 1.9946 9.69855 0.606873 7.97374 0.606873H3.20537H0.3125V12.9935H4.03144H8.10732C9.83214 12.9935 11.2299 11.6058 11.2299 9.89341C11.2299 8.29243 10.188 7.36197 9.10972 6.93865ZM7.37743 5.32388H4.03144V3.58922H7.37743V5.32388ZM7.51101 10.0101H4.03144V8.27545H7.51101V10.0101Z" fill="white"/>
                        <path d="M45.2269 6.93928V6.6072C46.256 6.1616 47.2135 5.24281 47.2135 3.70761C47.2135 1.99523 45.8157 0.607498 44.0909 0.607498H39.3225H36.4297V12.9941H40.1486H44.2245C45.9493 12.9941 47.3471 11.6064 47.3471 9.89403C47.3471 8.29305 46.3052 7.3626 45.2269 6.93928ZM43.4946 5.32451H40.1486V3.58984H43.4946V5.32451ZM43.6282 10.0107H40.1486V8.27608H43.6282V10.0107Z" fill="white"/>
                        <path d="M20.6818 0.606262H13.9866L11.4336 12.9929H15.1525L15.751 9.92994H19.3684L19.9668 12.9929H23.6858L21.1328 0.606262H20.6818ZM16.3623 6.80012L16.9607 3.73714H18.1587L18.7571 6.80012H16.3633H16.3623Z" fill="white"/>
                        <path d="M31.8887 0.606058H27.3362H24.4434V12.9927H28.1623V9.19343H29.3816L31.1674 12.9927H35.2272L32.842 8.59081C34.2216 8.1834 35.2272 6.91556 35.2272 5.41324V3.92048C35.2272 2.08927 33.7322 0.604996 31.8877 0.604996L31.8887 0.606058ZM28.1623 3.73694H31.5083V6.06255H28.1623V3.73694Z" fill="white"/>
                        <path d="M51.2913 0.606262H48.3984V12.994H51.2913H58.2066V10.0106H52.1174V8.2759H57.4617V5.32433H52.1174V3.58967H58.2066V0.606262H51.2913Z" fill="white"/>
                        <path d="M63.1877 0.606262H59.4688V12.994H62.3616H68.5321V9.8631H63.1877V0.606262Z" fill="white"/>
                        <path d="M73.2561 9.8631V0.606262H69.5371V12.994H72.43H78.6004V9.8631H73.2561Z" fill="white"/>
                    </animated.svg>
                </StyledThirdSvgContainer>
            </StyledLogoContainer>
        </StyledLoader>
    )
}

const StyledLoader = styled.div`
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${colors.black100};
    background-color: ${colors.black100};
    pointer-events: all;
    padding: ${rm(16)};
`


const StyledLogoContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: ${rm(8)};
`

const StyledFirstSvgContainer = styled.div`
    width: ${rm(136)};
    height: ${rm(26)};
    overflow: hidden;

    ${media.xsm`
        width: ${rm(80)};
        height: ${rm(16)};
    `}

    svg{
        width: 100%;
        height: 100%;
    }
`

const StyledSecondSvgContainer = styled.div`
    width: ${rm(42)};
    height: ${rm(32)};
    overflow: hidden;

    ${media.xsm`
        width: ${rm(24)};
        height: ${rm(18)};
    `}

    svg{
        width: 100%;
        height: 100%;
    }
`

const StyledThirdSvgContainer = styled.div`
    width: ${rm(158)};
    height: ${rm(26)};
    overflow: hidden;

    ${media.xsm`
        width: ${rm(80)};
        height: ${rm(16)};
    `}

    svg{
        width: 100%;
        height: 100%;
    }
`
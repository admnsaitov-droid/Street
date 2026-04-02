import { AnimatedDivider } from "@/components/animated/AnimatedDivider/AnimatedDivider";
import { BlueButton } from "@/components/Ui/buttons/BlueButton";
import { colors, media, rm } from "@/styles";
import { fontGolosText, fontSageGrotesk } from "@/styles/fonts";
import { heightLvh, minHeightLvh } from "@/styles/utils";
import styled from "styled-components"
import { AnimatedText } from "@/components/animated/AnimatedText/AnimatedText";
import { AnimatedTranslate } from "@/components/animated/AnimatedTranslate/AnimatedTranslate";
import AnimatedGrid from "@/components/animated/AnimatedContent"
import dynamic from "next/dynamic"
import { useWindowWidth } from "@react-hook/window-size";

const Scene = dynamic(() => import("./components/DynamicScene").then((mod) => mod.DynamicScene), {
    ssr: false,
})



interface GlobeProps {
    globeData: any
}

// const trackers: TrackerData[] = [
//     { position: [2, 1, 2], label: "Austria", enabled: true },
//     { position: [-10, 0.5, 0], label: "France", enabled: true },
//     { position: [0, -1, 2], label: "Brazil", enabled: true },
//     { position: [1.5, 0, -2], label: "Japan", enabled: true },
// ]

export const Globe = ({ globeData }: GlobeProps) => {
    const width = useWindowWidth()
    return (
        <StyledGlobe>
            <div className="left">
                <div style={{pointerEvents: 'none', userSelect: 'none'}}>
                    <StyledTitleContainer>
                        <AnimatedGrid
                            type="words"
                            animation={{
                                from: { opacity: 0, y: '40px' },
                                to: { opacity: 1, y: '0px' },
                                delayStep: 60
                            }}
                            overflow={true}
                            gap={{ horizontal: '0.25em', vertical: '0.25em' }}
                            containerStyle={{ overflow: 'hidden' }}
                            cellConfigs={{
                                'title-first': {
                                    style: {
                                        color: colors.white100,
                                        fontFamily: 'var(--font-golos-text)',
                                        fontOpticalSizing: 'auto',
                                        fontWeight: 600,
                                        fontStyle: 'normal',
                                    }
                                },
                                'title-second': {
                                    style: {
                                        color: colors.red,
                                        fontFamily: 'var(--font-sage-grotesk)',
                                        fontOpticalSizing: 'auto',
                                        fontWeight: 400,
                                        fontStyle: 'normal',
                                        lineHeight: '105%',
                                    }
                                }
                            }}
                        >
                            <span id="title-first">{globeData?.title?.textFirst}</span>
                            <span id="title-second" className="first">{globeData?.title?.textSecond}</span>
                        </AnimatedGrid>
                    </StyledTitleContainer>
                    <StyledDescription>{globeData?.description}</StyledDescription>
                </div>
                {width <= 768 ? <Scene /> : null}
                <div>
                    <StyledContinents style={{pointerEvents: 'none', userSelect: 'none'}}>
                        {globeData?.continents?.map((continent: any) => (
                            <StyledContinent key={continent?.id}>
                                <div className="dividerMain"></div>
                                <AnimatedText className="count">{continent?.count}</AnimatedText>
                                <div className="divider">
                                    <AnimatedDivider/>
                                </div>
                                <AnimatedText className="continent">{continent?.continent}</AnimatedText>
                            </StyledContinent>
                        ))}
                    </StyledContinents>
                    {width > 768 ? <AnimatedTranslate className="button-container">
                        <BlueButton link={globeData?.button?.link} isSvg className="button">{globeData?.button?.text}</BlueButton>
                    </AnimatedTranslate>
                    :
                    <div className="button-container">
                        <BlueButton link={globeData?.button?.link} isSvg className="button">{globeData?.button?.text}</BlueButton>
                    </div>
                }
                </div>
            </div>
            {width <= 768 ? null : <Scene />}
        </StyledGlobe>
    )
}

const StyledGlobe = styled.div`
    width: 100%;
    background-color: ${colors.black100};
    position: relative;
    ${heightLvh(100)};
    overflow: hidden;

    ${media.md`
        height: auto;
        ${minHeightLvh(100)};
    `}
    
    .button-container{
        ${media.md`
            margin: ${rm(0)} ${rm(25)};
            padding-bottom: ${rm(100)};
        `}

        ${media.xsm`
            margin: ${rm(0)} ${rm(16)};
            padding-bottom: ${rm(70)};
        `}
    }

    .button{
        width: fit-content;
        width: ${rm(550 * 0.46)};
        padding: ${rm(16)} 0;
        
        ${media.lg`
            width: ${rm(440 * 0.46)};
        `}

        ${media.xsm`
            width: 100%;
        `}
    }

    .left{
        display: flex;
        flex-direction: column;
        padding: ${rm(150)} ${rm(50)};
        position: relative;
        z-index: 10;
        justify-content: space-between;
        height: 100%;
        width: 50%;

        ${media.md`
            // padding: ${rm(100)} ${rm(25)};
            padding: 0;
            width: 100%;
        `}

        ${media.xsm`
            // padding: ${rm(70)} ${rm(16)};
        `}
    }
`

const StyledTitleContainer = styled.div`
    width: ${rm(600)};
    margin-bottom: ${rm(20)};
    
    ${media.lg`
        width: ${rm(450)};
        font-size: ${rm(40)};
        // padding: ${rm(100)} ${rm(25)} ${rm(0)} ${rm(25)};
    `}

    ${media.xsm`
        width: 100%;
        font-size: ${rm(32)};
        padding: ${rm(70)} ${rm(16)} ${rm(0)} ${rm(16)};
    `}

    line-height: 90%;
    letter-spacing: -0.01em;
    font-size: ${rm(48)};
    text-transform: uppercase;
`

const StyledContinents = styled.div`
    display: flex;
    row-gap: ${rm(40)};
    column-gap: ${rm(20)};
    width: ${rm(550)};
    margin-bottom: ${rm(64)};
    flex-wrap: wrap;

    ${media.lg`
        width: ${rm(440)};
    `}

    ${media.md`
        padding: ${rm(10)} ${rm(25)} ${rm(0)} ${rm(25)};
    `}

    ${media.xsm`
        width: 100%;
        margin-bottom: ${rm(30)};
        row-gap: ${rm(30)};
        column-gap: ${rm(8)};
        padding: ${rm(10)} ${rm(16)} ${rm(0)} ${rm(16)};
    `}
`

const StyledDescription = styled(AnimatedText)`
    width: ${rm(550)};
    line-height: 130%;
    font-size: ${rm(20)};
    ${fontGolosText(400)};
    color: ${colors.white100};
    margin-bottom: ${rm(56)};

    ${media.lg`
        width: ${rm(440)};
        font-size: ${rm(16)};
    `}

    ${media.md`
        padding: ${rm(0)} ${rm(25)} ${rm(0)} ${rm(25)};
    `}

    ${media.xsm`
        width: ${rm(272)};
        font-size: ${rm(14)};
        padding: ${rm(0)} ${rm(16)} ${rm(0)} ${rm(16)};
    `}
`


const StyledContinent = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${rm(15)};
    width: 46%;

    ${media.xsm`
        width: 48.7%;
    `}

    .dividerMain{
        margin-bottom: ${rm(30)};
        width: 100%;
        height: 1px;
        background: repeating-linear-gradient(
            to right,
            ${colors.gray} 0,
            ${colors.gray} 1px,
            transparent 1px,
            transparent 5px
        );
        background-size: auto;
        border: none;
        position: relative;
    }
    
    .count{
        font-size: ${rm(48)};
        ${fontSageGrotesk(400)};
        color: ${colors.white100};
        line-height: 90%;
        letter-spacing: -0.02em;
        
        ${media.lg`
            font-size: ${rm(40)};
        `}

        ${media.xsm`
            font-size: ${rm(32)};
        `}
    }

    .divider{
        width: ${rm(40)};
        height: 2px;

        div{
            background-color: ${colors.gray};
        }
    }

    .continent{
       font-size: ${rm(20)};
       ${fontGolosText(400)};
       color: ${colors.white100};
       line-height: 130%;

       ${media.lg`
            font-size: ${rm(16)};
       `}

       ${media.xsm`
            font-size: ${rm(14)};
       `}
    }
`
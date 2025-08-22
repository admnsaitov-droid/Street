import { AnimatedDivider } from "@/components/animated/AnimatedDivider/AnimatedDivider";
import { BlueButton } from "@/components/Ui/buttons/BlueButton";
import { colors, media, rm } from "@/styles";
import { fontGolosText, fontSageGrotesk } from "@/styles/fonts";
import { heightLvh } from "@/styles/utils";
import styled from "styled-components"
import { Scene } from "./components/Scene";
import { AnimatedText } from "@/components/animated/AnimatedText/AnimatedText";
import { AnimatedTranslate } from "@/components/animated/AnimatedTranslate/AnimatedTranslate";

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
    return (
        <StyledGlobe>
            <div className="left">
                <div>
                    <StyledTitle>
                        {globeData?.title?.textFirst}
                        <span className="first">{globeData?.title?.textSecond}</span>
                    </StyledTitle>
                    <StyledDescription>{globeData?.description}</StyledDescription>
                </div>
                <div>
                    <StyledContinents>
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
                    <AnimatedTranslate>
                        <BlueButton link={globeData?.button?.link} isSvg className="button">{globeData?.button?.text}</BlueButton>
                    </AnimatedTranslate>
                </div>
            </div>
            <Scene />
        </StyledGlobe>
    )
}

const StyledGlobe = styled.div`
    width: 100%;
    background-color: ${colors.black100};
    position: relative;
    ${heightLvh(100)};
    overflow: hidden;
    
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
        z-index: 2;
        justify-content: space-between;
        height: 100%;

        ${media.md`
            padding: ${rm(100)} ${rm(25)};
        `}

        ${media.xsm`
            padding: ${rm(70)} ${rm(16)};
        `}
    }
`

const StyledTitle = styled.p`
    width: ${rm(600)};
    margin-bottom: ${rm(20)};
    
    ${media.lg`
        width: ${rm(450)};
        font-size: ${rm(40)};
    `}

    ${media.xsm`
        width: 100%;
        font-size: ${rm(32)};
    `}

    line-height: 90%;
    letter-spacing: -0.01em;
    font-size: ${rm(48)};
    text-transform: uppercase;
    ${fontGolosText(600)};
    color: ${colors.white100};

    .first{
        ${fontSageGrotesk(400)} !important;
        color: ${colors.red} !important;
        margin-right: ${rm(10)};
        letter-spacing: -0.02em;
    }
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

    ${media.xsm`
        width: 100%;
        margin-bottom: ${rm(30)};
        row-gap: ${rm(30)};
        column-gap: ${rm(8)};
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

    ${media.xsm`
        width: ${rm(272)};
        font-size: ${rm(14)};
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
        height: ${rm(2)};
        background: radial-gradient(
            circle at ${rm(1)} ${rm(1)},
            ${colors.gray} ${rm(1)},
            transparent ${rm(1)}
        );
        background-size: ${rm(16)} ${rm(8)};
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
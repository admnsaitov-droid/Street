import { AnimatedDivider } from "@/components/animated/AnimatedDivider/AnimatedDivider";
import { AnimatedText } from "@/components/animated/AnimatedText/AnimatedText"
import { colors, media, rm } from "@/styles";
import { fontGolosText, fontSageGrotesk } from "@/styles/fonts";
import styled from "styled-components"

interface AchievementsProps {
    achievementsData: any
}

export const Achievements = ({ achievementsData }: AchievementsProps) => {
    return (
        <StyledAchievements>
            <StyledAchievementsList className="leftAchievements">
                {achievementsData?.leftAchievements?.map((achievement: any) => (
                    <StyledAchievement key={achievement.id}>
                        <hr className="dividerMain" />
                        <AnimatedText className="count">{achievement.indicator}</AnimatedText>
                        <div className="divider">
                            <AnimatedDivider duration={600} />
                        </div>
                        <AnimatedText className="achievement">{achievement.achievement}</AnimatedText>
                    </StyledAchievement>
                ))}
            </StyledAchievementsList>
            <div className="right">
                <StyledTitle>
                    <span className="first">{achievementsData?.title?.textFirst}</span>
                    {achievementsData?.title?.textSecond}
                </StyledTitle>
                <StyledAchievementsList className="rightAchievements">
                    {achievementsData?.rightAchievements?.map((achievement: any) => (
                        <StyledAchievement key={achievement.id}>
                            <hr className="dividerMain" />
                            <AnimatedText className="count">{achievement.indicator}</AnimatedText>
                            <div className="divider">
                                <AnimatedDivider duration={600} />
                            </div>
                            <AnimatedText className="achievement">{achievement.achievement}</AnimatedText>
                        </StyledAchievement>
                    ))}
                </StyledAchievementsList>
            </div>
        </StyledAchievements>
    )
}

const StyledAchievements = styled.div`
    width: 100%;
    padding: ${rm(150)} ${rm(50)};
    display: flex;
    gap: ${rm(40)};

    ${media.md`
        flex-direction: column;
        flex-direction: column-reverse;
        padding: ${rm(150)} ${rm(25)};
    `}

    ${media.xsm`
        padding: ${rm(70)} ${rm(16)};
        gap: ${rm(30)};
    `}

    .leftAchievements{
        ${media.md`
            padding-left: ${rm(20)};
            display: flex;
            justify-content: flex-end;
        `}

        ${media.xsm`
            padding-left: ${rm(0)};
            justify-content: flex-start;
            width: 100%;
        `}
    }

    .right{
        display: flex;
        flex-direction: column;
        gap: ${rm(40)};

        ${media.xsm`
            gap: ${rm(30)};
        `}

        .rightAchievements{
            width: 100%;
        }
    }
`

const StyledTitle = styled.p`
    width: ${rm(700)};
    line-height: 90%;
    letter-spacing: -0.02em;
    font-size: ${rm(48)};
    text-transform: uppercase;
    ${fontGolosText(600)};
    color: ${colors.black100};

    ${media.lg`
        width: ${rm(553)};
        font-size: ${rm(40)};
    `}

    ${media.xsm`
        width: 100%;
        font-size: ${rm(32)};
    `}

    .first{
        ${fontSageGrotesk(400)} !important;
        color: ${colors.red} !important;
        margin-right: ${rm(10)};
    }

`

const StyledAchievementsList = styled.div`
    display: flex;
    gap: ${rm(40)};
    width: 50%;

    ${media.md`
        width: 100%;
        gap: ${rm(10)};
    `}
`

const StyledAchievement = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${rm(15)};
    width: 50%;

    ${media.md`
        width: 33%;    
    `}

    ${media.xsm`
        width: 50%;
    `}

    .dividerMain{
        margin-bottom: ${rm(15)};
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
        color: ${colors.black100};
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
            background-color: ${colors.black100};
        }
    }

    .achievement{
       font-size: ${rm(20)};
       ${fontGolosText(400)};
       color: ${colors.gray};
       line-height: 130%;

       ${media.lg`
            font-size: ${rm(16)};
       `}

       ${media.xsm`
            font-size: ${rm(14)};
       `}
    }
`
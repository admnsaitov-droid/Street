import { colors, media, rm } from "@/styles"
import { StyledContactDescription } from "../ContactView"
import { StyledContactLeft } from "../ContactView"
import { StyledAnnotation } from "@/views/PackagesView/screens/Package/Package"
import styled from "styled-components"
import { fontGolosText } from "@/styles/fonts"
import { AnimatedText } from "@/components/animated/AnimatedText/AnimatedText"

interface GetInTouchProps {
    data: any
}

export const GetInTouch = ({ data }: GetInTouchProps) => {
    console.log( ' get in touch data', data)
    return (
        <StyledGetInTouch>
            <StyledAnnotation tag="h2">
                {data?.title}
            </StyledAnnotation>
            <StyledContactLeft>
                <StyledContactDescription>
                    {data?.description}
                </StyledContactDescription>
                <StyledHelp>
                    <div className="section">
                        <StyledHelpBlock>
                            <AnimatedText className="name">{data?.phoneText}</AnimatedText>
                            <AnimatedText className="text">{data?.phone}</AnimatedText>
                        </StyledHelpBlock>
                        <StyledHelpBlock>
                            <AnimatedText className="name">{data?.unquiriesText}</AnimatedText>
                            <AnimatedText className="text">{data?.inquries}</AnimatedText>
                        </StyledHelpBlock>
                        <StyledHelpBlock>
                            <AnimatedText className="name">{data?.supportText}</AnimatedText>
                            <AnimatedText className="text">{data?.support}</AnimatedText>
                        </StyledHelpBlock>
                    </div>
                    <div className="section">
                        <StyledHelpBlock>
                            <AnimatedText className="name">{data?.addressText}</AnimatedText>
                            <AnimatedText className="text">{data?.address}</AnimatedText>
                        </StyledHelpBlock>
                        <StyledHelpBlock>
                            <AnimatedText className="name">{data?.hoursText}</AnimatedText>
                            <AnimatedText className="text">{data?.hours}</AnimatedText>
                        </StyledHelpBlock>
                    </div>
                </StyledHelp>
            </StyledContactLeft>
        </StyledGetInTouch>
    )
}

const StyledGetInTouch = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-top: ${rm(75)};

    ${media.md`
        flex-direction: column;
        gap: ${rm(30)};
    `}
`

const StyledHelp = styled.div`
    display: flex;
    gap: ${rm(10)};

    ${media.xsm`
        flex-direction: column;
        gap: ${rm(25)};
    `}

    .section{
        display: flex;
        flex-direction: column;
        gap: ${rm(30)};
        width: ${rm(457)};

        ${media.lg`
            width: ${rm(327)};
        `}
    }
`

const StyledHelpBlock = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${rm(10)};
    width: 100%;
    cursor: pointer;
    transition: opacity 0.3s ease-in-out;

    &:hover{
        opacity: 0.7;
    }

    .name{
        font-size: ${rm(20)};
        line-height: 110%;
        ${fontGolosText(400)}
        color: ${colors.gray90};
        text-transform: uppercase;

        ${media.lg`
            font-size: ${rm(16)};
        `}

        ${media.xsm`
            font-size: ${rm(14)};
        `}
    }

    .text{
        font-size: ${rm(30)};
        line-height: 110%;
        ${fontGolosText(400)}
        color: ${colors.black100};
        letter-spacing: -0.01em;

        ${media.lg`
            font-size: ${rm(24)};
        `}

        ${media.xsm`
            font-size: ${rm(16)};
        `}
    }

`
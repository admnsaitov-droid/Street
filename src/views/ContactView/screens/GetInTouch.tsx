import { colors, media, rm } from "@/styles"
import { StyledContactDescription } from "../ContactView"
import { StyledContactLeft } from "../ContactView"
import { StyledAnnotation } from "@/views/PackagesView/screens/Package/Package"
import styled from "styled-components"
import { fontGolosText } from "@/styles/fonts"

interface GetInTouchProps {
    data: any
}

export const GetInTouch = ({ data }: GetInTouchProps) => {
    return (
        <StyledGetInTouch>
            <StyledAnnotation>
                {data?.title}
            </StyledAnnotation>
            <StyledContactLeft>
                <StyledContactDescription>
                    {data?.description}
                </StyledContactDescription>
                <StyledHelp>
                    <div className="section">
                        <StyledHelpBlock>
                            <div className="name">Phone</div>
                            <div className="text">{data?.phone}</div>
                        </StyledHelpBlock>
                        <StyledHelpBlock>
                            <div className="name">General Inquiries</div>
                            <div className="text">{data?.inquries}</div>
                        </StyledHelpBlock>
                        <StyledHelpBlock>
                            <div className="name">Customer Support</div>
                            <div className="text">{data?.support}</div>
                        </StyledHelpBlock>
                    </div>
                    <div className="section">
                        <StyledHelpBlock>
                            <div className="name">ADDRESS</div>
                            <div className="text">{data?.address}</div>
                        </StyledHelpBlock>
                        <StyledHelpBlock>
                            <div className="name">Open hours</div>
                            <div className="text">{data?.hours}</div>
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
`

const StyledHelp = styled.div`
    display: flex;
    gap: ${rm(10)};

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
    }

`
"use client"
import { colors, media, rm } from "@/styles"
import styled from "styled-components"
import { StyledTitle } from "../PackagesView/PackagesView"
import { fontGolosText } from "@/styles/fonts"
import { ContactForm } from "./screens/ContactForm"
import { GetInTouch } from "./screens/GetInTouch"
import { AnimatedText } from "@/components/animated/AnimatedText/AnimatedText"

interface ContactViewProps {
    data: any
}

export const ContactView = ({ data }: ContactViewProps) => {
    console.log(data)
    return (
        <StyledContactView>
            <StyledTop>
                <StyledTitle>
                    Contact
                </StyledTitle>
                <StyledContactLeft>
                    <StyledContactDescription>
                        {data.description}
                    </StyledContactDescription>
                    <ContactForm />
                </StyledContactLeft>
            </StyledTop>
            <GetInTouch data={data?.getInTouchBlock} />
        </StyledContactView>
    )
}

const StyledContactView = styled.div`
    width: 100%;
    padding: ${rm(110)} ${rm(50)} ${rm(150)} ${rm(50)};
    min-height: 100vh;
`

const StyledTop = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-bottom: ${rm(75)};
    position: relative;

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        background-image: 
            radial-gradient(circle 1px at 4px 0.5px, #B7BCCA 100%, transparent 100%),
            radial-gradient(circle 1px at 12px 0.5px, #B7BCCA 100%, transparent 100%),
            radial-gradient(circle 1px at 20px 0.5px, #B7BCCA 100%, transparent 100%),
            radial-gradient(circle 1px at 28px 0.5px, #B7BCCA 100%, transparent 100%),
            radial-gradient(circle 1px at 36px 0.5px, #B7BCCA 100%, transparent 100%),
            radial-gradient(circle 1px at 44px 0.5px, #B7BCCA 100%, transparent 100%),
            radial-gradient(circle 1px at 52px 0.5px, #B7BCCA 100%, transparent 100%),
            radial-gradient(circle 1px at 60px 0.5px, #B7BCCA 100%, transparent 100%);
        background-size: 16px 1px;
        background-repeat: repeat-x;
        transition: opacity 0.3s ease-in-out;
    }
`

export const StyledContactLeft = styled.div`
    width: ${rm(1007)};

    ${media.lg`
        width: ${rm(777)};  
    `}
`

export const StyledContactDescription = styled(AnimatedText)`
    width: 100%;
    font-size: ${rm(40)};
    color: ${colors.black100};
    ${fontGolosText(400)};
    line-height: 100%;
    letter-spacing: -0.01em;
    margin-bottom: ${rm(80)};
    
    ${media.lg`
        font-size: ${rm(32)};
    `}
`
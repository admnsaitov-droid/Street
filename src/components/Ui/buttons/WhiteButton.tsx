import { AnimLink } from "@/layouts/AnimatedRouterLayout/AnimatedRouterLayout";
import { colors, media, rm } from "@/styles";
import { fontGolosText } from "@/styles/fonts";
import styled from "styled-components";

interface WhiteButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    isSvg?: boolean;
    className?: string;
    link?: string;
}

export const WhiteButton = ({ children, onClick, isSvg, className, link }: WhiteButtonProps) => {    

    return (
        <StyledWhiteButton onClick={onClick} className={className}>
            {children}
            {link && (
                <StyledHiddenLink href={link} target="_blank"/>
            )}
            {isSvg && (
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.1092 9.21504L13.7168 5.60742L10.1092 1.99981L6.50157 5.60742L10.1092 9.21504Z" fill="black"/>
                    <path d="M13.715 19.1799L10.1074 15.5723L6.49981 19.1799L10.1074 22.7875L13.715 19.1799Z" fill="black"/>
                    <path d="M16.8927 16.0023L13.2852 12.3947L16.8927 8.78711L20.5003 12.3947" fill="black"/>
                </svg>
            )}
        </StyledWhiteButton>
    )
}

const StyledWhiteButton = styled.button`
    background-color: ${colors.white100};
    border-radius: ${rm(4)};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${rm(10)};
    padding: ${rm(16)} ${rm(28.5)};
    cursor: pointer;
    transition: opacity 0.3s ease;
    font-size: ${rm(18)};
    ${fontGolosText(600)};
    color: ${colors.black100};
    text-transform: uppercase;
    position: relative;

    ${media.lg`
        font-size: ${rm(16)};
    `}

    svg{
        width: ${rm(24)};
        height: ${rm(24)};
    }

    &:hover{
        opacity: 0.8;
    }

`

const StyledHiddenLink = styled(AnimLink)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
`
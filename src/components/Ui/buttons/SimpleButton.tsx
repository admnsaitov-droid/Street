import { AnimLink } from "@/layouts/AnimatedRouterLayout/AnimatedRouterLayout";
import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import styled from "styled-components"

interface SimpleButtonProps {
    children: React.ReactNode;
    link?: string;
    onClick?: () => void;
}

export const SimpleButton = ({ children, link, onClick }: SimpleButtonProps) => {
    return (
        <AnimLink href={link ? link : ''} onClick={onClick ? onClick : () => {}}>
            <StyledButton>
                {children}
            </StyledButton>
        </AnimLink>
    )
}

const StyledButton = styled.button`
    background-color: ${colors.blue};
    padding: ${rm(16)} ${rm(14)};
    color: ${colors.white100};
    border-radius: ${rm(5)};
    font-size: ${rm(20)};
    ${fontGolosText(600)};
    cursor: pointer;

    ${media.lg`
        font-size: ${rm(16)};
    `}
`
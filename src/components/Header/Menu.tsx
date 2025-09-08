import { useScroll } from "@/layouts/ScrollLayout/useScroll";
import { colors, media, rm } from "@/styles"
import styled from "styled-components"

interface MenuProps {
    data: any;
}

export const Menu = ({ data }: MenuProps) => {

    const stopScroll = useScroll((state) => state.stop);
    const startScroll = useScroll((state) => state.start);

    return (
        <StyledMenu>
            <div className="button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="6" width="18" height="2" rx="1" fill="white"/>
                    <rect x="3" y="11" width="18" height="2" rx="1" fill="white"/>
                    <rect x="3" y="16" width="18" height="2" rx="1" fill="white"/>
                </svg>
            </div>
        </StyledMenu>
    )
}

const StyledMenu = styled.div`
    position: relative;
    display: none;

    ${media.md`
        display: block;
    `}

    .button{
        padding: ${rm(11)};
        background-color: ${colors.blue};
        border-radius: ${rm(5)};

        svg{
            width: ${rm(24)};
            height: ${rm(24)};
            transform: translateY(10%);
        }
    }
`   

const StyledMenuContainer = styled.div`
    position: fixed;
`
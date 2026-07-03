import { colors, rm } from "@/styles";
import { fontGolosText } from "@/styles/fonts";
import styled from "styled-components"

interface LinesInfoCardProps {
    count: number;
    name: string;
    machinesText: string;
    exploreText: string;
    isHovered: boolean;
}

export const LinesInfoCard = ({ count, name, machinesText, exploreText, isHovered }: LinesInfoCardProps) => {

    return (
        <StyledLinesInfoCard>
            <StyledContent $isHovered={isHovered}>
                <div className="left"> 
                    <h3 className="name">{name}</h3>
                    <p className="count">{count} {machinesText}</p>
                </div>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="48" rx="4" fill={isHovered ? '#0040DD' : 'white'}/>
                    <path d="M21.6092 21.215L25.2168 17.6074L21.6092 13.9998L18.0016 17.6074L21.6092 21.215Z" fill={isHovered ? 'white' : '#0040DD'}/>
                    <path d="M25.215 31.1799L21.6074 27.5723L17.9998 31.1799L21.6074 34.7875L25.215 31.1799Z" fill={isHovered ? 'white' : '#0040DD'}/>
                    <path d="M28.3927 28.0023L24.7852 24.3947L28.3927 20.7871L32.0003 24.3947" fill={isHovered ? 'white' : '#0040DD'}/>
                </svg>
            </StyledContent>
        </StyledLinesInfoCard>
    )
}

const StyledLinesInfoCard = styled.div`
    position: absolute;
    bottom: ${rm(10)};
    width: calc(100% - ${rm(20)});
    left: ${rm(10)};
    z-index: 2;
`

const StyledContent = styled.div<{ $isHovered: boolean }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${rm(16)};
    background-color: rgba(255, 255, 255, 0.7);
    border: 1px solid #B7BCCA33;
    border-radius: ${rm(6)};
    box-shadow: 0px 4px 30px 0px #0000000D;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);

    svg{
        width: ${rm(48)};
        height: ${rm(48)};

        rect, path{
            transition: color 0.3s ease-in-out, fill 0.3s ease-in-out;
        }
    }


    .left{
        display: flex;
        flex-direction: column;
        gap: ${rm(12)};
    }

    .name{
        font-size: ${rm(18)};
        ${fontGolosText(500)};
        line-height: 100%;
        color: black;
        text-transform: uppercase;

        transition: color 0.3s ease-in-out;

        ${({ $isHovered }) => $isHovered && `
            color: #0040DD;
        `}
    }

    .count{
        font-size: ${rm(16)};
        ${fontGolosText(400)};
        line-height: 110%;
        color: #6F7685;
        text-transform: uppercase;
    }
`
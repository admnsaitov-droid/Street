import styled from "styled-components";
import { LineCard } from "./components/LineCard";
import { media, rm } from "@/styles";
import { BlueButton } from "../Ui/buttons/BlueButton";

interface LinesGridProps {
    linesData: any;
    machinesText: string;
    exploreText: string;
    isHome?: boolean;
}

export const LinesGrid = ({ linesData, machinesText, exploreText, isHome }: LinesGridProps) => {
    return (
        <StyledLinesGrid>
            <StyledContent>
                {linesData?.map((line: any, index: number) => (
                    <LineCard key={line?.id} lineData={line} machinesText={machinesText} exploreText={exploreText} />
                ))}
            </StyledContent>
            {isHome && (
                <BlueButton link={'/lines'} isSvg={true}>{exploreText}</BlueButton>
            )}
        </StyledLinesGrid>
    )
}

const StyledLinesGrid = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${rm(40)};
    align-items: center;
    width: 100%;
`

const StyledContent = styled.div`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: ${rm(20)};
    width: 100%;

    /* First row: 2 items, each spanning 3 columns */
    & > :nth-child(1),
    & > :nth-child(2) {
        grid-column: span 3;
        aspect-ratio: 3 / 2;

        ${media.md`
            grid-column: auto;
            aspect-ratio: 1;
        `}
    }

    /* All other rows: 3 items, each spanning 2 columns */
    & > :nth-child(n+3) {
        grid-column: span 2;

        ${media.md`
            grid-column: auto;
        `}
    }

    ${media.md`
        grid-template-columns: 1fr 1fr;
    `}

    /* Mobile: simple vertical list */
    ${media.xsm`
        display: flex;
        flex-direction: column;
        gap: ${rm(20)};
    `}
`
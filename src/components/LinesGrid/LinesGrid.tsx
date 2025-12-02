import styled from "styled-components";
import { LineCard } from "./components/LineCard";
import { media } from "@/styles";

interface LinesGridProps {
    linesData: any;
    machinesText: string;
    exploreText: string;
}

export const LinesGrid = ({ linesData, machinesText, exploreText }: LinesGridProps) => {
    return (
        <StyledLinesGrid>
            {linesData?.map((line: any) => (
                <LineCard key={line?.id} lineData={line} machinesText={machinesText} exploreText={exploreText} />
            ))}
        </StyledLinesGrid>
    )
}

const StyledLinesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 20px;

    /* First row: 2 items, each spanning 3 columns */
    & > :nth-child(1) {
        grid-column: span 3;

        ${media.md`
            grid-column: auto;
        `}
    }

    & > :nth-child(2) {
        grid-column: span 3;

        ${media.md`
            grid-column: auto;
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

    ${media.xsm`
        grid-template-columns: 1fr;
    `}
`
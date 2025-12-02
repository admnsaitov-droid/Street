import styled from "styled-components";
import { LineCard } from "./components/LineCard";

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
    }

    & > :nth-child(2) {
        grid-column: span 3;
    }

    /* All other rows: 3 items, each spanning 2 columns */
    & > :nth-child(n+3) {
        grid-column: span 2;
    }
`
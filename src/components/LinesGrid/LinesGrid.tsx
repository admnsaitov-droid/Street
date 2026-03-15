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
                    <LineCard key={line?.id} lineData={line} machinesText={machinesText} exploreText={exploreText} isSquare={index >= 2} />
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
    container-type: inline-size;
    /* Row height = one cell width in 3-col layout (use cqw so it's width-based, not height %) */
    --row-height: calc((100cqw - 2 * ${rm(20)}) / 3);
    grid-auto-rows: var(--row-height);

    /* First row: 2 items, each spanning 3 columns, same row height as others */
    & > :nth-child(1),
    & > :nth-child(2) {
        grid-column: span 3;
        height: 100%;

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
        --row-height: calc((100cqw - ${rm(20)}) / 2);
    `}

    ${media.xsm`
        grid-template-columns: 1fr;
        grid-auto-rows: auto;
    `}
`
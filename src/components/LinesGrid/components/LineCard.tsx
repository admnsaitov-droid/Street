import { media, rm } from "@/styles";
import styled from "styled-components";
import Image from "next/image";
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath";
import { AnimLink } from "@/layouts/AnimatedRouterLayout/AnimatedRouterLayout";
import { LinesInfoCard } from "./LinesInfoCard";
import { useState } from "react";

interface LineCardProps {
    lineData: any;
    machinesText: string;
    exploreText: string;
    isSquare?: boolean;
}

export const LineCard = ({ lineData, machinesText, exploreText, isSquare = false }: LineCardProps) => {

    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <StyledLineCard $isSquare={isSquare} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <StyledHiddenLink href={`/lines/${lineData?.linii?.slug}`} aria-label={`View ${lineData?.linii?.name} line details`}></StyledHiddenLink>
            <StyledImageWrapper className="image-wrapper">
                <Image src={getMediaStrapiPath(lineData?.linePreviewImage)} alt={lineData?.name} width={440} height={282} />
            </StyledImageWrapper>
            <LinesInfoCard count={lineData?.productsQuantity} name={lineData?.linii?.name} machinesText={machinesText} exploreText={exploreText} isHovered={isHovered} />
        </StyledLineCard>
    )
}

const StyledLineCard = styled.div<{ $isSquare?: boolean }>`
    display: flex;
    position: relative;
    overflow: hidden;
    border-radius: ${rm(10)};
    cursor: pointer;

    ${({ $isSquare }) =>
        $isSquare
            ? `
        aspect-ratio: 1;
        width: 100%;
        height: auto;
    `
            : `
        height: 100%;
        min-height: ${rm(452)};
        ${media.xsm`
            min-height: ${rm(282)};
        `}
    `}

    &:hover{
        .image-wrapper{
            transform: scale(1.01);
        }
    }
`

const StyledImageWrapper = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;

    transition: transform 0.3s ease-in-out;

    img{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

const StyledHiddenLink = styled(AnimLink)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
`
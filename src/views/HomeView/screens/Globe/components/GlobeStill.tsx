import Image from "next/image"
import styled from "styled-components"
import { media, rm } from "@/styles"
import { heightLvh } from "@/styles/utils"

/**
 * The globe on the robot form: one frame of the live scene, captured from the
 * page, in the box the canvas fills (`Scene.tsx` → StyledContainer). Kept out
 * of `Scene.tsx` so the robot document never pulls three.js.
 */
export const GlobeStill = ({ phone }: { phone: boolean }) => (
    <StyledStill>
        <Image
            src={phone ? '/robot/globe-mobile.webp' : '/robot/globe-desktop.webp'}
            alt=""
            fill
            sizes="100vw"
            loading="lazy"
        />
    </StyledStill>
)

const StyledStill = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: black;

    img {
        object-fit: cover;
    }

    ${media.md`
        position: relative;
        ${heightLvh(100)};
        margin-bottom: ${rm(100)};
    `}
`

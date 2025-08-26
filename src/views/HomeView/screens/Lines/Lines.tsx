import { Preview, usePreview } from "./components/Preview";
import { Line } from "./components/Line";
import { colors, media, rm } from "@/styles";
import { fontGolosText } from "@/styles/fonts";
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { AnimatedText } from "@/components/animated/AnimatedText/AnimatedText";
import { useWindowWidth } from "@react-hook/window-size";
import { useLoop } from "@/hooks/useLoop";
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath";

interface LinesProps {
  linesData: any;
}

export const Lines = ({ linesData }: LinesProps) => {
    const setAllUrls = usePreview(state => state.setAllUrls)
    const containerRef = usePreview(state => state.containerRef)
    const setUrl = usePreview(state => state.setUrl)
    const setPoster = usePreview(state => state.setPoster)
    const setRoute = usePreview(state => state.setRoute)
    const setIndex = usePreview(state => state.setIndex)
    const url = usePreview(state => state.url)
    const poster = usePreview(state => state.poster)
    
    const width = useWindowWidth()
    const [activeMobileIndex, setActiveMobileIndex] = useState(-1)
    const lineRefs = useRef<(HTMLDivElement | null)[]>([])
    
    useEffect(() => { setAllUrls(linesData.lines) }, [linesData])

    // Mobile scroll detection to find which line is in center of screen
    useLoop(() => {
        if (width > 768) return
        
        if (!containerRef.current || !lineRefs.current.length) return
        
        const screenCenter = window.innerHeight / 2
        let closestIndex = -1
        let closestDistance = Infinity
        const maxDistance = window.innerHeight * 0.15 // Only activate if line is within 15% of screen height
        
        lineRefs.current.forEach((lineRef, index) => {
            if (!lineRef) return
            
            const rect = lineRef.getBoundingClientRect()
            const lineCenter = rect.top + rect.height / 2
            const distance = Math.abs(lineCenter - screenCenter)
            
            if (distance < closestDistance) {
                closestDistance = distance
                closestIndex = index
            }
        })
        
        // If the closest line is too far away, don't activate any preview
        if (closestDistance > maxDistance) {
            closestIndex = -1
        }

        console.log('Mobile scroll detection:', {
            closestIndex,
            closestDistance,
            maxDistance,
            activeMobileIndex,
            shouldClear: closestIndex === -1,
            currentUrl: url,
            currentPoster: !!poster
        })
        

        
        if (closestIndex !== activeMobileIndex) {
            setActiveMobileIndex(closestIndex)
            
            if (closestIndex === -1) {
                // Clear preview state when no line is active
                setUrl('')
                setPoster('')
                setRoute('')
                setIndex(-1)
            } else {
                const line = linesData.lines[closestIndex]
                
                // Update preview state
                setUrl('poster-only')
                setPoster(getMediaStrapiPath(line?.poster))
                setRoute(line?.slug || '')
                setIndex(closestIndex)
            }
        }
        
        // Always clear preview state if closestIndex is -1 and preview is still active
        if (closestIndex === -1 && (url !== '' || poster !== '')) {
            console.log('FORCE CLEARING preview state - closestIndex is -1 but preview is still active')
            setUrl('')
            setPoster('')
            setRoute('')
            setIndex(-1)
        }
    })

    console.log('lines', linesData)

  return (
    <StyledLines ref={containerRef}>
        <Preview />
        <StyledTopContainer>
            <AnimatedText className="title">
                {linesData?.title}
            </AnimatedText>
            <div className="right">
                <div className="descriptionMain">
                    <AnimatedText className="description-animated">
                        {linesData?.description}
                    </AnimatedText>
                </div>
            </div>
        </StyledTopContainer>
        <div className="lines">
            {linesData?.lines.map((line: any, index: number) => (
                <Line 
                    key={line.id} 
                    line={line} 
                    index={index}
                    ref={(el: HTMLDivElement | null) => { lineRefs.current[index] = el }}
                    activeMobileIndex={activeMobileIndex}
                />
            ))}
        </div>
    </StyledLines>
  )
};

const StyledLines = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: ${rm(150)} ${rm(50)};
  position: relative;

  ${media.md`
    padding: ${rm(150)} ${rm(25)};
  `}

  ${media.xsm`
    padding: ${rm(70)} ${rm(16)};
  `}
`;

const StyledTopContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: ${rm(50)};

    ${media.xsm`
        flex-direction: column;
        gap: ${rm(30)};
        margin-bottom: ${rm(30)};
    `}

    .title{
        color: ${colors.gray};
        font-size: ${rm(20)};
        line-height: 110%;
        letter-spacing: -0.01em;
        ${fontGolosText(400)};
        text-transform: uppercase;
        height: fit-content !important;
        
        ${media.lg`
            font-size: ${rm(16)};
        `}

        ${media.xsm`
            font-size: ${rm(14)};
        `}
    }

    .right{
        width: ${rm(1100)};
        
        ${media.lg`
            width: ${rm(890)};
        `}

        ${media.md`
            width: ${rm(476)};
        `}

        ${media.xsm`
            width: 100%;
        `}

        .descriptionMain{
            color: ${colors.black100};
            font-size: ${rm(40)};
            line-height: 115%;
            letter-spacing: -0.01em;
            ${fontGolosText(400)};
            
            span:nth-child(2){
                padding-left: ${rm(113)} !important;
            }
            
            ${media.lg`
                font-size: ${rm(32)};
            `}

            ${media.md`
                font-size: ${rm(24)};
                
                span:nth-child(2){
                    padding-left: ${rm(0)} !important;
                }
            `}

            ${media.xsm`
                font-size: ${rm(20)};
            `}
        }
    }
`   
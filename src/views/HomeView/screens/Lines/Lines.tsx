import { Preview, usePreview } from "./components/Preview";
import { Line } from "./components/Line";
import { colors, media, rm } from "@/styles";
import { fontGolosText } from "@/styles/fonts";
import styled from "styled-components";
import { useEffect } from "react";
import { AnimatedText } from "@/components/animated/AnimatedText/AnimatedText";

interface LinesProps {
  linesData: any;
}

export const Lines = ({ linesData }: LinesProps) => {
    const setAllUrls = usePreview(state => state.setAllUrls)
    const containerRef = usePreview(state => state.containerRef)
    useEffect(() => { setAllUrls(linesData.lines) }, [linesData])



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
                    {linesData?.description}
                </div>
            </div>
        </StyledTopContainer>
        <div className="lines">
            {linesData?.lines.map((line: any, index: number) => (
                <Line key={line.id} line={line} index={index} />
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
`;

const StyledTopContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: ${rm(50)};

    .title{
        color: ${colors.gray};
        font-size: ${rm(20)};
        line-height: 110%;
        letter-spacing: -0.01em;
        ${fontGolosText(400)};
        text-transform: uppercase;
        
        ${media.lg`
            font-size: ${rm(16)};
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

        .descriptionMain{
            color: ${colors.black100};
            font-size: ${rm(40)};
            line-height: 100%;
            text-indent: ${rm(113)};
            letter-spacing: -0.01em;
            ${fontGolosText(400)};
            
            ${media.lg`
                font-size: ${rm(32)};
            `}

            ${media.md`
                font-size: ${rm(24)};
                text-indent: 0;
            `}
        }
    }
`   
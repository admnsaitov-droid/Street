import styled from "styled-components"
import { StyledAnnotation, StyledSubtitle } from "@/views/PackagesView/screens/Package/Package"
import { colors, media, rm } from "@/styles"
import { fontGolosText, fontSageGrotesk } from "@/styles/fonts"
import { MediaComponent } from "@/components/MediaComponent/MediaComponent"
import { useWindowWidth } from "@react-hook/window-size"

interface PurposeProps {
    data: any
}

export const Purpose = ({ data }: PurposeProps) => {
    const width = useWindowWidth();

    return (
        <StyledPurpose>
            <StyledTop>
                <StyledAnnotation>{data?.blockName}</StyledAnnotation>
                <StyledRightTop>
                    <StyledPurposeTitle>
                        <span>{data?.title?.firstWord}</span>
                        {<div style={{width: "100px"}}></div>}
                        <span>{data?.title?.secondWord}</span>
                        <span className="first">{data?.title?.thirdWord}</span>
                    </StyledPurposeTitle>
                    <div className="bottom">
                        <StyledSubtitle>{data?.description}</StyledSubtitle>
                        {width > 768 && <StyledSubtitle>{data?.descriptionSecondary}</StyledSubtitle>}
                    </div>
                </StyledRightTop>
            </StyledTop>
            <StyledBottom>
                <div className="left">
                    {data?.mediaSecondary?.map((image: any, index: number) => (
                        <StyledImageContainer key={index} className="imageContainer">
                            <MediaComponent media={image} className="image" />
                        </StyledImageContainer>
                    ))}
                </div>
                <div className="right">
                    <StyledImageContainer className="imageContainer">
                        <MediaComponent media={data?.mainImage} className="image" />
                    </StyledImageContainer>
                </div>
            </StyledBottom>
        </StyledPurpose>
    )
}

const StyledPurpose = styled.div`
    width: 100%;
    padding: ${rm(150)} ${rm(50)};

    ${media.md`
        padding: ${rm(150)} ${rm(25)};
    `}

    ${media.xsm`
        padding: ${rm(70)} ${rm(16)};
    `}
`   

const StyledTop = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;

    ${media.xsm`
        flex-direction: column;
        gap: ${rm(15)};
    `}
`

const StyledRightTop = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${rm(20)};

    ${media.md`
        width: ${rm(475)};    
    `}

    ${media.xsm`
        width: 100%;
        gap: ${rm(15)};
    `}

    .bottom{
        display: flex;
        gap: ${rm(10)};

        >:nth-child(1){
            width: ${rm(407)};

            ${media.lg`
                width: ${rm(327)};
            `}

            ${media.md`
                width: ${rm(354)};
            `}
        }

        >:nth-child(2){
            width: ${rm(540)};

            ${media.lg`
                width: ${rm(440)};
            `}
        }
    }
`

export const StyledPurposeTitle = styled.p`
    line-height: 90%;
    letter-spacing: -0.01em;
    font-size: ${rm(48)};
    text-transform: uppercase;
    ${fontGolosText(600)};
    color: ${colors.black100};
    gap: ${rm(10)};
    display: flex;
    width: ${rm(440)};
    flex-wrap: wrap;
    width: ${rm(470)};
    
    ${media.lg`
        font-size: ${rm(40)};
        width: ${rm(420)};
    `}

    ${media.md`
        >:first-child{
        margin-bottom: ${rm(-8)};
        }
    `}

    ${media.xsm`
        font-size: ${rm(32)};
        width: ${rm(320)};
    `}

    .first{
        ${fontSageGrotesk(400)} !important;
        color: ${colors.red} !important;
        letter-spacing: -0.02em;
        line-height: 105%;
    }
`

const StyledBottom = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: ${rm(40)};

    ${media.xsm`
        flex-direction: column;
        gap: ${rm(10)};
    `}

    .left{
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        ${media.md`
            gap: ${rm(10)};
        `}

        .imageContainer{
            width: ${rm(215)};
            height: ${rm(215)};

            ${media.md`
                width: ${rm(233)};
                height: ${rm(175)};
            `}

            ${media.xsm`
                width: ${rm(328)};
                height: ${rm(246)};
            `}
        }
    }

    .right{
        width: ${rm(777)};
        height: ${rm(581)};

        ${media.md`
            width: ${rm(475)};
            height: ${rm(360)};
        `}

        ${media.xsm`
            width: 100%;
            height: ${rm(246)};
        `}
    }
`

const StyledImageContainer = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: ${rm(10)};
    overflow: hidden;

    .image{
        width: 100%;
        height: 100%;
    }
`
import { colors, media, rm } from "@/styles";
import { fontGolosText, fontSageGrotesk } from "@/styles/fonts";
import { heightLvh } from "@/styles/utils";
import styled from "styled-components"
import { useEffect, useRef, useState } from "react";
import { SpringTrigger } from "@/components/Springs/SpringTrigger";
import { transformRange, lerp } from "@/utils/math";
import { WhiteButton } from "@/components/Ui/buttons/WhiteButton";
import { useTransition, animated } from "@react-spring/web";
import { MediaComponent } from "@/components/MediaComponent/MediaComponent";
import { useWindowWidth } from "@react-hook/window-size";
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath";

interface PackagesProps {
    packagesData: any
}

export const PackagesMobile = ({ packagesData }: PackagesProps) => {
    const [activePackage, setActivePackage] = useState<any>(null);

    const width = useWindowWidth()

    
    return (
        <StyledPackages>
            <StyledContentLayout>
                {packagesData?.packages?.map((item: any, index: number) => (
                <div className="wrapper" key={index}>
                    <div className="image-container">
                        <MediaComponent media={item?.media} className="image" parallax={width > 576} isExtendable={false} />
                    </div>
                    <div className="left">
                        <StyledMidContent>
                            <div className="title-container">
                                <animated.h3 className="title">
                                    {item?.title}
                                </animated.h3>
                            </div>
                            <div className="description-container">
                                <animated.p className="description">
                                    {item?.description}
                                </animated.p>
                            </div>
                        </StyledMidContent>
                        <WhiteButton className="button" link={item?.button?.link} isSvg={true}>
                            {item?.button?.text}
                        </WhiteButton>
                        </div>
                    </div>
                ))}
            </StyledContentLayout>
        </StyledPackages>
    )
}

const StyledPackages = styled.div`
    width: 100%;
    padding: 0 ${rm(50)};
    position: relative;

    ${media.xsm`
        padding: 0 ${rm(16)};
    `}
`

const StyledContentLayout = styled.div`
    // height: auto;
    height: 100%;
    width: 100%;
    position: relative;
    display: flex;
    padding: ${rm(100)} 0 ${rm(50)} 0;
    flex-direction: column;
    gap: ${rm(20)};

    .wrapper{
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        border-radius: ${rm(10)};
        overflow: hidden;

        ${media.md`
            flex-direction: column;
        `}

        .image-container{
            width: 100%;
            height: ${rm(250)};
            position: relative;

            img{
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }

    ${media.md`
        padding: ${rm(100)} 0 ${rm(50)} 0;
    `}

    ${media.xsm`
        padding: ${rm(80)} 0 ${rm(15)} 0;
    `}

    .left{
        width: 42%;
        background-color: ${colors.blue};
        padding: ${rm(40)};
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        ${media.md`
            width: 100%;
            height: 50%;
            border-bottom-left-radius: ${rm(10)};
            border-bottom-right-radius: ${rm(10)};
            overflow: hidden;
        `}

        ${media.xsm`
            padding: ${rm(24)} ${rm(20)};
            height: 65%;
        `}

        .button{
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .right{
        width: 58%;
        position: relative;
        height: 100%;
        overflow: hidden;

        ${media.md`
            width: 100%;
            height: 50%;
            border-top-left-radius: ${rm(10)};
            border-top-right-radius: ${rm(10)};
        `}

        ${media.xsm`
            height: 35%;
        `}

        img{
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
`

const StyledMidContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${rm(20)};

    ${media.xsm`
        gap: ${rm(10)};
    `}

    .title-container, .description-container {
        position: relative;
        overflow: hidden;
    }

    .title-container {
        height: ${rm(52)}; // Approximate height for title text
        ${media.lg`
            height: ${rm(44)};
        `}

        ${media.xsm`
            height: ${rm(21)};
        `}
    }

    .description-container {
        min-height: ${rm(100)}; // Minimum height for description, can grow
        height: fit-content;
    }

    .title{
        ${fontSageGrotesk(400)};
        line-height: 90%;
        letter-spacing: -0.02em;
        color: ${colors.white100};
        font-size: ${rm(48)};
        text-transform: uppercase;
        text-align: center;
        margin: 0;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;

        ${media.lg`
            font-size: ${rm(40)};    
        `}

        ${media.xsm`
            font-size: ${rm(26)};
        `}
    }

    .description{
        ${fontGolosText(400)};
        line-height: 130%;
        color: ${colors.blue90};
        font-size: ${rm(20)};
        text-align: center;
        margin: 0;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;

        ${media.lg`
            font-size: ${rm(16)};    
        `}

        ${media.xsm`
            font-size: ${rm(14)};
        `}
    }
`

const StyledTopBar = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;

    ${media.xsm`
        justify-content: center;
    `}

    .title{
        font-size: ${rm(20)};
        line-height: 110%;
        ${fontGolosText(400)};
        color: ${colors.white100};
        text-transform: uppercase;

        ${media.lg`
            font-size: ${rm(16)};    
        `}

        ${media.xsm`
            display: none;
        `}
    }

    .sizes{
        display: flex;
        align-items: center;
        gap: ${rm(20)};

        .square{
            width: ${rm(4)};
            height: ${rm(4)};
            background-color: ${colors.white100};
        }
    }
`

const StyledSizeContainer = styled.div<{ isActive: boolean }>`
    position: relative;

    .text{
        font-size: ${rm(20)};
        color: ${({ isActive }) => isActive ? colors.white100 : colors.blue90};
        ${fontGolosText(400)};
        text-transform: uppercase;
        line-height: 110%;
        
        transition: color 0.4s ease-in-out;

        ${media.lg`
            font-size: ${rm(16)};    
        `}
    }

    .underline{
        width: 0%;
        position: absolute;
        bottom: ${rm(-4)};
        background-color: ${colors.white100};
        height: ${rm(1)};
    }
`


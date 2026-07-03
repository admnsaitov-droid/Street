import { colors, media, rm } from "@/styles";
import { fontGolosText, fontSageGrotesk } from "@/styles/fonts";
import { heightLvh } from "@/styles/utils";
import styled from "styled-components"
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SpringTrigger } from "@/components/Springs/SpringTrigger";
import { transformRange, lerp } from "@/utils/math";
import { WhiteButton } from "@/components/Ui/buttons/WhiteButton";
import Image from "next/image";
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath";
import { useTransition, useSpring, animated } from "@react-spring/web";
import { MediaComponent } from "@/components/MediaComponent/MediaComponent";
import { useWindowWidth } from "@react-hook/window-size";

interface PackagesProps {
    packagesData: any
}

const transitionConfig = { tension: 300, friction: 30 }

const AnimatedAutoHeight = ({ children, deps = [] }: { children: ReactNode; deps?: unknown[] }) => {
    const contentRef = useRef<HTMLDivElement>(null)
    const isFirstRender = useRef(true)
    const [{ height }, api] = useSpring(() => ({ height: 0 }))

    useEffect(() => {
        const el = contentRef.current
        if (!el) return

        const updateHeight = () => {
            const nextHeight = el.offsetHeight
            api.start({
                height: nextHeight,
                immediate: isFirstRender.current,
            })
            isFirstRender.current = false
        }

        updateHeight()
        const resizeObserver = new ResizeObserver(updateHeight)
        resizeObserver.observe(el)

        return () => resizeObserver.disconnect()
    }, [api, ...deps])

    return (
        <animated.div style={{ height, overflow: 'hidden' }}>
            <div ref={contentRef}>{children}</div>
        </animated.div>
    )
}

export const Packages = ({ packagesData }: PackagesProps) => {
    const [sizes, setSizes] = useState<string[]>([]);
    const [activeSize, setActiveSize] = useState<string>('');
    const [activePackage, setActivePackage] = useState<any>(null);
    const hasMountedRef = useRef<boolean>(false);
    const activeSizeRef = useRef<string>('');
    const progressRef = useRef<number>(0);
    const prevBarProgressFirst = useRef<number>(0);
    const prevBarProgressSecond = useRef<number>(0);
    const prevBarProgressThird = useRef<number>(0);

    const width = useWindowWidth()

    const firstImageRef = useRef<HTMLDivElement>(null);
    const secondImageRef = useRef<HTMLDivElement>(null);
    const thirdImageRef = useRef<HTMLDivElement>(null);

    // Create transitions for title and description
    const titleTransitions = useTransition(activePackage?.title, {
        from: { opacity: 0, transform: 'translateY(30px)' },
        enter: { opacity: 1, transform: 'translateY(0px)' },
        leave: { opacity: 0, transform: 'translateY(-30px)' },
        config: transitionConfig
    });

    const descriptionTransitions = useTransition(activePackage?.description, {
        from: { opacity: 0, transform: 'translateY(30px)' },
        enter: { opacity: 1, transform: 'translateY(0px)' },
        leave: { opacity: 0, transform: 'translateY(-30px)' },
        config: transitionConfig
    });



    useEffect(() => {
        const packages = packagesData?.packages;
        if(packages){
            const sizes = packages.map((pkg: any) => pkg.size);
            setSizes(sizes);
            setActiveSize(sizes[0]);
            activeSizeRef.current = sizes[0];
            setActivePackage(packages[0]);
        }
    }, [packagesData])

    return (
        <StyledPackages>
            <StyledTriggerContainer 
                onChange={(state) => {
                    // const transformedProgress = transformRange(state?.progress, 0.1, 0.9, 0, 100);
                    const transformedProgress = transformRange(state?.progress, 0, 1, 0, 100);
                    progressRef.current = transformedProgress;

                    const barProgressFirst = transformRange(transformedProgress, 0, 33, 0, 100);
                    const barProgressSecond = transformRange(transformedProgress, 33, 66, 0, 100);
                    const barProgressThird = transformRange(transformedProgress, 66, 100, 0, 100);

                    // Apply smooth transitions using lerp
                    const lerpFactor = 0.1; // Adjust this value for smoother/faster transitions
                    
                    // If barProgressSecond > 0, smoothly transition barProgressFirst to 0
                    const targetFirst = barProgressSecond > 0 ? 0 : barProgressFirst;
                    const smoothFirst = lerp(prevBarProgressFirst.current, targetFirst, lerpFactor);
                    prevBarProgressFirst.current = smoothFirst;

                    // If barProgressThird > 0, smoothly transition barProgressSecond to 0
                    const targetSecond = barProgressThird > 0 ? 0 : barProgressSecond;
                    const smoothSecond = lerp(prevBarProgressSecond.current, targetSecond, lerpFactor);
                    prevBarProgressSecond.current = smoothSecond;

                    // Smooth transition for barProgressThird
                    const smoothThird = lerp(prevBarProgressThird.current, barProgressThird, lerpFactor);
                    prevBarProgressThird.current = smoothThird;

                    const underlineFirst = document.getElementById('underline-0');
                    const underlineSecond = document.getElementById('underline-1');
                    const underlineThird = document.getElementById('underline-2');

                    if(underlineFirst && underlineSecond && underlineThird) {
                        underlineFirst.style.width = `${smoothFirst}%`;
                        underlineSecond.style.width = `${smoothSecond}%`;
                        underlineThird.style.width = `${smoothThird}%`;
                    }

                    if(transformedProgress > 66) {
                        if(activeSizeRef.current !== sizes[2]) {
                            setActiveSize(sizes[2]);
                            setActivePackage(packagesData?.packages[2]);
                            activeSizeRef.current = sizes[2];
                        }
                    } else if(transformedProgress > 33) {
                        if(activeSizeRef.current !== sizes[1]) {
                            setActiveSize(sizes[1]);
                            setActivePackage(packagesData?.packages[1]);
                            activeSizeRef.current = sizes[1];
                        }
                    } else {
                        if(activeSizeRef.current !== sizes[0]) {
                            setActiveSize(sizes[0]);
                            setActivePackage(packagesData?.packages[0]);
                            activeSizeRef.current = sizes[0];
                        }
                    }

                    // Create natural scroll effect - each image represents a "page" in a continuous scroll
                    // As we scroll, we move through the images like scrolling through pages
                    const scrollOffset = transformRange(transformedProgress, 0, 100, 0, 200); // 200% total scroll range for 3 images
                    
                    // Each image is positioned 100% apart (like pages stacked vertically)
                    const firstImageTransform = scrollOffset; // First image starts at 0, moves to -100%
                    const secondImageTransform = scrollOffset - 100; // Second image starts at 100%, moves to 0, then -100%
                    const thirdImageTransform = scrollOffset - 200; // Third image starts at 200%, moves to 100%, then 0%

                    //images - apply the natural scroll transforms
                    if(firstImageRef.current && secondImageRef.current && thirdImageRef.current) {
                        firstImageRef.current.style.transform = `translateY(${-firstImageTransform}%)`;
                        secondImageRef.current.style.transform = `translateY(${-secondImageTransform}%)`;
                        thirdImageRef.current.style.transform = `translateY(${-thirdImageTransform}%)`;
                    }
                }}
                start='top top'
                end='bottom bottom'
            />
            <StyledStickyContainer>
                <StyledContentLayout>
                    <div className="wrapper">
                        <div className="left">
                            <StyledTopBar>
                                <h2 className="title">
                                    {packagesData?.title}
                                </h2>
                                <div className="sizes">
                                    {sizes.map((size: string, index: number) => (
                                        <>
                                            <StyledSizeContainer key={index} isActive={size === activeSize}>
                                                <p className="text">{size}</p>
                                                <div className="underline" id={`underline-${index}`}/>
                                            </StyledSizeContainer>
                                            {
                                                index !== sizes.length - 1 && (
                                                    <div className="square"/>
                                                )
                                            }
                                        </>
                                    ))}
                                </div>
                            </StyledTopBar>
                            <StyledMidContent>
                                <AnimatedAutoHeight deps={[activePackage?.title, width]}>
                                    <div className="title-container">
                                        {titleTransitions((style, item) => 
                                            item && (
                                                <animated.h3 className="title" style={style}>
                                                    {item}
                                                </animated.h3>
                                            )
                                        )}
                                    </div>
                                </AnimatedAutoHeight>
                                <AnimatedAutoHeight deps={[activePackage?.description, width]}>
                                    <div className="description-container">
                                        {descriptionTransitions((style, item) => 
                                            item && (
                                                <animated.p className="description" style={style}>
                                                    {item}
                                                </animated.p>
                                            )
                                        )}
                                    </div>
                                </AnimatedAutoHeight>
                            </StyledMidContent>
                            <WhiteButton className="button" link={activePackage?.button?.link} isSvg={true}>
                                {activePackage?.button?.text}
                            </WhiteButton>
                        </div>
                        <div className="right">
                            {/* First package image */}
                            {packagesData?.packages?.[0]?.media && (
                                <div style={{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}} ref={firstImageRef}>
                                    <MediaComponent media={packagesData.packages[0].media} className="image" parallax={width > 576} isExtendable={false} />
                                </div>
                            )}
                            {/* Second package image */}
                            {packagesData?.packages?.[1]?.media && (
                                <div style={{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}} ref={secondImageRef}>
                                    <MediaComponent media={packagesData.packages[1].media} className="image" parallax={width > 576} isExtendable={false} />
                                </div>
                            )}
                            {/* Third package image */}
                            {packagesData?.packages?.[2]?.media && (
                                <div style={{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}} ref={thirdImageRef}>
                                    <MediaComponent media={packagesData.packages[2].media} className="image" parallax={width > 576} isExtendable={false} />
                                </div>
                            )}
                        </div>
                    </div>
                </StyledContentLayout>
            </StyledStickyContainer>
        </StyledPackages>
    )
}

const StyledPackages = styled.div`
    width: 100%;
    ${heightLvh(400)};
    padding: 0 ${rm(50)};
    position: relative;

    ${media.md`
        padding: 0 ${rm(25)};
    `}

    ${media.xsm`
        padding: 0 ${rm(16)};
    `}
`

const StyledTriggerContainer = styled(SpringTrigger)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`

const StyledStickyContainer = styled.div`
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    ${heightLvh(100)};
    display: flex;
    align-items: center;
    justify-content: center;
`

const StyledContentLayout = styled.div`
    // height: auto;
    height: 100%;
    width: 100%;
    position: relative;
    display: flex;
    padding: ${rm(100)} 0 ${rm(50)} 0;

    .wrapper{
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        border-radius: ${rm(10)};
        overflow: hidden;

        ${media.md`
            flex-direction: column;
            flex-direction: column-reverse;
        `}
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
        display: grid;
        height: auto;
    }

    .title-container > *,
    .description-container > * {
        grid-area: 1 / 1;
        align-self: start;
        width: 100%;
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


import AnimatedLink from "@/components/animated/AnimatedLink/AnimatedLink"
import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import styled from "styled-components"
import { useEffect, useState, useRef } from "react"
import { animated, useSpring } from "@react-spring/web"
import { useLocale } from "next-intl"
import { getStrapiData } from "@/utils/strapi"
import UnderlineLink from "@/components/animated/UnderlineLink/UnderlineLink"
import Image from "next/image"
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath"
import useLoadingStore from "@/store/store"

export const PackageMenu = () => {  
    const [isHovered, setIsHovered] = useState(false)
    const [packagesData, setPackagesData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [contentHeight, setContentHeight] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);
    const locale = useLocale();
    const [currentPackage, setCurrentPackage] = useState<any>(null);
    const setIsMegaMenuOpen = useLoadingStore((state: any) => state.setIsMegaMenuOpen);

    useEffect(() => {
        const fetchPackagesData = async () => {
            try {
                const data = await getStrapiData('get-packages-data', locale);
                setPackagesData(data?.package);
                setCurrentPackage(data?.package?.[0]);
            } catch (err) {
                console.error('Error fetching packages data:', err);
                setError('Failed to load header');
            } finally {
                setLoading(false);
            }
        };

        fetchPackagesData();
    }, [locale]);

    // Measure content height when packages data changes
    useEffect(() => {
        if (packagesData && contentRef.current) {
            // Temporarily make the content visible to measure it
            const element = contentRef.current;
            const originalStyles = {
                height: element.style.height,
                overflow: element.style.overflow,
                visibility: element.style.visibility,
                position: element.style.position,
                top: element.style.top,
                left: element.style.left,
                zIndex: element.style.zIndex,
            };
            
            // Make it visible for measurement
            element.style.height = 'auto';
            element.style.overflow = 'visible';
            element.style.visibility = 'hidden';
            element.style.position = 'absolute';
            element.style.top = '0';
            element.style.left = '0';
            element.style.zIndex = '-1';
            
            // Measure the height
            const height = element.offsetHeight;
            setContentHeight(height);
            
            // Restore original styles
            Object.assign(element.style, originalStyles);
        }
    }, [packagesData]);

    // Handle resize to recalculate height
    useEffect(() => {
        const handleResize = () => {
            if (contentRef.current && packagesData) {
                const element = contentRef.current;
                const originalStyles = {
                    height: element.style.height,
                    overflow: element.style.overflow,
                    visibility: element.style.visibility,
                    position: element.style.position,
                    top: element.style.top,
                    left: element.style.left,
                    zIndex: element.style.zIndex,
                };
                
                element.style.height = 'auto';
                element.style.overflow = 'visible';
                element.style.visibility = 'hidden';
                element.style.position = 'absolute';
                element.style.top = '0';
                element.style.left = '0';
                element.style.zIndex = '-1';
                
                const height = element.offsetHeight;
                setContentHeight(height);
                
                Object.assign(element.style, originalStyles);
            }
        };

        const resizeObserver = new ResizeObserver(handleResize);
        if (contentRef.current) {
            resizeObserver.observe(contentRef.current);
        }
        
        return () => {
            resizeObserver.disconnect();
        };
    }, [packagesData]);

    const menuAnimation = useSpring({
        height: isHovered ? contentHeight : 0,
        config: { tension: 300, friction: 30 }
    })

    return (
        <StyledPackageMenu>
            <StyledVisibleContainer>
                <span
                    onMouseEnter={() => {
                        setIsHovered(true);
                        setIsMegaMenuOpen(true);
                    }}
                    onMouseLeave={() => {
                        setIsHovered(false);
                        setIsMegaMenuOpen(false);
                    }}
                >
                    Packages
                </span>
            </StyledVisibleContainer>
            
            <StyledMenu style={{pointerEvents: isHovered ? 'auto' : 'none', userSelect: isHovered ? 'auto' : 'none'}}
                onMouseEnter={() => {
                    setIsHovered(true);
                    setIsMegaMenuOpen(true);
                }}
                onMouseLeave={() => {
                    setIsHovered(false);
                    setIsMegaMenuOpen(false);
                }}
            >
                <StyledMenuContainer style={menuAnimation}>
                    <StyledLayout ref={contentRef}>
                        <StyledLeft>
                            <StyledPackages>
                                {packagesData?.map((item: any, index: number) => (
                                    <StyledPackage key={index} onMouseEnter={() => setCurrentPackage(item)}>
                                        0{index + 1}.<span>{item?.title} layout</span>
                                    </StyledPackage>
                                ))}
                            </StyledPackages>
                            <AllButton text="All packages" href="/packages" lineColor={colors.red} />
                        </StyledLeft>
                        <StyledRight>
                            <Image src={getMediaStrapiPath(currentPackage?.mainMediaLeft?.poster)} alt="Package" width={760} height={420} />
                        </StyledRight>
                    </StyledLayout>
                </StyledMenuContainer>
            </StyledMenu>
        </StyledPackageMenu>
    )
}

const StyledPackageMenu = styled.div`
    position: relative;
`


const StyledVisibleContainer = styled(AnimatedLink)`
    font-size: ${rm(16)};
    color: ${colors.black100};
    ${fontGolosText(400)};
    margin-bottom: ${rm(-2)};

    ${media.lg`
        font-size: ${rm(14)};
    `}
`

const StyledMenu = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    top: calc(100% - ${rm(20)});
    padding-top: ${rm(30)};
`

const StyledMenuContainer = styled(animated.div)`
    background: ${colors.white100};
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: ${rm(10)};
    overflow: hidden;
`

const StyledLayout = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: ${rm(40)};
`


const StyledLeft = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
`

const StyledPackages = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${rm(20)};
`

const StyledPackage = styled.div`
    font-size: ${rm(16)};
    ${fontGolosText(400)};
    color: ${colors.gray700};
    text-transform: uppercase;
    line-height: 110%;
    cursor: pointer;

    transition: color 0.3s ease;

    &:hover{
        color: ${colors.blue};

        span{
            color: ${colors.blue};
        }
    }

    span{
        font-size: ${rm(18)};
        line-height: 100%;
        letter-spacing: -0.01em;
        ${fontGolosText(500)};
        margin-left: ${rm(5)};
        color: ${colors.gray700};

        transition: color 0.3s ease;
    }
`


const AllButton = styled(UnderlineLink)`
    color: ${colors.red} !important;
    ${fontGolosText(500)};
    font-size: ${rm(18)};
    text-transform: uppercase;
    line-height: 100%;
    letter-spacing: -0.01em;
    cursor: pointer;
`

const StyledRight = styled.div`
    position: relative;
    width: ${rm(760)};
    height: ${rm(420)};

    img{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`
import AnimatedLink from "@/components/animated/AnimatedLink/AnimatedLink"
import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import styled from "styled-components"
import { useEffect, useState, useRef } from "react"
import { animated, easings, useSpring } from "@react-spring/web"
import { useLocale } from "next-intl"
import { getStrapiData } from "@/utils/strapi"
import UnderlineLink from "@/components/animated/UnderlineLink/UnderlineLink"
import Image from "next/image"
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath"
import useLoadingStore from "@/store/store"
import { AnimLink } from "@/layouts/AnimatedRouterLayout/AnimatedRouterLayout"

export const ProductsMenu = ({ previewText, allText }: { previewText: string, allText: string }) => {
    const [isHovered, setIsHovered] = useState(false)
    const [linesData, setLinesData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [contentHeight, setContentHeight] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);
    const locale = useLocale();
    const [currentPackage, setCurrentPackage] = useState<any>(null);
    const setIsMegaMenuOpen = useLoadingStore((state: any) => state.setIsMegaMenuOpen);
    const wasClickedRef = useRef(false);

    const openMenu = () => {
        if (wasClickedRef.current) return;
        setIsHovered(true);
        setIsMegaMenuOpen(true);
    };

    const closeMenu = () => {
        wasClickedRef.current = false;
        setIsHovered(false);
        setIsMegaMenuOpen(false);
    };

    const handleLinkClick = () => {
        wasClickedRef.current = true;
        setIsHovered(false);
        setIsMegaMenuOpen(false);
    };

    useEffect(() => {
        const fetchPackagesData = async () => {
            try {
                const data = await getStrapiData('get-lines', locale);
                setLinesData(data?.linesPageData?.lines);
                setCurrentPackage(data?.linesPageData?.lines[0]);
                console.log('ProductsMenuData', data)
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
        if (linesData && contentRef.current) {
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
    }, [linesData]);

    // Handle resize to recalculate height
    useEffect(() => {
        const handleResize = () => {
            if (contentRef.current && linesData) {
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
    }, [linesData]);

    const menuAnimation = useSpring({
        height: isHovered ? contentHeight : 0,
        config: {
            duration: 300,
            easing: easings.easeOutCubic,
        }
    })


    return (
        <StyledProductsMenu>
            <StyledVisibleContainer>
                <AnimLink
                    href="/lines"
                    onMouseEnter={openMenu}
                    onMouseLeave={closeMenu}
                    onClick={handleLinkClick}
                >
                    {previewText}
                </AnimLink>
            </StyledVisibleContainer>

            <StyledMenu style={{pointerEvents: isHovered ? 'auto' : 'none', userSelect: isHovered ? 'auto' : 'none'}}
                onMouseEnter={openMenu}
                onMouseLeave={closeMenu}
            >
                <StyledMenuContainer
                    style={menuAnimation}
                    data-lenis-prevent
                    data-lenis-prevent-wheel
                    data-lenis-prevent-touch
                >
                    <StyledLayout ref={contentRef}>
                        <StyledLeft>
                            <StyledPackages>
                                {linesData?.map((item: any, index: number) => (
                                    <StyledPackage
                                        key={index}
                                        href={`/lines/${item?.linii?.slug}`}
                                        onMouseEnter={() => setCurrentPackage(item)}
                                        $isActive={currentPackage?.id === item?.id}
                                        onClick={handleLinkClick}
                                    >
                                        0{index + 1}.<span>{item?.linii?.name} ({item?.linii?.products?.length || 0})</span>
                                    </StyledPackage>
                                ))}
                            </StyledPackages>
                            <AllButton text={allText} href="/lines" lineColor={colors.red} onClick={handleLinkClick} />
                        </StyledLeft>
                        <StyledRight>
                            <StyledProduct href={`/products/${currentPackage?.linii?.products?.[0]?.slug}`} onClick={handleLinkClick}>
                                <div className="imageContainer">
                                    <Image src={getMediaStrapiPath(currentPackage?.linii?.products[0]?.previewImage)} alt="Package" fill />
                                </div>
                            </StyledProduct>
                            <StyledProduct href={`/products/${currentPackage?.linii?.products?.[1]?.slug}`} onClick={handleLinkClick}>
                                <div className="imageContainer">
                                    <Image src={getMediaStrapiPath(currentPackage?.linii?.products[1]?.previewImage)} alt="Package" fill />
                                </div>
                            </StyledProduct>
                        </StyledRight>
                    </StyledLayout>
                </StyledMenuContainer>
            </StyledMenu>
        </StyledProductsMenu>
    )
}

const StyledProductsMenu = styled.div`
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

    ${media.md`
        /* On tablets/phones let the menu be part of the page flow so the whole page can scroll */
        position: static;
        top: auto;
        left: auto;
        height: auto;
        padding-top: ${rm(10)};
    `}
`

const StyledMenuContainer = styled(animated.div)`
    background: ${colors.white100};
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: ${rm(10)};
    /* Allow vertical scrolling inside the menu (especially on mobile) */
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-y;
    overscroll-behavior-y: contain;

    ${media.md`
        /* When menu is in normal flow, size by content but cap to viewport */
        height: auto;
        max-height: 100vh;
    `}
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

const StyledPackage = styled(AnimLink)<{ $isActive?: boolean }>`
    font-size: ${rm(16)};
    ${fontGolosText(400)};
    color: ${props => props.$isActive ? colors.blue : colors.gray700} !important;
    text-transform: uppercase;
    line-height: 110%;
    cursor: pointer;

    transition: color 0.3s ease;

    &:hover{
        color: ${colors.blue} !important;

        span{
            color: ${colors.blue} !important;
        }
    }

    span{
        font-size: ${rm(18)};
        line-height: 100%;
        letter-spacing: -0.01em;
        ${fontGolosText(500)};
        margin-left: ${rm(5)};
        color: ${props => props.$isActive ? colors.blue : colors.gray700} !important;

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
    width: ${rm(810)};
    height: ${rm(470)};
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${rm(10)};
`

const StyledProduct = styled(AnimLink)`
    display: flex;
    flex-direction: column;
    width: 50%;
    height: 100%;

    &:hover{
        img{
            transform: scale(1.01);
        }
    }

    .name{
        font-size: ${rm(18)};
        ${fontGolosText(500)};
        line-height: 100%;
        letter-spacing: -0.01em;
        color: ${colors.black100};
        text-transform: uppercase;
        margin-bottom: ${rm(6)};
    }
        
    .model{
        font-size: ${rm(14)};
        ${fontGolosText(400)};
        line-height: 130%;
        color: ${colors.gray90};
        text-transform: uppercase;
    }

    .imageContainer{
        width: 100%;
        // height: ${rm(407)};
        height: 100%;
        position: relative;
        overflow: hidden;
        border-radius: ${rm(10)};
        background-color: #EAECF2;
    }

    img{
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: ${rm(10)};
        margin-bottom: ${rm(10)};
        transition: transform 0.3s ease;
    }
`
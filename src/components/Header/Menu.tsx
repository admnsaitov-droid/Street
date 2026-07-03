import { useScroll } from "@/layouts/ScrollLayout/useScroll";
import { colors, media, rm } from "@/styles"
import styled, { keyframes } from "styled-components"
import useLoadingStore from "@/store/store"
import { useEffect, useState, useRef } from "react"
import { fontGolosText } from "@/styles/fonts";
import { AnimLink } from "@/layouts/AnimatedRouterLayout/AnimatedRouterLayout";
import { LanguageSelect } from "@/components/Header/LanguageSelect/LanguageSelect";
import { SimpleButton } from "@/components/Ui/buttons/SimpleButton";
import { animated, easings, useSpring } from "@react-spring/web";
import { PackageMenuMobile } from "./MegaMenus/PackageMenuMobile";
import { ProductsMenuMobile } from "./MegaMenus/ProductsMenuMobile";

interface MenuProps {
    data: any;
}

export const Menu = ({ data }: MenuProps) => {

    const stopScroll = useScroll((state) => state.stop);
    const startScroll = useScroll((state) => state.start);

    const [openMenu, setOpenMenu] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);

    const [isPackageMenuOpen, setIsPackageMenuOpen] = useState(false);
    const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
    const setIsMegaMenuOpen = useLoadingStore((state: any) => state.setIsMegaMenuOpen);
    const isMegaMenuOpen = useLoadingStore((state: any) => state.isMegaMenuOpen);

    useEffect(() => {
        if (!isMegaMenuOpen) {
            setOpenMenu(false);
            setIsPackageMenuOpen(false);
            setIsProductsMenuOpen(false);
        }
    }, [isMegaMenuOpen]);

    useEffect(() => {
        if (openMenu) {
            stopScroll();
        } else {
            startScroll();
        }
    }, [openMenu]);

    // Measure content height when menu opens
    useEffect(() => {
        if (openMenu && contentRef.current) {
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
    }, [openMenu]);

    // Handle resize to recalculate height
    useEffect(() => {
        const handleResize = () => {
            if (contentRef.current && openMenu) {
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
    }, [openMenu]);

    const menuAnimation = useSpring({
        height: openMenu ? contentHeight : 0,
        config: {
            duration: 300,
            easing: easings.easeOutCubic,
        }
    });

    return (
        <StyledMenu >
            <div className="button" onClick={() => {
                setOpenMenu(!openMenu);
                setIsMegaMenuOpen(!isMegaMenuOpen);
            }}>
                <AnimatedMenuIcon $isOpen={openMenu}>
                    <span className="line line1"></span>
                    <span className="line line2"></span>
                    <span className="line line3"></span>
                </AnimatedMenuIcon>
            </div>
            <StyledMenuContainer style={{pointerEvents: openMenu ? 'auto' : 'none', userSelect: openMenu ? 'auto' : 'none'}}>
                <StyledMenuWrapper style={menuAnimation}>
                    <PackageMenuMobile isOpen={isPackageMenuOpen} setIsOpen={setIsPackageMenuOpen} setMenuOpen={setOpenMenu} />
                    <ProductsMenuMobile isOpen={isProductsMenuOpen} setIsOpen={setIsProductsMenuOpen} setMenuOpen={setOpenMenu} />
                    <StyledMenuContent ref={contentRef}>
                        <StyledMenuItems>
                            <span className="item" onClick={() => setIsPackageMenuOpen(true)}>
                                Packages
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 6L15 12L9 18" stroke="black" stroke-width="2"/>
                                </svg>
                            </span>
                            <span className="item" onClick={() => setIsProductsMenuOpen(true)}>
                                Products
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 6L15 12L9 18" stroke="black" stroke-width="2"/>
                                </svg>
                            </span>
                            {data?.links?.links?.map((item: any, index: number) => (
                                <AnimLink href={item?.link ? item?.link : '#'} onClick={() => {
                                    setOpenMenu(false);
                                    setIsMegaMenuOpen(false);
                                }} className="item" key={index}>
                                    {item.text}
                                </AnimLink>
                            ))}
                        </StyledMenuItems>
                        <StyledBottomContainer>
                            <LanguageSelect languages={data?.locales} />
                            {data?.contactButton?.link && (
                                <SimpleButton link={data?.contactButton?.link} onClick={() => {
                                    setOpenMenu(false);
                                    setIsMegaMenuOpen(false);
                                }}>
                                    {data?.contactButton?.text}
                                </SimpleButton>
                            )}
                        </StyledBottomContainer>
                    </StyledMenuContent>
                </StyledMenuWrapper>
            </StyledMenuContainer>
        </StyledMenu>
    )
}

const StyledMenu = styled.div`
    display: none;

    ${media.md`
        display: block;
        position: relative;
        z-index: 100000;
    `}

    .button{
        padding: ${rm(11)};
        background-color: ${colors.blue};
        border-radius: ${rm(5)};

        svg{
            width: ${rm(24)};
            height: ${rm(24)};
            transform: translateY(10%);
        }
    }
`   

const StyledMenuContainer = styled.div`
    position: fixed;
    top: ${rm(60)};
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    width: 100%;
`

const StyledMenuWrapper = styled(animated.div)`
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: ${rm(10)};
    background-color: ${colors.white100};
    overflow: hidden;
`

const StyledMenuContent = styled.div`
    padding: ${rm(50)};
    width: 100%;
    height: 100%;

    ${media.xsm`
        padding: ${rm(32)} ${rm(16)};
    `}
`

const StyledMenuItems = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${rm(30)};


    .item{
        font-size: ${rm(32)};
        ${fontGolosText(400)};
        line-height: 100%;
        color: ${colors.black100};
        cursor: pointer;
        letter-spacing: -0.01em;
        display: flex;
        align-items: center;
        gap: ${rm(6)};

        ${media.xsm`
            font-size: ${rm(24)};
        `}

        svg{
            width: ${rm(24)};
            height: ${rm(24)};
        }
    }
`

const AnimatedMenuIcon = styled.div<{ $isOpen: boolean }>`
    width: ${rm(24)};
    height: ${rm(24)};
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    .line {
        width: 100%;
        height: 2px;
        background-color: white;
        border-radius: 1px;
        position: absolute;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        transform-origin: center;
    }

    .line1 {
        top: ${props => props.$isOpen ? '50%' : '25%'};
        transform: ${props => props.$isOpen ? 'translateY(-50%) rotate(45deg)' : 'translateY(-50%) rotate(0deg)'};
    }

    .line2 {
        top: 50%;
        transform: translateY(-50%);
        opacity: ${props => props.$isOpen ? '0' : '1'};
        width: ${props => props.$isOpen ? '0%' : '100%'};
    }

    .line3 {
        top: ${props => props.$isOpen ? '50%' : '75%'};
        transform: ${props => props.$isOpen ? 'translateY(-50%) rotate(-45deg)' : 'translateY(-50%) rotate(0deg)'};
    }
`

const StyledBottomContainer = styled.div`
    display: flex;
    margin-top: ${rm(140)};
    padding-top: ${rm(30)};
    position: relative;
    display: flex;
    width: 100%;
    justify-content: space-between;

    ${media.xsm`
        margin-top: ${rm(50)};
    `}

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background-image: repeating-linear-gradient(
            to right,
            #B7BCCA 0,
            #B7BCCA 1px,
            transparent 1px,
            transparent 5px
        );
        background-size: auto;
        background-repeat: repeat-x;
    }
`
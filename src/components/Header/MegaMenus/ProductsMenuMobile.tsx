'use client';

import { fontGolosText } from "@/styles/fonts";
import { colors, media, rm } from "@/styles";
import { getStrapiData } from "@/utils/strapi";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { AnimLink } from "@/layouts/AnimatedRouterLayout/AnimatedRouterLayout";
import { animated, useSpring } from "@react-spring/web";
import useLoadingStore from "@/store/store";

interface ProductsMenuMobileProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    setMenuOpen: (menuOpen: boolean) => void;
}

export const ProductsMenuMobile = ({ isOpen, setIsOpen, setMenuOpen }: ProductsMenuMobileProps) => {

    const locale = useLocale();
    const [productsData, setProductsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const setIsMegaMenuOpen = useLoadingStore((state: any) => state.setIsMegaMenuOpen);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchProductsData = async () => {
            try {
                const data = await getStrapiData('get-lines', locale);
                setProductsData(data?.linesPageData?.lines);
            } catch (err) {
                console.error('Error fetching products data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProductsData();
    }, [locale]);

    // Scroll panel to top each time it opens
    useEffect(() => {
        if (isOpen && panelRef.current) {
            panelRef.current.scrollTop = 0;
        }
    }, [isOpen]);

    // Prevent touch events from bubbling to Lenis / parent overflow:hidden wrapper
    useEffect(() => {
        const el = panelRef.current;
        if (!el) return;

        const onTouchMove = (e: TouchEvent) => {
            e.stopPropagation();
        };

        el.addEventListener('touchmove', onTouchMove, { passive: true });
        return () => el.removeEventListener('touchmove', onTouchMove);
    }, []);

    const menuAnimation = useSpring({
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateX(0%)' : 'translateX(100%)',
        config: { tension: 300, friction: 30 }
    });

    return (
        <StyledOverlay style={{ pointerEvents: isOpen ? 'auto' : 'none' }}>
            <StyledPanel
                ref={panelRef}
                style={menuAnimation}
            >
                <StyledStickyHeader>
                    <StyledBackButton onClick={() => setIsOpen(false)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 6L9 12L15 18" stroke="black" strokeWidth="2"/>
                        </svg>
                        <span>Back</span>
                    </StyledBackButton>
                </StyledStickyHeader>
                <StyledPackages>
                    {productsData?.map((item: any, index: number) => (
                        <StyledPackage
                            key={index}
                            href={`/lines/${item?.linii?.slug}`}
                            onClick={() => {
                                setIsOpen(false);
                                setMenuOpen(false);
                                setIsMegaMenuOpen(false);
                            }}
                        >
                            0{index + 1}. <span>{item?.linii?.name}</span>
                        </StyledPackage>
                    ))}
                </StyledPackages>
            </StyledPanel>
        </StyledOverlay>
    );
};

/* Fills the whole menu wrapper area */
const StyledOverlay = styled.div`
    position: absolute;
    inset: 0;
    z-index: 10;
`;

/* Slide-in panel that IS the scroll container */
const StyledPanel = styled(animated.div)`
    position: absolute;
    inset: 0;
    background-color: ${colors.white100};
    border-radius: ${rm(10)};

    /* This element itself scrolls — no nested scroll container */
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;

    padding: ${rm(50)};
    padding-top: 0; /* header handles top padding */

    ${media.xsm`
        padding: 0 ${rm(16)} ${rm(32)};
    `}
`;

/* Sticky back button stays at top while list scrolls */
const StyledStickyHeader = styled.div`
    position: sticky;
    top: 0;
    z-index: 2;
    background-color: ${colors.white100};
    padding-top: ${rm(50)};
    padding-bottom: ${rm(20)};
    margin-bottom: ${rm(20)};

    ${media.xsm`
        padding-top: ${rm(32)};
    `}
`;

const StyledPackages = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${rm(20)};
`;

const StyledPackage = styled(AnimLink)`
    font-size: ${rm(16)};
    ${fontGolosText(400)};
    color: ${colors.black100} !important;
    text-transform: uppercase;
    line-height: 110%;
    cursor: pointer;

    span {
        font-size: ${rm(18)};
        line-height: 100%;
        letter-spacing: -0.01em;
        ${fontGolosText(500)};
        color: ${colors.black100} !important;
        margin-left: ${rm(5)};
    }
`;

const StyledBackButton = styled.div`
    display: flex;
    align-items: center;
    margin-left: ${rm(-7)};
    cursor: pointer;

    svg {
        width: ${rm(24)};
        height: ${rm(24)};
    }

    span {
        font-size: ${rm(16)};
        text-transform: uppercase;
        ${fontGolosText(600)};
        color: ${colors.black100};
    }
`;

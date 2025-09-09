'use client';

import { fontGolosText } from "@/styles/fonts";
import { colors, media, rm } from "@/styles";
import { getStrapiData } from "@/utils/strapi";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { AnimLink } from "@/layouts/AnimatedRouterLayout/AnimatedRouterLayout";
import { animated, useSpring } from "@react-spring/web";
import useLoadingStore from "@/store/store";

interface PackageMenuMobileProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    setMenuOpen: (menuOpen: boolean) => void;
}

export const PackageMenuMobile = ({ isOpen, setIsOpen, setMenuOpen }: PackageMenuMobileProps) => {

    const locale = useLocale();
    const [packagesData, setPackagesData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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

    const menuAnimation = useSpring({
        height: isOpen ? '100%' : '0%',
        config: { tension: 300, friction: 30 }
    });

    return (
        <StyledPackageMenuMobile style={{pointerEvents: isOpen ? 'auto' : 'none', userSelect: isOpen ? 'auto' : 'none'}}>
            <StyledPackageMenuMobileWrapper style={menuAnimation}>
                <StyledPackageMenuMobileContent>
                    <StyledBackButton onClick={() => {
                        setIsOpen(false);
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 6L9 12L15 18" stroke="black" stroke-width="2"/>
                        </svg>
                        <span>Back</span>
                    </StyledBackButton>
                    <StyledPackages>
                        {packagesData?.map((item: any, index: number) => (
                            <StyledPackage key={index} href={`/packages/${item?.slug}`} onMouseEnter={() => setCurrentPackage(item)} onClick={() => {
                                setIsOpen(false);
                                setMenuOpen(false);
                                setIsMegaMenuOpen(false);
                            }}>
                                0{index + 1}. <span>{item?.title}</span>
                            </StyledPackage>
                        ))}
                    </StyledPackages>
                </StyledPackageMenuMobileContent>
            </StyledPackageMenuMobileWrapper>
        </StyledPackageMenuMobile>
    )
}

const StyledPackageMenuMobile = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
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

    span{
        font-size: ${rm(18)};
        line-height: 100%;
        letter-spacing: -0.01em;
        ${fontGolosText(500)};
        color: ${colors.black100} !important;
        margin-left: ${rm(5)};
    }
`;


const StyledPackageMenuMobileWrapper = styled(animated.div)`
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: ${rm(10)};
    background-color: ${colors.white100};
    overflow: hidden;
`

const StyledPackageMenuMobileContent = styled.div`
    padding: ${rm(50)};
    width: 100%;
    height: 100%;

    ${media.xsm`
        padding: ${rm(32)} ${rm(16)};
    `}
`

const StyledBackButton = styled.div`
    display: flex;
    align-items: center;
    margin-left: ${rm(-7)};
    margin-bottom: ${rm(40)};

    svg{
        width: ${rm(24)};
        height: ${rm(24)};
    }

    span{
        font-size: ${rm(16)};
        text-transform: uppercase;
        ${fontGolosText(600)};
        color: ${colors.black100};
    }
`
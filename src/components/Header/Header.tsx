'use client';

import styled from "styled-components";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getStrapiData } from "@/utils/strapi";
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { colors, media, rm } from "@/styles";
import { AnimLink } from "@/layouts/AnimatedRouterLayout/AnimatedRouterLayout";
import { fontGolosText } from "@/styles/fonts";
import { SimpleButton } from "../Ui/buttons/SimpleButton";
import { Menu } from "./Menu";
import { useWindowWidth } from "@react-hook/window-size";
import { LanguageSelect } from "./LanguageSelect/LanguageSelect";
import AnimatedLink from "../animated/AnimatedLink/AnimatedLink";
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath";

export const Header = () => {
    const [headerData, setHeaderData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const width = useWindowWidth();
    const locale = useLocale();

    useEffect(() => {
        const fetchHeaderData = async () => {
            try {
                const data = await getStrapiData('get-header-data', locale);
                setHeaderData(data);
            } catch (err) {
                console.error('Error fetching header data:', err);
                setError('Failed to load header');
            } finally {
                setLoading(false);
            }
        };

        fetchHeaderData();
    }, [locale]);


    if (loading) {
        return (
            <></>
        );
    }

    return (
        <StyledHeader>
            <StyledWrapper>
                <AnimLink href={'/'} className="logo">
                    {headerData?.data && (
                        <Image 
                            src={
                                width > 576 
                                    ? getMediaStrapiPath(headerData?.data?.logo) || '/logo.png'
                                    : getMediaStrapiPath(headerData?.data?.logoMobile || headerData?.data?.logo) || '/logo.png'
                            }
                            alt="logo" 
                            width={100} 
                            height={100} 
                        />
                    )}
                </AnimLink>
                <StyledLinks>
                    {headerData?.data?.links?.links?.map((item: any, index: number) => (
                        <AnimatedLink href={item?.link ? item?.link : '#'} key={index}>
                            <span>
                                {item.text}
                            </span>
                        </AnimatedLink>
                    ))}
                </StyledLinks>
                <StyledRightContainer>
                    <LanguageSelect languages={headerData?.data?.locales} />
                    {headerData?.data?.contactButton?.link && (
                        <SimpleButton link={headerData?.data?.contactButton?.link}>
                            {headerData?.data?.contactButton?.text}
                        </SimpleButton>
                    )}
                </StyledRightContainer>
                <Menu />
            </StyledWrapper>
        </StyledHeader>
    )
}

const StyledHeader = styled.div`
    position: fixed;
    width: 100%;
    padding: ${rm(10)} ${rm(50)};
    z-index: 100;
    top: 0;
    left: 0;

    ${media.md`
        padding: ${rm(10)} ${rm(25)};    
    `}

    ${media.xsm`
        padding: ${rm(12)} ${rm(16)};
    `}
`

const StyledWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: ${rm(1)};
    padding-left: ${rm(17)};
    border-radius: ${rm(6)};
    background-color: ${colors.background};
    box-shadow: 0px 4px 30px 0px #0000000D;
    backdrop-filter: blur(32px);

    ${media.md`
        padding: ${rm(2)};
        padding-left: ${rm(17)};
    `}

    ${media.xsm`
        padding-left: ${rm(15)};
    `}

    .logo{
        width: ${rm(206)};
        height: ${rm(20)};
        position: relative;

        ${media.lg`
            width: ${rm(176)};
            height: ${rm(16)};    
        `}

        ${media.xsm`
            width: ${rm(77)};
            height: ${rm(25)};    
        `}

        img{
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }
`

const StyledLinks = styled.div`
    display: flex;
    gap: ${rm(30)};

    ${media.md`
        display: none;    
    `}

    span{
        font-size: ${rm(16)};
        color: ${colors.black100};
        ${fontGolosText(400)};
        margin-bottom: ${rm(-2)};

        ${media.lg`
            font-size: ${rm(14)};
        `}
    }
`

const StyledRightContainer = styled.div`
    display: flex;
    gap: ${rm(2)};

    ${media.md`
        display: none;    
    `}
`
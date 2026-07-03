"use client"

import { media, rm } from "@/styles"
import { colors } from "@/styles/colors"
import { fontGolosText, fontSageGrotesk } from "@/styles/fonts"
import styled from "styled-components"
import { useEffect, useState } from "react"
import { useLocale } from "next-intl"
import { getStrapiData } from "@/utils/strapi"
import { AnimLink } from "@/layouts/AnimatedRouterLayout/AnimatedRouterLayout"
import AnimatedLink from "../animated/AnimatedLink/AnimatedLink"

export const Footer = ({ initialData }: { initialData?: any }) => {
    const [footerData, setFooterData] = useState<any>(initialData ?? null);
    const locale = useLocale();

    useEffect(() => {
        const fetchFooterData = async () => {
            try {
                const data = await getStrapiData('get-footer-data', locale);
                setFooterData(data?.data);
            } catch (err) {
                console.error('Error fetching footer data:', err);
            }
        };

        fetchFooterData();
    }, [locale]);

    const phoneHref = footerData?.companyData?.phone
        ? `tel:${String(footerData.companyData.phone).replace(/\s+/g, '')}`
        : undefined;
    const mailHref = footerData?.companyData?.mail
        ? `mailto:${footerData.companyData.mail}`
        : undefined;
    const mapsHref =
        footerData?.companyData?.Latitude != null && footerData?.companyData?.Longitude != null
            ? `https://www.google.com/maps/search/?api=1&query=${footerData.companyData.Latitude},${footerData.companyData.Longitude}`
            : undefined;

    return (
        <StyledFooter>
            <StyledTopContainer>
                <div className="left">
                    <StyledTitle>
                        <span>{footerData?.title?.textFirst}</span>
                        <span className="first">{footerData?.title?.textSecond}</span>
                    </StyledTitle>
                    <StyledInfoText as="a" href={mapsHref} target={mapsHref ? "_blank" : undefined} rel={mapsHref ? "noopener noreferrer" : undefined}>
                        {footerData?.companyData?.adress}
                    </StyledInfoText>
                    <StyledInfoText as="a" href={phoneHref}>
                        {footerData?.companyData?.phone}
                    </StyledInfoText>
                    <StyledInfoText as="a" href={mailHref}>
                        {footerData?.companyData?.mail}
                    </StyledInfoText>
                </div>
                <div className="right">
                    <StyledSection>
                        <p className="title">{footerData?.packages?.title}</p>
                        <div className="content">
                            {footerData?.packages?.links?.map((item: any, index: number) => (
                                <AnimatedLink href={item?.link} key={index} ariaLabel={item?.text}>
                                    <span className="text">{item?.text}</span>
                                </AnimatedLink>
                            ))}
                        </div>
                    </StyledSection>
                    <StyledSection>
                        <p className="title">{footerData?.company?.title}</p>
                        <div className="content">
                            {footerData?.company?.links?.map((item: any, index: number) => (
                                <AnimatedLink href={item?.link} key={index} ariaLabel={item?.text}>
                                    <span className="text">{item?.text}</span>
                                </AnimatedLink>
                            ))}
                        </div>
                    </StyledSection>
                    <StyledSection>
                        <p className="title">{footerData?.products?.title}</p>
                        <div className="content">
                            {footerData?.products?.links?.map((item: any, index: number) => (
                                <AnimatedLink href={item?.link ? item?.link : ''} key={index} ariaLabel={item?.text}>
                                    <span className="text">{item?.text}</span>
                                </AnimatedLink>
                            ))}
                        </div>
                    </StyledSection>
                    <StyledSection>
                        <p className="title">{footerData?.socials?.title}</p>
                        <div className="content">
                            {footerData?.socials?.links?.map((item: any, index: number) => (
                                <AnimatedLink key={index}> 
                                    <a href={item?.link} target="_blank" className="text" aria-label={`${item?.text} - opens in new tab`}>{item?.text}</a>
                                </AnimatedLink>
                            ))}
                        </div>
                    </StyledSection>
                </div>
            </StyledTopContainer>
            <StyledBottomContainer>
                <div className="dividerMain"></div>
                <div className="first">
                    <svg width="275" height="25" viewBox="0 0 275 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_5049_372)">
                        <path d="M144.771 12.4971L139.631 7.35742L134.491 12.4971L139.631 17.6367L144.771 12.4971Z" fill="white"/>
                        <path d="M132.438 10.4385L137.578 5.29883L132.438 0.159179L127.299 5.29883L132.438 10.4385Z" fill="#FF0021"/>
                        <path d="M137.579 19.6924L132.439 14.5527L127.3 19.6924L132.439 24.832L137.579 19.6924Z" fill="white"/>
                        <path d="M139.634 17.6347L134.494 12.4951L139.634 7.35547L144.773 12.4951" fill="white"/>
                        <path d="M130.384 12.4948L125.245 7.35525L118.05 0.160156L112.91 5.29975L120.105 12.4948L112.91 19.6899L118.05 24.8295L125.245 17.6344L130.384 12.4948Z" fill="white"/>
                        <path d="M165.796 12.7153V12.1926C167.404 11.4913 168.901 10.0453 168.901 7.6291C168.901 4.93408 166.716 2.75 164.021 2.75H156.571H152.051V22.2447H157.862H164.23C166.925 22.2447 169.109 20.0606 169.109 17.3656C169.109 14.8459 167.481 13.3815 165.796 12.7153ZM163.09 10.1739H157.862V7.44376H163.09V10.1739ZM163.298 17.5493H157.862V14.8192H163.298V17.5493Z" fill="white"/>
                        <path d="M222.23 12.7153V12.1926C223.838 11.4913 225.334 10.0453 225.334 7.6291C225.334 4.93408 223.15 2.75 220.455 2.75H213.004H208.484V22.2447H214.295H220.664C223.359 22.2447 225.543 20.0606 225.543 17.3656C225.543 14.8459 223.915 13.3815 222.23 12.7153ZM219.523 10.1739H214.295V7.44376H219.523V10.1739ZM219.732 17.5493H214.295V14.8192H219.732V17.5493Z" fill="white"/>
                        <path d="M183.88 2.75H173.419L169.43 22.2447H175.241L176.176 17.424H181.828L182.763 22.2447H188.574L184.585 2.75H183.88ZM177.131 12.4982L178.066 7.67753H179.938L180.873 12.4982H177.132H177.131Z" fill="white"/>
                        <path d="M201.389 2.74777H194.276H189.756V22.2425H195.567V16.263H197.472L200.262 22.2425H206.606L202.879 15.3145C205.034 14.6734 206.606 12.678 206.606 10.3135V7.96416C206.606 5.08212 204.27 2.74609 201.388 2.74609L201.389 2.74777ZM195.567 7.67529H200.795V11.3355H195.567V7.67529Z" fill="white"/>
                        <path d="M231.708 2.75H227.188V22.2464H231.708H242.513V17.551H232.998V14.8209H241.349V10.1755H232.998V7.44543H242.513V2.75H231.708Z" fill="white"/>
                        <path d="M250.293 2.75H244.482V22.2464H249.003H258.644V17.3189H250.293V2.75Z" fill="white"/>
                        <path d="M266.026 17.3189V2.75H260.215V22.2464H264.735H274.376V17.3189H266.026Z" fill="white"/>
                        <path d="M47.9928 2.74777H40.8795H36.3594V22.2425H42.1702V16.263H44.0754L46.8657 22.2425H53.2092L49.4822 15.3145C51.6379 14.6734 53.2092 12.678 53.2092 10.3135V7.96416C53.2092 5.08212 50.8731 2.74609 47.9911 2.74609L47.9928 2.74777ZM42.1702 7.67529H47.3983V11.3355H42.1702V7.67529Z" fill="white"/>
                        <path d="M59.6116 2.75H55.0898V22.2464H59.6116H70.4151V17.551H60.9024V14.8209H69.2513V10.1755H60.9024V7.44543H70.4151V2.75H59.6116Z" fill="white"/>
                        <path d="M76.9049 2.75H72.3848V22.2464H76.9049H87.71V17.551H78.1956V14.8209H86.5462V10.1755H78.1956V7.44543H87.71V2.75H76.9049Z" fill="white"/>
                        <path d="M23.5974 2.75H18.209V7.67753H23.5974V22.2464H29.4082V7.67753H34.7966V2.75H29.4082H23.5974Z" fill="white"/>
                        <path d="M105.641 2.75H100.254H94.4414H89.0547V7.67753H94.4414V22.2464H100.254V7.67753H105.641V2.75Z" fill="white"/>
                        <path d="M11.9984 2.75H5.48955C2.60751 2.75 0.271484 5.08603 0.271484 7.96807V9.87997C0.271484 11.8119 1.66241 13.4617 3.56764 13.7889L11.4039 15.1314V17.5276H6.084V15.2901H0.273153V17.0283C0.273153 19.9104 2.60918 22.2464 5.49122 22.2464H12C14.8821 22.2464 17.2181 19.9104 17.2181 17.0283V15.1164C17.2181 13.1845 15.8272 11.5347 13.922 11.2075L6.08567 9.86494V7.46881H11.4056V9.70632H17.2164V7.96807C17.2164 5.08603 14.8804 2.75 11.9984 2.75Z" fill="white"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_5049_372">
                        <rect width="275" height="25" fill="white"/>
                        </clipPath>
                        </defs>
                    </svg>
                </div>
                <div className="second">
                    {footerData?.bottomBlock?.links?.map((item: any, index: number) => (
                        <AnimatedLink href={item?.link ? item?.link : ''} key={index} ariaLabel={item?.text}>
                            <span className="link">{item?.text}</span>
                        </AnimatedLink>
                    ))}
                </div>
                <div className="third">
                    <span>© STREET BARBELL {new Date().getFullYear()} . All rights reserved</span>
                    <span className="developed">Developed by <a href="https://textura.agency" target="_blank" rel="noopener noreferrer">textura.agency</a></span>
                </div>
            </StyledBottomContainer>
        </StyledFooter>
    )
}

const StyledFooter = styled.footer`
    background-color: ${colors.black100};
    position: relative;
    z-index: 100;
    padding: ${rm(70)} ${rm(50)} ${rm(30)} ${rm(50)};

    ${media.md`
        padding: ${rm(70)} ${rm(25)} ${rm(30)} ${rm(25)};
    `}

    ${media.xsm`
        padding: ${rm(70)} ${rm(16)} ${rm(15)} ${rm(16)};
        z-index: 49;
    `}
`

const StyledTitle = styled.p`
    margin-bottom: ${rm(82)};
    font-size: ${rm(48)};
    text-transform: uppercase;
    ${fontSageGrotesk(400)};
    letter-spacing: -0.01em;
    color: ${colors.gray};
    display: flex;
    line-height: 105%;
    width: ${rm(800)};
    display: flex;
    flex-direction: column;
    gap: ${rm(5)};

    ${media.lg`
        font-size: ${rm(40)};
        width: ${rm(563)};
    `}

    ${media.xsm`
        font-size: ${rm(32)};
        width: 100%;
        margin-bottom: ${rm(50)};
    `}

    .first{
        ${fontGolosText(600)}; !important;
        color: ${colors.red} !important;
        letter-spacing: -0.02em;
        line-height: 90%;
    }
`

const StyledTopContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: ${rm(100)};

    ${media.md`
        flex-direction: column;
        gap: ${rm(100)};
    `}

    ${media.xsm`
        gap: ${rm(70)};
    `}

    .left{
        display: flex;
        flex-direction: column;
    }

    .right{
        display: flex;
        flex-wrap: wrap;
        row-gap: ${rm(50)};
        column-gap: ${rm(125)};
        width: 32%;

        ${media.lg`
            width: 43%;
        `}

        ${media.md`
            width: 100%;
            row-gap: ${rm(10)};
            column-gap: ${rm(10)};
        `}

        ${media.xsm`
            width: 100%;
            row-gap: ${rm(30)};
            column-gap: ${rm(8)};
        `}
    }
`

const StyledInfoText = styled.p`
    font-size: ${rm(22)};
    ${fontGolosText(500)};
    color: ${colors.white100};
    line-height: 100%;
    text-transform: uppercase;
    letter-spacing: -0.01em;
    margin-bottom: ${rm(30)};
    width: ${rm(330)};
    cursor: pointer;

    transition: opacity 0.3s ease-in-out;

    &:hover{
        opacity: 0.7;
    }

    ${media.lg`
        font-size: ${rm(18)};
        width: ${rm(294)};
    `}

    ${media.md`
        width: 100%;
    `}

    ${media.xsm`
        margin-bottom: ${rm(20)};
        font-size: ${rm(14)};
    `}
`

const StyledSection = styled.div`
    display: flex;
    flex-direction: column;
    width: ${rm(225)};

    ${media.md`
        width: ${rm(172)};
    `}

    ${media.xsm`
        width: ${rm(160)};
    `}

    .title{
        font-size: ${rm(20)};
        ${fontGolosText(400)};
        color: ${colors.gray};
        line-height: 110%;
        text-transform: uppercase;
        margin-bottom: ${rm(20)};

        ${media.lg`
            font-size: ${rm(16)};
        `}

        ${media.xsm`
            font-size: ${rm(14)};
        `}
    }


    .content{
        display: flex;
        flex-direction: column;
        gap: ${rm(8)};

        .text{
            font-size: ${rm(16)};
            ${fontGolosText(400)};
            color: ${colors.white100};
            line-height: 130%;

            ${media.lg`
                font-size: ${rm(14)};
            `}

            ${media.xsm`
                font-size: ${rm(14)};
            `}
        }
    }
`

const StyledBottomContainer = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    padding-top: ${rm(30)};

    ${media.md`
        flex-wrap: wrap;
        justify-content: space-between;
        gap: ${rm(30)};
    `}

    ${media.xsm`
        flex-direction: column;
        gap: ${rm(15)};
        padding-top: ${rm(15)};
        align-items: flex-start;
        justify-content: flex-start;
    `}

    .dividerMain{
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        height: ${rm(2)};
        background: radial-gradient(
            circle at ${rm(0.5)} ${rm(0.5)},
            ${colors.gray} ${rm(1)},
            transparent ${rm(1)}
        );
        background-size: ${rm(6)} ${rm(4)};
        border: none;
    }

    .first{
        width: 40%;

        ${media.lg`
            width: 50%;
        `}

        ${media.md`
            width: ${rm(275)};
        `}

        ${media.xsm`
            width: 100%;
        `}

        svg{
            width: ${rm(275)};
            height: ${rm(25)};

            ${media.xsm`
                width: ${rm(209)};
                height: ${rm(19)};
            `}
        }
    }

    .second{
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: center;
        gap: ${rm(30)};

        ${media.lg`
            width: 97%;
        `}

        ${media.md`
            width: auto;
        `}

        ${media.xsm`
            width: 100%;
            flex-direction: column;
            gap: ${rm(4)};
            align-items: flex-start;
            justify-content: flex-start;
        `}

        .link{
            color: #6F7685;
            font-size: ${rm(16)};
            ${fontGolosText(400)};
            line-height: 130%;

            ${media.lg`
                font-size: ${rm(14)};
            `}

            ${media.xsm`
                font-size: ${rm(12)};
            `}
        }
    }

    .third{
        width: 40%;
        color: #6F7685;
        text-align: right;
        font-size: ${rm(16)};
        ${fontGolosText(400)};
        line-height: 130%;
        text-transform: uppercase;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: ${rm(8)};

        ${media.lg`
            font-size: ${rm(14)};
            width: 50%;
        `}

        ${media.xsm`
            font-size: ${rm(12)};
            width: 100%;
            align-items: flex-start;
        `}

        .developed{
            font-size: ${rm(13)};
            text-transform: none;

            ${media.lg`
                font-size: ${rm(12)};
            `}

            ${media.xsm`
                font-size: ${rm(11)};
            `}

            a{
                color: #6F7685;
                text-decoration: underline;
                text-underline-offset: ${rm(2)};
                transition: color 0.3s ease-in-out;

                &:hover{
                    color: ${colors.white100};
                }
            }
        }
    }
`
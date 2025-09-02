'use client'

import { media, rm } from "@/styles";
import { fontUrbanist } from "@/styles/fonts";
import { Fragment } from "react";
import styled from "styled-components"

interface CameraGridEffectProps {
    time: string[]
}

export default function CameraGridEffect({ time }: CameraGridEffectProps) {
    return (
        <StyledCameraGridEffect>
            <div className="container">
                <div className="top-left-line line">
                    <div className="text">REC</div>
                </div>
                <div className="bottom-left-line line">
                    <svg width="45" height="24" viewBox="0 0 45 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="44" height="22.0233" stroke="white" />
                        <circle cx="11.5116" cy="11.5116" r="6.82558" stroke="white" />
                        <circle cx="33.4884" cy="11.5116" r="6.82558" stroke="white" />
                        <line x1="11.5117" y1="4.73254" x2="33.4885" y2="4.73254" stroke="white" />
                    </svg>
                </div>
                <div className="time">
                    [<div className="time-values">
                        {time.map((timeValue, i) => (
                            <Fragment key={i}>
                                <div className='time-value'>{timeValue}</div>
                                {i !== time.length - 1 && <div className="colon">:</div>}
                            </Fragment>
                        ))}
                    </div>]
                </div>
                <div className="bottom-right-line line"></div>
                <div className="center-lines">
                    <div className="top-left-line center-line"></div>
                    <div className="bottom-left-line center-line"></div>
                    <div className="bottom-right-line center-line"></div>
                    <div className="top-right-line center-line"></div>
                </div>
            </div>
        </StyledCameraGridEffect>
    )
}

const StyledCameraGridEffect = styled.div`
    padding: ${rm(20)};
    width: 100%;
    height: 100%;
    position: relative;
    pointer-events: none;
    user-select: none;

    @keyframes pulse {
        0% {
            opacity: 1;
        }
        7% {
            opacity: 0;
        }
        14% {
            opacity: 1;
        }
        100% {
            opacity: 1;
        }
    }

    ${media.xsm`
        padding: ${rm(80)} ${rm(10)} ${rm(10)};
    `}

    .container {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .line {
        position: absolute;
        height: ${rm(60)};
        width: ${rm(60)};

        ${media.xsm`
           display: none !important;
       `}
    }

    .top-left-line {
        top: 0;
        left: 0;
        padding-top: ${rm(15)};
        padding-left: ${rm(15)};
        border-top: 1px #FFFFFF solid;
        border-left: 1px #FFFFFF solid;

        ${media.xsm`
           display: block !important;
           border: none;
           padding: 0;
        `}

        .text {
            ${fontUrbanist(400)};
            font-size: ${rm(24)};
            position: relative;
            display: flex;
            align-items: center;
            padding-left: ${rm(20)};
            color: white;

            &::before {
                content: '';
                position: absolute;
                top: ${rm(7)};
                left: 0;
                width: ${rm(15)};
                height: ${rm(15)};
                background-color: red;
                border-radius: ${rm(999)};
                animation: pulse 7s linear infinite;
            }
        }
    }

    .bottom-left-line {
        bottom: 0;
        left: 0;
        padding-bottom: ${rm(15)};
        padding-left: ${rm(15)};
        display: flex;
        align-items: flex-end;
        border-bottom: 1px #FFFFFF solid;
        border-left: 1px #FFFFFF solid;
    }

    .bottom-right-line {
        bottom: 0;
        right: 0;
        border-bottom: 1px #FFFFFF solid;
        border-right: 1px #FFFFFF solid;
    }

    .top-right-line {
        top: 0;
        right: 0;
        border-top: 1px #FFFFFF solid;
        border-right: 1px #FFFFFF solid;
    }

    .time {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        ${fontUrbanist(400)};
        color: #FFFFFF;
        display: flex;
        ${media.xsm`
           top: ${rm(5)};
       `}
    }

    .time-values {
        display: flex;
        gap: ${rm(1)};
        padding: 0 ${rm(4)};
    }


    .time-value {
        width: ${rm(18)};
    }

    .center-lines {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: ${rm(190)};
        width: ${rm(290)};

        .top-left-line {
            border-top: 1px #FFFFFF solid;
            border-left: 1px #FFFFFF solid;
        }
    }

    .center-line {
        position: absolute;
        height: ${rm(45)};
        width: ${rm(70)};
    }

`;
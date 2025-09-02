'use client'

import { media, rm } from "@/styles"
import { forwardRef, useEffect, useRef } from "react"
import styled from "styled-components"
import useCursorStore from "@/store/store"

interface VideoMenuProps {
    volume: number,
    handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

const VideoMenu = forwardRef<HTMLDivElement, VideoMenuProps>((props, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { setCurrentCursor } = useCursorStore();
    useEffect(() => {
        inputRef.current?.style.setProperty('--fill', `${props.volume * 100}%`);
    }, [props.volume])
    return (
        <StyledVideoMenu ref={ref}
            onMouseEnter={(e) => {
                e.stopPropagation()
                setCurrentCursor({
                    type: 'default',
                })
            }} onMouseLeave={(e) => {
                e.stopPropagation()
                setCurrentCursor({
                    type: 'default',
                })
            }}
        >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_1435_382)">
                    <path d="M7.00421 11.3645C7.00425 11.4852 6.96989 11.6034 6.90516 11.7053C6.84042 11.8072 6.748 11.8885 6.63871 11.9397C6.52949 11.9911 6.4079 12.0103 6.28817 11.9951C6.16843 11.9799 6.05551 11.9309 5.96262 11.8538L2.48692 8.9737H0.635762C0.552274 8.97374 0.469596 8.95733 0.392454 8.9254C0.315312 8.89347 0.245217 8.84666 0.186175 8.78763C0.127134 8.7286 0.080302 8.65852 0.0483572 8.58138C0.0164123 8.50425 -1.97613e-05 8.42158 1.78348e-08 8.33809V5.80512C1.31137e-08 5.63649 0.0669771 5.47477 0.186201 5.35552C0.305425 5.23627 0.467133 5.16925 0.635762 5.16921H2.48707L5.96277 2.2891C6.05563 2.21197 6.16858 2.16294 6.28834 2.14777C6.4081 2.1326 6.5297 2.15193 6.63886 2.20348C6.74811 2.25477 6.84051 2.33611 6.90524 2.43798C6.96996 2.53985 7.00435 2.65805 7.00436 2.77875L7.00421 11.3645ZM9.4475 10.371C9.35654 10.3776 9.26524 10.3646 9.17978 10.3327C9.09433 10.3009 9.01674 10.251 8.95228 10.1865L8.86726 10.1012C8.75935 9.99351 8.69377 9.85058 8.6825 9.69853C8.67122 9.54648 8.71501 9.39544 8.80587 9.273C9.27987 8.63718 9.53508 7.86489 9.53327 7.07183C9.53327 6.21321 9.24796 5.40787 8.70806 4.74276C8.60884 4.62076 8.5584 4.46629 8.56648 4.30925C8.57457 4.1522 8.64062 4.00374 8.75184 3.89257L8.83671 3.80755C8.96371 3.68055 9.1339 3.61133 9.31809 3.62232C9.40684 3.62677 9.49367 3.64976 9.573 3.6898C9.65233 3.72984 9.7224 3.78604 9.77869 3.8548C10.5276 4.7712 10.9232 5.88382 10.9232 7.07198C10.9232 8.17858 10.5734 9.23192 9.91126 10.1176C9.85663 10.1906 9.78695 10.251 9.70693 10.2948C9.62692 10.3385 9.53844 10.3645 9.4475 10.371ZM12.076 12.3358C12.0192 12.403 11.949 12.4576 11.87 12.4963C11.791 12.535 11.7048 12.5569 11.6169 12.5606C11.529 12.5643 11.4413 12.5497 11.3593 12.5178C11.2773 12.4859 11.2028 12.4374 11.1405 12.3752L11.057 12.2917C10.9445 12.1791 10.8783 12.0285 10.8714 11.8695C10.8646 11.7105 10.9176 11.5547 11.02 11.4329C12.0462 10.2113 12.6092 8.66726 12.6102 7.07183C12.6109 5.41695 12.0052 3.81916 10.9077 2.58057C10.8005 2.45946 10.7435 2.30207 10.7482 2.1404C10.753 1.97874 10.8192 1.82497 10.9333 1.71037L11.0167 1.62685C11.0773 1.56452 11.1504 1.51567 11.2311 1.48347C11.3119 1.45126 11.3985 1.43644 11.4854 1.43996C11.5721 1.44247 11.6573 1.46268 11.7359 1.49935C11.8144 1.53602 11.8847 1.58837 11.9422 1.65319C13.2688 3.14631 14.0011 5.07452 14 7.07183C13.9995 8.99847 13.318 10.8629 12.076 12.3358Z" fill="white" />
                </g>
                <defs>
                    <clipPath id="clip0_1435_382">
                        <rect width="14" height="14" fill="white" />
                    </clipPath>
                </defs>
            </svg>
            <input type="range" className="input-range" value={props.volume} min='0' max='1' step='0.01' onChange={(e) => props.handleVolumeChange(e)} ref={inputRef} />
        </StyledVideoMenu>
    )
});

VideoMenu.displayName = 'VideoMenu';

export default VideoMenu;

const StyledVideoMenu = styled.div`

        display: flex;
        gap: ${rm(15)};
        align-items: center;
        background-color: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(4px);
        padding: ${rm(15)};
        width: fit-content;
        border-radius: ${rm(30)};


    .input-range {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: ${rm(4)};
        background: rgba(255, 255, 255, 0.5); 
        border-radius: ${rm(2)};
        outline: none;
    }

    .input-range::-webkit-slider-runnable-track {
    height: ${rm(4)};
    background: linear-gradient(to right, white 0%, white var(--fill, 50%), transparent var(--fill, 50%), transparent 100%);
    border-radius: ${rm(2)};
    }

    .input-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: ${rm(12)};
    height: ${rm(12)};
    background: white;
    border-radius: 50%;
    cursor: pointer;
    margin-top: ${rm(-4)};
    }

    .input-range::-moz-range-track {
    height: ${rm(4)};
    background: rgba(255, 255, 255, 0.5);
    border-radius: ${rm(2)};
    }

    .input-range::-moz-range-progress {
    height: ${rm(4)};
    background: white;
    border-radius: ${rm(2)};
    }

    .input-range::-moz-range-thumb {
    width: ${rm(12)};
    height: ${rm(12)};
    background: white;
    border-radius: 50%;
    cursor: pointer;
    border: none;
    }

`;
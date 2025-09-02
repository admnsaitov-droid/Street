'use client'

import { media, rm } from "@/styles";
import { fontUrbanist } from "@/styles/fonts";
import { forwardRef, Fragment, useEffect, useRef, useState } from "react";
import styled from "styled-components"
import useCursorStore from "@/store/store"
interface TimeMenuProps {
    videoDuration: number,
    formateTime: (time: string) => string[],
    currentTime: string[],
    handleTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    isPlaying: boolean,
}

const TimeMenu = forwardRef<HTMLDivElement, TimeMenuProps>((props, ref) => {
    const duration = props.formateTime(props.videoDuration + '').slice(1, 3);
    const time = props.currentTime.slice(1, 3);
    const inputRef = useRef<HTMLInputElement>(null);
    const { setCurrentCursor } = useCursorStore();
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Merge refs
    useEffect(() => {
        if (!wrapperRef.current) return;
        if (typeof ref === 'function') {
            ref(wrapperRef.current);
        } else if (ref) {
            ref.current = wrapperRef.current;
        }
    }, [ref]);

    const formatToSeconds = (time: string[]) => {
        let seconds = +time[0] * 3600;
        seconds += +time[1] * 60;
        seconds += +time[2];
        seconds += +`0.${time[3]}`;
        return seconds
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        handleDrag(e);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        handleDrag(e);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleDrag = (e: MouseEvent | React.MouseEvent) => {
        if (!wrapperRef.current) return;
        const rect = wrapperRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percentage = x / rect.width;
        props.handleTimeChange({
            target: { value: percentage.toString() }
        } as React.ChangeEvent<HTMLInputElement>);
    };

    useEffect(() => {
        let time = props.currentTime
        inputRef.current?.style.setProperty('--fill', `${(formatToSeconds(time) / formatToSeconds(props.formateTime(props.videoDuration + ''))) * 100}%`);
    }, [props.currentTime]);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <StyledTimeMenu
        onMouseEnter={() => {
            setCurrentCursor({
                type: 'default'
            });
        }}
        >
            <div className="to-pause-button">
                {props.isPlaying ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="2" height="10" rx="1" fill="black" />
                        <rect x="8" width="2" height="10" rx="1" fill="black" />
                    </svg>
                ) : (
                    <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.93333 4.2C7.46667 4.6 7.46667 5.4 6.93333 5.8L1.6 9.8C0.940764 10.2944 3.95697e-08 9.82405 6.72981e-08 9L3.3649e-07 1C3.64219e-07 0.175955 0.940764 -0.294427 1.6 0.2L6.93333 4.2Z" fill="black" />
                    </svg>
                )}
            </div>
            <div className="time">
                [
                <div className="time-content">
                    <div className="current-time">
                        {time.map((timeValue, i) => (
                            <Fragment key={i}>
                                <div className='time-value'>{timeValue}</div>
                                {i !== time.length - 1 && <div className="colon">:</div>}
                            </Fragment>
                        ))}
                    </div>
                    {'/ '}
                    <div className="duration">
                        {duration.map((durationValue, i) => (
                            <Fragment key={i}>
                                <div className='time-value'>{durationValue}</div>
                                {i !== time.length - 1 && <div className="colon">:</div>}
                            </Fragment>
                        ))}
                    </div>
                </div>
                ]
            </div>
            <div 
                className="input-range-wrapper" 
                ref={wrapperRef}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleDrag}
            >
                <input type="range" className="input-range" value={+time.join('.') * 100 / props.videoDuration} min='0' max='1' step='0.001' onChange={(e) => props.handleTimeChange(e)} ref={inputRef} />
                {(isHovered || isDragging) && (
                    <div 
                        className="time-indicator" 
                        style={{ 
                            left: `${(formatToSeconds(props.currentTime) / formatToSeconds(props.formateTime(props.videoDuration + ''))) * 100}%`,
                            cursor: isDragging ? 'grabbing' : 'grab',
                        }} 
                        onMouseDown={handleMouseDown}
                    />
                )}
            </div>
        </StyledTimeMenu>
    )
})

TimeMenu.displayName = 'TimeMenu';

export default TimeMenu;

const StyledTimeMenu = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: ${rm(20)};
    align-items: center;
    color: white;
    ${fontUrbanist(400)};
    padding-bottom: ${rm(3)};

    .to-pause-button {
        background-color: white;
        border-radius: 100px;
        white-space: nowrap;
        transition: transform 0.3s ease-in-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        width: ${rm(50)};
        height: ${rm(50)};
        display: none;

        svg {
            margin: auto;
        }

        ${media.xsm`
            display: flex;
        `}
    }

    .time, .time-content, .duration, .current-time {
        display: flex;
    }

    .duration {
        margin-left: ${rm(2)};
    }

    .time-content {
        padding: 0 ${rm(4)};
    }

    .time-value {
        width: ${rm(18)};
    }

    .input-range-wrapper {
        width: 100%;
        height: ${rm(15)};
        display: flex;
        align-items: flex-end;
        cursor: pointer;
        padding-top: ${rm(12)};
        position: relative;
        user-select: none;
    }

    .input-range {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: ${rm(3)};
        background: rgba(255, 255, 255, 0.5); 
        border-radius: ${rm(2)};
        outline: none;
        pointer-events: none;
    }

    .input-range::-webkit-slider-runnable-track {
        height: 100%;
        background: linear-gradient(to right, white 0%, white var(--fill, 50%), transparent var(--fill, 50%), transparent 100%);
        border-radius: ${rm(2)};
    }

    .input-range::-webkit-slider-thumb {
        -webkit-appearance: none;
        background: white;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    .input-range::-moz-range-track {
        height: ${rm(3)};
        background: rgba(255, 255, 255, 0.5);
        border-radius: ${rm(2)};
    }

    .input-range::-moz-range-progress {
        height: ${rm(3)};
        background: white;
        border-radius: ${rm(2)};
    }

    .input-range::-moz-range-thumb {
        background: white;
        cursor: pointer;
        border: none;
        height: 0;
        width: 0;
    }

    .time-indicator {
        position: absolute;
        bottom: -50%;
        width: ${rm(6)};
        height: ${rm(6)};
        background: white;
        border-radius: 50%;
        transform: translate(-50%, -100%);
        pointer-events: all;

        &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: ${rm(24)};
            height: ${rm(24)};
            background: transparent;
        }
    }
`;
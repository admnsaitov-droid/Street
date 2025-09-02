'use client'

import { heightLvh } from "@/styles/utils";
import { useEffect, useRef, useState } from "react"
import styled from "styled-components";
import CameraGridEffect from "./components/CameraGridEffect";
import useLoadingStore from "@/store/store";
import { media, rm } from "@/styles";
import { fontUrbanist } from "@/styles/fonts";
import { useScroll } from "@/layouts/ScrollLayout/useScroll";
import VolumeMenu from "./components/VolumeMenu";
import TimeMenu from "./components/TimeMenu";
import CloseVideo from "./components/CloseVideo";

export default function VideoBlock() {
    const [isPlaying, setIsPlaying] = useState<boolean>(true);
    const [isStartedAgain, setIsStartedAgain] = useState<boolean>(false);
    const [isMouseMoving, setIsMouseMoving] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(0.5);

    const videoRef = useRef<HTMLVideoElement>(null);
    const volumeRef = useRef<HTMLDivElement>(null);
    const timeRef = useRef<HTMLDivElement>(null);
    const videoMenuRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLDivElement>(null);
    const isAboutVideoPlaying = useLoadingStore((state: any) => state.isAboutVideoPlaying);
    const setIsAboutVideoPlaying = useLoadingStore((state: any) => state.setIsAboutVideoPlaying);
    const setCurrentCursor = useLoadingStore((state: any) => state.setCurrentCursor);
    const { stop, start } = useScroll();

    const [time, setTime] = useState<string[]>(['00', '00', '00', '00']);
    const timer = useRef<NodeJS.Timeout>();

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (videoRef.current && !volumeRef.current?.contains(e.target as Node) && !timeRef.current?.contains(e.target as Node)) {
            if (!isAboutVideoPlaying) {
                // Opening the video
                setIsAboutVideoPlaying(true);
                videoRef.current.muted = false;
                videoRef.current.volume = volume;
                setIsPlaying(true);
                if (!isStartedAgain) {
                    videoRef.current.currentTime = 0;
                    setIsStartedAgain(true);
                }
                videoRef.current.play();
                setCurrentCursor({
                    type: 'default',
                })
                return;
            }

            // Handle play/pause when video is already open
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying)
        }
    }

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = +e.target?.value;
        setVolume(newVolume);

        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }

    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value;
        if (videoRef.current) {
            setTime(formateTime(+newTime * videoRef.current?.duration + ''));
            videoRef.current.currentTime = +newTime * videoRef.current.duration;
        }
    };

    const handleClickClose = () => {
        if (videoRef.current) {
            videoRef.current.muted = true;
            // Keep playing when closing
            setIsPlaying(true);
            videoRef.current.play();
        }
        setIsAboutVideoPlaying(false);
        setIsStartedAgain(false);
        setIsMouseMoving(false);
        if (timer.current) {
            clearTimeout(timer.current);
        }
        setCurrentCursor({
            type: 'watch'
        });
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (volumeRef.current?.contains(e.target as Node) || 
            timeRef.current?.contains(e.target as Node) ||
            closeRef.current?.contains(e.target as Node)
        ) {
            setCurrentCursor({
                type: 'default'
            });
            return;
        }

        if (!isAboutVideoPlaying) {
            setCurrentCursor({
                type: 'watch'
            });
            return;
        }

        if (!isMouseMoving) {
            setIsMouseMoving(true);
        }

        if (timer) {
            clearTimeout(timer.current);
        }

        if (isMouseMoving && isStartedAgain && isPlaying) {
            setCurrentCursor({
                type: 'pause'
            })
        }

        timer.current = setTimeout(() => {
            setIsMouseMoving(false);
            if (isAboutVideoPlaying) {
                setCurrentCursor({
                    type: 'none'
                });
            } else {
                setCurrentCursor({
                    type: 'watch'
                });
            }
        }, 2500);
    }

    const formateTime = (time: string) => {
        let [mil = '0', sec = '0', mins = '0', hours = '0'] = time.split('.').reverse();
        mil = mil.slice(0, 2);
        const timeValues: string[] = [+hours < 10 ? '0' + hours : hours, +mins < 10 ? '0' + mins : mins, +sec < 10 ? '0' + sec : sec, mil];
        return timeValues;
    }

    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(() => {
                setTime(formateTime(videoRef.current?.currentTime + ''));
            }, 100);
            setCurrentCursor({
                type: 'default',
            })
            return () => clearInterval(interval);
        } else if (isHovered) {
            setCurrentCursor({
                type: 'watch'
            })
        }

    }, [isPlaying]);

    useEffect(() => {
        if (!isStartedAgain && isHovered) {
            setCurrentCursor({
                type: 'watch',
            })
        } else {
            setCurrentCursor({
                type: 'default',
            })
        }
    }, [isStartedAgain, isHovered])

    useEffect(() => {


        if (isAboutVideoPlaying) {
            videoRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
            stop();
        } else {
            start();
        }

    }, [isAboutVideoPlaying]);



    return (
        <StyledVideoBlock onClick={(e) => handleClick(e)} onMouseEnter={() => {
            setIsHovered(true)
            if (!isPlaying) {
                setCurrentCursor({
                    type: 'watch',
                })
            }
        }} onMouseLeave={() => {
            setIsHovered(false)
            setCurrentCursor({
                type: 'default',
            })
        }} onMouseMove={handleMouseMove}>
            <video src="/assets/productionFootage.mp4" width='100%' height='100%' ref={videoRef} loop autoPlay muted playsInline webkit-playsinline data-is-startedagain={isStartedAgain}></video>
            {!isAboutVideoPlaying && <CameraGridEffect time={time} />}
            {isAboutVideoPlaying && (
                <VideoMenu data-is-shown={(isMouseMoving || !isPlaying) && isAboutVideoPlaying}>
                    <VideoMenuContent ref={videoMenuRef}>
                        <VolumeMenu ref={volumeRef} volume={volume} handleVolumeChange={handleVolumeChange} />
                        <TimeMenu formateTime={formateTime} videoDuration={videoRef.current?.duration || 0} currentTime={time} handleTimeChange={handleTimeChange} ref={timeRef} isPlaying={isPlaying} />
                        <CloseVideo ref={closeRef} handleClickClose={handleClickClose} />
                    </VideoMenuContent>
                </VideoMenu>
            )}
            <div className='info' data-is-playing={isStartedAgain}>
                <div className="info-content">
                    <div className="name">
                        Hi! I&apos;m Dan Aranha —
                    </div>
                    <div className="biography">
                        Professinal Videographer from Dubai
                    </div>
                    <div className="watch">
                        Watch showreel
                    </div>
                </div>
            </div>
        </StyledVideoBlock>
    )
}

const StyledVideoBlock = styled.div`
    ${heightLvh(100)};
    position: relative;
    width: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;

    > video {
        height: 100%;
        width: 100%;
        object-fit: cover;
        position: absolute;
        top: 0;
        left: 0;

        ${media.xsm`
            &[data-is-startedagain="true"] {
                object-fit: contain;
                padding: 0 ${rm(10)};
             }
        `}

    }

    .info {
            display: none;
            position: absolute;
            bottom: ${rm(10)};
            left: ${rm(20)};
            align-items: flex-end;
            color: black;
            width: ${rm(345)};
            transition: clip-path 0.4s linear;
            clip-path: inset(0% 0% 0% 0%);
            height: ${rm(130)};

            &[data-is-playing="true"] {
                 clip-path: inset(100% 100% 0% 0%);
             }

            .info-content::before {
                content: '';
                width: ${rm(17)};
                height: ${rm(17)};
                position: absolute;
                bottom: 0;
                left: ${rm(-16.4)};
                background-color: rgba(255, 255, 255);
                -webkit-mask: radial-gradient(circle at 0 0, transparent ${rm(17)}, black 0); 
                mask: radial-gradient(circle at 0 0, transparent ${rm(17)}, black 0);
            }

            .info-content {
                background-color: rgba(255, 255, 255);
                padding: ${rm(20)};
                ${fontUrbanist(500)};
                border-radius: ${rm(8)} ${rm(8)} ${rm(8)} ${rm(0)};
                width: calc(100% - ${rm(16)});
                position: absolute;
                z-index: 1;
                margin-left: ${rm(16)};
                opacity: 0.8;
                backdrop-filter: blur(80%);
            }

            .name {
                font-size: ${rm(30)};
                font-weight: 500;
            }

            .watch {
                font-weight: 500;
                text-decoration: underline 1px black solid;
                margin-top: ${rm(10)};
            }
        }

    ${media.xsm`

        padding: 0 ${rm(10)};
        overflow: hidden;

        .info {
            display: flex;
        }
    `}
`;


const VideoMenu = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    padding: ${rm(20)};
    opacity: 0;
    transition: opacity .7s linear;

    &[data-is-shown="true"] {
        opacity: 1;
    }

    ${media.xsm`
        padding: ${rm(10)} 0;
    `}
`;

const VideoMenuContent = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`;
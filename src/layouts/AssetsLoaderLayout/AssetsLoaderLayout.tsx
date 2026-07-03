'use client'

// Module-level flag — resets on full page reload (module re-executes).
// The cleanup function resets it between React Strict Mode's double-invocation
// so the loader shows correctly in development too.
let loaderShown = false;

import styled from "styled-components";
import React, { useEffect, useState, createContext, useContext } from "react";
import { useLoadAssets } from "./useLoadAssets";
// Assets
import { useSpring, animated, useTransition, easings } from "@react-spring/web";
import { rm } from '@/styles'
import { colors } from "@/styles";
import { Loader } from "./Loader";
import { create } from "zustand";
interface Props {
    loading: boolean,
    loaded: boolean
    progress: 0,
    currentFile: '',
    fullyLoaded: false,
}
export const AssetsLoaderContext = createContext({
    loading: true,
    progress: 0,
    currentFile: '',
    fullyLoaded: false,
    loaded: false
} as Props)
export const useAssetsLoader = () => {
    const context = useContext(AssetsLoaderContext)
    return context
}

const StyledLoader = styled(animated.div)`
    position: fixed;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    // background-color: color(text-black);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    --color-loader-1: #fff;
    --color-loader-2: #fff;
    --size-loader: ${rm(48)};
    transform: translate(0, 0, 0);
    overflow: hidden;
    color: ${colors.black100};
    pointer-events: none;

    > div {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: ${rm(32)};
        pointer-events: none;
    }
`
const StyledLoaderContainer = styled.div`
    visibility: visible;
`

// Only For scroll feature
export const useLayoutState = create<{fullyLoaded: boolean}>((set) => ({
    fullyLoaded: false,
}))

export const AssetsLoaderLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [delayedLoading, setDelayedLoading] = useState(true)
    const [fullyLoaded, setFullyLoaded] = useState(false)
    const [skipLoader, setSkipLoader] = useState(false)
    const [loading, progress, currentFile] = useLoadAssets({
        // path: ' ',
        // images: [
        //     ...framesForLoadingLayout
        // ],
        // videos: [
        //     'video/hero.mp4'
        // ]
    })
    useEffect(() => { !loading && setDelayedLoading(false) }, [loading])
    useEffect(() => {
        if (fullyLoaded) {
            useLayoutState.setState({ fullyLoaded: true })
        }
    }, [fullyLoaded])

    useEffect(() => {
        document.body.style.removeProperty('opacity')
        if (loaderShown) {
            setSkipLoader(true)
            setFullyLoaded(true)
            useLayoutState.setState({ fullyLoaded: true })
        } else {
            loaderShown = true
        }
        return () => {
            // Cleanup resets the flag so React Strict Mode's second invocation
            // doesn't find it set and incorrectly skip the loader.
            loaderShown = false
        }
    }, [])

    const transitions = useTransition(!skipLoader && !fullyLoaded, {
        from: { transform: 'translateY(0%)' },
        enter: { transform: 'translateY(0%)' },
        leave: { transform: 'translateY(100%)' },
        delay: 80,
        config: {
            duration: 250,
            easing: easings.easeInCubic
        }
    })

    const wrapperValues = useSpring({
        opacity: skipLoader || fullyLoaded ? 1 : 0,
        config: skipLoader ? { duration: 0 } : undefined
    })

    return (
        <>
            {!skipLoader && transitions((styles, item) => item && (
                <StyledLoader style={styles}>
                    <Loader setFullyLoaded={setFullyLoaded} progress={progress} isFullyLoaded={fullyLoaded}/>
                </StyledLoader>
            ))}
            <StyledLoaderContainer as={animated.div} style={wrapperValues}>
                <AssetsLoaderContext.Provider
                    value={{
                        loading,
                        progress,
                        currentFile,
                        loaded: !delayedLoading,
                        fullyLoaded,
                    } as Props}
                >
                    {children}
                </AssetsLoaderContext.Provider>
            </StyledLoaderContainer>
        </>
    )
};
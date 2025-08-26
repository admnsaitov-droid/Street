'use client'

import { rm } from "@/styles"
import { colors } from "@/styles/colors"
import { useRef, useEffect, useState } from "react"
import styled from "styled-components"
import useLoadingStore from "@/store/store"

interface LoaderProps {
    setFullyLoaded: (value: boolean) => void
    progress: number
}

const StyledLoader = styled.div`
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${colors.black100};
    background-color: ${colors.black100};
    pointer-events: all;
    padding: ${rm(16)};
`

export const Loader = ({ setFullyLoaded, progress }: LoaderProps) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const progressRef = useRef(0)
    const setContentLoaded = useLoadingStore(state => state.setContentLoaded)


    useEffect(() => {
        progressRef.current = progress
    }, [progress])

    useEffect(() => {
        if (isLoaded) {
            document.body.style.cursor = 'default'
            return
        }
        document.body.style.cursor = 'progress'
    }, [isLoaded])

    // Fake Progress
    // Replace it with real progress/logic
    useEffect(() => {
        setTimeout(() => {
            setIsLoaded(true)
            setTimeout(() => {
                setFullyLoaded(true)
                setContentLoaded(true)
            }, 500)
        }, 0)
    }, [progressRef.current])

    return (
        <StyledLoader>
            {/* You can add a logo or any content here if needed */}
        </StyledLoader>
    )
}
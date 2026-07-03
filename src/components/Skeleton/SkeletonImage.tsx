/**
 * @fileoverview Skeleton image component with loading state handling
 * 
 * This component provides a skeleton loading state for images:
 * 1. Shows skeleton loader while image loads
 * 2. Smooth transitions between loading/loaded states
 * 3. Configurable loading delay
 * 4. Handles image source changes
 * 
 * @param {ImageProps} props - Next.js Image component props
 * @param {string} wrapperClassName - Class name for wrapper element
 * @param {number} delay - Delay before showing loaded image in ms
 */


'use client'

import Image, { ImageProps } from "next/image"
import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { SkeletonLoader } from "./SkeletonLoader"
import { Handle } from "../Springs/Handle"

interface SkeletonImageProps extends ImageProps {
    wrapperClassName?: string
    delay?: number
}

export const SkeletonImage = ({
    wrapperClassName,
    delay = 300,
    priority = false,
    loading = "lazy",
    ...props
}: SkeletonImageProps) => {
    const [loaded, setLoaded] = useState(false)
    const cachedSrc = useRef(props.src)
    const timeoutRef = useRef<NodeJS.Timeout>()
    
    useEffect(() => {
        if (cachedSrc.current !== props.src) {
            setLoaded(false)
            cachedSrc.current = props.src
        }
    }, [props.src])

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    return (
        <StyledSkeletonImage
            className={wrapperClassName}
        >
            <Handle>{!loaded && <SkeletonLoader />}</Handle>
            <Image
                {...props}
                priority={priority}
                loading={loading}
                onLoad={() => {
                    timeoutRef.current = setTimeout(() => {
                        setLoaded(true)
                    }, delay)
                }}
                onError={() => {
                    setLoaded(true) // Show image even if it fails to load
                }}
            />
        </StyledSkeletonImage>
    )
}

const StyledSkeletonImage = styled.span`
    position: relative;
    overflow: hidden;
`

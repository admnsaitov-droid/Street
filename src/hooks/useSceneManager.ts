/**
 * @fileoverview Custom hook for managing 3D scene loading and rendering
 * 
 * This hook provides comprehensive scene management:
 * 1. Visibility detection with intersection observer
 * 2. Loading state management with progress tracking
 * 3. On-demand rendering control
 * 4. Performance optimization with proper cleanup
 * 5. Smooth transitions between states
 */

'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface SceneManagerOptions {
    /** Threshold for intersection observer (0-1) */
    threshold?: number
    /** Root margin for intersection observer */
    rootMargin?: string
    /** Delay before enabling rendering after coming into view */
    renderDelay?: number
    /** Minimum loading time to prevent flicker */
    minLoadingTime?: number
}

interface SceneManagerReturn {
    /** Ref to attach to scene container */
    containerRef: React.RefObject<HTMLDivElement>
    /** Current visibility state */
    isInView: boolean
    /** Current loading state */
    isLoading: boolean
    /** Whether scene should render */
    shouldRender: boolean
    /** Function to set loading state */
    setLoading: (loading: boolean) => void
    /** Function to mark scene as ready */
    setSceneReady: () => void
    /** Loading progress (0-1) */
    progress: number
    /** Function to update loading progress */
    setProgress: (progress: number) => void
}

export const useSceneManager = (options: SceneManagerOptions = {}): SceneManagerReturn => {
    const {
        threshold = 0.1,
        rootMargin = '50px',
        renderDelay = 100,
        minLoadingTime = 500
    } = options

    // Refs and state
    const containerRef = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoadingState] = useState(true)
    const [progress, setProgress] = useState(0)
    const [sceneReady, setSceneReadyState] = useState(false)
    const [shouldRender, setShouldRender] = useState(false)
    const [isInView, setIsInView] = useState(false)
    const loadingStartTime = useRef<number>(Date.now())
    const renderTimeoutRef = useRef<NodeJS.Timeout>()
    const observerRef = useRef<IntersectionObserver | null>(null)


    // Setup intersection observer
    useEffect(() => {
        if (!containerRef.current) return

        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting)
            },
            {
                threshold,
                rootMargin
            }
        )

        observerRef.current.observe(containerRef.current)

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
        }
    }, [threshold, rootMargin])

    // Handle visibility changes
    useEffect(() => {
        if (renderTimeoutRef.current) {
            clearTimeout(renderTimeoutRef.current)
        }

        if (isInView) {
            // Delay rendering to prevent stuttering
            renderTimeoutRef.current = setTimeout(() => {
                setShouldRender(true)
            }, renderDelay)
        } else {
            // Immediately stop rendering when out of view
            setShouldRender(false)
        }

        return () => {
            if (renderTimeoutRef.current) {
                clearTimeout(renderTimeoutRef.current)
            }
        }
    }, [isInView, renderDelay])

    // Handle loading state
    const setLoading = useCallback((loading: boolean) => {
        if (loading) {
            loadingStartTime.current = Date.now()
            setProgress(0)
        }
        setIsLoadingState(loading)
    }, [])

    // Handle scene ready
    const setSceneReady = useCallback(() => {
        const elapsedTime = Date.now() - loadingStartTime.current
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime)

        setTimeout(() => {
            setSceneReadyState(true)
            setIsLoadingState(false)
            setProgress(1)
        }, remainingTime)
    }, [minLoadingTime])

    // Auto-progress loading
    useEffect(() => {
        if (isLoading && !sceneReady) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    const newProgress = Math.min(prev + 0.02, 0.9)
                    return newProgress
                })
            }, 50)

            return () => clearInterval(interval)
        }
    }, [isLoading, sceneReady])

    // Reset states when coming back into view
    useEffect(() => {
        if (isInView && !sceneReady) {
            setLoading(true)
        }
    }, [isInView, sceneReady, setLoading])

    return {
        containerRef,
        isInView,
        isLoading,
        shouldRender: shouldRender && isInView,
        setLoading,
        setSceneReady,
        progress,
        setProgress
    }
}

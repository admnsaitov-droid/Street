'use client'

import Image, { ImageProps } from "next/image"
import { useState, useCallback } from "react"

interface OptimizedImageProps extends ImageProps {
  critical?: boolean;
}

export const OptimizedImage = ({ 
  critical = false, 
  loading = "lazy",
  priority = false,
  ...props 
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false)

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
  }, [])

  return (
    <Image
      {...props}
      priority={critical || priority}
      loading={critical ? "eager" : loading}
      onLoad={handleLoad}
      style={{
        ...props.style,
        transition: isLoaded ? 'opacity 0.3s ease-in-out' : 'none',
        opacity: isLoaded ? 1 : 0.8,
      }}
    />
  )
}

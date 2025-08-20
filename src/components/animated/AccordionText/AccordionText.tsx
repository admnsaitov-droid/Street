'use client'

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { useSpring, useSprings, animated } from '@react-spring/web'
import { easings } from '@react-spring/web'
import styled from 'styled-components'

interface AccordionTextProps {
  children: string
  enabled?: boolean
  className?: string
  duration?: number
  stagger?: number
  textClassName?: string
}

interface Line {
  text: string
  width: number
}

export const AccordionText: React.FC<AccordionTextProps> = ({
  children,
  enabled = false,
  className,
  duration = 600,
  stagger = 150,
  textClassName,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [lines, setLines] = useState<Line[]>([])
  const [containerWidth, setContainerWidth] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)

  // Calculate lines based on container width
  const calculateLines = useCallback(() => {
    if (!measureRef.current || !containerRef.current) return

    const container = containerRef.current
    const measurer = measureRef.current
    const containerWidth = container.offsetWidth
    
    if (containerWidth === 0) return

    setContainerWidth(containerWidth)
    
    const words = children.split(' ')
    const newLines: Line[] = []
    let currentLine = ''
    let currentLineWidth = 0

    // Reset measurer
    measurer.textContent = ''
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      const testLine = currentLine ? `${currentLine} ${word}` : word
      
      // Measure the width of the test line
      measurer.textContent = testLine
      const testWidth = measurer.offsetWidth
      
      if (testWidth > containerWidth && currentLine) {
        // Current line is full, push it and start a new line
        newLines.push({
          text: currentLine,
          width: currentLineWidth
        })
        currentLine = word
        measurer.textContent = word
        currentLineWidth = measurer.offsetWidth
      } else {
        // Add word to current line
        currentLine = testLine
        currentLineWidth = testWidth
      }
    }
    
    // Don't forget the last line
    if (currentLine) {
      newLines.push({
        text: currentLine,
        width: currentLineWidth
      })
    }
    
    setLines(newLines)
    
    // Measure content height after lines are calculated
    setTimeout(() => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight)
      }
    }, 0)
  }, [children])

  // Recalculate lines when container size changes
  useEffect(() => {
    calculateLines()
  }, [calculateLines])

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      calculateLines()
    }

    const resizeObserver = new ResizeObserver(handleResize)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }
    
    return () => {
      resizeObserver.disconnect()
    }
  }, [calculateLines])

  // Container height animation
  const [containerSpring, containerApi] = useSpring(() => ({
    height: enabled ? contentHeight : 0,
    config: {
      duration,
      easing: easings.easeOutCubic,
    },
  }))

  // Create springs for each line
  const [lineSprings, lineApi] = useSprings(lines.length, (index) => ({
    opacity: enabled ? 1 : 0,
    transform: enabled ? 'translateY(0px)' : 'translateY(20px)',
    config: {
      duration,
      easing: easings.easeOutCubic,
    },
    delay: enabled ? index * stagger : 0,
  }))

  // Update springs when enabled state changes
  useEffect(() => {
    containerApi.start({
      height: enabled ? contentHeight : 0,
      config: {
        duration,
        easing: easings.easeOutCubic,
      },
    })
    
    lineApi.start((index) => ({
      opacity: enabled ? 1 : 0,
      transform: enabled ? 'translateY(0px)' : 'translateY(20px)',
      delay: enabled ? index * stagger : 0,
      config: {
        duration,
        easing: easings.easeOutCubic,
      },
    }))
  }, [enabled, lineApi, containerApi, stagger, duration, contentHeight])

  return (
    <StyledContainer ref={containerRef} className={className}>
      {/* Hidden measurer for calculating text width */}
      <StyledMeasurer 
        ref={measureRef}
        aria-hidden="true"
      />
      
      {/* Animated container with height animation */}
      <StyledAnimatedContainer style={containerSpring}>
        {/* Hidden content for measuring full height */}
        <StyledContentMeasurer ref={contentRef}>
          {lines.map((line, index) => (
            <div key={index} className={textClassName}>
              {line.text}
            </div>
          ))}
        </StyledContentMeasurer>
        
        {/* Animated lines */}
        <StyledLinesContainer>
          {lines.map((line, index) => (
            <StyledAnimatedLine
              key={index}
              style={lineSprings[index]}
              className={textClassName}
            >
              {line.text}
            </StyledAnimatedLine>
          ))}
        </StyledLinesContainer>
      </StyledAnimatedContainer>
      
      {/* SEO text (hidden) */}
      <StyledSeoText aria-hidden="true">
        {children}
      </StyledSeoText>
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  position: relative;
  width: 100%;
`

const StyledMeasurer = styled.div`
  position: absolute;
  visibility: hidden;
  height: auto;
  width: auto;
  white-space: nowrap;
  font-family: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
`

const StyledAnimatedContainer = styled(animated.div)`
  overflow: hidden;
  will-change: height;
`

const StyledContentMeasurer = styled.div`
  position: absolute;
  visibility: hidden;
  width: 100%;
  top: 0;
  left: 0;
  z-index: -1;
`

const StyledLinesContainer = styled.div`
  position: relative;
`

const StyledAnimatedLine = styled(animated.div)`
  margin-bottom: 0;
  will-change: opacity, transform;
`

const StyledSeoText = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  pointer-events: none;
  user-select: text;
`
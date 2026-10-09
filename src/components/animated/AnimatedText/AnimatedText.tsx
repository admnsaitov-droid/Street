'use client'

import { NextPage } from "next"

import { createElement, memo } from "react";
import type { EngineProps } from "@/components/Text/TextEngine";
import { config } from "@react-spring/web";

import TextEngine from "@/components/Text/TextEngine";
import { useRobot } from "@/components/Robot/Robot";

interface Props {
    children: any
    duration?: number
    stagger?: number
}
export const AnimatedText: NextPage<Props & EngineProps> = memo(({
    children,
    enabled = true,
    duration = 1200,
    stagger = 130,
    ...props
}) => {
    const robot = useRobot()
    // Robot form: the text at rest — no line split, nothing to reveal.
    if (robot) {
        return createElement(props.tag || 'span', { className: props.className, style: props.style }, children)
    }
    return (
        <TextEngine
            enabled={enabled}
            lineIn={{y: 0}} //opacity 1
            lineOut={{y: 100}} //opacity 0
            lineStagger={stagger}
            lineConfig={config.slow}
            overflow
            showSeoText={false}
            seo={false}
            columnGap={0.2}
            mode="once"
            {...props}
        >
            { children }
        </TextEngine>
    )
})

AnimatedText.displayName = 'AnimatedText'
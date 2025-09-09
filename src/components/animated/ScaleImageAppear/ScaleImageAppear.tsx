import { animated, easings, useInView, useSpring } from "@react-spring/web"
import styled from "styled-components"

interface ScaleImageAppearProps {
    children: React.ReactNode
    className?: string
    delay?: number
}

export const ScaleImageAppear = ({ children, className, delay }: ScaleImageAppearProps) => {

    const [ref, inView] = useInView({
        once: true,
    })

    const springAppear = useSpring({
        scale: inView ? 1 : 0.94,
        config: {
            duration: 600,
            easing: easings.easeOutQuad,
        },
        delay: delay,
    })

    return (
        <StyledScaleImageAppear ref={ref} className={className}>
            <StyledChildrenWrapper style={springAppear}>
                {children}
            </StyledChildrenWrapper>
        </StyledScaleImageAppear>
    )
}

const StyledScaleImageAppear = styled(animated.div)`
`

const StyledChildrenWrapper = styled(animated.div)`
    width: 100%;
    height: 100%;
`
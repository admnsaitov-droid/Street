import { colors } from "@/styles"
import { animated, useInView, useSpring } from "@react-spring/web"
import styled from "styled-components"

interface AnimatedDividerProps {
    duration?: number
}

export const AnimatedDivider = ({ duration = 600 }: AnimatedDividerProps) => {
    const [ref, inView] = useInView()

    const appearSpring = useSpring({
        width: inView ? '100%' : '0%',
        config: { duration: duration }
    })

    return (
        <StyledDivider ref={ref} style={appearSpring}>
        </StyledDivider>
    )
}

const StyledDivider = styled(animated.div)`
    width: 100%;
    height: 100%;
`
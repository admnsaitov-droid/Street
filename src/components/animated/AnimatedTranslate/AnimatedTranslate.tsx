import { animated, easings, useInView, useSpring } from "@react-spring/web"
import styled from "styled-components"
import { useRobot } from "@/components/Robot/Robot"

export const AnimatedTranslate = ({children, className, delay}: {children: React.ReactNode, className?: string, delay?: number}) => {
    const robot = useRobot()

    const [ref, inView] = useInView({
        //@ts-expect-error
        threshold: 0.9,
        once: true,
    })

    const appearSpring = useSpring({
        y: inView || robot ? '0px' : '20px',
        opacity: inView || robot ? 1 : 0,
        delay: delay,
        config: {
            duration: 800,
            easing: easings.easeInOutCubic,
        }
    })

    return(
        <StyledAnimatedTranslate ref={ref} className={className} style={appearSpring}>
            {children}
        </StyledAnimatedTranslate>
    )
}

const StyledAnimatedTranslate = styled(animated.div)`

`
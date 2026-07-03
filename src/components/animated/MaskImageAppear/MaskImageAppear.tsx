import { animated, easings, useInView, useSpring } from "@react-spring/web"
import styled from "styled-components"

export const MaskImageAppear = ({ children, className, delay, duration, enabled=true }: { children: React.ReactNode, className?: string, delay?: number, duration?: number, enabled?: boolean }) => {

    const [ref, inView] = useInView({
        once: true,
    })

    const springAppear = useSpring({
        y: inView || !enabled ? '0%' : '-100%',
        config: {
            duration: duration || 900,
            easing: easings.easeOutQuad,
        },
        delay: delay || 0,
    })

    const springAddition = useSpring({
        y: inView || !enabled ? '0%' : '50%',
        config: {
            duration: duration || 900,
            easing: easings.easeOutQuad,
        },
    })

    return (
        <StyledMaskImageAppear ref={ref} className={className}>
            <StyledChildrenWrapper style={springAppear}>
                <StyledAdditionWrapper style={springAddition}>
                    {children}
                </StyledAdditionWrapper>
            </StyledChildrenWrapper>
        </StyledMaskImageAppear>
    )
}

const StyledMaskImageAppear = styled.div`
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
`

const StyledChildrenWrapper = styled(animated.div)`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
`

const StyledAdditionWrapper = styled(animated.div)`
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
`
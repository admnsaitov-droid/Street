import { animated, easings, useInView, useSpring } from "@react-spring/web"
import styled from "styled-components"

interface LineAppearProps {
    children: React.ReactNode
}

export const LineAppear = ({ children }: LineAppearProps) => {
    const [ref, inView] = useInView()

    const appearSpring = useSpring({
        y: inView ? '0px' : '-30px',
        config: { duration: 600, easing: easings.easeInOutQuad },
    })

    return (
        <StyledLineAppear ref={ref}>
            {/* <animated.div style={{...appearSpring, width: '100%', height: '100%'}}> */}
                {children}
            {/* </animated.div> */}
        </StyledLineAppear>
    )
}

const StyledLineAppear = styled.div`
    width: 100%;
    // overflow: hidden;
    position: relative;
`
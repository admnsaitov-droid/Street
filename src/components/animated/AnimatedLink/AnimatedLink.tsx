import { colors } from "@/styles"
import { useState } from "react"
import { animated, easings, useSpring } from "@react-spring/web"
import styled from "styled-components"
import { AnimLink } from "@/layouts/AnimatedRouterLayout/AnimatedRouterLayout"

const StyledLink = styled.span`
    position: relative;
    overflow: hidden;
`
const StyledLinkContainer = styled(animated.span)`
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    transition: .3s transform ease-out, .3s opacity ease-out;
`
const StyledHiddenContainer = styled.span`
    opacity: 0;
`

const StyledHiddenlink = styled(AnimLink)`
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
`

export default function AnimatedLink({children ,style, href, ariaLabel}: {children: any, style?: any, href?: string, ariaLabel?: string}) {
    
    const [isHovered, setIsHovered] = useState<boolean>(false)

    const firstSpring = useSpring({
        opacity: isHovered ? 0 : 1,
        transform: `translateY(${isHovered ? '-130%' : `0%`}) rotate(${isHovered ? '10deg' : '0deg'})`,
        config: {duration: 100, easing: easings.easeInOutCubic}
    })

    const secondSpring = useSpring({
        opacity: !isHovered ? 0 : 1,
        transform: `translateY(${!isHovered ? '130%' : `0%`}) rotate(${!isHovered ? '10deg' : '0deg'})`,
        config: {duration: 100, easing: easings.easeInOutCubic}
    })

    // Extract accessible text from children
    const getAccessibleText = () => {
        if (ariaLabel) return ariaLabel;
        if (typeof children === 'string') return children;
        if (children?.props?.children) return children.props.children;
        return 'Link';
    };

    return(
        <span 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{cursor: 'pointer', ...style, position: 'relative'}}
        >
            <StyledLink>
                <StyledHiddenContainer>
                    <span>{ children }</span>   
                </StyledHiddenContainer>
                <StyledLinkContainer style={{...firstSpring, color: colors.black100}}>
                    <span>{ children }</span>
                </StyledLinkContainer>
                <StyledLinkContainer style={{ ...secondSpring, color: colors.black100 }}>
                    <span>{ children }</span>
                </StyledLinkContainer>
            </StyledLink>
            {href && <StyledHiddenlink href={href} aria-label={getAccessibleText()}/>}
        </span>
    )
}
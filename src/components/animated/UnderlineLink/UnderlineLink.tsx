import styled from 'styled-components';
import {useState, useEffect} from 'react'
import { media, rm } from '@/styles';
import { colors } from '@/styles';
import { useSpring, animated, easings } from '@react-spring/web'
import { fontGolosText } from '@/styles/fonts';
import { AnimLink } from '@/layouts/AnimatedRouterLayout/AnimatedRouterLayout';
import { usePathname } from 'next/navigation';

const StyledContainer = styled.span`
    position: relative;
    overflow: hidden;
    padding-bottom: 2px;
    cursor: pointer;
    width: fit-content;
    ${fontGolosText(500)};
    font-size: ${rm(20)};

    ${media.lg`
        font-size: ${rm(14)};
    `}

    &:hover span {
        opacity: 1;
    }
`

const StyledLink = styled(AnimLink)`
    position: absolute;
    z-index: 3;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
`

const StyledLine = styled(animated.span)`
    position: absolute;
    bottom: ${rm(3)};
    left: 0;
    height: 1px;
    width: 100%;
    transition: .3s transform ease-out;
    opacity: 1;

    > * {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background: ${colors.black100};
    }

    > :first-child {
        left: 0;
    }

    > :last-child {
        left: 150%;
    }
`

export default function UnderlineLink({text, onClick, href, className, lineColor}: { text: string, onClick?: any, href?: string, className?: string, lineColor?: string}) {
    const [isHovered, setIsHovered] = useState<boolean>(false)
    // const pathname = usePathname();

    // useEffect(() => {
    //     // Check if we have a hash in the URL and we're on the correct page
    //     const hash = window.location.hash.slice(1); // Remove the # symbol
    //     if (hash && pathname === href?.split('#')[0]) {
    //         // Small delay to ensure the page has rendered
    //         setTimeout(() => {
    //             scrollToClients(hash);
    //         }, 100);
    //     }
    // }, [pathname]);

    const lineAnimation = useSpring({ 
        x: isHovered ? '0%' : '-150%',
        config: {duration: 100, easing: easings.easeInOutCubic},
    });

    return(
        <StyledContainer onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={onClick ? onClick : () => {}} className={className}>
            { text }
            {href ? 
                <StyledLink 
                href={href}
                aria-label={`Link to ${text}`}
                rel="noopener noreferrer"
                ></StyledLink>
                :
                <></>
            }
            <StyledLine style={lineAnimation}><span style={{backgroundColor: lineColor}}></span><span style={{backgroundColor: lineColor}}></span></StyledLine>
        </StyledContainer>
    )
}
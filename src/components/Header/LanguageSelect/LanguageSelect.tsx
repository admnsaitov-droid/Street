import { media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useLocale } from 'next-intl'
// import { Link } from '@/navigation'
import styled from "styled-components"

interface Language {
    id: number
    localeCode: string
    localeName: string
}

interface LanguageSelectProps {
    languages: Language[]
}

export const LanguageSelect = ({ languages }: LanguageSelectProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const currentLocale = useLocale()
    const dropdownRef = useRef<HTMLDivElement>(null)
    const dropdownContentRef = useRef<HTMLDivElement>(null)

    // Find current language data
    const currentLanguage = languages?.find(lang => lang.localeCode === currentLocale) || languages?.[0]

    // Detect mobile device
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window)
        }
        
        checkIsMobile()
        window.addEventListener('resize', checkIsMobile)
        
        return () => {
            window.removeEventListener('resize', checkIsMobile)
        }
    }, [])

    // Close dropdown when clicking outside (only for mobile)
    useEffect(() => {
        if (!isMobile) return

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isMobile])

    const handleLanguageChange = (localeCode: string) => {
        console.log('🔥 LANGUAGE SWITCH STARTED');
        console.log('📍 Current state:', {
            currentLocale,
            newLocale: localeCode,
            pathname,
            window_location: typeof window !== 'undefined' ? window.location.href : 'N/A',
            window_pathname: typeof window !== 'undefined' ? window.location.pathname : 'N/A'
        });
        
        // Debug the replace operation step by step
        console.log('🔍 Replace operation details:', {
            pathname,
            currentLocale,
            searchPattern: `/${currentLocale}`,
            pathnameStartsWith: pathname.startsWith(`/${currentLocale}`),
            pathnameIncludes: pathname.includes(`/${currentLocale}`),
            replaceResult: pathname.replace(`/${currentLocale}`, `/${localeCode}`)
        });
        
        // Try multiple approaches to build the new path
        const approach1 = pathname.replace(`/${currentLocale}`, `/${localeCode}`);
        const approach2 = `/${localeCode}${pathname.substring(currentLocale.length + 1)}`;
        const approach3 = pathname.split('/').map((segment, index) => 
            index === 1 && segment === currentLocale ? localeCode : segment
        ).join('/');
        
        console.log('🛠️ Different approaches to path building:', {
            approach1_replace: approach1,
            approach2_substring: approach2,
            approach3_split: approach3,
            pathSegments: pathname.split('/'),
            currentLocaleIndex: pathname.split('/').indexOf(currentLocale)
        });
        
        // Use the most explicit approach
        const newPath = approach3;
        
        console.log('🚀 Final newPath chosen:', newPath);
        console.log('🌐 About to set window.location.href to:', newPath);
        
        // Use window.location with FULL absolute URL to bypass middleware
        if (typeof window !== 'undefined') {
            // Build full absolute URL to avoid middleware interception
            const fullUrl = `${window.location.protocol}//${window.location.host}${newPath}`;
            
            console.log('🔄 Before redirect - current URL:', window.location.href);
            console.log('🌐 Setting full absolute URL:', fullUrl);
            
            window.location.href = fullUrl;
            console.log('🔄 After setting href (may not log due to redirect)');
        }
        
        setIsOpen(false);
    }

    const toggleDropdown = () => {
        // Only toggle on click for mobile devices
        if (isMobile) {
            if (isOpen) {
                closeDropdown()
            } else {
                openDropdown()
            }
        }
    }

    const handleMouseEnter = () => {
        // Only open on hover for desktop devices
        if (!isMobile) {
            openDropdown()
        }
    }

    const handleMouseLeave = () => {
        // Only close on mouse leave for desktop devices
        if (!isMobile) {
            closeDropdown()
        }
    }

    const openDropdown = () => {
        if (isOpen) return
        
        setIsOpen(true)
        setIsAnimating(true)
        
        // Force reflow to ensure the element is rendered
        requestAnimationFrame(() => {
            if (dropdownContentRef.current) {
                const height = dropdownContentRef.current.scrollHeight
                dropdownContentRef.current.style.height = `${height}px`
            }
        })
    }

    const closeDropdown = () => {
        if (!isOpen) return
        
        if (dropdownContentRef.current) {
            dropdownContentRef.current.style.height = '0px'
        }
        
        // Wait for animation to complete before hiding
        setTimeout(() => {
            setIsOpen(false)
            setIsAnimating(false)
        }, 200) // Match the CSS transition duration
    }

    if (!languages || languages.length === 0) {
        return null
    }

    return (
        <StyledLanguageSelect
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <StyledActiveLanguage onClick={toggleDropdown} $isOpen={isOpen}>
                <span>{currentLanguage?.localeName || 'EN'}</span>
                <svg width="6" height="4" viewBox="0 0 6 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.26516 0H0.733536C0.309618 0 0.0780396 0.494429 0.349426 0.820092L2.61524 3.53907C2.81514 3.77894 3.18356 3.77894 3.38346 3.53907L5.64927 0.820092C5.92066 0.494429 5.68908 0 5.26516 0Z" fill="black"/>
                </svg>
            </StyledActiveLanguage>
            
            <StyledDropdown 
                ref={dropdownContentRef}
                $isOpen={isOpen}
                $isAnimating={isAnimating}
            >
                {languages.map((language) => (
                    <StyledLanguageOption
                        key={language.id}
                        onClick={() => handleLanguageChange(language.localeCode)}
                        $isActive={language.localeCode === currentLocale}
                    >
                        {language.localeName}
                    </StyledLanguageOption>
                ))}
            </StyledDropdown>
        </StyledLanguageSelect>
    )
}

const StyledLanguageSelect = styled.div`
    position: relative;
`

const StyledActiveLanguage = styled.div<{ $isOpen: boolean }>`
    position: relative;
    padding: ${rm(14)} ${rm(0)} ${rm(14)} ${rm(0)};
    width: ${rm(68)};
    gap: ${rm(4.5)};
    height: 100%;
    cursor: pointer;
    transition: opacity 0.2s ease;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        opacity: 0.7;
    }

    span {
        font-size: ${rm(16)};
        ${fontGolosText(400)};
        line-height: 130%;

        ${media.lg`
            font-size: ${rm(14)};    
        `}
    }

    svg {
        width: ${rm(7)};
        height: ${rm(4)};
        transition: transform 0.2s ease;
        transform: ${({ $isOpen }) => $isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
    }
`

const StyledDropdown = styled.div<{ $isOpen: boolean; $isAnimating: boolean }>`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: ${rm(4)};
    box-shadow: 0 ${rm(4)} ${rm(8)} rgba(0, 0, 0, 0.1);
    z-index: 100;
    overflow: hidden;
    height: 0;
    transition: height 0.2s ease-in-out;
    opacity: ${({ $isOpen }) => $isOpen ? 1 : 0};
    visibility: ${({ $isOpen }) => $isOpen ? 'visible' : 'hidden'};
    
    ${({ $isOpen, $isAnimating }) => $isOpen && $isAnimating && `
        height: auto;
    `}

    ${media.xsm`
        top: auto;
        bottom: 100%;
        box-shadow: 0 -${rm(4)} ${rm(8)} rgba(0, 0, 0, 0.1);
    `}
`

const StyledLanguageOption = styled.div<{ $isActive: boolean }>`
    padding: ${rm(12)} ${rm(16)};
    cursor: pointer !important;
    font-size: ${rm(16)};
    ${fontGolosText(400)};
    line-height: 130%;
    background: ${({ $isActive }) => $isActive ? '#f5f5f5' : 'white'};
    position: relative;
    z-index: 100;
    
    &:hover {
        background: #f0f0f0;
    }

    &:not(:last-child) {
        border-bottom: 1px solid #e0e0e0;
    }

    ${media.lg`
        font-size: ${rm(14)};
        padding: ${rm(10)} ${rm(12)};
    `}
`
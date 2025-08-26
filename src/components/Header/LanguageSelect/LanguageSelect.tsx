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
    const router = useRouter()
    const pathname = usePathname()
    const currentLocale = useLocale()
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Find current language data
    const currentLanguage = languages?.find(lang => lang.localeCode === currentLocale) || languages?.[0]

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleLanguageChange = (localeCode: string) => {
        // Dead simple: just replace /currentLocale with /newLocale
        const newPath = pathname.replace(`/${currentLocale}`, `/${localeCode}`);
        
        console.log('Language switch:', { 
            currentLocale, 
            newLocale: localeCode, 
            originalPath: pathname,
            newPath 
        });
        
        router.push(newPath);
        setIsOpen(false);
    }

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }

    if (!languages || languages.length === 0) {
        return null
    }

    return (
        <StyledLanguageSelect ref={dropdownRef}>
            <StyledActiveLanguage onClick={toggleDropdown} $isOpen={isOpen}>
                <span>{currentLanguage?.localeName || 'EN'}</span>
                <svg width="6" height="4" viewBox="0 0 6 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.26516 0H0.733536C0.309618 0 0.0780396 0.494429 0.349426 0.820092L2.61524 3.53907C2.81514 3.77894 3.18356 3.77894 3.38346 3.53907L5.64927 0.820092C5.92066 0.494429 5.68908 0 5.26516 0Z" fill="black"/>
                </svg>
            </StyledActiveLanguage>
            
            {isOpen && (
                <StyledDropdown>
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
            )}
        </StyledLanguageSelect>
    )
}

const StyledLanguageSelect = styled.div`
    position: relative;
`

const StyledActiveLanguage = styled.div<{ $isOpen: boolean }>`
    position: relative;
    padding: ${rm(14)} ${rm(8)} ${rm(14)} ${rm(12)};
    display: flex;
    align-items: center;
    gap: ${rm(4.5)};
    height: 100%;
    cursor: pointer;
    transition: opacity 0.2s ease;

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

const StyledDropdown = styled.div`
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
`

const StyledLanguageOption = styled.div<{ $isActive: boolean }>`
    padding: ${rm(12)} ${rm(16)};
    cursor: pointer;
    font-size: ${rm(16)};
    ${fontGolosText(400)};
    line-height: 130%;
    background: ${({ $isActive }) => $isActive ? '#f5f5f5' : 'white'};
    
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
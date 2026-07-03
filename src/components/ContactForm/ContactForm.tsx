'use client'
import styled from "styled-components"
import { colors } from "@/styles/colors"
import { useEffect, useState, useRef } from "react"
import { useLocale } from "next-intl"
import { media, rm } from "@/styles"
import { fontGolosText, fontSageGrotesk } from "@/styles/fonts"
import useLoadingStore from "@/store/store"
import { SimpleInput } from "../Ui/Inputs/SimpleInput"
import { SimpleTextarea } from "../Ui/Inputs/SimpleTextarea"
import contactFormTranslations from "./contactFormTranslations"
import { AnimLink } from "@/layouts/AnimatedRouterLayout/AnimatedRouterLayout"
import { SimpleCheckbox } from "../Ui/checkbox/SimpleCheckbox"
import { BlueButton } from "../Ui/buttons/BlueButton"
import { usePathname, useSearchParams } from "next/navigation"
import UnderlineLink from "../animated/UnderlineLink/UnderlineLink"
import { useWindowWidth } from "@react-hook/window-size"
import AnimatedGrid from "@/components/animated/AnimatedContent"
import { LineAppear } from "./components/LineAppear"
import { scrollTo } from "@/utils/scrollTo"

export const ContactForm = () => {
    const locale = useLocale()
    const hardcoded = contactFormTranslations[locale] ?? contactFormTranslations.en
    const [data, setData] = useState<any>(hardcoded)
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const width = useWindowWidth()

    const setIsSubmitSuccessful = useLoadingStore((state: any) => (state.setIsSubmitSuccessful))
    const setIsSubmitError = useLoadingStore((state: any) => (state.setIsSubmitError))
    const [isSending, setIsSending] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        subject: '',
        body: '',
        policy: false
    })
    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        subject: '',
        body: '',
        policy: false
    })

    // Refs for form fields to enable scrolling to errors
    const fullNameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const phoneNumberRef = useRef<HTMLInputElement>(null)
    const subjectRef = useRef<HTMLInputElement>(null)
    const bodyRef = useRef<HTMLTextAreaElement>(null)
    const policyRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setData(contactFormTranslations[locale] ?? contactFormTranslations.en)
    }, [locale])

    const validateForm = () => {
        const newErrors = {
            fullName: '',
            email: '',
            phoneNumber: '',
            subject: '',
            body: '',
            policy: false
        }
        let isValid = true
        let firstErrorRef = null

        if (!formData.fullName.trim()) {
            newErrors.fullName = data?.data?.contactForm?.nameErrorText
            isValid = false
            if (!firstErrorRef) firstErrorRef = fullNameRef
        }

        if (!formData.email.trim()) {
            newErrors.email = data?.data?.contactForm?.mailErrorText
            isValid = false
            if (!firstErrorRef) firstErrorRef = emailRef
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = data?.data?.contactForm?.mailErrorText
            isValid = false
            if (!firstErrorRef) firstErrorRef = emailRef
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = data?.data?.contactForm?.phoneErrorMessage
            isValid = false
            if (!firstErrorRef) firstErrorRef = phoneNumberRef
        } else {
            // Check if phone number contains only numbers and has more than 6 digits
            const phoneNumbers = formData.phoneNumber.replace(/\D/g, '') // Remove all non-digits
            if (phoneNumbers.length <= 6) {
                newErrors.phoneNumber = data?.data?.contactForm?.phoneErrorMessage
                isValid = false
                if (!firstErrorRef) firstErrorRef = phoneNumberRef
            }
        }

        if (!formData.subject.trim()) {
            newErrors.subject = data?.data?.contactForm?.subjectErrorText
            isValid = false
            if (!firstErrorRef) firstErrorRef = subjectRef
        }

        if (!formData.body.trim()) {
            newErrors.body = data?.data?.contactForm?.messageErrorText
            isValid = false
            if (!firstErrorRef) firstErrorRef = bodyRef
        }

        if (!formData.policy) {
            newErrors.policy = true
            isValid = false
            if (!firstErrorRef) firstErrorRef = policyRef
        }

        setErrors(newErrors)
        
        // Scroll to first error if validation fails
        if (!isValid && firstErrorRef?.current) {
            setTimeout(() => {
                firstErrorRef.current?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                })
            }, 100)
        }
        
        return isValid
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setIsSending(true);
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const languages = navigator.languages?.join(', ') || navigator.language || '';
            const utmParams = {
                utm_source: searchParams.get('utm_source') || undefined,
                utm_medium: searchParams.get('utm_medium') || undefined,
                utm_campaign: searchParams.get('utm_campaign') || undefined,
                utm_term: searchParams.get('utm_term') || undefined,
                utm_content: searchParams.get('utm_content') || undefined,
            };
            const response = await fetch('/api/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, timezone, languages, ...utmParams }),
            });

            const data = await response.json();

            if (data.success) {
                setIsSubmitSuccessful(true);
                setIsSending(false);
                setFormData({
                    fullName: '',
                    email: '',
                    phoneNumber: '',
                    subject: '',
                    body: '',
                    policy: false
                });
                setErrors({
                    fullName: '',
                    email: '',
                    phoneNumber: '',
                    subject: '',
                    body: '',
                    policy: false
                });
            } else {
                setIsSubmitError(true);
                throw new Error(data.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);
            setIsSubmitError(true);
        } finally {
            setTimeout(() => {
                setIsSending(false);
            }, 1500);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        // Clear error when user starts typing
        if (errors[e.target.name as keyof typeof errors]) {
            setErrors({ ...errors, [e.target.name]: '' })
        }
    }

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        // Clear error when user starts typing
        if (errors[e.target.name as keyof typeof errors]) {
            setErrors({ ...errors, [e.target.name]: '' })
        }
    }

    return (    
        !pathname.includes('contact') ? <StyledContactForm>
            <StyledTitleContainer>
                <StyledTitleFirst>{data?.data?.title?.textFirst}</StyledTitleFirst>
                <StyledTitleSecond>{data?.data?.title?.textSecond}</StyledTitleSecond>
            </StyledTitleContainer>
            <StyledNote>{data?.data?.note}</StyledNote>
            <StyledForm onSubmit={handleSubmit}>
                {width > 576 && <>
                    <LineAppear>
                        <StyledSection>
                            <StyledFormText>{data?.data?.contactForm?.nameText}</StyledFormText>
                            <StyledInputWrapper>
                                <SimpleInput ref={fullNameRef} label={data?.data?.contactForm?.namePlaceholder} name="fullName" value={formData.fullName} onChange={handleInputChange} error={errors.fullName} />
                            </StyledInputWrapper>
                        </StyledSection>
                    </LineAppear>
                    <LineAppear>
                        <StyledSection> 
                            <StyledFormText>{data?.data?.contactForm?.mailText}</StyledFormText>
                            <StyledInputWrapper>
                                <SimpleInput ref={emailRef} label={data?.data?.contactForm?.mailPlaceholder} name="email" value={formData.email} onChange={handleInputChange} error={errors.email} />
                            </StyledInputWrapper>
                            <StyledFormText>{data?.data?.contactForm?.phoneText}</StyledFormText>
                            <StyledInputWrapper>
                                <SimpleInput ref={phoneNumberRef} label={data?.data?.contactForm?.phonePlaceholder} name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} error={errors.phoneNumber} />
                            </StyledInputWrapper>
                        </StyledSection>
                    </LineAppear>
                    <LineAppear>
                        <StyledSection>
                            <StyledFormText>{data?.data?.contactForm?.subjectText}</StyledFormText>
                            <StyledInputWrapper>
                                <SimpleInput ref={subjectRef} label={data?.data?.contactForm?.subjectPlaceholder} name="subject" value={formData.subject} onChange={handleInputChange} error={errors.subject} />
                            </StyledInputWrapper>
                        </StyledSection>
                    </LineAppear>
                    <LineAppear>
                        <StyledSection>
                            <StyledFormText>{data?.data?.contactForm?.questionText}</StyledFormText>
                            <StyledInputWrapper>
                                <SimpleTextarea ref={bodyRef} label={data?.data?.contactForm?.questionPlaceholder} name="body" value={formData.body} onChange={handleTextareaChange} error={errors.body} />
                            </StyledInputWrapper>
                        </StyledSection>
                    </LineAppear>
                </>}
                {width <= 576 && <>
                    <LineAppear>
                        <StyledSection>
                            <StyledFormText>{data?.data?.contactForm?.nameText}</StyledFormText>
                            <StyledInputWrapper>
                                <SimpleInput ref={fullNameRef} label={data?.data?.contactForm?.namePlaceholder} name="fullName" value={formData.fullName} onChange={handleInputChange} error={errors.fullName} />
                            </StyledInputWrapper>
                        </StyledSection>
                    </LineAppear>
                    <LineAppear>
                        <StyledSection> 
                            <StyledFormText>{data?.data?.contactForm?.mailText}</StyledFormText>
                            <StyledInputWrapper>
                                <SimpleInput ref={emailRef} label={data?.data?.contactForm?.mailPlaceholder} name="email" value={formData.email} onChange={handleInputChange} error={errors.email} />
                            </StyledInputWrapper>
                        </StyledSection>
                    </LineAppear>
                    <LineAppear>
                        <StyledSection>
                            <StyledFormText>{data?.data?.contactForm?.phoneText}</StyledFormText>
                            <StyledInputWrapper>
                                <SimpleInput ref={phoneNumberRef} label={data?.data?.contactForm?.phonePlaceholder} name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} error={errors.phoneNumber} />
                            </StyledInputWrapper>
                        </StyledSection>
                    </LineAppear>
                    <LineAppear>
                        <StyledSection>
                            <StyledFormText>{data?.data?.contactForm?.subjectText}</StyledFormText>
                            <StyledInputWrapper>
                                <SimpleInput ref={subjectRef} label={data?.data?.contactForm?.subjectPlaceholder} name="subject" value={formData.subject} onChange={handleInputChange} error={errors.subject} />
                            </StyledInputWrapper>
                        </StyledSection>
                    </LineAppear>
                    <LineAppear>
                        <StyledSection>
                            <StyledFormText>{data?.data?.contactForm?.questionText}</StyledFormText>
                            <StyledInputWrapper>
                                <SimpleTextarea ref={bodyRef} label={data?.data?.contactForm?.questionPlaceholder} name="body" value={formData.body} onChange={handleTextareaChange} error={errors.body} />
                            </StyledInputWrapper>
                        </StyledSection>
                    </LineAppear>
                </>}
                <StyledBottom>
                    <div ref={policyRef} className="left" onClick={() => {
                        setFormData({ ...formData, policy: !formData.policy })
                        // Clear error when user toggles checkbox
                        if (errors.policy) {
                            setErrors({ ...errors, policy: false })
                        }
                    }}>
                        <SimpleCheckbox
                            checked={formData.policy}
                            onChange={() => {
                                setFormData({ ...formData, policy: !formData.policy })
                                // Clear error when user toggles checkbox
                                if (errors.policy) {
                                    setErrors({ ...errors, policy: false })
                                }
                            }}
                        />
                        <div className="texts">
                            <span>{data?.data?.policyText} <UnderlineLink href='/privacy-policy' text={data?.data?.contactForm?.policyText} lineColor={colors.blue} /></span>
                        </div>
                        {errors.policy && <StyledError>{data?.data?.contactForm?.policyErrorText}</StyledError>}
                    </div>
                    <BlueButton 
                        isSvg={true} 
                        submit={true} 
                        disabled={isSending}
                        className="button"
                    >
                        {isSending ? data?.data?.button?.text : data?.data?.button?.text}
                    </BlueButton>
                </StyledBottom>
            </StyledForm>
        </StyledContactForm> : null
    )
}

const StyledContactForm = styled.div`
    width: 100%;
    padding: ${rm(150)} ${rm(50)};
    background-color: #F8F9FC;

    ${media.md`
        padding: ${rm(150)} ${rm(25)};
    `}

    ${media.xsm`
        padding: ${rm(70)} ${rm(16)};
    `}


    .button{
        ${media.xsm`
            width: 100%;
        `}
    }
`

const StyledTitleContainer = styled.div`
    margin-bottom: ${rm(20)};
    line-height: 90%;
    letter-spacing: -0.01em;
    font-size: ${rm(48)};
    text-transform: uppercase;
    display: flex;
    gap: ${rm(12)};
    flex-wrap: wrap;

    ${media.lg`
        font-size: ${rm(40)};
    `}

    ${media.xsm`
        font-size: ${rm(32)};
        margin-bottom: ${rm(15)};
    `}
`

const StyledTitleFirst = styled.div`
    color: ${colors.black100};
    font-family: var(--font-golos-text);
    font-optical-sizing: auto;
    font-weight: 600;
    font-style: normal;
    display: block;
    margin-bottom: 0;
`

const StyledTitleSecond = styled.div`
    color: ${colors.red};
    font-family: var(--font-sage-grotesk);
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    line-height: 105%;
    display: block;
    margin-top: 0;
`

const StyledNote = styled.p`
    ${fontGolosText(400)}
    color: ${colors.gray};
    font-size: ${rm(20)};
    line-height: 130%;
    letter-spacing: -0.01em;
    margin-bottom: ${rm(50)};
    width: ${rm(530)};

    ${media.lg`
        font-size: ${rm(16)};
        width: ${rm(440)};
    `}

    ${media.md`
        width: ${rm(354)};
    `}

    ${media.xsm`
        font-size: ${rm(14)};
        width: ${rm(292)};
        margin-bottom: ${rm(30)};
    `}
`

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${rm(40)};

    ${media.xsm`
        gap: ${rm(30)};
    `}
`

const StyledFormText = styled.div`
    font-size: ${rm(30)};
    line-height: 110%;
    letter-spacing: -0.01em;
    ${fontGolosText(400)}
    color: ${colors.black100};

    ${media.lg`
        font-size: ${rm(24)};
    `}

    ${media.md`
        font-size: ${rm(18)};
    `}

    ${media.xsm`
        font-size: ${rm(16)};
    `}
`

const StyledSection = styled.div`
    display: flex;
    gap: ${rm(20)};

    ${media.md`
        gap: ${rm(10)};
    `}

    ${media.xsm`
        flex-direction: column;
        gap: ${rm(20)};
    `}
`

const StyledInputWrapper = styled.div`
    flex: 1;
`

export const StyledBottom = styled.div`
    display: flex;
    align-items: center;
    margin-top: ${rm(50)};
    justify-content: space-between;
    cursor: pointer;

    ${media.xsm`
        margin-top: ${rm(10)};
        flex-direction: column;
        gap: ${rm(30)};
        align-items: flex-start;
    `}

    .left{
        display: flex;
        align-items: center;
        gap: ${rm(10)};
        flex: 1;

        ${media.xsm`
            gap: ${rm(5)};
            flex: 1;
        `}

        .texts{
            ${fontGolosText(400)};
            color: ${colors.gray};
            font-size: ${rm(20)};
            line-height: 130%;
            display: flex;
            flex-wrap: wrap;
            width: ${rm(600)};

            ${media.lg`
                width: ${rm(360)};    
            `}

            ${media.xsm`
                width: 100% !important;    
            `}

            >span{
                margin-left: ${rm(5)};

                span{
                    color: ${colors.blue};
                    margin-bottom: ${rm(-8)};

                    ${media.xsm`
                        margin-bottom: ${rm(-6)};
                    `}
                }
            }

            ${media.lg`
                font-size: ${rm(16)};
            `}

            ${media.xsm`
                font-size: ${rm(14)};
                display: flex;
                flex-wrap: wrap;
                width: ${rm(200)};
            `}
        }
    }
`

const StyledError = styled.div`
    color: ${colors.red};
    font-size: ${rm(14)};
    ${fontGolosText(400)};
    margin-top: ${rm(5)};

    ${media.xsm`
        position: absolute;
        margin-top: ${rm(60)};
    `}
`
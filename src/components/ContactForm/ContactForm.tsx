'use client'
import styled from "styled-components"
import { colors } from "@/styles/colors"
import { useEffect, useState } from "react"
import { useLocale } from "next-intl"
import { getStrapiData } from "@/utils/strapi"
import { media, rm } from "@/styles"
import { fontGolosText, fontSageGrotesk } from "@/styles/fonts"
import useLoadingStore from "@/store/store"
import { SimpleInput } from "../Ui/Inputs/SimpleInput"
import { SimpleTextarea } from "../Ui/Inputs/SimpleTextarea"
import { AnimLink } from "@/layouts/AnimatedRouterLayout/AnimatedRouterLayout"
import { SimpleCheckbox } from "../Ui/checkbox/SimpleCheckbox"
import { BlueButton } from "../Ui/buttons/BlueButton"
import { usePathname } from "next/navigation"
import UnderlineLink from "../animated/UnderlineLink/UnderlineLink"
import { useWindowWidth } from "@react-hook/window-size"
import AnimatedGrid from "@/components/animated/AnimatedContent"
import { LineAppear } from "./components/LineAppear"

export const ContactForm = () => {
    const [data, setData] = useState<any>(null)
    const locale = useLocale()
    const pathname = usePathname()
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

    useEffect(() => {
        const fetchData = async () => {
            const data = await getStrapiData('get-contact-data', locale)
            setData(data)
        }
        fetchData()
    }, [])

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

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required'
            isValid = false
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
            isValid = false
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address'
            isValid = false
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required'
            isValid = false
        } else {
            // Check if phone number contains only numbers and has more than 6 digits
            const phoneNumbers = formData.phoneNumber.replace(/\D/g, '') // Remove all non-digits
            if (phoneNumbers.length <= 6) {
                newErrors.phoneNumber = 'Phone number must be more than 6 digits'
                isValid = false
            }
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required'
            isValid = false
        }

        if (!formData.body.trim()) {
            newErrors.body = 'Message body is required'
            isValid = false
        }

        if (!formData.policy) {
            newErrors.policy = true
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setIsSending(true);
            const response = await fetch('/api/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
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
                <AnimatedGrid
                    type="words"
                    animation={{
                        from: { opacity: 0, y: '40px' },
                        to: { opacity: 1, y: '0px' },
                        delayStep: 60
                    }}
                    overflow={true}
                    gap={{ horizontal: '0.25em', vertical: '0.25em' }}
                    containerStyle={{ overflow: 'hidden' }}
                    cellConfigs={{
                        'title-first': {
                            style: {
                                color: colors.black100,
                                fontFamily: 'var(--font-golos-text)',
                                fontOpticalSizing: 'auto',
                                fontWeight: 600,
                                fontStyle: 'normal',
                            }
                        },
                        'title-second': {
                            style: {
                                color: colors.red,
                                fontFamily: 'var(--font-sage-grotesk)',
                                fontOpticalSizing: 'auto',
                                fontWeight: 400,
                                fontStyle: 'normal',
                                lineHeight: '105%',
                            }
                        }
                    }}
                >
                    <span id="title-first">{data?.data?.title?.textFirst}</span>
                    <span id="title-second" className="first">{data?.data?.title?.textSecond}</span>
                </AnimatedGrid>
            </StyledTitleContainer>
            <StyledNote>{data?.data?.note}</StyledNote>
            <StyledForm onSubmit={handleSubmit}>
                {width > 576 && <>
                    <LineAppear>
                        <StyledSection>
                            <StyledFormText>Hello, my name is</StyledFormText>
                            <StyledInputWrapper>
                                <SimpleInput label="your name" name="fullName" value={formData.fullName} onChange={handleInputChange} error={errors.fullName} />
                            </StyledInputWrapper>
                        </StyledSection>
                    </LineAppear>
                    <LineAppear>
                        <StyledSection> 
                            <StyledFormText>You can reach me by</StyledFormText>
                            <StyledInputWrapper>
                                <SimpleInput label="your email" name="email" value={formData.email} onChange={handleInputChange} error={errors.email} />
                            </StyledInputWrapper>
                            <StyledFormText>, my phone number is</StyledFormText>
                            <StyledInputWrapper>
                                <SimpleInput label="your phone" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} error={errors.phoneNumber} />
                            </StyledInputWrapper>
                        </StyledSection>
                    </LineAppear>
                    <LineAppear>
                        <StyledSection>
                            <StyledFormText>I have a question about</StyledFormText>
                            <StyledInputWrapper>
                                <SimpleInput label="letter subject" name="subject" value={formData.subject} onChange={handleInputChange} error={errors.subject} />
                            </StyledInputWrapper>
                        </StyledSection>
                    </LineAppear>
                    <LineAppear>
                        <StyledSection>
                            <StyledFormText>My question is</StyledFormText>
                            <StyledInputWrapper>
                                <SimpleTextarea label="question body" name="body" value={formData.body} onChange={handleTextareaChange} error={errors.body} />
                            </StyledInputWrapper>
                        </StyledSection>
                    </LineAppear>
                </>}
                {width <= 576 && <>
                    <LineAppear>
                        <StyledSection>
                            <StyledFormText>Hello, my name is</StyledFormText>
                            <StyledInputWrapper>
                                <SimpleInput label="your name" name="fullName" value={formData.fullName} onChange={handleInputChange} error={errors.fullName} />
                            </StyledInputWrapper>
                        </StyledSection>
                    </LineAppear>
                    <LineAppear>
                        <StyledSection> 
                            <StyledFormText>You can reach me by</StyledFormText>
                            <StyledInputWrapper>
                                <SimpleInput label="your email" name="email" value={formData.email} onChange={handleInputChange} error={errors.email} />
                            </StyledInputWrapper>
                        </StyledSection>
                    </LineAppear>
                    <LineAppear>
                        <StyledSection>
                            <StyledFormText>My phone number is</StyledFormText>
                            <StyledInputWrapper>
                                <SimpleInput label="your phone" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} error={errors.phoneNumber} />
                            </StyledInputWrapper>
                        </StyledSection>
                    </LineAppear>
                    <LineAppear>
                        <StyledSection>
                            <StyledFormText>I have a question about</StyledFormText>
                            <StyledInputWrapper>
                                <SimpleInput label="letter subject" name="subject" value={formData.subject} onChange={handleInputChange} error={errors.subject} />
                            </StyledInputWrapper>
                        </StyledSection>
                    </LineAppear>
                    <LineAppear>
                        <StyledSection>
                            <StyledFormText>My question is</StyledFormText>
                            <StyledInputWrapper>
                                <SimpleTextarea label="question body" name="body" value={formData.body} onChange={handleTextareaChange} error={errors.body} />
                            </StyledInputWrapper>
                        </StyledSection>
                    </LineAppear>
                </>}
                <StyledBottom>
                    <div className="left" onClick={() => {
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
                            <p>{data?.data?.policyText}</p>
                            <UnderlineLink href='/privacy-policy' text='Privacy policy' lineColor={colors.blue} />
                        </div>
                        {errors.policy && <StyledError>Please accept the privacy policy</StyledError>}
                    </div>
                    <BlueButton 
                        isSvg={true} 
                        submit={true} 
                        disabled={isSending}
                        className="button"
                    >
                        {isSending ? 'Sending...' : data?.data?.button?.text}
                    </BlueButton>
                </StyledBottom>
            </StyledForm>
        </StyledContactForm> : null
    )
}

const StyledContactForm = styled.div`
    width: 100%;
    padding: ${rm(150)};
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

    ${media.lg`
        font-size: ${rm(40)};
    `}

    ${media.xsm`
        font-size: ${rm(32)};
        margin-bottom: ${rm(15)};
    `}
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

        ${media.xsm`
            gap: ${rm(5)};
            flex-direction: column;
        `}

        .texts{
            ${fontGolosText(400)};
            color: ${colors.gray};
            font-size: ${rm(20)};
            line-height: 130%;
            display: flex;

            >span{
                color: ${colors.blue};
                margin-left: ${rm(5)};
            }

            ${media.lg`
                font-size: ${rm(16)};
            `}

            ${media.xsm`
                font-size: ${rm(14)};
                display: inline;
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
        font-size: ${rm(12)};
        margin-top: ${rm(5)};
        margin-left: ${rm(-10)};
    `}
`
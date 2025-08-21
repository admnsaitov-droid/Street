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
            // Allows formats: +1234567890, +1 234 567 890, +1-234-567-890
            const phoneRegex = /^\+?[0-9\s-]{10,}$/
            if (!phoneRegex.test(formData.phoneNumber.trim())) {
                newErrors.phoneNumber = 'Please enter a valid phone number'
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
    }

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleInputError = (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrors({ ...errors, [e.target.name]: e.target.value })
    }

    const handleTextareaError = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setErrors({ ...errors, [e.target.name]: e.target.value })
    }

    return (    
        !pathname.includes('contact') ? <StyledContactForm>
            <StyledTitle>
                <span>{data?.data?.title?.textFirst}</span>
                <span className="first">{data?.data?.title?.textSecond}</span>
            </StyledTitle>
            <StyledNote>{data?.data?.note}</StyledNote>
            <StyledForm onSubmit={handleSubmit}>
                {width > 576 && <>
                    <StyledSection>
                        <StyledFormText>Hello, my name is</StyledFormText>
                        <StyledInputWrapper>
                            <SimpleInput label="your name" name="fullName" value={formData.fullName} onChange={handleInputChange} onError={handleInputError} />
                        </StyledInputWrapper>
                    </StyledSection>
                    <StyledSection> 
                        <StyledFormText>You can reach me by</StyledFormText>
                        <StyledInputWrapper>
                            <SimpleInput label="your email" name="email" value={formData.email} onChange={handleInputChange} onError={handleInputError} />
                        </StyledInputWrapper>
                        <StyledFormText>, my phone number is</StyledFormText>
                        <StyledInputWrapper>
                            <SimpleInput label="your phone" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} onError={handleInputError} />
                        </StyledInputWrapper>
                    </StyledSection>
                    <StyledSection>
                        <StyledFormText>I have a question about</StyledFormText>
                        <StyledInputWrapper>
                            <SimpleInput label="letter subject" name="subject" value={formData.subject} onChange={handleInputChange} onError={handleInputError} />
                        </StyledInputWrapper>
                    </StyledSection>
                    <StyledSection>
                        <StyledFormText>My question is</StyledFormText>
                        <StyledInputWrapper>
                            <SimpleTextarea label="question body" name="body" value={formData.body} onChange={handleTextareaChange} onError={handleTextareaError} />
                        </StyledInputWrapper>
                    </StyledSection>
                </>}
                {width <= 576 && <>
                    <StyledSection>
                        <StyledFormText>Hello, my name is</StyledFormText>
                        <StyledInputWrapper>
                            <SimpleInput label="your name" name="fullName" value={formData.fullName} onChange={handleInputChange} onError={handleInputError} />
                        </StyledInputWrapper>
                    </StyledSection>
                    <StyledSection> 
                        <StyledFormText>You can reach me by</StyledFormText>
                        <StyledInputWrapper>
                            <SimpleInput label="your email" name="email" value={formData.email} onChange={handleInputChange} onError={handleInputError} />
                        </StyledInputWrapper>
                    </StyledSection>
                    <StyledSection>
                        <StyledFormText>My phone number is</StyledFormText>
                        <StyledInputWrapper>
                            <SimpleInput label="your phone" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} onError={handleInputError} />
                        </StyledInputWrapper>
                    </StyledSection>
                    <StyledSection>
                        <StyledFormText>I have a question about</StyledFormText>
                        <StyledInputWrapper>
                            <SimpleInput label="letter subject" name="subject" value={formData.subject} onChange={handleInputChange} onError={handleInputError} />
                        </StyledInputWrapper>
                    </StyledSection>
                    <StyledSection>
                        <StyledFormText>My question is</StyledFormText>
                        <StyledInputWrapper>
                            <SimpleTextarea label="question body" name="body" value={formData.body} onChange={handleTextareaChange} onError={handleTextareaError} />
                        </StyledInputWrapper>
                    </StyledSection>
                </>}
                <StyledBottom>
                    <div className="left">
                        <SimpleCheckbox
                            checked={formData.policy}
                            onChange={() => setFormData({ ...formData, policy: !formData.policy })}
                        />
                        <div className="texts">
                            <p>{data?.data?.policyText}</p>
                            <UnderlineLink href='/privacy-policy' text='Privacy policy' lineColor={colors.blue} />
                        </div>
                        {errors.policy && <StyledError>Please accept the privacy policy</StyledError>}
                    </div>
                    <BlueButton 
                        isSvg={false} 
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

const StyledTitle = styled.p`
    margin-bottom: ${rm(20)};
    line-height: 90%;
    letter-spacing: -0.01em;
    font-size: ${rm(48)};
    text-transform: uppercase;
    ${fontGolosText(600)};
    color: ${colors.black100};
    display: flex;
    gap: ${rm(10)};

    ${media.lg`
        font-size: ${rm(40)};
    `}

    ${media.xsm`
        font-size: ${rm(32)};
        flex-direction: column;
        margin-bottom: ${rm(15)};
    `}

    .first{
        ${fontSageGrotesk(400)} !important;
        color: ${colors.red} !important;
        letter-spacing: -0.02em;
        line-height: 105%;

        ${media.xsm`
            line-height: 90%;
        `}
    }
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
`
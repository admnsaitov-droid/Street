"use client"
import UnderlineLink from "@/components/animated/UnderlineLink/UnderlineLink";
import { StyledBottom } from "@/components/ContactForm/ContactForm";
import { BlueButton } from "@/components/Ui/buttons/BlueButton";
import { SimpleCheckbox } from "@/components/Ui/checkbox/SimpleCheckbox";
import { ContactInput } from "@/components/Ui/Inputs/ContactInput";
import { SimpleInput } from "@/components/Ui/Inputs/SimpleInput";
import { SimpleTextarea } from "@/components/Ui/Inputs/SimpleTextarea";
import { AnimLink } from "@/layouts/AnimatedRouterLayout/AnimatedRouterLayout";
import useLoadingStore from "@/store/store";
import { colors, media, rm } from "@/styles";
import { fontGolosText } from "@/styles/fonts";
import { useState, useRef } from "react";
import styled from "styled-components"

interface ContactFormProps {
    data: any
    buttonText: string
}

export const ContactForm = ({ data, buttonText }: ContactFormProps) => {
    const setIsSubmitSuccessful = useLoadingStore((state: any) => (state.setIsSubmitSuccessful))
    const setIsSubmitError = useLoadingStore((state: any) => (state.setIsSubmitError))
    const [isSending, setIsSending] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        body: '',
        policy: false
    })
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        body: '',
        policy: false
    })

    // Refs for form fields to enable scrolling to errors
    const firstNameRef = useRef<HTMLInputElement>(null)
    const lastNameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const phoneNumberRef = useRef<HTMLInputElement>(null)
    const bodyRef = useRef<HTMLTextAreaElement>(null)
    const policyRef = useRef<HTMLDivElement>(null)

    const validateForm = () => {
        const newErrors = {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            body: '',
            policy: false
        }
        let isValid = true
        let firstErrorRef = null

        if (!formData.firstName.trim()) {
            newErrors.firstName = data?.firstNameErrorText
            isValid = false
            if (!firstErrorRef) firstErrorRef = firstNameRef
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = data?.lastNameErrorText
            isValid = false
            if (!firstErrorRef) firstErrorRef = lastNameRef
        }

        if (!formData.email.trim()) {
            newErrors.email = data?.mailErrorText
            isValid = false
            if (!firstErrorRef) firstErrorRef = emailRef
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = data?.mailErrorText
            isValid = false
            if (!firstErrorRef) firstErrorRef = emailRef
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = data?.phoneErrorText
            isValid = false
            if (!firstErrorRef) firstErrorRef = phoneNumberRef
        } else {
            // Check if phone number contains only numbers and has more than 6 digits
            const phoneNumbers = formData.phoneNumber.replace(/\D/g, '') // Remove all non-digits
            if (phoneNumbers.length <= 6) {
                newErrors.phoneNumber = data?.phoneErrorText
                isValid = false
                if (!firstErrorRef) firstErrorRef = phoneNumberRef
            }
        }

        if (!formData.body.trim()) {
            newErrors.body = data?.messageErrorText
            isValid = false
            if (!firstErrorRef) firstErrorRef = bodyRef
        }

        if (!formData.policy) {
            newErrors.policy = data?.policyErrorText
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
            const response = await fetch('/api/send-main', {
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
                    firstName: '',
                    lastName: '',
                    email: '',
                    phoneNumber: '',
                    body: '',
                    policy: false
                });
                setErrors({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phoneNumber: '',
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
        <StyledContactForm onSubmit={handleSubmit}>
            <StyledInputs>
                <StyledSection>
                    <ContactInput ref={firstNameRef} label={data?.firstNamePlaceholder} name="firstName" value={formData.firstName} onChange={handleInputChange} error={errors.firstName} />
                    <ContactInput ref={lastNameRef} label={data?.lastNamePlaceholder} name="lastName" value={formData.lastName} onChange={handleInputChange} error={errors.lastName} />
                </StyledSection>
                <StyledSection>
                    <ContactInput ref={emailRef} label={data?.mailPlaceholder} name="email" value={formData.email} onChange={handleInputChange} error={errors.email} />
                    <ContactInput ref={phoneNumberRef} label={data?.phonePlaceholder} name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} error={errors.phoneNumber} />
                </StyledSection>
                <SimpleTextarea ref={bodyRef} label={data?.messagePlaceholder} name="body" value={formData.body} onChange={handleTextareaChange} error={errors.body} />
            </StyledInputs>
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
                        <p>{data?.checkboxText} <UnderlineLink className="link" href='/privacy-policy' text={data?.policyText} lineColor={colors.blue} /></p>
                    </div>
                    {errors.policy && <StyledError>{data?.policyErrorText}</StyledError>}
                </div>
                <BlueButton 
                    isSvg={false} 
                    submit={true} 
                    disabled={isSending}
                    className="button"
                >
                    {isSending ? buttonText : buttonText}
                </BlueButton>
            </StyledBottom>
        </StyledContactForm>
    )
}

const StyledContactForm = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: ${rm(50)};

    .button{
        ${media.xsm`
            width: 100%;
        `}
    }

    .link{
        margin-bottom: ${rm(-8)};
        color: ${colors.blue};

        ${media.xsm`
            margin-bottom: ${rm(-6)};
        `}
    }
`

const StyledInputs = styled.div`
    display: flex;
    gap: ${rm(60)};
    flex-direction: column;
    width: 100%;
`

const StyledSection = styled.div`
    display: flex;
    gap: ${rm(10)};

    ${media.xsm`
        flex-direction: column;
        gap: ${rm(50)};
    `}

    >div{
        width: 49%;

        ${media.xsm`
            width: 100%;
        `}
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
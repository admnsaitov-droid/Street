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
import { useState } from "react";
import styled from "styled-components"

export const ContactForm = () => {
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

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required'
            isValid = false
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required'
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
                    <ContactInput label="First name*" name="firstName" value={formData.firstName} onChange={handleInputChange} error={errors.firstName} />
                    <ContactInput label="Last name*" name="lastName" value={formData.lastName} onChange={handleInputChange} error={errors.lastName} />
                </StyledSection>
                <StyledSection>
                    <ContactInput label="Email*" name="email" value={formData.email} onChange={handleInputChange} error={errors.email} />
                    <ContactInput label="Phone number*" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} error={errors.phoneNumber} />
                </StyledSection>
                <SimpleTextarea label="Message*" name="body" value={formData.body} onChange={handleTextareaChange} error={errors.body} />
            </StyledInputs>
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
                        <p>I have read and accept agree the</p>
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
                    {isSending ? 'Sending...' : 'Submit'}
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
`
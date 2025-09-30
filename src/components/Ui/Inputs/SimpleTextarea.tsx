import styled from "styled-components"
import { rm, colors, media } from "@/styles"
import { useState, FocusEvent, TextareaHTMLAttributes, forwardRef } from "react"
import { fontGolosText } from "@/styles/fonts"

interface SimpleTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export const SimpleTextarea = forwardRef<HTMLTextAreaElement, SimpleTextareaProps>(({ label, value = "", error, ...props }, ref) => {
  const [focused, setFocused] = useState(false)
  
  // Generate unique ID for accessibility
  const textareaId = props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`

  const handleFocus = () => setFocused(true)
  const handleBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
    setFocused(false)
    props.onBlur && props.onBlur(e)
  }

  return (
    <StyledSimpleTextarea>
      <Label
        htmlFor={textareaId}
        $active={focused || !!value}
      >
        {label}
      </Label>
      <Textarea
        {...props}
        ref={ref}
        id={textareaId}
        value={value}
        onChange={e => {
          props.onChange && props.onChange(e)
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        aria-invalid={!!error}
      />
      <Underline $active={focused || !!value} $error={!!error} />
      <StaticUnderline $error={!!error} />
      {error && <ErrorMessage id={`${textareaId}-error`}>{error}</ErrorMessage>}
    </StyledSimpleTextarea>
  )
})

const StyledSimpleTextarea = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;

  /* Handle autocomplete state - move label up when autocomplete is active */
  &:has(textarea:-webkit-autofill) label {
    font-size: ${rm(18)} !important;
    transform: translateY(-${rm(18)}) !important;
    color: #B7BCCA !important;

    ${media.lg`
      font-size: ${rm(18)} !important;
    `}

    ${media.md`
      font-size: ${rm(12)} !important;
      transform: translateY(-${rm(20)}) !important;
    `}
  }
`

const Label = styled.label<{ $active: boolean }>`
  position: absolute;
  left: 0;
  top: ${rm(-2)};
  font-size: ${({ $active }) => $active ? rm(18) : rm(30)};
  ${fontGolosText(400)};
  color: #B7BCCA;
  pointer-events: none;
  transition: all 0.2s cubic-bezier(.4,0,.2,1);
  transform: ${({ $active }) => $active ? `translateY(-${rm(18)})` : "none"};

  ${media.lg`
    font-size: ${({ $active }: any) => $active ? rm(18) : rm(24)};
  `}

  ${media.md`
    font-size: ${({ $active }: any) => $active ? rm(12) : rm(18)};
    transform: ${({ $active }: any) => $active ? `translateY(-${rm(20)})` : "none"};
    top: ${rm(-0.5)};
  `}

  ${media.xsm`
    font-size: ${({ $active }: any) => $active ? rm(12) : rm(16)};
    transform: ${({ $active }: any) => $active ? `translateY(-${rm(18)})` : "none"};
    top: ${rm(1)};
  `}
`

const Textarea = styled.textarea`
  width: 100%;
  background: transparent;
  border: none;
  border-radius: 0;
  color: ${colors.black100};
  font-size: ${rm(30)};
  ${fontGolosText(400)};
  padding: 0;
  outline: none;
  height: ${rm(88)};
  z-index: 1;
  position: relative;
  resize: none;

  /* Remove autocomplete styles */
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px transparent inset !important;
    -webkit-text-fill-color: ${colors.black100} !important;
    transition: background-color 5000s ease-in-out 0s;
  }

  ${media.lg`
    font-size: ${rm(24)};
  `}

  ${media.md`
    font-size: ${rm(18)};
    height: ${rm(62)};
  `}

  ${media.xsm`
    font-size: ${rm(14)};
    height: ${rm(44)};
  `}
`

const Underline = styled.div<{ $active: boolean; $error: boolean }>`
  position: absolute;
  left: 0%;
  bottom: ${rm(-10)};
  width: 0%;
  height: ${rm(2)};
  background: ${({ $error }) => $error ? colors.red : colors.black100};
  transform: translateX(0%);
  transition: width 0.3s cubic-bezier(.4,0,.2,1);
  ${({ $active }) => $active && `width: 100%;`};
  z-index: 1;
`

const StaticUnderline = styled.div<{ $error: boolean }>`
  position: absolute;
  left: 0;
  bottom: ${rm(-10)};
  height: ${rm(1)};
  background: ${({ $error }) => $error ? colors.red : '#B7BCCA'};
  width: 100%;
`

const ErrorMessage = styled.div`
  position: absolute;
  left: 0;
  top: ${rm(100)};
  color: ${colors.red};
  font-size: ${rm(14)};
  ${fontGolosText(400)};
  margin-top: ${rm(5)};
  
  ${media.lg`
    font-size: ${rm(12)};
  `}
  
  ${media.md`
    font-size: ${rm(10)};
  `}
  
  ${media.xsm`
    font-size: ${rm(10)};
    top: ${rm(55)};
  `}
`

SimpleTextarea.displayName = "SimpleTextarea"
import styled from "styled-components"
import { rm, colors, media } from "@/styles"
import { useState, FocusEvent, InputHTMLAttributes, forwardRef } from "react"
import { fontGolosText } from "@/styles/fonts"

interface SimpleInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const SimpleInput = forwardRef<HTMLInputElement, SimpleInputProps>(({ label, value = "", error, ...props }, ref) => {
  const [focused, setFocused] = useState(false)
  
  // Generate unique ID for accessibility
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`

  const handleFocus = () => setFocused(true)
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(false)
    props.onBlur && props.onBlur(e)
  }

  return (
    <StyledSimpleInput>
      <Label
        htmlFor={inputId}
        $active={focused || !!value}
      >
        {label}
      </Label>
      <Input
        {...props}
        ref={ref}
        id={inputId}
        value={value}
        onChange={e => {
          props.onChange && props.onChange(e)
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-describedby={error ? `${inputId}-error` : undefined}
        aria-invalid={!!error}
      />
      <Underline $active={focused || !!value} $error={!!error} />
      <StaticUnderline $error={!!error} />
      {error && <ErrorMessage id={`${inputId}-error`}>{error}</ErrorMessage>}
    </StyledSimpleInput>
  )
})

const StyledSimpleInput = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;

  /* Handle autocomplete state - move label up when autocomplete is active */
  &:has(input:-webkit-autofill) label {
    font-size: ${rm(18)} !important;
    transform: translateY(-${rm(18)}) !important;
    color: #B7BCCA !important;

    ${media.lg`
      font-size: ${rm(18)} !important;
      transform: translateY(-${rm(20)}) !important;
    `}

    ${media.xsm`
      font-size: ${rm(12)} !important;
      transform: translateY(-${rm(20)}) !important;
    `}
  }

  ${media.lg`
    margin-top: ${rm(-2)};  
  `}
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
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${media.lg`
    font-size: ${({ $active }: any) => $active ? rm(18) : rm(24)};
    transform: ${({ $active }: any) => $active ? `translateY(-${rm(20)})` : "none"};
    top: ${rm(2)};
  `}

  ${media.md`
    font-size: ${({ $active }: any) => $active ? rm(12) : rm(18)};
    transform: ${({ $active }: any) => $active ? `translateY(-${rm(20)})` : "none"};
    top: ${rm(1.5)};
  `}

  ${media.xsm`
    font-size: ${({ $active }: any) => $active ? rm(12) : rm(16)};
    transform: ${({ $active }: any) => $active ? `translateY(-${rm(18)})` : "none"};
    top: ${rm(1)};
  `}
`

const Input = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  border-radius: 0;
  color: ${colors.black100};
  font-size: ${rm(30)};
  ${fontGolosText(400)};
  padding: 0;
  outline: none;
  height: ${rm(32)};
  z-index: 1;
  position: relative;

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
    height: ${rm(24)};
  `}

  ${media.xsm`
    font-size: ${rm(14)};
    height: ${rm(20)};
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
  top: ${rm(45)};
  color: ${colors.red};
  font-size: ${rm(14)};
  ${fontGolosText(400)};
  margin-top: ${rm(-2)};
  
  ${media.lg`
    font-size: ${rm(12)};
  `}
  
  ${media.md`
    font-size: ${rm(10)};
  `}
  
  ${media.xsm`
    font-size: ${rm(10)};
    top: ${rm(35)};
  `}
`

SimpleInput.displayName = "SimpleInput"
import styled from "styled-components"
import { rm, colors, media } from "@/styles"
import { useState, FocusEvent, InputHTMLAttributes } from "react"
import { fontGolosText } from "@/styles/fonts"

interface ContactInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export const ContactInput = ({ label, value = "", ...props }: ContactInputProps) => {
  const [focused, setFocused] = useState(false)

  const handleFocus = () => setFocused(true)
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(false)
    props.onBlur && props.onBlur(e)
  }

  return (
    <StyledContactInput>
      <Label
        $active={focused || !!value}
      >
        {label}
      </Label>
      <Input
        {...props}
        value={value}
        onChange={e => {
          props.onChange && props.onChange(e)
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <Underline $active={focused || !!value} />
      <StaticUnderline />
    </StyledContactInput>
  )
}

const StyledContactInput = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
` 

const Label = styled.label<{ $active: boolean }>`
  position: absolute;
  left: 0;
  top: ${rm(10)};
  font-size: ${({ $active }) => $active ? rm(18) : rm(30)};
  ${fontGolosText(400)};
  color: #B7BCCA;
  pointer-events: none;
  transition: all 0.2s cubic-bezier(.4,0,.2,1);
  transform: ${({ $active }) => $active ? `translateY(-${rm(18)})` : "none"};

  ${media.lg`
    font-size: ${({ $active }: any) => $active ? rm(18) : rm(24)};
    transform: ${({ $active }: any) => $active ? `translateY(-${rm(20)})` : "none"};
    top: ${rm(2)};
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
  height: ${rm(42)};
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
`

const Underline = styled.div<{ $active: boolean }>`
  position: absolute;
  left: 0%;
  bottom: ${rm(-10)};
  width: 0%;
  height: ${rm(2)};
  background: ${colors.black100};
  transform: translateX(0%);
  transition: width 0.3s cubic-bezier(.4,0,.2,1);
  ${({ $active }) => $active && `width: 100%;`};
  z-index: 1;
`

const StaticUnderline = styled.div`
  position: absolute;
  left: 0;
  bottom: ${rm(-10)};
  height: ${rm(1)};
  background: #B7BCCA;
  width: 100%;
`
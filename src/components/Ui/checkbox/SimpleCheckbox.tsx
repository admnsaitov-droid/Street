import { rm } from "@/styles"
import { colors } from "@/styles/colors"
import styled from "styled-components"

interface SimpleCheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export const SimpleCheckbox = ({ checked, onChange }: SimpleCheckboxProps) => {
    return (
        <StyledCheckbox onClick={() => onChange(!checked)}>
            {checked && <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.8047 3.52783C13.0081 3.52783 13.2022 3.61422 13.3438 3.76514C13.4851 3.91581 13.5635 4.11935 13.5635 4.32959C13.5634 4.53965 13.4849 4.7425 13.3438 4.89307L6.4541 12.2358C6.15706 12.5524 5.67398 12.5524 5.37695 12.2358L2.65527 9.33545C2.58524 9.2608 2.52975 9.17232 2.49219 9.07568C2.45462 8.97902 2.43555 8.87526 2.43555 8.771C2.43556 8.56088 2.51411 8.35815 2.65527 8.20752C2.79686 8.0566 2.9909 7.97021 3.19434 7.97021C3.39769 7.97028 3.59088 8.05665 3.73242 8.20752L5.91211 10.5308L12.2666 3.76514C12.4081 3.6144 12.6014 3.52787 12.8047 3.52783Z" fill="white" stroke="white" stroke-width="0.218182"/>
            </svg>
            }
        </StyledCheckbox>
    )
}

const StyledCheckbox = styled.div`
    width: ${rm(24)};
    height: ${rm(24)};
    background: ${colors.black100};
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${rm(4)};
    cursor: pointer;

    transition: opacity 0.3s ease-in-out;

    &:hover{
        opacity: 0.8;
    }

    svg{
        width: ${rm(15)};
        height: ${rm(15)};
    }
`
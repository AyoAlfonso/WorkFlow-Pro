import React, { useState } from "react"
import styled, { css } from "styled-components"
import Modal from "styled-react-modal"
import { Input, NumberInput, CurrencyInput, PercentInput } from "~/components/shared/input"
import { baseTheme } from "~/themes/base"
import { Icon } from "~/components/shared/icon"

type StyledModalProps = {
  width: string;
}

export const StyledModal = Modal.styled<StyledModalProps>`
  border-radius: 8px;
  width: ${props => props.width || "640px"};
  maxHeight: 90%;
  background-color: ${props => props.theme.colors.white};
`

const inputStyles = css`
  margin: 0px;
  font-size: 12px;
`

export const StyledInput = styled(Input)`${inputStyles}`
export const StyledNumberInput = styled(NumberInput)`${inputStyles}`
export const StyledCurrencyInput = styled(CurrencyInput)`${inputStyles}`
export const StyledPercentInput = styled(PercentInput)`${inputStyles}`

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: calc(100% - 32px);
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
`

export const Header = styled.p`
  margin: 0px;
  font-size: 16px;
  font-weight: bold;
`

export const CloseIconContainer = styled.div`
  &:hover {
    cursor: pointer
  }
`

export const FormContainer = styled.div`
  display: flex;
  width: calc(100% - 32px);
  flex-direction: column;
  padding: 16px;
  gap: 16px;
`

export const FormElementContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 4px;
  .trix-kpi-modal {
    font-size: 12px;
    margin: 0px;
    margin-top: 4px;
  }
`

export const RowContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  gap: 16px;
`

const InputHeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`

const InputHeader = styled.p`
  margin: 0px;
  font-size: 12px;
  font-weight: bold;
`

const CommentText = styled.p`
  margin: 0px;
  margin-top: auto;
  font-size: 9px;
  color: ${props => props.theme.colors.grey100};
`

type ModalWithHeaderProps = {
  children?: JSX.Element | JSX.Element[] | string,
  header: string,
  isOpen: boolean,
  width?: string,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

export const ModalWithHeader = ({
  children,
  header,
  isOpen,
  setIsOpen,
  width,
}: ModalWithHeaderProps): JSX.Element => {
  return (
    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={e => {
        setIsOpen(false)
      }}
      width={width}
    >
      <HeaderContainer>
        <Header>{header}</Header>
        <CloseIconContainer onClick={() => {
          setIsOpen(false)
        }}>
          <Icon size={16} icon={"Close"} iconColor={baseTheme.colors.grey100} />
        </CloseIconContainer>
      </HeaderContainer>
      {children}
    </StyledModal>
  )
}

type InputFromUnitTypeProps = {
  unitType: string,
  placeholder: string,
  onChange: Function,
  defaultValue: string | number,
  [restProps: string]: any
}

export const InputFromUnitType = ({
  unitType,
  placeholder,
  onChange,
  defaultValue,
  ...restProps
}: InputFromUnitTypeProps): JSX.Element => {
  const [val, setVal] = useState(defaultValue)

  const handleChange = (e) => {
    onChange(e)
    setVal(e.target.value)
  }

  switch (unitType) {
    case "currency":
      return (<StyledCurrencyInput
        placeholder={placeholder}
        onChange={handleChange}
        value={val}
        {...restProps}
      />)
    case "percentage":
      return (<StyledPercentInput
        placeholder={placeholder}
        onChange={handleChange}
        value={val}
        {...restProps}
      />)
    default:
      return (<StyledNumberInput
        placeholder={placeholder}
        onChange={handleChange}
        value={val}
        {...restProps}
      />)
  }
}

type InputHeaderWithCommentProps = {
  children?: JSX.Element | JSX.Element[] | string,
  comment?: string,
}

export const InputHeaderWithComment = ({
  children,
  comment
}: InputHeaderWithCommentProps): JSX.Element => {
  return (
    <InputHeaderContainer>
      <InputHeader>{children}</InputHeader>
      {comment && <CommentText>{comment}</CommentText>}
    </InputHeaderContainer>
  )
}

export const SaveButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 16px;
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.theme.colors.white};
  background: ${props => props.theme.colors.primary100};
  border-radius: 4px;
  margin-top: 8px;
  margin-right: auto;
  padding: 8px 12px;

  &:hover {
    cursor: pointer;
    background: ${props => props.theme.colors.primary80};
  }
`

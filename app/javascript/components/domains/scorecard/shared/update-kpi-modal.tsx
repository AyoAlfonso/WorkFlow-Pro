import React, { useState } from "react"
import R from "ramda"
import styled, { css } from "styled-components"
import { observer } from "mobx-react"
import { useTranslation } from "react-i18next"
import Modal from "styled-react-modal"
import { useMst } from "~/setup/root"
import { Input, CurrencyInput, PercentInput } from "~/components/shared/input"
import { Icon } from "~/components/shared/icon"
import { baseTheme } from "~/themes/base"

interface UpdateKPIModalProps {
  kpiId: number,
  ownedById: number,
  unitType: string,
  year: number,
  week: number,
  currentValue: number | undefined,
  headerText: string,
  setUpdateKPIModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateKPIModalOpen: boolean;
}

export const UpdateKPIModal = observer(
  ({
    kpiId,
    unitType,
    year,
    week,
    currentValue,
    headerText,
    setUpdateKPIModalOpen,
    updateKPIModalOpen,
  }: UpdateKPIModalProps): JSX.Element => {
    const { keyPerformanceIndicatorStore, sessionStore } = useMst();
    const [value, setValue] = useState<number>(currentValue);
    const [comment, setComment] = useState("");

    const { grey100 } = baseTheme.colors

    const handleSave = () => {
      if(value != undefined) {
        const log = {
          keyPerformanceIndicatorId: kpiId,
          userId: sessionStore.profile.id,
          score: value,
          note: null,
          week,
          fiscalYear: year,
          fiscalQuarter: Math.floor((week - 1)/13) + 1,
        }
        if(comment != "") {
          log.note = comment;
        }
        keyPerformanceIndicatorStore.createScorecardLog(log)
      }
      setUpdateKPIModalOpen(false);
    }

    const handleChange = (e) => {
      switch (unitType) {
        case "currency":
          setValue(Number(e.target.value.replace(/[^0-9\.]+/g, "")))
          break;
        case "percentage":
          setValue(Number(e.target.value.replace(/[^0-9\.]+/g, "")))
          break;
        default:
          setValue(Number(e.target.value))
          break;
      }
    }

    const renderValueInput = () => {
      const placeholder = "Add the new value..."
      switch (unitType) {
        case "currency":
          return (<StyledCurrencyInput
            placeholder={placeholder}
            onChange={handleChange}
            value={currentValue}
          />)
        case "percentage":
          return (<StyledPercentInput
            placeholder={placeholder}
            onChange={handleChange}
            value={currentValue}
          />)
        default:
          return (<StyledInput
            placeholder={placeholder}
            onChange={handleChange}
            type={"number"}
            inputMode={"numeric"}
            value={currentValue}
          />)
      }
    }

    return (
      <StyledModal
        isOpen={updateKPIModalOpen}
        onBackgroundClick={e => {
          setUpdateKPIModalOpen(false)
        }}
      >
        <HeaderContainer>
          <Header>{headerText}</Header>
          <CloseIconContainer onClick={() => {
            setUpdateKPIModalOpen(false);
          }}>
            <Icon size={16} icon={"Close"} iconColor={grey100} />
          </CloseIconContainer>
        </HeaderContainer>
        <FormContainer>
          <FormElementContainer>
            <InputHeaderContainer>
              <InputHeader>New Value</InputHeader>
            </InputHeaderContainer>
            {renderValueInput()}
          </FormElementContainer>
          <FormElementContainer>
            <InputHeaderContainer>
              <InputHeader>Comment</InputHeader>
              <CommentText>optional</CommentText>
            </InputHeaderContainer>
            <StyledInput placeholder={"Add a comment..."} onChange={(e) => {
              setComment(e.target.value);
            }}/>
          </FormElementContainer>
          <FormElementContainer>
            <SaveButton onClick={handleSave}>Save</SaveButton>
          </FormElementContainer>
        </FormContainer>
      </StyledModal>
    )
  }
)

const StyledModal = Modal.styled`
  border-radius: 8px;
  width: 640px;
  maxHeight: 90%;
  background-color: ${props => props.theme.colors.white};
`

const inputStyles = css`
  margin: 0px;
  font-size: 12px;
`

const StyledInput = styled(Input)`${inputStyles}`
const StyledCurrencyInput = styled(CurrencyInput)`${inputStyles}`
const StyledPercentInput = styled(PercentInput)`${inputStyles}`

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: calc(100% - 32px);
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
`

const Header = styled.p`
  margin: 0px;
  font-size: 16px;
  font-weight: bold;
`

const CloseIconContainer = styled.div`
  &:hover {
    cursor: pointer
  }
`

const FormContainer = styled.div`
  display: flex;
  padding: 16px;
  width: calc(100% - 32px);
  flex-direction: column;
  gap: 16px;
`

const FormElementContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
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

const SaveButton = styled.div`
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

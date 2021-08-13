import React, { useState } from "react"
import R from "ramda"
import styled, { css } from "styled-components"
import { observer } from "mobx-react"
import { useTranslation } from "react-i18next"
import { useMst } from "~/setup/root"
import { Select } from "~/components/shared/input"
import {
  InputFromUnitType,
  ModalWithHeader,
  InputHeaderWithComment,
  SaveButton,
  StyledInput,
} from "./modal-elements"
import { baseTheme } from "~/themes/base"

interface AddManualKPIModalProps {
  addManualKPIModalOpen: boolean;
  setAddManualKPIModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddManualKPIModal = observer(
  ({
    addManualKPIModalOpen,
    setAddManualKPIModalOpen,
  }: AddManualKPIModalProps): JSX.Element => {
    const { keyPerformanceIndicatorStore, sessionStore } = useMst();
    const [title, setTitle] = useState<string>(null)
    const [description, setDescription] = useState<string>(null)
    const [unitType, setUnitType] = useState<string>(null)
    const [ownerId, setOwnerId] = useState<number>(sessionStore?.profile?.id)
    const [currentValue, setCurrentValue] = useState<number>(null)
    const [targetValue, setTargetValue] = useState<number>(null)

    const handleSave = () => {

    }

    const handleChange = (e, setStateAction) => {
      switch (unitType) {
        case "currency":
          setStateAction(Number(e.target.value.replace(/[^0-9\.]+/g, "")));
          break;
        case "percentage":
          setStateAction(Number(e.target.value.replace(/[^0-9\.]+/g, "")));
          break;
        default:
          setStateAction(Number(e.target.value));
          break;
      }
    }

    return (
      <ModalWithHeader
        header={"Add Manual KPI"}
        isOpen={addManualKPIModalOpen}
        setIsOpen={setAddManualKPIModalOpen}
      >
        <FormContainer>
          <FormElementContainer>
            <InputHeaderWithComment>Title</InputHeaderWithComment>
            <StyledInput
              placeholder={"e.g. Employee NPS"}
              value={title}
              onChange={(e) => { setTitle(e.target.value) }}
            />
          </FormElementContainer>
          <FormElementContainer>
            <InputHeaderWithComment comment={"optional"}>Description</InputHeaderWithComment>
            <StyledInput placeholder={"Add a description"} onChange={(e) => { setDescription(e.target.value) }} />
          </FormElementContainer>
          <DualColumnContainer>
            <FormElementContainer>
              <InputHeaderWithComment>Unit</InputHeaderWithComment>
              <Select
                name={"unitType"}
                onChange={(e) => { setUnitType(e.target.value) }}
                value={unitType}
                fontSize={12}
              >
                <option key={"numerical"} value={"numerical"}># Numerical</option>
                <option key={"percentage"} value={"percentage"}>% Percentage</option>
                <option key={"currency"} value={"currency"}>$ Currency</option>
              </Select>
            </FormElementContainer>
            <FormElementContainer>
              <InputHeaderWithComment>Owner</InputHeaderWithComment>
            </FormElementContainer>
          </DualColumnContainer>
          <DualColumnContainer>
            <FormElementContainer>
              <InputHeaderWithComment comment={"optional"}>Current Value</InputHeaderWithComment>
              <InputFromUnitType
                unitType={unitType}
                placeholder={"0"}
                onChange={(e) => { handleChange(e, setCurrentValue) }}
                value={currentValue}
              />
            </FormElementContainer>
            <FormElementContainer>
              <InputHeaderWithComment>Target Value</InputHeaderWithComment>
              <InputFromUnitType
                unitType={unitType}
                placeholder={"0"}
                onChange={(e) => { handleChange(e, setTargetValue) }}
                value={targetValue}
              />
            </FormElementContainer>
          </DualColumnContainer>
          <FormElementContainer>
            <SaveButton onClick={handleSave}>Save</SaveButton>
          </FormElementContainer>
        </FormContainer>
      </ModalWithHeader>
    )
  })

const FormElementContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 4px;
`

const FormContainer = styled.div`
  display: flex;
  width: calc(100% - 32px);
  flex-direction: column;
  padding: 16px;
  gap: 16px;
`

const DualColumnContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  gap: 16px;
`

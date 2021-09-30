import * as React from "react";
import * as R from "ramda";
import styled, { css } from "styled-components";
import { space, SpaceProps } from "styled-system";
import { useState, useRef, useEffect } from "react";
import { Input, Label, Button, TextDiv } from "~/components/shared";
import { baseTheme } from "~/themes/base";
import { Select } from "~/components/shared/input";
import { Store } from "@material-ui/icons";
import { useMst } from "~/setup/root";
import { InputFromUnitType } from "~/components/domains/scorecard/shared/modal-elements";

interface IEditKeyElementFormProps {
  //   onCreate: (keyElementParams: any) => void;
  onClose: () => void;
  action: any;
  element: any;
  store: any;
  type: any;
  //TODO: set correct type
}

export const EditKeyElementForm = ({
  store,
  element,
  action,
  onClose,
  type,
}: IEditKeyElementFormProps): JSX.Element => {
  const { userStore } = useMst();
  const { users } = userStore;
  const [title, setTitle] = useState<string>(element.value);
  const [completionType, setCompletionType] = useState<string>(element.completionType);

  const [completionTargetValue, setCompletionTargetValue] = useState<number>(
    element.completionTargetValue,
  );
  const [condition, setCondition] = useState<number>(element.greaterThan);
  const [ownedBy, setOwnedBy] = useState<number>(element.ownedById);

  const allUsers = [...users, { id: null, firstName: "None", lastName: "" }];

  const selectOptions = [
    { label: "Numerical #", value: "numerical" },
    { label: "Percentage %", value: "percentage" },
    { label: "Dollars $", value: "currency" },
    { label: "Completion", value: "binary" },
  ];

  const selectCondition = [
    { label: "Greater than or equal to", value: 1 },
    { label: "Less than or equal to", value: 0 },
  ];

  const resetForm = () => {
    setTitle("");
    setCompletionType("numerical");
    setCompletionTargetValue(0);
    setCondition(0);
    setOwnedBy(0);
  };

  const updateKeyElement = () => {
    const keyElementParams = {
      value: title,
      completionType,
      completionTargetValue,
      greaterThan: condition,
      ownedBy,
    };
    let id;

    if (type == "annualInitiative") {
      id = store.annualInitiative.id;
    } else if (type == "quarterlyGoal") {
      id = store.quarterlyGoal.id;
    } else if (type == "subInitiative") {
      id = store.subInitiative.id;
    }
    store.updateKeyElement(id, element.id, keyElementParams);
  };

  const isValid =
    !R.isEmpty(title) &&
    !R.isEmpty(completionType) &&
    !R.isNil(condition) &&
    !R.isNil(completionTargetValue) &&
    !R.isNil(ownedBy);

  const handleSave = () => {
    if (isValid) {
      updateKeyElement();
      onClose();
    }
  };

  const handleSaveAndAddAnother = () => {
    if (isValid) {
      updateKeyElement();
      resetForm();
    }
  };

  const completionSymbol = () => {
    switch (completionType) {
      case "binary":
        return "";
      case "numerical":
        return "#";
      case "percentage":
        return "%";
      case "currency":
        return "$";
    }
  };

  return (
    <Container>
      <RowContainer>
        <FormElementContainer>
          <InputHeaderContainer>
            <InputHeader>Title</InputHeader>
          </InputHeaderContainer>
          <StyledInput
            onChange={e => {
              e.preventDefault();
              setTitle(e.currentTarget.value);
            }}
            value={title}
            placeholder={"Title..."}
          />
        </FormElementContainer>
      </RowContainer>
      <RowContainer mt={"16px"}>
        <FormElementContainer>
          <InputHeaderContainer>
            <InputHeader>Unit</InputHeader>
          </InputHeaderContainer>
          <Select
            onChange={e => {
              e.preventDefault();
              setCompletionType(e.currentTarget.value);
            }}
            value={completionType}
            fontSize={12}
            height={15}
            pt={6}
            pb={10}
          >
            {selectOptions.map(({ label, value }, index) => (
              <option key={`option-${index}`} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </FormElementContainer>
        <FormElementContainer>
          <InputHeaderContainer>
            <InputHeader>Owner</InputHeader>
          </InputHeaderContainer>
          <Select
            onChange={e => {
              e.preventDefault();
              setOwnedBy(e.currentTarget.value);
            }}
            value={ownedBy}
            fontSize={12}
            height={15}
            pt={6}
            pb={10}
          >
            {allUsers
              .filter(user => user.firstName)
              .map(({ id, firstName, lastName }, index) => (
                <option key={`option-${index}`} value={id}>
                  {firstName} {lastName}
                </option>
              ))}
          </Select>
        </FormElementContainer>
      </RowContainer>

      <RowContainer mt={"16px"}>
        <FormElementContainer>
          <InputHeaderContainer>
            <InputHeader>Condition</InputHeader>
          </InputHeaderContainer>
          <Select
            onChange={e => {
              e.preventDefault();
              setCondition(e.currentTarget.value);
            }}
            value={condition}
            fontSize={12}
            height={15}
            pt={6}
            pb={10}
          >
            {selectCondition.map(({ label, value }, index) => (
              <option key={`option-${index}`} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </FormElementContainer>
        {completionType !== "binary" && (
          <FormElementContainer>
            <InputHeaderContainer>
              <InputHeader>Target Value</InputHeader>
            </InputHeaderContainer>
            <InputFromUnitType
              defaultValue={completionTargetValue}
              unitType={completionType}
              placeholder={"90"}
              max={completionType === "percentage" ? 100 : null}
              onChange={e => {
                e.preventDefault();
                const value =
                  completionType === "percentage" && e.currentTarget.value > 100
                    ? 100
                    : e.currentTarget.value;
                setCompletionTargetValue(value);
              }}
              value={completionTargetValue}
            />
            <CompletionTypeContainer>
              <TextDiv fontSize={"12px"}>{completionSymbol()}</TextDiv>
            </CompletionTypeContainer>
          </FormElementContainer>
        )}
      </RowContainer>
      <ButtonRowContainer mt={completionType === "binary" ? "20px" : "0"}>
        <Button variant={"primary"} onClick={handleSave} mr={"8px"} small disabled={!isValid}>
          <TextDiv fontSize={"12px"}>Save</TextDiv>
        </Button>
        {action == "Add" && (
          <Button
            variant={"primaryOutline"}
            onClick={handleSaveAndAddAnother}
            small
            disabled={!isValid}
          >
            <TextDiv fontSize={"12px"}>Save & Add Another</TextDiv>
          </Button>
        )}
      </ButtonRowContainer>
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

const RowContainer = styled.div<SpaceProps>`
  ${space}
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  gap: 16px;
`;
const ButtonRowContainer = styled(RowContainer)`
  margin: 5% 0px;
`;

const FormGroupContainer = styled.div<SpaceProps>`
  ${space}
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const CompletionTypeContainer = styled.div`
  position: absolute;
  right: 30px;
  top: 9px;
`;

const InputHeader = styled.p`
  margin: 0px;
  font-size: 12px;
  font-weight: bold;
`;

const InputHeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

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
`;

const inputStyles = css`
  margin: 0px;
  font-size: 12px;
`;

export const StyledInput = styled(Input)`
  ${inputStyles}
`;

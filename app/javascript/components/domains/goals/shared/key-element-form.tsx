import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { space, SpaceProps } from "styled-system";
import { useState, useRef, useEffect } from "react";
import { Input, Label, Select, Button, TextDiv } from "~/components/shared";
import { baseTheme } from "~/themes/base";
import { Store } from "@material-ui/icons";
import { useMst } from "~/setup/root";

interface IKeyElementFormProps {
  onCreate: (keyElementParams: any) => void;
  onClose: () => void;
  setActionType: any;
  setSelectedElement: any;
}

export const KeyElementForm = ({
  onCreate,
  onClose,
  setActionType,
  setSelectedElement,
}: IKeyElementFormProps): JSX.Element => {
  const { userStore } = useMst();
  const { users } = userStore;
  const [title, setTitle] = useState<string>("");
  const [completionType, setCompletionType] = useState<string>("numerical");
  // const [ , setCompletionCurrentValue] = useState<number>(0);
  const [completionTargetValue, setCompletionTargetValue] = useState<number>(0);
  const [ownedBy, setOwnedBy] = useState<number>(users?.[0].id);
  const [condition, setCondition] = useState<number>(1);

  const selectOptions = [
    { label: "Numerical #", value: "numerical" },
    { label: "Percentage %", value: "percentage" },
    { label: "Dollars $", value: "currency" },
    { label: "Completion", value: "binary" },
  ];

  const selectCondition = [
    { label: "Greater than or equal to", value: 1 },
    { label: "Less than", value: 0 },
  ];

  const resetForm = () => {
    setTitle("");
    setCompletionType("numerical");
    setCompletionTargetValue(0);
    setCondition(0);
    setOwnedBy(0);
    setActionType("Add");
    setSelectedElement(null);
  };

  const createKeyElement = () => {
    const keyElementParams = {
      value: title,
      completionType,
      completionTargetValue,
      greaterThan: condition,
      ownedBy,
    };
    onCreate(keyElementParams);
  };

  const isValid =
    !R.isEmpty(title) &&
    !R.isEmpty(completionType) &&
    !R.isNil(completionTargetValue) &&
    !R.isNil(ownedBy) &&
    !R.isNil(condition);

  const handleSave = () => {
    if (isValid) {
      createKeyElement();
      onClose();
    }
  };

  const handleSaveAndAddAnother = () => {
    if (isValid) {
      createKeyElement();
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
        <FormGroupContainer>
          <Label>Key Result Title</Label>
          <Input
            onChange={e => {
              e.preventDefault();
              setTitle(e.currentTarget.value);
            }}
            value={title}
            placeholder={"Title..."}
          />
        </FormGroupContainer>
      </RowContainer>
      <RowContainer>
        <FormGroupContainer>
          <Label>Unit</Label>
          <Select
            onChange={e => {
              e.preventDefault();
              setCompletionType(e.currentTarget.value);
            }}
            value={completionType}
            style={{ minWidth: "200px" }}
          >
            {selectOptions.map(({ label, value }, index) => (
              <option key={`option-${index}`} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </FormGroupContainer>
        <FormGroupContainer>
          <Label>Owner</Label>
          <Select
            onChange={e => {
              e.preventDefault();
              setOwnedBy(e.currentTarget.value);
            }}
            value={ownedBy}
            style={{ minWidth: "200px" }}
          >
            {users
              .filter(user => user.firstName)
              .map(({ id, firstName, lastName }, index) => (
                <option key={`option-${index}`} value={id}>
                  {firstName} {lastName}
                </option>
              ))}
          </Select>
        </FormGroupContainer>
      </RowContainer>

      <RowContainer mt={"16px"}>
        <FormGroupContainer mb={"15px"}>
          <Label>Condition</Label>
          <Select
            onChange={e => {
              e.preventDefault();
              setCondition(e.currentTarget.value);
            }}
            value={condition}
            style={{ minWidth: "200px" }}
          >
            {selectCondition.map(({ label, value }, index) => (
              <option key={`option-${index}`} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </FormGroupContainer>
        {completionType !== "binary" && (
          <FormGroupContainer>
            <Label>Target Value</Label>
            <InputContainer>
              <Input
                type={"number"}
                min={0}
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
            </InputContainer>
          </FormGroupContainer>
          // </RowContainer>
        )}
      </RowContainer>
      <RowContainer mt={completionType === "binary" ? "20px" : "0"}>
        <Button variant={"primary"} onClick={handleSave} mr={"8px"} small disabled={!isValid}>
          <TextDiv fontSize={"16px"}>Save</TextDiv>
        </Button>
        <Button
          variant={"primaryOutline"}
          onClick={handleSaveAndAddAnother}
          small
          disabled={!isValid}
        >
          <TextDiv fontSize={"16px"}>Save & Add Another</TextDiv>
        </Button>
      </RowContainer>
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

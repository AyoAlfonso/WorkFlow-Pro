import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { space, SpaceProps } from "styled-system";
import { useState, useRef, useEffect } from "react";
import { Input, Label, Select, Button, TextDiv } from "~/components/shared";
import { baseTheme } from "~/themes/base";
import { Store } from "@material-ui/icons";

interface IKeyElementFormProps {
  onCreate: (keyElementParams: any) => void;
  onClose: () => void;
}

export const KeyElementForm = ({ onCreate, onClose }: IKeyElementFormProps): JSX.Element => {
  const [title, setTitle] = useState<string>("");
  const [completionType, setCompletionType] = useState<string>("binary");
  const [completionCurrentValue, setCompletionCurrentValue] = useState<number>(0);
  const [completionTargetValue, setCompletionTargetValue] = useState<number>(0);

  const selectOptions = [
    { label: "Completion", value: "binary" },
    { label: "Numerical", value: "numerical" },
    { label: "Percentage", value: "percentage" },
    { label: "Dollars", value: "currency" },
  ];

  const resetForm = () => {
    setTitle("");
    setCompletionType("binary");
    setCompletionCurrentValue(0);
    setCompletionTargetValue(0);
  };

  const createKeyElement = () => {
    const keyElementParams = {
      value: title,
      completionType,
      completionCurrentValue,
      completionTargetValue,
    };
    onCreate(keyElementParams);
  };

  const isValid =
    !R.isEmpty(title) &&
    !R.isEmpty(completionType) &&
    !R.isNil(completionCurrentValue) &&
    !R.isNil(completionTargetValue);

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
          <Label>Completion measured by</Label>
          <Select
            onChange={e => {
              e.preventDefault();
              setCompletionType(e.currentTarget.value);
            }}
            value={completionType}
            style={{ width: "100%" }}
          >
            {selectOptions.map(({ label, value }, index) => (
              <option key={`option-${index}`} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </FormGroupContainer>
      </RowContainer>
      {completionType !== "binary" && (
        <RowContainer mt={"16px"}>
          <FormGroupContainer mr={"4px"}>
            <Label>Current Value</Label>
            <InputContainer>
              <Input
                type={"number"}
                min={0}
                onChange={e => {
                  e.preventDefault();
                  setCompletionCurrentValue(e.currentTarget.value);
                }}
                value={completionCurrentValue}
              />
            </InputContainer>
          </FormGroupContainer>
          <FormGroupContainer ml={"4px"}>
            <Label>Target Value</Label>
            <InputContainer>
              <Input
                type={"number"}
                min={0}
                onChange={e => {
                  e.preventDefault();
                  setCompletionTargetValue(e.currentTarget.value);
                }}
                value={completionTargetValue}
              />
            </InputContainer>
          </FormGroupContainer>
        </RowContainer>
      )}
      <RowContainer>
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

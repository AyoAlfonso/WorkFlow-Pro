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
  const [completionType, setCompletionType] = useState<string>("numerical");
  const [completionCurrentValue, setCompletionCurrentValue] = useState<number>(0);
  const [completionTargetValue, setCompletionTargetValue] = useState<number>(0);

  const selectOptions = [
    { label: "Numerical #", value: "numerical" },
    { label: "Percentage %", value: "percentage" },
    { label: "Dollars $", value: "currency" },
    { label: "Completion", value: "binary" },
  ];

  const resetForm = () => {
    setTitle("");
    setCompletionType("numerical");
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
          <Label>Completion measured by</Label>
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
              <CompletionTypeContainer>
                <TextDiv fontSize={"12px"}>{completionSymbol()}</TextDiv>
              </CompletionTypeContainer>
            </InputContainer>
          </FormGroupContainer>
          <FormGroupContainer ml={"4px"}>
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
        </RowContainer>
      )}
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

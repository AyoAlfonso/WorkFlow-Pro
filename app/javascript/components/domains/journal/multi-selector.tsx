import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Checkbox, Label } from "@rebass/forms";
import { baseTheme } from "~/themes/base";

export interface IMultiSelectorProps {
  checkboxColor?: string;
  checkedLimit?: number;
  disabled?: boolean;
  options: Array<any>;
  optionsChecked: Array<any>;
  setOptionsChecked: React.Dispatch<React.SetStateAction<any>>;
}

export const MultiSelector = ({
  checkboxColor,
  checkedLimit,
  disabled,
  options,
  optionsChecked,
  setOptionsChecked,
}: IMultiSelectorProps): JSX.Element => {
  return (
    <Container>
      {options.map((option, index) => (
        <CheckboxComponent
          option={option}
          key={option.id}
          setOptionsChecked={setOptionsChecked}
          optionsChecked={optionsChecked}
          checkedLimit={checkedLimit}
          checkboxColor={checkboxColor}
          disabled={disabled}
        />
      ))}
    </Container>
  );
};

const CheckboxComponent = ({
  checkboxColor,
  checkedLimit,
  disabled,
  option,
  optionsChecked,
  setOptionsChecked,
}) => {
  const isChecked = optionsChecked.includes(option);
  const [checked, setChecked] = useState<boolean>(isChecked);

  const toggleChecked = () => {
    if (checkedLimit) {
      if (optionsChecked.length < checkedLimit) {
        setChecked(!checked);
      } else {
        setChecked(false);
      }
    } else {
      setChecked(!checked);
    }
  };

  return (
    <CheckBoxContainer
      // this is bad for accessibility to not have labels for the checkboxes, but for whatever reason labels
      // completely break the styling for the chatbot and cause it to do some weird things
      onClick={() => {
        if (!disabled) {
          toggleChecked();
          setOptionsChecked(option);
        }
      }}
    >
      <Checkbox
        id={option.id}
        name={option.description}
        checked={checked}
        onChange={() => {}}
        sx={{
          color: Object.keys(baseTheme.colors).includes(checkboxColor)
            ? baseTheme.colors[checkboxColor]
            : checkboxColor,
        }}
      />
      {option.description}
    </CheckBoxContainer>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 300px;
`;

const CheckBoxContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 12px;
  &:hover {
    cursor: pointer;
  }
`;

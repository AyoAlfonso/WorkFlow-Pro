import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Checkbox, Label } from "@rebass/forms";
import { baseTheme } from "~/themes/base";
import { TextNoMargin } from "~/components/shared/text";

export interface IMultiSelectorProps {
  options: Array<any>;
  optionsChecked: Array<any>;
  setOptionsChecked: React.Dispatch<React.SetStateAction<any>>;
  checkedLimit?: number;
}

export const MultiSelector = ({
  checkedLimit,
  options,
  optionsChecked,
  setOptionsChecked,
}: IMultiSelectorProps): JSX.Element => {
  return (
    <Container>
      {options.map((option, index) => (
        <CheckboxComponent
          option={option}
          key={index}
          setOptionsChecked={setOptionsChecked}
          optionsChecked={optionsChecked}
          checkedLimit={checkedLimit}
        />
      ))}
    </Container>
  );
};

const CheckboxComponent = ({ checkedLimit, option, optionsChecked, setOptionsChecked }) => {
  const [checked, setChecked] = useState<boolean>(false);

  const toggleChecked = () => {
    console.log("CHECKED: ", checked);
    console.log(optionsChecked);
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
        toggleChecked();
        setOptionsChecked(option);
      }}
    >
      <Checkbox
        id={option.id}
        name={option.description}
        checked={checked}
        onChange={() => {}}
        sx={{ color: baseTheme.colors.primary100 }}
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

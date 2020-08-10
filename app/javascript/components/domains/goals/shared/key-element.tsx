import * as React from "react";
import styled from "styled-components";
import { useState } from "react";
import "react-tabs/style/react-tabs.css";
import { Checkbox, Label } from "@rebass/forms";
import ContentEditable from "react-contenteditable";
import { KeyElementType } from "~/types/key-element";

interface IKeyElementProps {
  element: KeyElementType;
  store: any;
  editable: boolean;
}

export const KeyElement = ({ element, store, editable }: IKeyElementProps): JSX.Element => {
  const [checkboxValue, setCheckboxValue] = useState<boolean>(
    element["completedAt"] ? true : false,
  );

  return (
    <KeyElementContainer>
      <CheckboxContainer>
        <Label>
          <Checkbox
            id={element.id}
            name={element.id}
            checked={checkboxValue}
            onChange={e => {
              setCheckboxValue(e.target.checked);
              store.updateKeyElementStatus(element.id, e.target.checked);
            }}
          />
        </Label>
      </CheckboxContainer>

      <KeyElementStyledContentEditable
        html={element.value}
        disabled={!editable}
        onChange={e => store.updateKeyElementValue(element.id, e.target.value)}
        onBlur={() => store.update()}
        completed={checkboxValue}
      />
    </KeyElementContainer>
  );
};

const KeyElementContainer = styled.div`
  display: flex;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  margin-top: auto;
  margin-bottom: auto;
`;

const StyledContentEditable = styled(ContentEditable)`
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 10px;
  border: 1px solid #e3e3e3;
  box-shadow: 0px 3px 6px #f5f5f5;
  padding-left: 16px;
  padding-right: 16px;
`;

type KeyElementStyledContentEditableType = {
  completed: boolean;
};

const KeyElementStyledContentEditable = styled(StyledContentEditable)<
  KeyElementStyledContentEditableType
>`
  width: 100%;
  text-decoration: ${props => props.completed && "line-through"};
`;

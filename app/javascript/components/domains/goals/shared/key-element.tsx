import * as React from "react";
import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import "react-tabs/style/react-tabs.css";
import { Checkbox, Label } from "@rebass/forms";
import ContentEditable from "react-contenteditable";
import { KeyElementType } from "~/types/key-element";
import { baseTheme } from "~/themes";

interface IKeyElementProps {
  element: KeyElementType;
  store: any;
  editable: boolean;
  lastKeyElement: boolean;
  focusOnLastInput: boolean;
  setFocusOnLastInput: React.Dispatch<React.SetStateAction<boolean>>;
}

export const KeyElement = ({
  element,
  store,
  editable,
  lastKeyElement,
  focusOnLastInput,
  setFocusOnLastInput,
}: IKeyElementProps): JSX.Element => {
  const [checkboxValue, setCheckboxValue] = useState<boolean>(
    element["completedAt"] ? true : false,
  );

  const keyElementRef = useRef(null);

  useEffect(() => {
    if (lastKeyElement && editable && focusOnLastInput) {
      keyElementRef.current.focus();
    }
  }, [focusOnLastInput]);

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
            sx={{
              color: baseTheme.colors.primary100,
            }}
          />
        </Label>
      </CheckboxContainer>

      <KeyElementStyledContentEditable
        innerRef={keyElementRef}
        html={element.value}
        disabled={!editable}
        onChange={e => {
          if (!e.target.value.includes("<div>")) {
            store.updateKeyElementValue(element.id, e.target.value);
          }
        }}
        onKeyDown={key => {
          if (key.keyCode == 13) {
            store.createKeyElement().then(() => {
              setFocusOnLastInput(true);
            });
          }
        }}
        onBlur={() => store.update()}
        completed={checkboxValue.toString()} //CHRIS' NOTE: YOU CANT PASS A BOOLEAN VALUE INTO STYLED COMPONENTS.
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
  completed: string;
};

const KeyElementStyledContentEditable = styled(StyledContentEditable)<
  KeyElementStyledContentEditableType
>`
  width: 100%;
  text-decoration: ${props => (props.completed == "true" ? "line-through" : "")};
`;

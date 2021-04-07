import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import "react-tabs/style/react-tabs.css";
import { Checkbox, Label } from "@rebass/forms";
import ContentEditable from "react-contenteditable";
import { KeyElementType } from "~/types/key-element";
import { baseTheme } from "~/themes";
import { StripedProgressBar } from "~/components/shared/progress-bars";
import { Icon, Text } from "~/components/shared";
import { HomeContainerBorders } from "~/components/domains/home/shared-components";

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
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const keyElementTitleRef = useRef(null);
  const keyElementCompletionTargetRef = useRef(null);

  useEffect(() => {
    if (lastKeyElement && editable && focusOnLastInput) {
      keyElementTitleRef.current.focus();
    }
  }, [focusOnLastInput]);

  const completionSymbol = () => {
    switch (element.completionType) {
      case "numerical":
        return "#";
      case "percentage":
        return "%";
      case "currency":
        return "$";
    }
  };

  const completion =
    element.completionTargetValue > 0
      ? (element.completionCurrentValue / element.completionTargetValue) * 100
      : 0;

  const sanitize = html => {
    const result = R.pipe(
      R.replace(/<div>/g, ""),
      R.replace(/<\/div>/g, ""),
      R.replace(/<br>/g, ""),
    )(html);
    return result;
  };

  return (
    <KeyElementContainer>
      {element.completionType === "binary" && (
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
      )}
      <ContentContainer>
        <KeyElementStyledContentEditable
          innerRef={keyElementTitleRef}
          html={sanitize(element.value)}
          disabled={!editable}
          onChange={e => {
            if (!e.target.value.includes("<div>")) {
              store.updateKeyElementValue("value", element.id, e.target.value);
            }
          }}
          onKeyDown={key => {
            if (key.keyCode == 13) {
              keyElementTitleRef.current.blur();
            }
          }}
          onBlur={() => store.update()}
          completed={checkboxValue.toString()} //CHRIS' NOTE: YOU CANT PASS A BOOLEAN VALUE INTO STYLED COMPONENTS.
          placeholder={"Title..."}
        />
        {element.completionType !== "binary" && (
          <CompletionContainer>
            <ProgressContainer>
              <StyledContentEditable
                innerRef={keyElementCompletionTargetRef}
                html={sanitize(`${element.completionCurrentValue}`)}
                disabled={!editable}
                onChange={e => {
                  if (!e.target.value.includes("<div>")) {
                    store.updateKeyElementValue(
                      "completionCurrentValue",
                      element.id,
                      parseInt(e.target.value),
                    );
                  }
                }}
                onKeyDown={key => {
                  if (key.keyCode == 13) {
                    keyElementCompletionTargetRef.current.blur();
                  }
                }}
                onBlur={() => store.update()}
                placeholder={completionSymbol()}
              />
              <CompletionTextContainer>
                {`/ ${element.completionTargetValue}${completionSymbol()}`}
              </CompletionTextContainer>
            </ProgressContainer>
            <ProgressBarContainer>
              <StripedProgressBar variant={"primary"} completed={completion} />
            </ProgressBarContainer>
          </CompletionContainer>
        )}
      </ContentContainer>
      <OptionsButtonContainer
        onClick={() => {
          setShowOptions(!showOptions);
        }}
      >
        <Icon icon={"Options"} size={"12px"} iconColor={"grey40"} />
      </OptionsButtonContainer>
      {showOptions && (
        <OptionsContainer>
          <Option
            onClick={() => {
              store.deleteKeyElement(element.id);
            }}
          >
            <OptionText>Delete</OptionText>
          </Option>
        </OptionsContainer>
      )}
    </KeyElementContainer>
  );
};

const KeyElementContainer = styled.div`
  display: flex;
  position: relative;
  margin-bottom: 24px;
`;

const ContentContainer = styled.div`
  width: 90%;
`;

const CheckboxContainer = styled.div`
  display: flex;
  margin-top: 6px;
  width: 40px;
`;

const OptionsButtonContainer = styled.div`
  position: absolute;
  margin-top: 5px;
  right: 0;
  top: 0;
  transform: rotate(90deg);
  &:hover {
    cursor: pointer;
  }
`;

const OptionsContainer = styled(HomeContainerBorders)`
  position: absolute;
  background: white;
  right: 0;
  top: 12px;
  width: 100px;
  z-index: 2;
`;

const OptionText = styled(Text)`
  color: black;
  cursor: pointer;
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 12px;
`;

const Option = styled.div`
  display: flex;
  &:hover {
    background-color: ${props => props.theme.colors.primary100};
    border-radius: 10px;
    z-index: 2;
  }
  &:hover ${OptionText} {
    color: white;
  }
`;

const StyledContentEditable = styled(ContentEditable)`
  box-sizing: border-box;
  /* width: 100%; */
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 16px;
  padding-right: 16px;
  border-radius: 10px;
  border: 1px solid #e3e3e3;
  box-shadow: 0px 3px 6px #f5f5f5;
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

const CompletionContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 8px;
`;

const CompletionTextContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  white-space: nowrap;
  margin-left: 8px;
  margin-right: 16px;
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 25%;
`;

const ProgressBarContainer = styled.div`
  width: 75%;
`;

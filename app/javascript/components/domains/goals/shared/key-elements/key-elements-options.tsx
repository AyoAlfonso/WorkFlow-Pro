import * as React from "react";
import styled from "styled-components";
import { Icon } from "~/components/shared/icon";
import { useEffect, useRef } from "react";
import { useMst } from "~/setup/root";
import { useTranslation } from "react-i18next";

interface IKeyElementsDropdownOptionsProps {
  setShowDropdownOptions: any;
  showOptions: any;
  setShowKeyElementForm: any;
  setActionType: any;
  setSelectedElement: any;
  element: any;
  store: any;
}

export const KeyElementsDropdownOptions = ({
  setShowDropdownOptions,
  showOptions,
  setShowKeyElementForm,
  setActionType,
  setSelectedElement,
  element,
  store,
}: IKeyElementsDropdownOptionsProps): JSX.Element => {
  const optionsRef = useRef(null);

  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = event => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowDropdownOptions(!showOptions);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [optionsRef, showOptions]);

  const editKeyElement = () => {
    setShowKeyElementForm(true);
    setActionType("Edit");
    setSelectedElement(element);
  };

  const deleteKeyElement = () => {
    if (confirm(`Are you sure you want to delete this key result?`)) {
      store.deleteKeyElement(element.id);
    }
  };

  return (
    <Container ref={optionsRef}>
      {/* 
        // DONT HAVE THE PATTERN TO CREATE AN INITIATIVE YET.
        {itemType == "quarterlyGoal" && (
        <OptionContainer onClick={() => createSubInitiative()}>
          <IconContainer>
            <StyledIcon icon={"Plus"} size={"15px"} />
          </IconContainer>
          <OptionText> Create Sub-Initiative </OptionText>
        </OptionContainer>
      )} */}

      <OptionContainer onClick={() => editKeyElement()}>
        <IconContainer>
          <StyledIcon icon={"Checkmark"} size={"15px"} />
        </IconContainer>
        <OptionText> Edit </OptionText>
      </OptionContainer>
      <OptionContainer onClick={() => deleteKeyElement()}>
        <IconContainer>
          <StyledIcon icon={"Delete"} size={"15px"} />
        </IconContainer>
        <OptionText> Delete </OptionText>
      </OptionContainer>
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  background-color: ${props => props.theme.colors.white};
  box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  z-index: 3;
  margin-left: -80px;
  margin-top: 5px;
  height: auto;
  overflow: auto;
`;

const TextContainer = styled.div`
  margin-left: 8px;
  font-size: 12px;
  margin-top: auto;
  margin-bottom: auto;
  color: ${props => props.theme.colors.black};
`;

const IconContainer = styled.div`
  color: ${props => props.theme.colors.greyInactive};
  width: 20px;
  text-align: center;
  margin-top: auto;
  margin-bottom: auto;
`;

const OptionText = styled(TextContainer)`
  color: ${props => props.theme.colors.black};
  margin-left: 8px;
  white-space: nowrap;
`;

export const StyledIcon = styled(Icon)``;

type InitialsTextProps = {
  fontSize?: string;
  fontColor?: string;
};

export const InitialsText = styled.div<InitialsTextProps>`
  font-size: ${props => props.fontSize || "12px"};
  font-weight: bold;
  margin-top: auto;
  margin-bottom: auto;
  color: ${props => props.fontColor};
`;

const OptionContainer = styled.div`
  display: flex;
  height: 24px;
  padding-left: 16px;
  padding-right: 16px;
  margin-top: 4px;
  margin-bottom: 4px;
  &: hover {
    cursor: pointer;
    background-color: ${props => props.theme.colors.primary100};
  }
  &:hover ${OptionText} {
    color: white;
  }
  &: hover ${InitialsText}{
    color: white;
  }
  &: hover ${StyledIcon}{
    color: white;
  }

`;

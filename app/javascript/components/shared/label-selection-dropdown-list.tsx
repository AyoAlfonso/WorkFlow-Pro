import * as React from "react";
import styled from "styled-components";
import { Text } from "./text";
import { Icon } from "./";

interface ILabelSelectionDropdownListProps {
  labelsList: any;
  onLabelSelect: any;
}

export const LabelSelectionDropdownList = ({
  labelsList,
  onLabelSelect,
}: ILabelSelectionDropdownListProps): JSX.Element => {
  const renderLabelOptions = (): Array<JSX.Element> => {
    return labelsList.map((label, index) => {
      return (
        <LabelOption key={index} onClick={() => onLabelSelect(label)}>
          <Icon
            icon={"Priority-Empty"}
            size={"25px"}
            iconColor={label.color ? label.color : "grey60"}
          />
          <LabelOptionText> {`${label.name}`}</LabelOptionText>
        </LabelOption>
      );
    });
  };

  return <ActionDropdownContainer>{renderLabelOptions()}</ActionDropdownContainer>;
};

const ActionDropdownContainer = styled.div`
  position: absolute;
  background-color: ${props => props.theme.colors.white};
  box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.1);
  margin-left: -10px;
  margin-top: 5px;
  border-radius: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  z-index: 2;
  height: auto;
  overflow: auto;
`;

const LabelOptionText = styled(Text)`
  color: ${props => props.theme.colors.primary100};
  cursor: pointer;
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 6px;
  padding-bottom: 6px;
  padding-left: 12px;
  padding-right: 18px;
`;

const LabelOption = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 5px;
  padding-right: 10px;
  &:hover {
    background-color: ${props => props.theme.colors.primary100};
  }
  &:hover ${LabelOptionText} {
    color: white;
  }
`;

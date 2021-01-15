import * as React from "react";
import styled from "styled-components";
import { LabelType } from "~/types/label";
import { Text } from "./text";

interface ILabelSelectionDropdownListProps {
  labelsList: Array<LabelType>;
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
          <LabelOptionText> {`${label.name}`}</LabelOptionText>
        </LabelOption>
      );
    });
  };

  return <ActionDropdownContainer>{renderLabelOptions()}</ActionDropdownContainer>;
};

const ActionDropdownContainer = styled.div`
  position: absolute;
  background-color: ${props => props.theme.colors.backgroundBlue};
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
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 12px;
`;

const LabelOption = styled.div`
  display: flex;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 10px;
  padding-right: 10px;
  &:hover {
    background-color: ${props => props.theme.colors.primary100};
  }
  &:hover ${LabelOptionText} {
    color: white;
  }
`;

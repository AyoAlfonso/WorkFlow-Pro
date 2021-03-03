import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { Text, TextDiv } from "./";
import { LabelSelectionDropdownList } from "./";
import { Icon } from "./";
import { useMst } from "../../setup/root";
import { baseTheme } from "~/themes";

interface ILabelSelectionProps {
  selectedLabel: any;
  setSelectedLabel: any;
  onLabelClick: any;
  showLabelsList: boolean;
  inlineEdit?: boolean;
  afterLabelSelectAction?: any;
  marginLeft?: string;
}

export const LabelSelection = ({
  selectedLabel,
  setSelectedLabel,
  onLabelClick,
  showLabelsList,
  inlineEdit = false,
  afterLabelSelectAction,
  marginLeft,
}: ILabelSelectionProps): JSX.Element => {
  const { labelStore } = useMst();
  const { labelsList } = labelStore;

  const styledLabelTextColor = () => {
    if (inlineEdit) {
      return selectedLabel.color || baseTheme.colors.grey60;
    } else {
      return baseTheme.colors.primary100;
    }
  };

  const closeModal = () => {
    onLabelClick(false);
  };

  return (
    <LabelContainer onClick={() => onLabelClick(!showLabelsList)} marginLeft={marginLeft}>
      {!R.isNil(selectedLabel) ? (
        <StyledLabel>
          <Icon
            icon={"Label"}
            size={inlineEdit ? "10px" : "16px"}
            iconColor={selectedLabel.color ? selectedLabel.color : "grey60"}
            style={{ marginLeft: "10px" }}
          />
          <StyledLabelText color={styledLabelTextColor()}>{selectedLabel.name}</StyledLabelText>
        </StyledLabel>
      ) : (
        <StyledLabel>
          <Icon icon={"Label"} size={inlineEdit ? "10px" : "16px"} iconColor={"grey60"} />
        </StyledLabel>
      )}
      {showLabelsList && (
        <div onClick={e => e.stopPropagation()}>
          <LabelSelectionDropdownList
            labelsList={labelsList}
            setSelectedLabel={setSelectedLabel}
            afterLabelSelectAction={afterLabelSelectAction}
            closeModal={closeModal}
          />
        </div>
      )}
    </LabelContainer>
  );
};

type LabelContainerProps = {
  marginLeft?: string;
};

const LabelContainer = styled.div<LabelContainerProps>`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  margin-left: ${props => props.marginLeft || "auto"};
  margin-right: 5px;
  height: 20px;
  margin-top: auto;
  margin-bottom: auto;
  &: hover {
    cursor: pointer;
  }
`;

const StyledLabel = styled(TextDiv)`
  color: ${props => props.theme.colors.primary100};
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-left: 6px;
  margin-right: 6px;
`;

type StyledLabelTextProps = {
  color: string;
};

const StyledLabelText = styled(Text)<StyledLabelTextProps>`
  color: ${props => props.color};
  cursor: pointer;
  margin-left: 6px;
  margin-right: 6px;
`;

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
  marginLeftDropdownList?: string;
}

export const LabelSelection = ({
  selectedLabel,
  setSelectedLabel,
  onLabelClick,
  showLabelsList,
  inlineEdit = false,
  afterLabelSelectAction,
  marginLeft,
  marginLeftDropdownList,
}: ILabelSelectionProps): JSX.Element => {
  const { labelStore } = useMst();
  const { labelsList } = labelStore;

  const styledLabelTextColor = () => {
    if (inlineEdit) {
      return selectedLabel.color || baseTheme.colors.grey60;
    } else {
      return selectedLabel.color || baseTheme.colors.primary100;
    }
  };

  const closeModal = () => {
    onLabelClick(false);
  };

  return (
    <LabelContainer onClick={() => onLabelClick(!showLabelsList)} marginLeft={marginLeft}>
      {!R.isNil(selectedLabel) ? (
        <StyledLabel inlineEdit={inlineEdit}>
          <Icon
            icon={"Label"}
            size={inlineEdit ? "10px" : "16px"}
            iconColor={selectedLabel.color ? selectedLabel.color : "grey60"}
            style={{ marginLeft: "10px" }}
          />
          <StyledLabelText color={styledLabelTextColor()}>{selectedLabel.name}</StyledLabelText>
        </StyledLabel>
      ) : (
        <DefaultStyledLabel inlineEdit={inlineEdit}>
          <DefaultStyledLabelContainer>
            <Icon icon={"Label"} size={inlineEdit ? "10px" : "16px"} iconColor={"grey60"} />{" "}
            {inlineEdit && <DefaultStyledTextContainer>Label</DefaultStyledTextContainer>}
          </DefaultStyledLabelContainer>
        </DefaultStyledLabel>
      )}
      {showLabelsList && (
        <div onClick={e => e.stopPropagation()}>
          <LabelSelectionDropdownList
            labelsList={labelsList}
            setSelectedLabel={setSelectedLabel}
            afterLabelSelectAction={afterLabelSelectAction}
            closeModal={closeModal}
            marginLeft={marginLeftDropdownList}
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
  height: 20px;
  margin-top: auto;
  margin-bottom: auto;
  &: hover {
    cursor: pointer;
  }
`;

type StyledLabel = {
  inlineEdit: boolean;
};

const StyledLabel = styled(TextDiv)<StyledLabel>`
  color: ${props => props.theme.colors.primary100};
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-left: 6px;
  margin-right: ${props => !props.inlineEdit && "8px"};
`;

type StyledLabelTextProps = {
  color: string;
};

const StyledLabelText = styled(Text)<StyledLabelTextProps>`
  color: ${props => props.color};
  cursor: pointer;
  margin-left: 6px;
`;

type DefaultStyledLabelContainer = {
  inlineEdit: boolean;
};

export const DefaultStyledLabel = styled(StyledLabel)<DefaultStyledLabelContainer>`
  display: ${props => (props.inlineEdit ? "none" : "block")};
`;

const DefaultStyledTextContainer = styled.div`
  margin-left: 4px;
  color: ${props => props.theme.colors.grey60};
`;

const DefaultStyledLabelContainer = styled.div`
  display: flex;
`;

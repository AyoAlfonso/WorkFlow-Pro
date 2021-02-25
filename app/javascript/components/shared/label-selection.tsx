import * as React from "react";
import { useEffect, useState, useRef } from "react";
import * as R from "ramda";
import styled from "styled-components";
import { Text, TextDiv } from "./";
import { LabelSelectionDropdownList } from "./";
import { Icon } from "./";
import { useMst } from "../../setup/root";
import { baseTheme } from "~/themes";

interface ILabelSelectionProps {
  onLabelClick: any;
  showLabelsList: boolean;
  selectedItemId?: number | string;
  inlineEdit?: boolean;
  afterLabelSelectAction?: any;
  marginLeft?: string;
}

export const LabelSelection = ({
  onLabelClick,
  showLabelsList,
  selectedItemId,
  inlineEdit = false,
  afterLabelSelectAction,
  marginLeft,
}: ILabelSelectionProps): JSX.Element => {
  const { labelStore } = useMst();
  const [selectedLabel, setSelectedLabel] = useState<any>(null);
  const wrapperRef = useRef(null);

  const { labelsList } = labelStore;

  useEffect(() => {
    if (selectedItemId && labelsList) {
      const label = labelsList.find(label => label.id == selectedItemId);
      setSelectedLabel(label);
    }
  }, []);

  const useOutsideModalCloser = ref => {
    useEffect(() => {
      const handleClickOutside = event => {
        if (ref.current && !ref.current.contains(event.target)) {
          onLabelClick(showLabelsList);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };
  useOutsideModalCloser(wrapperRef);

  const styledLabelTextColor = () => {
    if (inlineEdit) {
      return selectedLabel.color || baseTheme.colors.grey60;
    } else {
      return baseTheme.colors.primary100;
    }
  };

  return (
    <LabelContainer onClick={() => onLabelClick(true)} marginLeft={marginLeft}>
      {!R.isNil(selectedLabel) ? (
        <StyledLabel>
          <Icon
            icon={"Label"}
            size={inlineEdit ? "10px" : "25px"}
            iconColor={selectedLabel.color ? selectedLabel.color : "grey60"}
            style={{ marginLeft: "10px" }}
          />
          <StyledLabelText color={styledLabelTextColor()}>{selectedLabel.name}</StyledLabelText>
        </StyledLabel>
      ) : (
        <StyledLabel>
          <Icon icon={"Label"} size={inlineEdit ? "10px" : "25px"} iconColor={"grey60"} />
        </StyledLabel>
      )}
      {showLabelsList && (
        <div ref={wrapperRef}>
          <LabelSelectionDropdownList
            labelsList={labelsList}
            onLabelSelect={setSelectedLabel}
            afterLabelSelectAction={afterLabelSelectAction}
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
  margin-right: 12px;
  height: 20px;
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

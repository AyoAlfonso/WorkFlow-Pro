import * as React from "react";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/shared/button";
import ContentEditable from "react-contenteditable";
import { GoalDropdownOptions } from "../shared/goal-dropdown-options";

interface IDropdownOptionsProps {
  editable: boolean;
  showDropdownOptionsContainer: boolean;
  setShowDropdownOptionsContainer: React.Dispatch<React.SetStateAction<boolean>>;
  setParentModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  itemType: string;
  item: any;
}

export const DropdownOptions = ({
  editable,
  showDropdownOptionsContainer,
  setShowDropdownOptionsContainer,
  setParentModalOpen,
  itemType,
  item,
}: IDropdownOptionsProps): JSX.Element => {
  return editable ? (
    <Container onClick={() => setShowDropdownOptionsContainer(!showDropdownOptionsContainer)}>
      <StyledOptionIcon icon={"Options"} size={"16px"} iconColor={"grey80"} />
      {showDropdownOptionsContainer && (
        <GoalDropdownOptions
          setShowDropdownOptions={setShowDropdownOptionsContainer}
          setModalOpen={setParentModalOpen}
          itemType={itemType}
          itemId={item.id}
        />
      )}
    </Container>
  ) : (
    <></>
  );
};

const Container = styled.div`
  margin-right: 16px;
  &: hover {
    cursor: pointer;
  }
`;

const StyledOptionIcon = styled(Icon)`
  transform: rotate(90deg);
`;

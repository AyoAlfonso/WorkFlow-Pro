import * as React from "react";
import styled from "styled-components";
import { Icon } from "~/components/shared/icon";
import { GoalDropdownOptions } from "../shared/goal-dropdown-options";

interface IDropdownOptionsProps {
  editable: boolean;
  showDropdownOptionsContainer: boolean;
  setShowDropdownOptionsContainer: React.Dispatch<React.SetStateAction<boolean>>;
  setParentModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  itemType: string;
  item: any;
  quarter?: number;
}

export const DropdownOptions = ({
  editable,
  showDropdownOptionsContainer,
  setShowDropdownOptionsContainer,
  setParentModalOpen,
  itemType,
  item,
  quarter,
}: IDropdownOptionsProps): JSX.Element => {
  return editable ? (
    <Container onClick={() => setShowDropdownOptionsContainer(!showDropdownOptionsContainer)}>
      <StyledOptionIcon icon={"Options"} size={"16px"} iconColor={"grey80"} />
      {showDropdownOptionsContainer && (
        <GoalDropdownContainer>
          {(quarter && !item.closedAt)? (
          <GoalDropdownOptions
            setShowDropdownOptions={setShowDropdownOptionsContainer}
            setModalOpen={setParentModalOpen}
            itemType={itemType}
            itemId={item.id}
            quarter={quarter}
          />
          ) : (
            <GoalDropdownOptions
              setShowDropdownOptions={setShowDropdownOptionsContainer}
              setModalOpen={setParentModalOpen}
              itemType={itemType}
              itemId={item.id}
            />
          )}
        </GoalDropdownContainer>
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

const GoalDropdownContainer = styled.div`
  margin-left: -50px;
`;

import * as React from "react";
import styled from "styled-components";
import { useState } from "react";
import { Button } from "~/components/shared/button";
import { Icon } from "~/components/shared/icon";
import { TextInput } from "~/components/shared/text-input";
import { HomeContainerBorders } from "../../home/shared-components";

interface ICreateGoalSectionProps {
  type?: string;
  placeholder: string;
  addButtonText: string;
  createButtonText: string;
  showCreateGoal: boolean;
  setShowCreateGoal: React.Dispatch<React.SetStateAction<boolean>>;
  createAction: any;
  annualInitiativeId?: string | number;
}

export const CreateGoalSection = ({
  type,
  placeholder,
  addButtonText,
  createButtonText,
  showCreateGoal,
  setShowCreateGoal,
  createAction,
  annualInitiativeId,
}: ICreateGoalSectionProps): JSX.Element => {
  const [description, setDescription] = useState<string>("");

  return showCreateGoal ? (
    <CreateAnnualInitiativeCardContainer>
      <TextInput textValue={description} setTextValue={setDescription} placeholder={placeholder} />
      <ActionsContainer>
        <AddInitiativeButton
          small
          variant={"primary"}
          onClick={() => {
            const variables = type
              ? { type, description }
              : annualInitiativeId
              ? { annualInitiativeId, description }
              : { description };
            createAction(variables).then(() => {
              setShowCreateGoal(false);
              setDescription("");
            });
          }}
        >
          <AddInitiativeText>{createButtonText}</AddInitiativeText>
        </AddInitiativeButton>
        <CloseIconContainer
          onClick={() => {
            setShowCreateGoal(false);
            setDescription("");
          }}
        >
          <Icon icon={"Close"} size={"20px"} style={{ marginTop: "3px" }} iconColor={"grey60"} />
        </CloseIconContainer>
      </ActionsContainer>
    </CreateAnnualInitiativeCardContainer>
  ) : (
    <StyledButton small variant={"grey"} onClick={() => setShowCreateGoal(true)}>
      <Icon icon={"Plus"} size={"20px"} style={{ marginTop: "3px" }} />
      <AddGoalText>{addButtonText}</AddGoalText>
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 240px;
  width: -webkit-fill-available;
  &: hover {
    color: ${props => props.theme.colors.primary100};
  }
`;

const AddGoalText = styled.p`
  margin-left: 16px;
`;

const CreateAnnualInitiativeCardContainer = styled(HomeContainerBorders)`
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 16px;
  padding-right: 16px;
`;

const ActionsContainer = styled.div`
  display: flex;
  margin-top: 16px;
`;

const AddInitiativeButton = styled(Button)`
  width: 120px;
  padding: 0;
  &: hover {
    font-weight: bold;
    background-color: ${props => props.theme.colors.primaryActive};
  }
`;
const AddInitiativeText = styled.p`
  margin: 0;
  font-size: 14px;
`;

const CloseIconContainer = styled.div`
  margin-left: 16px;
  margin-top: auto;
  margin-bottom: auto;
  &:hover {
    cursor: pointer;
  }
`;

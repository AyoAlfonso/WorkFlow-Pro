import * as React from "react";
import styled from "styled-components";
import { useState } from "react";
import { Button } from "~/components/shared/button";
import { Icon } from "~/components/shared/icon";
import { TextInput } from "~/components/shared/text-input";
import { HomeContainerBorders } from "../../home/shared-components";
import { TextDiv } from "~/components/shared/text";

interface ICreateGoalSectionProps {
  type?: string;
  placeholder: string;
  addButtonText: string;
  createButtonText: string;
  showCreateGoal: boolean;
  setShowCreateGoal: React.Dispatch<React.SetStateAction<boolean>>;
  createAction: any;
  annualInitiativeId?: string | number;
  buttonWidth?: string;
  inAnnualInitiative?: boolean;
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
  buttonWidth,
  inAnnualInitiative,
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

            if (annualInitiativeId) {
              createAction(variables, inAnnualInitiative).then(() => {
                setShowCreateGoal(false);
                setDescription("");
              });
            } else {
              createAction(variables).then(() => {
                setShowCreateGoal(false);
                setDescription("");
              });
            }
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
    <StyledButton
      small
      variant={"grey"}
      onClick={() => setShowCreateGoal(true)}
      width={buttonWidth}
    >
      <Icon icon={"Plus"} size={"20px"} />
      <AddGoalText>{addButtonText}</AddGoalText>
    </StyledButton>
  );
};

type StyledButtonType = {
  width?: string;
};

const StyledButton = styled(Button)<StyledButtonType>`
  display: flex;
  justify-content: center;
  margin-left: 8px;
  align-items: center;
  min-width: ${props => !props.width && "240px"};
  width: ${props => (props.width ? props.width : "-webkit-fill-available")};
  &: hover {
    color: ${props => props.theme.colors.primary100};
  }
  height: 100%;
`;

const AddGoalText = styled(TextDiv)`
  margin-left: 16px;
  white-space: break-spaces;
`;

const CreateAnnualInitiativeCardContainer = styled(HomeContainerBorders)`
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 16px;
  padding-right: 16px;
  background-color: white;
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

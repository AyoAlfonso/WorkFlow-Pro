import * as React from "react";
import styled from "styled-components";
import { useState } from "react";
import { Button } from "~/components/shared/button";
import { Icon } from "~/components/shared/icon";
import { TextInput } from "~/components/shared/text-input";
import { HomeContainerBorders } from "../../home/shared-components";
import { TextDiv } from "~/components/shared/text";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";

interface ICreateGoalSectionProps {
  type?: string;
  placeholder: string;
  addButtonText: string;
  createButtonText: string;
  showCreateGoal: boolean;
  setShowCreateGoal: React.Dispatch<React.SetStateAction<boolean>>;
  createAction: any;
  annualInitiativeId?: string | number;
  quarterlyGoalId?: string | number;
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
  quarterlyGoalId,
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
              : quarterlyGoalId
              ? { quarterlyGoalId, description }
              : { description };

            if (annualInitiativeId) {
              if (!variables.description) {
                return showToast(`Please add a description`, ToastMessageConstants.INFO);
              }
              createAction(variables, inAnnualInitiative).then(() => {
                // leave open for next item creation - // setShowCreateGoal(false);
                setDescription("");
                //open the next item for creation
              });
            } else {
              createAction(variables).then(() => {
                // leave open for next item creation - // setShowCreateGoal(false);
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
          <Icon icon={"Close"} size={"12px"} style={{ marginTop: "3px" }} iconColor={"grey60"} />
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
      <CircularIcon icon={"Plus"} size={"12px"} />
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
  align-items: center;
  width: ${props => (props.width != "fill" ? props.width : "-webkit-fill-available")};
  padding-left: 0;
  padding-right: 0;
  background-color: ${props => props.theme.colors.white};
  border-color: ${props => props.theme.colors.white};
  &: hover {
    color: ${props => props.theme.colors.primary100};
  }
`;
const CircularIcon = styled(Icon)`
  box-shadow: 2px 2px 6px 0.5px rgb(0 0 0 / 20%);
  color: ${props => props.theme.colors.white};
  border-radius: 50%;
  height: 25px;
  width: 25px;
  background-color: ${props => props.theme.colors.primary100};
  &: hover {
    background-color: ${props => props.theme.colors.primaryActive};
  }
`;
const AddGoalText = styled(TextDiv)`
  margin-left: 10px;
  white-space: break-spaces;
  color: ${props => props.theme.colors.primary100};
  font-size: 12px;
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
  margin-top: 12px;
  justify-content: center;
`;

const AddInitiativeButton = styled(Button)`
  padding-right: 0;
  padding: 8px 16px;
  &: hover {
    font-weight: bold;
    background-color: ${props => props.theme.colors.primaryActive};
  }
`;
const AddInitiativeText = styled.p`
  margin: 0;
  font-size: 12px;
`;

const CloseIconContainer = styled.div`
  margin-left: 10px;
  margin-top: auto;
  margin-bottom: auto;
  &:hover {
    cursor: pointer;
  }
`;

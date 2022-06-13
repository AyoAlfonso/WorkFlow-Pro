import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";
import styled from "styled-components";
import { Icon } from "~/components/shared";
import { StepCardProps } from "../data/step-data";
import { SelectedStepType } from "../steps-selector-page";
import { variant } from "styled-system";

interface StepTypeCardProps {
  step: StepCardProps;
  setSelectedSteps: React.Dispatch<React.SetStateAction<Array<SelectedStepType>>>;
  setShowStepsModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsChanging?: React.Dispatch<React.SetStateAction<boolean>>;
  isChanging?: boolean;
  stepToPreview?: SelectedStepType;
  selectedSteps?: Array<SelectedStepType>;
  setTodoModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StepTypeCard = observer(({
  step,
  setSelectedSteps,
  setShowStepsModal,
  setIsChanging,
  isChanging,
  stepToPreview,
  selectedSteps,
  setTodoModalOpen,
}: StepTypeCardProps): JSX.Element => {
  const { companyStore } = useMst();
  const isKeyResults = companyStore.company?.objectivesKeyType === "KeyResults";
  const isForum = companyStore.company?.displayFormat == "Forum"

  const { t } = useTranslation();
  const { iconName, stepName, description, question, iconColor, variant } = step;

  const initiativeVariant = isKeyResults ? "Key Results" : "Milestones";

  const handleClick = () => {
    if (isChanging && stepName == "ToDos") {
      setShowStepsModal && setShowStepsModal(false);
      setTodoModalOpen(true);
    } else if (isChanging) {
      const steps = selectedSteps;
      const stepIndex = steps.findIndex(step => step.orderIndex == stepToPreview.orderIndex);
      steps[stepIndex].stepType = stepName;
      steps[stepIndex].iconName = iconName;
      setSelectedSteps(steps);
      setIsChanging(false);
      setShowStepsModal(false);
    } else if (stepName == "ToDos") {
      setShowStepsModal && setShowStepsModal(false);
      setTodoModalOpen(true);
    } else if (stepName == "Initiatives") {
      setSelectedSteps(steps => [
        ...steps,
        {
          stepType: stepName,
          iconName: iconName,
          variant: initiativeVariant,
          orderIndex: steps.length + 1,
        },
      ]);
      setShowStepsModal && setShowStepsModal(false);
    } else {
      setSelectedSteps(steps => [
        ...steps,
        {
          stepType: stepName,
          iconName: iconName,
          question: question,
          variant: variant,
          orderIndex: steps.length + 1,
        },
      ]);
      setShowStepsModal && setShowStepsModal(false);
    }
  };

  const formatIssue = str => {
    if (isForum) {
      return "Topics"
    } else {
      return str
    }
  }

  const formattedStepName = stepName == "Issues" ? formatIssue(stepName) : stepName;

  return (
    <Container onClick={handleClick}>
      <IconContainer>
        <Icon icon={iconName} size="64px" iconColor={iconColor} />
      </IconContainer>
      <TextContainer>
        <StepName>{t(`${formattedStepName}`)}</StepName>
        <Description>{t(`${description}`)}</Description>
      </TextContainer>
    </Container>
  );
});

const Container = styled.div`
  background: ${props => props.theme.colors.white};
  box-shadow: 0px 3px 6px #00000029;
  padding: 1em;
  // min-width: 40%;
  // width: 290px;
  display: flex;
  border-radius: 0.5em;
  display: flex;
  gap: 0 0.5em;
  cursor: pointer;
  &: hover {
    background: ${props => props.theme.colors.backgroundGrey};
  }
`;

const IconContainer = styled.div``;

const TextContainer = styled.div``;

const StepName = styled.span`
  display: block;
  color: ${props => props.theme.colors.black};
  text-align: left;
  font-size: 1em;
  font-weight: bold;
  line-spacing: 1em;
  margin-bottom: 10px;
`;

const Description = styled.span`
  color: ${props => props.theme.colors.black};
  text-align: left;
  font-size: 0.75em;
`;

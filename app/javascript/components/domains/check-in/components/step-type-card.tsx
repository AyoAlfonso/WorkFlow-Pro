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
  setStepToPreview: React.Dispatch<React.SetStateAction<SelectedStepType>>;
  selectedSteps?: Array<SelectedStepType>;
  setTodoModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StepTypeCard = observer(
  ({
    step,
    setSelectedSteps,
    setShowStepsModal,
    setIsChanging,
    isChanging,
    stepToPreview,
    setStepToPreview,
    selectedSteps,
    setTodoModalOpen,
  }: StepTypeCardProps): JSX.Element => {
    const { companyStore } = useMst();
    const isKeyResults = companyStore.company?.objectivesKeyType === "KeyResults";
    const isForum = companyStore.company?.displayFormat == "Forum";
    const issuesInstructions = `Capture any ${
      isForum ? "Topics" : "Issues"
    } that you want to keep track of.`;

    const { t } = useTranslation();
    const {
      iconName,
      name,
      description,
      question,
      iconColor,
      variant,
      stepType,
      instructions,
    } = step;

    const initiativeVariant = isKeyResults ? "Key Results" : "Milestones";

    const handleClick = () => {
      if (isChanging && name == "ToDos") {
        setShowStepsModal && setShowStepsModal(false);
        setTodoModalOpen(true);
      } else if (isChanging) {
        const steps = [...selectedSteps];
        const stepIndex = steps.findIndex(step => step.orderIndex == stepToPreview.orderIndex);
        steps[stepIndex].stepType = stepType;
        steps[stepIndex].iconName = iconName;
        steps[stepIndex].name = name;
        steps[stepIndex].instructions = name == "Issues" ? issuesInstructions : instructions;
        steps[stepIndex].variant = variant;
        steps[stepIndex].question = question;
        steps[stepIndex].componentToRender = name;
        setSelectedSteps(steps);
        setIsChanging(false);
        setShowStepsModal(false);
      } else if (name == "ToDos") {
        setShowStepsModal && setShowStepsModal(false);
        setTodoModalOpen(true);
      } else if (name == "Initiatives") {
        setSelectedSteps(steps => [
          ...steps,
          {
            stepType: stepType,
            name: name,
            iconName: iconName,
            instructions: instructions,
            variant: initiativeVariant,
            componentToRender: name,
            orderIndex: steps.length + 1,
          },
        ]);
        setShowStepsModal && setShowStepsModal(false);
      } else {
        setSelectedSteps(steps => [
          ...steps,
          {
            stepType: stepType,
            name: name,
            iconName: iconName,
            question: question,
            instructions: name == "Issues" ? issuesInstructions : instructions,
            variant: variant,
            componentToRender: name,
            orderIndex: steps.length + 1,
          },
        ]);
        setShowStepsModal && setShowStepsModal(false);
      }
    };

    const formatIssue = str => {
      if (isForum) {
        return "Topics";
      } else {
        return str;
      }
    };

    const formattedStepName = name == "Issues" ? formatIssue(name) : name;

    return (
      <Container onClick={handleClick}>
        <IconContainer>
          <Icon icon={iconName} size="64px" iconColor={iconColor} />
        </IconContainer>
        <TextContainer>
          <Name>{t<string>(`${formattedStepName}`)}</Name>
          <Description>{t<string>(`${description}`)}</Description>
        </TextContainer>
      </Container>
    );
  },
);

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

const Name = styled.span`
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

import * as React from "react";
import styled from "styled-components";
import { StepProgressBarIcon } from "~/components/shared";
import { Text } from "~/components/shared/text";

interface MeetingAgendaProps {
  steps: any;
  currentStep: number;
}

export const MeetingAgenda = ({ steps, currentStep }: MeetingAgendaProps): JSX.Element => {
  const renderMeetingSteps = (): Array<JSX.Element> => {
    return steps.map((step, index) => {
      let iconBackgroundColor;

      if (step.orderIndex == currentStep) {
        iconBackgroundColor = "primary100";
      } else if (step.orderIndex > currentStep) {
        iconBackgroundColor = "grey40";
      } else {
        iconBackgroundColor = "grey80";
      }

      return (
        <StepContainer key={index}>
          <StepProgressBarIcon
            iconBackgroundColor={iconBackgroundColor}
            iconColor={"white"}
            iconName={"Chevron-Left"}
          />
          <StyledText>
            {step.name} ({step.duration} minutes)
          </StyledText>
        </StepContainer>
      );
    });
  };

  return <Container>{renderMeetingSteps()}</Container>;
};

const Container = styled.div`
  padding-top: 5px;
`;

const StepContainer = styled.div`
  display: flex;
  padding-top: 8px;
  padding-bottom: 8px;
`;

const StyledText = styled(Text)`
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 10px;
`;

const EditorWrapper = styled.div`
  height: 300px;
  overflow-y: auto;
  border: ${props => `1px solid ${props.theme.colors.borderGrey}`};
  padding: 8px;
`;

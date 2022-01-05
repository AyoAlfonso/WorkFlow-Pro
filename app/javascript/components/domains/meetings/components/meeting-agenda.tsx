import * as React from "react";
import styled from "styled-components";
import { StepProgressBarIcon, Avatar } from "~/components/shared";
import { Text } from "~/components/shared/text";
import { useMst } from "~/setup/root";
import { UserType } from "~/types/user";
import * as R from "ramda";
import { observer } from "mobx-react";

interface MeetingAgendaProps {
  steps: any;
  currentStep: number;
  topicOwner?: UserType;
  meeting: any;
}

export const MeetingAgenda = observer(
  ({ steps, currentStep, topicOwner, meeting }: MeetingAgendaProps): JSX.Element => {
    const { companyStore } = useMst();

    const renderExplorationTopicOwner = (step): JSX.Element => {
      if (
        step.componentToRender == "Exploration" &&
        (topicOwner || R.path(["settings", "forumExplorationTopic"], meeting))
      ) {
        return (
          <ExplorationTopicOwnerContainer>
            {topicOwner && (
              <Avatar
                defaultAvatarColor={topicOwner.defaultAvatarColor}
                firstName={topicOwner.firstName}
                lastName={topicOwner.lastName}
                avatarUrl={topicOwner.avatarUrl}
                size={25}
                marginLeft={"20px"}
              />
            )}
            <DetailsContainer>
              <SubText>
                {topicOwner ? `${topicOwner.firstName} ${topicOwner.lastName}` : ""}
              </SubText>
              <SubText> Topic: {R.path(["settings", "forumExplorationTopic"], meeting)}</SubText>
            </DetailsContainer>
          </ExplorationTopicOwnerContainer>
        );
      }
    };

    const getStepLabelForObjectiveKeyType = () => {
      if (companyStore.company?.objectivesKeyType == "KeyResults") {
        return "Key Results";
      } else {
        return "Milestones";
      }
    };

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
            <StepTopicContainer>
              <StyledText>
                {meeting.meetingType == "personal_weekly" && step.name == "Milestones"
                  ? `${getStepLabelForObjectiveKeyType()} ${step.duration &&
                      `(${step.duration} minutes)`}`
                  : `${step.name} ${step.duration && `(${step.duration} minutes)`}`}
              </StyledText>
              {renderExplorationTopicOwner(step)}
            </StepTopicContainer>
          </StepContainer>
        );
      });
    };

    return <Container>{renderMeetingSteps()}</Container>;
  },
);

const Container = styled.div`
  height: inherit;
  overflow: auto;
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
  font-size: 16px;
  font-weight: 400;
`;

const ExplorationTopicOwnerContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SubText = styled(Text)`
  color: ${props => props.theme.colors.grey80};
  font-size: 12px;
  font-weight: bold;
  margin: 5px;
  margin-left: 8px;
`;

const StepTopicContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
`;

const DetailsContainer = styled.div``;

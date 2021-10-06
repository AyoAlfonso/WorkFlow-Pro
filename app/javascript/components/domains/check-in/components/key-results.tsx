import * as React from "react";
import { observer } from "mobx-react";
import { Loading } from "~/components/shared/loading";
import { MilestoneType } from "~/types/milestone";
import { HomeContainerBorders } from "../../home/shared-components";
import { Text } from "../../../shared/text";
import { Avatar } from "../../../shared/avatar";
import ContentEditable from "react-contenteditable";
import { useMst } from "~/setup/root";
import styled from "styled-components";
import { MilestoneCard } from "../../goals/milestone/milestone-card";

export const MilestoneComponent = observer(
  (props): JSX.Element => {
    const { sessionStore, quarterlyGoalStore } = useMst();

    const milestone = {
      createdAt: "2021-09-17T13:00:30.977Z",
      createdById: 2,
      description: "Test drive the vehicles",
      id: 2,
      milestoneableId: 1,
      milestoneableType: "QuarterlyGoal",
      quarterlyGoalDescription: null,
      status: "unstarted",
      week: 37,
      weekOf: "2020-07-23",
    };

    const renderHeading = (): JSX.Element => {
      return (
        <Container>
          <StyledHeader>What's the status on your Milestones from week of <u>June 28th</u>?</StyledHeader>
        </Container>
      );
    };

    const renderUserAvatar = () => {
      return (
        <Avatar
          size={32}
          marginLeft={"0"}
          firstName={sessionStore.profile.firstName}
          lastName={sessionStore.profile.lastName}
          defaultAvatarColor={sessionStore.profile.defaultAvatarColor}
          avatarUrl={sessionStore.profile.avatarUrl}
        />
      );
    };

    const renderMilestones = (): JSX.Element => {
      return (
        <Container>
          <AvatarContainer>
            {renderUserAvatar()}
            <StyledText>{milestone.description}</StyledText>
          </AvatarContainer>
          <MilestoneContainer>
            <MilestoneCard itemType={"quarterlyGoal"} editable={false} milestone={milestone} />
          </MilestoneContainer>
        </Container>
      );
    };
    return (
      <>
        {renderHeading()}
        {renderMilestones()}
      </>
    );
  },
);

const Container = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
`;

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 15px;
  margin-bottom: 25px;
`;

const MilestoneContainer = styled.div`
  margin-bottom: 15px;
`;

const StyledText = styled.span`
  font-size: 16px;
  font-weight: bold;
  margin-left: 5px;
`;

const StyledHeader = styled.h1`
  margin-bottom: 25px;
`;

type MilestoneDetailsType = {
  unstarted: boolean;
  currentWeek: boolean;
};

const MilestoneDetails = styled(HomeContainerBorders)<MilestoneDetailsType>`
  padding: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
  width: 90%;
  border: ${props =>
    (!props.unstarted || props.currentWeek) && `1px solid ${props.theme.colors.primary100}`};
  color: ${props => props.unstarted && props.theme.colors.grey60};
`;

type WeekOfTextType = {
  unstarted: boolean;
};

const WeekOfText = styled(Text)<WeekOfTextType>`
  color: ${props => (props.unstarted ? props.theme.colors.grey60 : props.theme.colors.primary100)};
  margin-top: 8px;
  margin-bottom: 8px;
`;

const WeekOfTextValue = styled.span`
  text-decoration: underline;
  font-weight: bold;
`;

const MilestoneContentEditable = styled(ContentEditable)`
  margin-top: 8px;
  margin-bottom: 8px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 16px;
  padding-right: 16px;
  color: ${props => props.theme.colors.black};
`;

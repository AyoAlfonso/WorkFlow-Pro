import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";
import {
  Text,
  Avatar,
  Loading,
  Heading,
  Icon,
  UserSelectionDropdownList,
} from "~/components/shared";
import ContentEditable from "react-contenteditable";
import { ParkingLotIssues } from "./parking-lot-issues";
import { useEffect, useState } from "react";
import { ScheduledIssues } from "./scheduled-issues";
import { toJS } from "mobx";
import { ForumTopic } from "~/components/domains/meetings-forum/components/forum-topic";
import {
  ColumnContainerParent,
  ColumnContainer,
  HeaderText,
} from "~/components/shared/styles/row-style";
import { useTranslation } from "react-i18next";

interface IExplorationProps {
  includeExplorationTopic?: boolean;
}

export const Exploration = observer(
  ({ includeExplorationTopic = true }: IExplorationProps): JSX.Element => {
    const {
      meetingStore: { currentMeeting },
      teamStore: { teams },
      issueStore,
      forumStore,
    } = useMst();
    const { t } = useTranslation();

    const [userSelectionOpen, setUserSelectionOpen] = useState<boolean>(false);

    //a bit roundabout, we sould probably refactor the meeting step to pass in both team and meeting
    const currentTeam = (teams || []).find(team => team.id === currentMeeting.teamId);

    if (R.isNil(currentTeam) || R.isNil(currentMeeting)) {
      return <Loading />;
    }

    useEffect(() => {
      issueStore.fetchTeamIssues(currentMeeting.teamId); //ASSUMPTIONS: must have team id for parking lot

      //TODO: should we just include the meeting_ids with the team_issues themselves?
      if (currentMeeting) {
        issueStore.fetchTeamIssueMeetingEnablements(currentMeeting.id);
      }
    }, [currentMeeting.teamId]);

    const topicOwner = currentTeam.users.find(
      member => member.id == R.path(["forumExplorationTopicOwnerId"], currentMeeting.settings),
    );

    const handleChangeExplorationTopicOwnerId = user => {
      setUserSelectionOpen(false);
      forumStore
        .updateMeeting(
          {
            id: currentMeeting.id,
            meeting: {
              settingsForumExplorationTopicOwnerId: user.id,
            },
          },
          true,
        )
        .then(() => {});
    };

    const renderUserAvatar = (): JSX.Element => {
      return (
        <>
          <AvatarContainer onClick={() => setUserSelectionOpen(!userSelectionOpen)}>
            {topicOwner ? (
              <>
                <Avatar
                  firstName={topicOwner.firstName}
                  lastName={topicOwner.lastName}
                  defaultAvatarColor={topicOwner.defaultAvatarColor}
                  avatarUrl={topicOwner.avatarUrl}
                  size={48}
                  marginLeft={"inherit"}
                  marginRight={"inherit"}
                />
                <HostedByName>{`${topicOwner.firstName} ${topicOwner.lastName}`}</HostedByName>
              </>
            ) : (
              <>
                <ImageContainer>
                  <StyledIcon icon={"New-User"} size={"30px"} />
                </ImageContainer>
                <NoMemberText>No Member</NoMemberText>
              </>
            )}
          </AvatarContainer>

          {userSelectionOpen && (
            <UserSelectionContainer onClick={e => e.stopPropagation()}>
              <UserSelectionDropdownList
                userList={toJS(currentTeam.users)}
                onUserSelect={handleChangeExplorationTopicOwnerId}
                setShowUsersList={setUserSelectionOpen}
              />
            </UserSelectionContainer>
          )}
        </>
      );
    };

    return (
      <>
        {includeExplorationTopic && (
          <>
            <ColumnContainerParent>
              <HeaderText text={t("meetingForum.exploration.title")} />
            </ColumnContainerParent>
            <ColumnContainerParent>
              <ForumTopic disabled={false} teamMembers={toJS(currentTeam.users)} />
            </ColumnContainerParent>
          </>
        )}
        <ColumnContainerParent>
          <ColumnContainer>
            <HeaderText
              text={t("meetingForum.scheduledIssues.title", {
                prefix: includeExplorationTopic ? "2: " : "",
              })}
            />
            <ScheduledIssues teamId={currentMeeting.teamId} upcomingForumMeeting={currentMeeting} />
          </ColumnContainer>
          <ColumnContainer>
            <HeaderText text={t("meetingForum.parkingLotIssues.title")} />
            <ParkingLotIssues
              teamId={currentMeeting.teamId}
              upcomingForumMeeting={currentMeeting}
            />
          </ColumnContainer>
        </ColumnContainerParent>
      </>
    );
  },
);

const HostedByName = styled(Text)`
  margin-left: 15px;
`;

const ImageContainer = styled.div`
  border-radius: 9999px;
  border: ${props => `3px solid ${props.theme.colors.greyInactive}`};
  width: 42px;
  height: 42px;
  display: flex;
  justify-content: center;
`;

const StyledIcon = styled(Icon)`
  color: ${props => props.theme.colors.greyInactive};
`;

const NoMemberText = styled(HostedByName)`
  font-style: italic;
  color: ${props => props.theme.colors.greyActive};
`;

const UserSelectionContainer = styled.div`
  margin-top: 50px;
  margin-left: -20px;
`;

const AvatarContainer = styled.div`
  display: flex;
  &: hover {
    cursor: pointer;
  }
`;

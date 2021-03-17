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

export const Exploration = observer(
  (): JSX.Element => {
    const {
      meetingStore: { currentMeeting },
      teamStore: { teams },
      issueStore,
      forumStore,
    } = useMst();

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

    const headerText = (text: string): JSX.Element => {
      return (
        <Heading type={"h2"} fontSize={"20px"} fontWeight={600}>
          {text}
        </Heading>
      );
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
      <Container>
        <SectionContainer>
          <HeaderContainer>{headerText("Scheduled Exploration")}</HeaderContainer>
          <DescriptionText>Topics to be discussed today</DescriptionText>
          <HostContainer>{renderUserAvatar()}</HostContainer>
          <StyledContentEditable
            placeholder={"No Topic"}
            html={R.path(["forumExplorationTopic"], currentMeeting.settings) || "No Topic"}
            onChange={null}
          />
        </SectionContainer>

        <SectionContainer>
          <HeaderContainer>{headerText("Dynamic Explorations")}</HeaderContainer>
          <ScheduledIssues teamId={currentMeeting.teamId} upcomingForumMeeting={currentMeeting} />
        </SectionContainer>

        <SectionContainer>
          <HeaderContainer>{headerText("Forum Hub")}</HeaderContainer>
          <ParkingLotIssues teamId={currentMeeting.teamId} upcomingForumMeeting={currentMeeting} />
        </SectionContainer>
      </Container>
    );
  },
);

const Container = styled.div`
  display: flex;
`;

const SectionContainer = styled.div`
  min-width: 320px;
  width: 33%;
  padding-left: 8px;
  padding-right: 8px;
`;

const HostContainer = styled.div`
  display: flex;
  margin-bottom: 15px;
`;

const HostedByName = styled(Text)`
  margin-left: 15px;
`;

const HeaderContainer = styled.div``;

const DescriptionText = styled(Text)`
  color: ${props => props.theme.colors.greyActive};
  font-size: 12px;
  margin-bottom: 25px;
  margin-left: 0;
`;

const StyledContentEditable = styled(ContentEditable)`
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 10px;
  border: ${props => `1px solid ${props.theme.colors.borderGrey}`};
  box-shadow: 0px 3px 6px #f5f5f5;
  padding-left: 16px;
  padding-right: 16px;
  width: 80%;
  &:hover {
    cursor: ${props => (!props.disabled ? "text" : "default")};
  }
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

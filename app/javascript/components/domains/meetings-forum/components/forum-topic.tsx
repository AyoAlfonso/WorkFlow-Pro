import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import * as R from "ramda";
import { ColumnContainerCenterAligned } from "~/components/shared/styles/row-style";
import ContentEditable from "react-contenteditable";
import { useRefCallback } from "~/components/shared/content-editable-hooks";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";
import { IUser } from "~/models/user";
import { IMeeting } from "~/models/meeting";
import { Icon, Text, UserSelectionDropdownList, Avatar } from "~/components/shared";

interface IForumTopic {
  teamMembers: Array<any>;
  meeting?: IMeeting;
  disabled: boolean;
}

export const ForumTopic = observer(
  ({ teamMembers, meeting, disabled }: IForumTopic): JSX.Element => {
    const { forumStore, meetingStore } = useMst();

    const [currentMeeting, setCurrentMeeting] = useState<any>(
      meeting || meetingStore.currentMeeting,
    );
    const [userSelectionOpen, setUserSelectionOpen] = useState<boolean>(false);

    const [explorationTopic, setExplorationTopic] = useState(
      R.path(["forumExplorationTopic"], currentMeeting.settings) || "",
    );

    //https://github.com/lovasoa/react-contenteditable/issues/161
    const handleChangeExplorationTopic = useRefCallback(e => {
      if (!e.target.value.includes("<div>")) {
        setExplorationTopic(e.target.value);
      }
    }, []);

    const handleBlurExplorationTopic = useRefCallback(() => {
      forumStore.updateMeeting({
        id: currentMeeting.id,
        meeting: {
          settingsForumExplorationTopic: explorationTopic,
        },
      });
    }, [explorationTopic]);

    const handleChangeExplorationTopicOwnerId = user => {
      setUserSelectionOpen(false);
      forumStore
        .updateMeeting({
          id: currentMeeting.id,
          meeting: {
            settingsForumExplorationTopicOwnerId: user.id,
          },
        })
        .then(result => {
          if (!meeting) {
            setCurrentMeeting(result);
          }
        });
    };

    const topicRef = useRef(null);
    const topicOwner = teamMembers.find(
      member => member.id == R.path(["forumExplorationTopicOwnerId"], currentMeeting.settings),
    );

    const renderUserAvatar = () => {
      if (topicOwner) {
        return (
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
        );
      } else {
        return (
          <TopicOwnerContainer>
            <ImageContainer>
              <StyledIcon icon={disabled ? "User" : "New-User"} size={"30px"} />
            </ImageContainer>
            <AddMemberText>Add a member</AddMemberText>
          </TopicOwnerContainer>
        );
      }
    };

    return (
      <>
        <StyledColumnContainerCenterAligned>
          <HostedByContainer
            onClick={() => {
              if (!disabled) {
                setUserSelectionOpen(!userSelectionOpen);
              }
            }}
          >
            {renderUserAvatar()}
          </HostedByContainer>

          {userSelectionOpen && (
            <UserSelectionContainer onClick={e => e.stopPropagation()}>
              <UserSelectionDropdownList
                userList={teamMembers}
                onUserSelect={handleChangeExplorationTopicOwnerId}
                setShowUsersList={setUserSelectionOpen}
              />
            </UserSelectionContainer>
          )}
        </StyledColumnContainerCenterAligned>
        <ColumnContainerCenterAligned>
          <StyledContentEditable
            innerRef={topicRef}
            placeholder={"Add a topic - e.g. How do we improve productivity while we go remote?"}
            html={explorationTopic || ""}
            onChange={handleChangeExplorationTopic}
            onKeyDown={key => {
              if (key.keyCode == 13) {
                topicRef.current.blur();
              }
            }}
            onBlur={handleBlurExplorationTopic}
            disabled={disabled}
          />
        </ColumnContainerCenterAligned>
      </>
    );
  },
);

const StyledContentEditable = styled(ContentEditable)`
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 10px;
  border: ${props => `1px solid ${props.theme.colors.borderGrey}`};
  box-shadow: 0px 3px 6px #f5f5f5;
  padding-left: 16px;
  padding-right: 16px;
  &:hover {
    cursor: ${props => (!props.disabled ? "text" : "default")};
  }
`;

const UserSelectionContainer = styled.div`
  margin-left: 80px;
  margin-top: -10px;
`;

const HostedByContainer = styled.div`
  display: flex;
  &: hover {
    cursor: pointer;
  }
`;

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

const AddMemberText = styled(HostedByName)`
  font-style: italic;
  color: ${props => props.theme.colors.greyActive};
`;

const StyledIcon = styled(Icon)`
  color: ${props => props.theme.colors.greyInactive};
`;

const TopicOwnerContainer = styled.div`
  display: flex;
  &:hover ${AddMemberText} {
    font-weight: bold;
  }
  &:hover ${StyledIcon} {
    color: ${props => props.theme.colors.greyActive};
  }
  &:hover ${ImageContainer} {
    border-color: ${props => props.theme.colors.greyActive};
  }
`;

const StyledColumnContainerCenterAligned = styled(ColumnContainerCenterAligned)`
  margin-bottom: 24px;
`;

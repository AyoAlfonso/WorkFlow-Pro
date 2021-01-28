import React, { useState, useRef, useEffect } from "react";
import * as R from "ramda";
import styled from "styled-components";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Text } from "~/components/shared/text";
import { Heading } from "~/components/shared/heading";
import { IMeeting } from "~/models/meeting";
import { Avatar } from "~/components/shared/avatar";
import ContentEditable from "react-contenteditable";
import { useRefCallback } from "~/components/shared/content-editable-hooks";
import {
  MonthContainer,
  ColumnContainer,
  Container as SectionContainer,
  Divider,
} from "./row-style";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";
import { IUser } from "~/models/user";
import { UserSelectionDropdownList } from "~/components/shared";

//input is meeting
//render Month, ScheduledTime, Who, Topic
//WHO AND TOPIC plugin still  needs to be done

export interface ISection1MeetingDetailsProps {
  meeting: IMeeting;
  teamMembers: Array<IUser>;
}

export const Section1MeetingDetails = observer(
  ({ meeting, teamMembers }: ISection1MeetingDetailsProps): JSX.Element => {
    // const { t } = useTranslation();
    const { forumStore } = useMst();

    const [explorationTopic, setExplorationTopic] = useState(
      R.path(["forumExplorationTopic"], meeting.settings) || "",
    );
    const [explorationTopicOwnerId, setExplorationTopicOwnerId] = useState(
      R.path(["forumExplorationTopicId"], meeting.settings) || "",
    );

    const [userSelectionOpen, setUserSelectionOpen] = useState<boolean>(false);

    //https://github.com/lovasoa/react-contenteditable/issues/161
    const handleChangeExplorationTopic = useRefCallback(e => {
      if (!e.target.value.includes("<div>")) {
        setExplorationTopic(e.target.value);
      }
    }, []);

    const handleBlurExplorationTopic = useRefCallback(() => {
      forumStore.updateMeetingTopic({
        id: meeting.id,
        meeting: {
          settingsForumExplorationTopic: explorationTopic,
        },
      });
    }, [explorationTopic]);

    const topicRef = useRef(null);
    const topicOwnerRef = useRef(null);
    const userDropdownRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = event => {
        if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
          setUserSelectionOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [userDropdownRef]);

    const hostedBy = meeting.hostedBy;

    return (
      <Container>
        <SectionContainer>
          <MonthContainer>
            <Heading type={"h3"}>{moment(meeting.scheduledStartTime).format("MMMM")}</Heading>
          </MonthContainer>
          <SectionContainer>
            <ColumnContainer>
              <HostedByContainer onClick={() => setUserSelectionOpen(!userSelectionOpen)}>
                <Avatar
                  firstName={hostedBy.firstName}
                  lastName={hostedBy.lastName}
                  defaultAvatarColor={hostedBy.defaultAvatarColor}
                  avatarUrl={hostedBy.avatarUrl}
                  size={48}
                  marginLeft={"inherit"}
                  marginRight={"inherit"}
                />
                <HostedByName>{`${hostedBy.firstName} ${hostedBy.lastName}`}</HostedByName>
              </HostedByContainer>

              {userSelectionOpen && (
                <UserSelectionContainer ref={userDropdownRef}>
                  <UserSelectionDropdownList
                    userList={teamMembers}
                    onUserSelect={() => console.log("hello world")}
                  />
                </UserSelectionContainer>
              )}

              {/* <UserSelectionDropdownList userList={companyUsers} onUserSelect={() => console.log('hello world')} /> */}
            </ColumnContainer>
            <ColumnContainer>
              <StyledContentEditable
                innerRef={topicRef}
                placeholder={
                  "Add a topic - e.g. How do we improve productivity while we go remote?"
                }
                html={explorationTopic || ""}
                onChange={handleChangeExplorationTopic}
                onKeyDown={key => {
                  if (key.keyCode == 13) {
                    topicRef.current.blur();
                  }
                }}
                onBlur={handleBlurExplorationTopic}
              />
            </ColumnContainer>
          </SectionContainer>
        </SectionContainer>
        <Divider />
      </Container>
    );
  },
);

const Container = styled.div``;

const StyledContentEditable = styled(ContentEditable)`
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 10px;
  border: 1px solid #e3e3e3;
  box-shadow: 0px 3px 6px #f5f5f5;
  padding-left: 16px;
  padding-right: 16px;
  width: 100%;
  &:hover {
    cursor: ${props => (!props.disabled ? "text" : "default")};
  }
`;

const UserSelectionContainer = styled.div`
  margin-left: 25px;
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

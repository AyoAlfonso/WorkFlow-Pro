import React, { useState, useRef } from "react";
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
import { MonthContainer, ColumnContainer, Container, Divider } from "./row-style";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";

//input is meeting
//render Month, ScheduledTime, Who, Topic
//WHO AND TOPIC plugin still  needs to be done

export interface ISection1MeetingDetailsProps {
  meeting: IMeeting;
}

export const Section1MeetingDetails = observer(
  ({ meeting }: ISection1MeetingDetailsProps): JSX.Element => {
    // const { t } = useTranslation();
    const { forumStore } = useMst();

    const [explorationTopic, setExplorationTopic] = useState(
      R.path(["forumExplorationTopic"], meeting.settings) || "",
    );
    const [explorationTopicOwnerId, setExplorationTopicOwnerId] = useState(
      R.path(["forumExplorationTopicId"], meeting.settings) || "",
    );

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

    return (
      <>
        <Container>
          <MonthContainer>
            <Heading type={"h4"}>{moment(meeting.scheduledStartTime).format("MMMM")}</Heading>
            <Text>{moment(meeting.scheduledStartTime).format("Do hh:mm a")}</Text>
          </MonthContainer>
          <Container>
            <ColumnContainer>
              <Avatar
                firstName={"sample"}
                lastName={"sample"}
                size={48}
                marginLeft={"inherit"}
                marginRight={"inherit"}
              />
              <Text>Sample sample</Text>
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
          </Container>
        </Container>
        <Divider />
      </>
    );
  },
);

const StyledContentEditable = styled(ContentEditable)`
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 10px;
  border: 1px solid #e3e3e3;
  box-shadow: 0px 3px 6px #f5f5f5;
  padding-left: 16px;
  padding-right: 16px;
  &:hover {
    cursor: ${props => (!props.disabled ? "text" : "default")};
  }
`;

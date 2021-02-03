import * as React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useMst } from "~/setup/root";
import * as R from "ramda";
import { observer } from "mobx-react";
import * as moment from "moment";
import { Text } from "~/components/shared/text";
import { MeetingAgenda } from "../../meetings/components/meeting-agenda";
import { Heading } from "~/components/shared";
import ContentEditable from "react-contenteditable";
import { useRef, useState, useEffect } from "react";
import { useRefCallback } from "~/components/shared/content-editable-hooks";
interface ISelectedMeetingAgendaEntry {
  selectedMeetingId: string | number;
}

export const SelectedMeetingAgendaEntry = observer(
  ({ selectedMeetingId }: ISelectedMeetingAgendaEntry) => {
    const { t } = useTranslation();
    const {
      teamStore: { teams },
      forumStore,
    } = useMst();

    const selectedMeeting = forumStore.searchedForumMeetings.find(
      meeting => meeting.id == selectedMeetingId,
    );

    const locationRef = useRef(null);
    const [location, setLocation] = useState<string>("");

    useEffect(() => {
      setLocation(R.path(["forumLocation"], selectedMeeting.settings));
    }, [selectedMeeting.id]);

    const teamMembers = teams.find(team => team.id == selectedMeeting.teamId)["users"];
    const topicOwner = teamMembers.find(
      member => member.id == R.path(["settings", "forumExplorationTopicOwnerId"], selectedMeeting),
    );

    const handleChangeLocation = useRefCallback(e => {
      if (!e.target.value.includes("<div>")) {
        setLocation(e.target.value);
      }
    }, []);

    const handleBlurLocation = useRefCallback(() => {
      forumStore.updateMeeting({
        id: selectedMeeting.id,
        meeting: {
          settingsForumLocation: location,
        },
      });
    }, [location]);

    return (
      <Container>
        <MeetingHeader>
          <Heading type={"h3"}>{t("forum.forumMeeting")}</Heading>
          <MeetingTimeText>
            {`${t("forum.scheduledStartTime")}: ${moment(selectedMeeting.scheduledStartTime).format(
              "dddd, MMMM D, LT",
            )}`}
          </MeetingTimeText>
          {selectedMeeting.startTime && (
            <MeetingTimeText>
              {`${t("forum.actualStartTime")}: ${moment(selectedMeeting.startTime).format(
                "dddd, MMMM D, LT",
              )}`}
            </MeetingTimeText>
          )}
          <LocationContainer>
            <StyledContentEditable
              innerRef={locationRef}
              placeholder={"Enter the location"}
              html={location || ""}
              onChange={handleChangeLocation}
              onKeyDown={key => {
                if (key.keyCode == 13) {
                  locationRef.current.blur();
                }
              }}
              onBlur={handleBlurLocation}
            />
          </LocationContainer>
        </MeetingHeader>
        <MeetingAgenda steps={selectedMeeting.steps} currentStep={999} topicOwner={topicOwner} />
      </Container>
    );
  },
);

const Container = styled.div`
  width: 50%;
  min-width: 400px;
  margin-right: 30px;
`;

const MeetingHeader = styled.div``;

const MeetingTimeText = styled(Text)`
  font-size: 12px;
  color: ${props => props.theme.colors.grey80};
`;

const LocationContainer = styled.div`
  display: flex;
`;

const StyledContentEditable = styled(ContentEditable)`
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 10px;
  border: ${props => `1px solid ${props.theme.colors.borderGrey}`};
  box-shadow: 0px 3px 6px #f5f5f5;
  padding-left: 16px;
  padding-right: 16px;
  width: 100%;
`;

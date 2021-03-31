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
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { SelectedMeetingNotes } from "./selected-meeting-notes";
import { Subject } from "@material-ui/icons";
interface ISelectedMeetingAgendaEntry {
  selectedMeetingId: string | number;
  disabled: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap",
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginTop: "3px",
      marginRight: theme.spacing(3),
      width: 250,
    },
  }),
);

export const SelectedMeetingAgendaEntry = observer(
  ({ selectedMeetingId, disabled }: ISelectedMeetingAgendaEntry) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const {
      teamStore: { teams },
      forumStore,
      meetingStore,
    } = useMst();

    const selectedMeeting = forumStore.searchedForumMeetings.find(
      meeting => meeting.id == selectedMeetingId,
    );

    const locationRef = useRef(null);
    const [location, setLocation] = useState<string>("");
    const [newScheduledStartTime, setNewScheduledStartTime] = useState<string>("");

    useEffect(() => {
      setLocation(R.path(["forumLocation"], selectedMeeting.settings));
      setNewScheduledStartTime(selectedMeeting.scheduledStartTime);
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
        <ChildContainer>
          <MeetingHeader>
            <StyledHeading type={"h3"}>{t("forum.forumMeeting")}</StyledHeading>
            <MeetingTimeContainer>
              <MeetingTimeText>{`${t("forum.scheduledStartTime")}: `}</MeetingTimeText>
              <form className={classes.container} noValidate>
                <TextField
                  id="datetime-local"
                  type="datetime-local"
                  value={moment(newScheduledStartTime).format("YYYY-MM-DDTHH:mm")}
                  className={classes.textField}
                  onChange={async event => {
                    setNewScheduledStartTime(event.target.value);
                    await meetingStore.updateMeeting(
                      R.merge(selectedMeeting, {
                        scheduledStartTime: moment(event.target.value).format(),
                      }),
                    );
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </form>
            </MeetingTimeContainer>

            {selectedMeeting.startTime && (
              <MeetingTimeText fontWeight={"bold"}>
                {`${t("forum.actualStartTime")}: ${moment(selectedMeeting.startTime).format(
                  "dddd, MMMM D, LT",
                )}`}
              </MeetingTimeText>
            )}
            {disabled ? (
              <MeetingTimeText>Location: {location}</MeetingTimeText>
            ) : (
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
            )}
          </MeetingHeader>
          <MeetingAgendaContainer>
            <MeetingAgenda
              steps={selectedMeeting.steps}
              currentStep={999}
              topicOwner={topicOwner}
              meeting={selectedMeeting}
            />
          </MeetingAgendaContainer>
        </ChildContainer>

        <ChildContainer>
          <SelectedMeetingNotes selectedMeetingId={selectedMeeting.id} />
        </ChildContainer>
      </Container>
    );
  },
);

const Container = styled.div`
  width: 100%;
  min-width: 400px;
  display: flex;
`;

const MeetingHeader = styled.div``;

const StyledHeading = styled(Heading)`
  margin-bottom: 0;
`;

const MeetingTimeText = styled(Text)`
  font-size: 12px;
  color: ${props => props.theme.colors.grey80};
  margin-bottom: 0;
`;

const LocationContainer = styled.div`
  display: flex;
  margin: 6px;
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
  margin: 8px;
`;

const MeetingTimeContainer = styled.div`
  display: flex;
  padding-top: 8px;
  padding-bottom: 8px;
`;

const MeetingAgendaContainer = styled.div`
  display: flex;
  margin-top: 8px;
`;

const ChildContainer = styled.div`
  width: 50%;
  min-width: 375px;
`;

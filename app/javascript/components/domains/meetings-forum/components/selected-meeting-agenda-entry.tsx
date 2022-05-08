import * as React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useMst } from "~/setup/root";
import * as R from "ramda";
import { observer } from "mobx-react";
import moment from "moment";
import { HtmlTooltip } from "~/components/shared/tooltip";
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
import MeetingTypes from "~/constants/meeting-types";
import { Icon } from "~/components/shared/icon";
import { meetingTypeParser } from "~/components/shared/agenda/meeting-type-parser";

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
      companyStore: { company },
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
    const [showNotes, setShowNotes] = useState<boolean>(false);
    const [showScheduledStartDate, setShowScheduledStartDate] = useState<boolean>(false);
    const [showLocation, setShowLocation] = useState<boolean>(false);
    const [showAverageRating, setshowAverageRating] = useState<boolean>(false);
    const [showActualStartTime, setShowActualStartTime] = useState<boolean>(false);
    const [showMeetingAgenda, setShowMeetingAgenda] = useState<boolean>(false);
    const [showAverageRatingTooltip, setShowAverageRatingTooltip] = useState<boolean>(false);
    const [showActualStartTimeTooltip, setShowActualStartTimeTooltip] = useState<boolean>(false);
    const [showLocationTooltip, setShowLocationTooltip] = useState<boolean>(false);
    useEffect(() => {
      setLocation(R.path(["forumLocation"], selectedMeeting.settings));
      setNewScheduledStartTime(selectedMeeting.scheduledStartTime);
    }, [selectedMeeting.id]);

    const teamMembers = teams.find(team => team.id == selectedMeeting.teamId)["users"];
    const topicOwner = teamMembers.find(
      member => member.id == R.path(["settings", "forumExplorationTopicOwnerId"], selectedMeeting),
    );

    const overviewType = company && company.accessForum ? "forum" : "teams";
    const forumType =
      company?.forumType == "Organisation"
        ? MeetingTypes.ORGANISATION_FORUM_MONTHLY
        : MeetingTypes.FORUM_MONTHLY;

    const handleChangeLocation = useRefCallback(e => {
      if (!e.target.value.includes("<div>")) {
        setLocation(e.target.value);
      }
    }, []);

    const renderNotes = (): JSX.Element => {
      return <SelectedMeetingNotes selectedMeetingId={selectedMeeting.id} />;
    };
    const renderMeetingAgenda = (): JSX.Element => {
      return (
        <MeetingAgendaContainer>
          <MeetingAgenda
            steps={selectedMeeting.steps}
            currentStep={999}
            topicOwner={topicOwner}
            meeting={selectedMeeting}
          />
        </MeetingAgendaContainer>
      );
    };
    const renderScheduledStartDate = (): JSX.Element => {
      return (
        <MeetingTimeContainer>
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
      );
    };

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
          <StyledHeading type={"h2"}>
            {meetingTypeParser(selectedMeeting.meetingType)}
          </StyledHeading>
          <InformationContainer>
            <StyledChevronIconContainer
              onClick={e => {
                e.stopPropagation();
                setShowScheduledStartDate(!showScheduledStartDate);
              }}
            >
              <MeetingSectionHeaderText>{`${t(
                "forum.scheduledStartTime",
              )}: `}</MeetingSectionHeaderText>
              <StyledChevronIcon
                icon={showScheduledStartDate ? "Chevron-Up" : "Chevron-Down"}
                size={"12px"}
                iconColor={showScheduledStartDate ? "grey100" : "primary100"}
              />{" "}
            </StyledChevronIconContainer>
            {showScheduledStartDate ? renderScheduledStartDate() : <></>}

            <HtmlTooltip
              arrow={true}
              open={showActualStartTimeTooltip}
              enterDelay={500}
              leaveDelay={200}
              title={<span>There is no actual start time data from the meeting yet</span>}
            >
              <StyledChevronIconContainer
                onClick={e => {
                  e.stopPropagation();
                  if (!selectedMeeting.startTime) return;
                  setShowActualStartTime(!showActualStartTime);
                }}
                onMouseEnter={() => {
                  setShowActualStartTimeTooltip(!selectedMeeting.startTime && true);
                }}
                onMouseLeave={() => {
                  setShowActualStartTimeTooltip(false);
                }}
              >
                <MeetingSectionHeaderText>
                  {`${t("forum.actualStartTime")}`}{" "}
                </MeetingSectionHeaderText>
                <StyledChevronIcon
                  icon={showActualStartTime ? "Chevron-Up" : "Chevron-Down"}
                  size={"12px"}
                  iconColor={showActualStartTime ? "grey100" : "primary100"}
                />
              </StyledChevronIconContainer>
            </HtmlTooltip>

            {showActualStartTime && selectedMeeting.startTime && (
              <DateValue>{`${moment(selectedMeeting.startTime).format(
                "dddd, MMMM D, LT",
              )}`}</DateValue>
            )}

            {disabled ? (
              <HtmlTooltip
                arrow={true}
                open={showLocationTooltip}
                enterDelay={500}
                leaveDelay={200}
                title={<span>There is no location data for the meeting yet</span>}
              >
                <>
                  <StyledChevronIconContainer
                    onClick={e => {
                      e.stopPropagation();
                      setShowLocation(!showLocation);
                      if (!location) return;
                    }}
                    onMouseEnter={() => {
                      setShowLocationTooltip(!location && true);
                    }}
                    onMouseLeave={() => {
                      setShowLocationTooltip(false);
                    }}
                  >
                    <MeetingSectionHeaderText> Location</MeetingSectionHeaderText>
                    <StyledChevronIcon
                      icon={showLocation ? "Chevron-Up" : "Chevron-Down"}
                      size={"12px"}
                      iconColor={showLocation ? "grey100" : "primary100"}
                    />{" "}
                  </StyledChevronIconContainer>
                  {showLocation && <MeetingSectionHeaderText> {location}</MeetingSectionHeaderText>}
                </>
              </HtmlTooltip>
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

            <StyledChevronIconContainer
              onClick={e => {
                e.stopPropagation();
                setShowMeetingAgenda(!showMeetingAgenda);
              }}
            >
              <MeetingSectionHeaderText>{`${t("forum.meetingAgenda")} `}</MeetingSectionHeaderText>
              <StyledChevronIcon
                icon={showMeetingAgenda ? "Chevron-Up" : "Chevron-Down"}
                size={"12px"}
                iconColor={showMeetingAgenda ? "grey100" : "primary100"}
              />{" "}
            </StyledChevronIconContainer>
            {showMeetingAgenda ? renderMeetingAgenda() : <></>}

            <HtmlTooltip
              arrow={true}
              open={showAverageRatingTooltip}
              enterDelay={500}
              leaveDelay={200}
              title={<span>There is no average rating data from the meeting yet</span>}
            >
              <StyledChevronIconContainer
                onClick={e => {
                  e.stopPropagation();
                  if (!selectedMeeting.averageRating) return;
                  setshowAverageRating(!showAverageRating);
                }}
                onMouseEnter={() => {
                  setShowAverageRatingTooltip(!selectedMeeting.averageRating && true);
                }}
                onMouseLeave={() => {
                  setShowAverageRatingTooltip(false);
                }}
              >
                <MeetingSectionHeaderText> {t("forum.averageRating")}</MeetingSectionHeaderText>
                <StyledChevronIcon
                  icon={showAverageRating ? "Chevron-Up" : "Chevron-Down"}
                  size={"12px"}
                  iconColor={showAverageRating ? "grey100" : "primary100"}
                />{" "}
              </StyledChevronIconContainer>
            </HtmlTooltip>

            {showAverageRating ? selectedMeeting.averageRating : <></>}

            <StyledChevronIconContainer
              onClick={e => {
                e.stopPropagation();
                setShowNotes(!showNotes);
              }}
            >
              <MeetingSectionHeaderText> Notes</MeetingSectionHeaderText>
              <StyledChevronIcon
                icon={showNotes ? "Chevron-Up" : "Chevron-Down"}
                size={"12px"}
                iconColor={showNotes ? "grey100" : "primary100"}
              />{" "}
            </StyledChevronIconContainer>
            {showNotes ? renderNotes() : <></>}
          </InformationContainer>
        </ChildContainer>
      </Container>
    );
  },
);

const Container = styled.div`
  width: 100%;
  // min-width: 300px;
  // display: flex;
  // justify-content: space-around;
`;
const StyledChevronIcon = styled(Icon)`
  display: inline-block;
  padding: 0px 15px;
`;

const StyledChevronIconContainer = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  margin-top: 2rem;
`;
const MeetingHeader = styled.div``;

const StyledHeading = styled(Heading)`
  margin-bottom: 0;
  font-weight: bold;
  font-size: 26px;
`;

const MeetingSectionHeaderText = styled(Text)`
  font-size: 16px;
  color: ${props => props.theme.colors.black};
  margin-bottom: 0;
  margin-top: 0;
  font-weight: bold;
`;

const LocationContainer = styled.div`
  display: flex;
  margin: 6px;
`;

const StyledContentEditable = styled(ContentEditable)`
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 5px;
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
  // width: 50%;
  // min-width: 375px;
`;

const DateValue = styled.span`
  display: inline-block;
  padding-top: 1em;
`;

const InformationContainer = styled.div`
  padding: 0.5em;
`;
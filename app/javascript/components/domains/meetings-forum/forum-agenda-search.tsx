import * as React from "react";
import styled from "styled-components";
import {
  EntryContainer,
  ItemListContainer,
  ItemCard,
  NoSelectedItems,
} from "~/components/shared/journals-and-notes";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { addDays } from "date-fns";
import { CalendarFilter } from "~/components/shared/journals-and-notes/calendar-filter";
import { useMst } from "~/setup/root";
import * as R from "ramda";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import moment from "moment";
import { meetingTypeParser } from "~/components/shared/agenda/meeting-type-parser";
import { Text } from "~/components/shared/text";
import { Heading } from "~/components/shared";
import { SelectedMeetingAgendaEntry } from "./components/selected-meeting-agenda-entry";
import { TeamMeetingButton } from "~/components/shared/team-meeting-button";
import MeetingTypes from "~/constants/meeting-types";
import { LynchPynBadge } from "./components/lynchpyn-badge";
import { Icon } from "~/components/shared";
export const ForumAgendaSearch = observer(() => {
  const { t } = useTranslation();
  const history = useHistory();
  const {
    forumStore,
    teamStore: { teams },
    companyStore,
    meetingStore,
  } = useMst();

  const teamId = forumStore.currentForumTeamId || R.path([0, "id"], toJS(teams));

  const meetingType =
    companyStore?.company.forumType == "Organisation"
      ? MeetingTypes.ORGANISATION_FORUM_MONTHLY
      : MeetingTypes.FORUM_MONTHLY;

  const fetchMeetings = (startDate, endDate) => {
    if (teamId) {
      forumStore.searchForMeetingsByDateRange(startDate, endDate, teamId, meetingType);
    }
  };

  const [selectedDateFilter, setSelectedDateFilter] = useState<string>(
    t("dateFilters.lastThirtyDays"),
  );
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);

  const defaultStartDate = new Date(companyStore.company.currentQuarterStartDate);
  const defaultEndDate = addDays(new Date(companyStore.company.nextQuarterStartDate), -1);
  const currentTeam = teams.find(team => team.id == teamId);
  const quarterDateFilter = {
    startDate: defaultStartDate,
    endDate: defaultEndDate,
    key: "selection",
  };

  const [dateFilter, setDateFilter] = useState<any>({
    selection: quarterDateFilter,
    compare: {
      startDate: new Date(),
      endDate: new Date(),
      key: "compare",
    },
  });

  useEffect(() => {
    fetchMeetings(
      R.path(["selection", "startDate"], dateFilter),
      R.path(["selection", "endDate"], dateFilter),
    );
  }, [teamId]);

  const filterOptions = [
    {
      label: t("dateFilters.today"),
      selection: {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    },
    {
      label: t("dateFilters.thisWeek"),
      selection: {
        startDate: moment()
          .startOf("week")
          .toDate(),
        endDate: moment()
          .endOf("week")
          .toDate(),
        key: "selection",
      },
    },
    {
      label: t("dateFilters.thisMonth"),
      selection: {
        startDate: moment()
          .startOf("month")
          .toDate(),
        endDate: moment()
          .endOf("month")
          .toDate(),
        key: "selection",
      },
    },
    {
      label: t("dateFilters.thisQuarter"),
      selection: quarterDateFilter,
    },
  ];

  const dateSelectedAction = ranges => {
    const { startDate, endDate } = ranges;

    if (!moment(startDate).isSame(endDate)) {
      //if currentSelectedMeeting is not between start and end date, set to null to ensure no boundary effects
      if (
        selectedMeeting &&
        moment(selectedMeeting.scheduledStartTime).isSameOrAfter(startDate) &&
        moment(selectedMeeting.scheduledStartTime).isSameOrBefore(endDate)
      ) {
        //TODO: filter not based on actual start time as well
      } else {
        setSelectedMeeting(null);
      }
      fetchMeetings(startDate, endDate);
    }
  };

  const handleMeetingClick = () => {
    meetingStore.startNextMeeting(selectedMeeting.teamId, meetingType).then(({ meeting }) => {
      if (!R.isNil(meeting)) {
        history.push(`/team/${meeting.teamId}/meeting/${meeting.id}`);
      }
    });
  };

  const renderSelectedEntry = () => {
    if (selectedMeeting) {
      //TODO may want to look at actual start time
      const inCurrentOrFutureMonth = moment(selectedMeeting.scheduledStartTime).isSameOrAfter(
        moment(),
        "month",
      );
      return (
        <>
          <SelectedEntryContainer>
            <SelectedMeetingAgendaEntry
              selectedMeetingId={selectedMeeting.id}
              disabled={!inCurrentOrFutureMonth || selectedMeeting.ended}
            />
          </SelectedEntryContainer>
        </>
      );
    } else {
      return (
        <NoSelectedItemsContainer>
          <NoSelectedItems text={t<string>("forum.emptyMeetingEntries")} />
        </NoSelectedItemsContainer>
      );
    }
  };

  const renderItems = () => {
    if (!R.isNil(forumStore.searchedForumMeetings)) {
      return (
        <>
          <StyledHeading type={"h2"}>{`Meetings`}</StyledHeading>
          {forumStore.searchedForumMeetings.map((meeting, index) => (
            <MeetingResultContainer key={index}>
              <MeetingDateText>
                {moment(meeting.scheduledStartTime).format("ddd, MMM D")}
              </MeetingDateText>

              <ItemCard
                titleText={`
                  ${moment(meeting.scheduledStartTime).format("LT")} |
                  ${teams.find(team => team.id == meeting.teamId)?.name}
                  `}
                bodyText={meetingTypeParser(meeting.meetingType)}
                onClick={() => setSelectedMeeting(meeting)}
                selected={!R.isNil(selectedMeeting) ? selectedMeeting.id === meeting.id : false}
              />
            </MeetingResultContainer>
          ))}
        </>
      );
    }
  };

  return (
    <>
      <Container>
        <CalendarFilter
          header={t<string>("forum.DateRange")}
          headerSize="h2"
          headerFontSize="24px"
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          selectedDateFilter={selectedDateFilter}
          setSelectedDateFilter={setSelectedDateFilter}
          dateSelectAction={dateSelectedAction}
          width={"20%"}
          maxDate={addDays(new Date(), 365)}
          customFilterOptions={filterOptions}
        />
        <StyledItemListContainer>{renderItems()}</StyledItemListContainer>
        <StyledEntryContainer>{renderSelectedEntry()}</StyledEntryContainer>
        {/* {instanceType === "forum" && <LynchPynBadge />} */}
      </Container>
    </>
  );
});

const Container = styled.div`
  display: flex;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    padding: 1em;
  }
`;

const SelectedEntryContainer = styled.div`
  // margin-left: 50px;
  padding-right: 5px;
  display: flex;
`;

const StyledEntryContainer = styled(EntryContainer)`
  width: 60%;
  padding: 0;
  max-height: inherit;
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;

const StyledItemListContainer = styled(ItemListContainer)`
  // min-width: 300px;
  width: 20%;
  margin-top: 0px;
  margin-right: 0rem;
  margin-bottom: 0rem;
  // margin-left: 5%;
  @media only screen and (max-width: 768px) {
    width: 100%;
    margin-bottom: 1rem;
  }
`;

const MeetingResultContainer = styled.div``;

const MeetingDateText = styled(Text)`
  margin-top: 0;
  margin-bottom: 10px;
  margin-left: 8px;
  font-size: 12px;
  font-weight: bold;
`;

const StyledHeading = styled(Heading)`
  margin-bottom: 1rem;
  font-size: 26px;
  margin-top: 0.5rem;
  font-family: exo;
`;

const NoSelectedItemsContainer = styled.div`
  margin-top: 50px;
  margin-left: auto;
  margin-right: auto;
`;

const BreadcrumbHeaderText = styled.span`
  display: inline-block;
  font-size: 24px;
  font-weight: bold;
  margin-top: 15px;
  margin-bottom: 25px;
`;
const BackHeaderText = styled(BreadcrumbHeaderText)`
  color: ${props => props.theme.colors.grey100};
  margin-right: 0.5em;
  cursor: pointer;
`;

const ChevronRight = styled(Icon)`
  transform: rotate(180deg);
  margin-right: 0.5em;
  margin-top: 0.25em;
`;

const SubHeaderContainer = styled.div`
  display: flex;
  height: 50px;
  margin-bottom: 20px;
`;

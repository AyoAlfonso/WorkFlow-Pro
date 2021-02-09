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
import * as moment from "moment";
import { meetingTypeParser } from "~/components/shared/agenda/meeting-type-parser";
import { Text } from "~/components/shared/text";
import { SelectedMeetingAgendaEntry } from "./components/selected-meeting-agenda-entry";
import { SelectedMeetingNotes } from "./components/selected-meeting-notes";
import { TeamMeetingButton } from "~/components/shared/team-meeting-button";
import MeetingTypes from "~/constants/meeting-types";

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

  const fetchMeetings = (startDate, endDate) => {
    if (teamId) {
      forumStore.searchForMeetingsByDateRange(startDate, endDate, teamId);
    }
  };

  const [selectedDateFilter, setSelectedDateFilter] = useState<string>(
    t("dateFilters.lastThirtyDays"),
  );
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);

  const defaultStartDate = new Date(companyStore.company.currentQuarterStartDate);
  const defaultEndDate = addDays(new Date(companyStore.company.nextQuarterStartDate), -1);

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
      fetchMeetings(startDate, endDate);
    }
  };

  const handleMeetingClick = () => {
    meetingStore
      .fetchNextMeeting(selectedMeeting.teamId, MeetingTypes.FORUM_MONTHLY)
      .then(({ meeting }) => {
        if (!R.isNil(meeting)) {
          history.push(`/team/${meeting.teamId}/meeting/${meeting.id}`);
        }
      });
  };

  const renderSelectedEntry = () => {
    if (selectedMeeting) {
      return (
        <>
          <TeamMeetingButton
            handleMeetingClick={handleMeetingClick}
            disabled={!moment(selectedMeeting.scheduledStartTime).isSame(moment(), "month")}
          />
          <SelectedEntryContainer>
            <SelectedMeetingAgendaEntry selectedMeetingId={selectedMeeting.id} />
            <SelectedMeetingNotes selectedMeetingId={selectedMeeting.id} />
          </SelectedEntryContainer>
        </>
      );
    } else {
      return (
        <NoSelectedItemsContainer>
          <NoSelectedItems text={t("forum.emptyMeetingEntries")} />
        </NoSelectedItemsContainer>
      );
    }
  };

  const renderItems = () => {
    if (!R.isNil(forumStore.searchedForumMeetings)) {
      return forumStore.searchedForumMeetings.map((meeting, index) => (
        <MeetingResultContainer key={index}>
          <MeetingDateText>
            {moment(meeting.scheduledStartTime).format("ddd, MMM D")}
          </MeetingDateText>
          <ItemCard
            titleText={moment(meeting.scheduledStartTime).format("LT")}
            bodyText={meetingTypeParser(meeting.meetingType)}
            onClick={() => setSelectedMeeting(meeting)}
            selected={!R.isNil(selectedMeeting) ? selectedMeeting.id === meeting.id : false}
          />
        </MeetingResultContainer>
      ));
    }
  };

  return (
    <Container>
      <CalendarFilter
        header={t("meeting.meetingAgenda")}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        selectedDateFilter={selectedDateFilter}
        setSelectedDateFilter={setSelectedDateFilter}
        dateSelectAction={dateSelectedAction}
        additionalComponentsBelow={
          <StyledItemListContainer>{renderItems()}</StyledItemListContainer>
        }
        width={"400px"}
        maxDate={addDays(new Date(), 365)}
        customFilterOptions={filterOptions}
      />
      <StyledEntryContainer>{renderSelectedEntry()}</StyledEntryContainer>
    </Container>
  );
});

const Container = styled.div`
  display: flex;
`;

const SelectedEntryContainer = styled.div`
  margin-left: 50px;
  display: flex;
`;

const StyledEntryContainer = styled(EntryContainer)`
  width: 100%;
  padding: 0;
  margin-top: 40px;
  max-height: inherit;
`;

const StyledItemListContainer = styled(ItemListContainer)`
  padding: 5px;
  margin-top: 15px;
  margin-left: -5px;
  overflow-y: unset;
`;

const MeetingResultContainer = styled.div``;

const MeetingDateText = styled(Text)`
  margin-top: 0;
  margin-bottom: 10px;
  margin-left: 8px;
  font-size: 12px;
  font-weight: bold;
`;

const NoSelectedItemsContainer = styled.div`
  margin-top: 50px;
  margin-left: auto;
  margin-right: auto;
`;

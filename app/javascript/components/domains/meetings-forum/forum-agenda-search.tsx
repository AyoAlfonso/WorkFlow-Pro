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

  const { company } = companyStore;
  const instanceType = company && company.accessForum ? "forum" : "teams";

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
      const inCurrentMonth = moment(selectedMeeting.scheduledStartTime).isSame(moment(), "month");
      const inCurrentOrFutureMonth = moment(selectedMeeting.scheduledStartTime).isSameOrAfter(
        moment(),
        "month",
      );
      return (
        <>
          <TeamMeetingButton handleMeetingClick={handleMeetingClick} disabled={!inCurrentMonth} />
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
    <>
      <SubHeaderContainer>
        <BackHeaderText onClick={() => history.push(`/meetings/agenda`)}>
          {company?.name}
        </BackHeaderText>
        <ChevronRight icon={"Chevron-Left"} size={"10px"} iconColor={"grey100"} />
        <BreadcrumbHeaderText> Meeting Agenda & Notes </BreadcrumbHeaderText>
      </SubHeaderContainer>
      <Container>
        <CalendarFilter
          header={""}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          selectedDateFilter={selectedDateFilter}
          setSelectedDateFilter={setSelectedDateFilter}
          dateSelectAction={dateSelectedAction}
          additionalComponentsBelow={
            <StyledItemListContainer>{renderItems()}</StyledItemListContainer>
          }
          width={"450px"}
          maxDate={addDays(new Date(), 365)}
          customFilterOptions={filterOptions}
        />
        <StyledEntryContainer>{renderSelectedEntry()}</StyledEntryContainer>
        {/* {instanceType === "forum" && <LynchPynBadge />} */}
      </Container>
    </>
  );
});

const Container = styled.div`
  display: flex;
`;

const SelectedEntryContainer = styled.div`
  margin-left: 50px;
  padding-right: 5px;
  display: flex;
`;

const StyledEntryContainer = styled(EntryContainer)`
  width: 100%;
  padding: 0;
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

const BreadcrumbHeaderText = styled.span`
  display: inline-block;
  font-size: 18px;
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

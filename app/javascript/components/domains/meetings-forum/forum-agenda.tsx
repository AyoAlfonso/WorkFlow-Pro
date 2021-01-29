import * as React from "react";
import styled from "styled-components";
import {
  EntryContainer,
  ItemListContainer,
  ItemCard,
} from "~/components/shared/journals-and-notes";
import { useTranslation } from "react-i18next";
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

export const ForumAgenda = observer(() => {
  const { t } = useTranslation();
  const {
    forumStore,
    teamStore: { teams },
  } = useMst();

  const [selectedDateFilter, setSelectedDateFilter] = useState<string>(
    t("dateFilters.lastThirtyDays"),
  );
  const [selectedMeetingId, setSelectedMeetingId] = useState<number>(null);

  const teamId = forumStore.currentForumTeamId || R.path([0, "id"], toJS(teams));

  const defaultStartDate = addDays(new Date(), -30);
  const defaultEndDate = new Date();

  const [dateFilter, setDateFilter] = useState<any>({
    selection: {
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      key: "selection",
    },
    compare: {
      startDate: new Date(),
      endDate: new Date(),
      key: "compare",
    },
  });

  useEffect(() => {
    fetchMeetings(defaultStartDate, defaultEndDate);
  }, [teamId]);

  const fetchMeetings = (startDate, endDate) => {
    if (teamId) {
      forumStore.searchForMeetingsByDateRange(startDate, endDate, teamId);
    }
  };

  const dateSelectedAction = ranges => {
    const { startDate, endDate } = ranges;
    if (startDate.getDate() != endDate.getDate()) {
      fetchMeetings(startDate, endDate);
    }
  };

  const renderSelectedEntry = () => {
    return <SelectedEntryContainer> SELECTED ENTRY SECTION </SelectedEntryContainer>;
  };

  const renderItems = () => {
    if (!R.isNil(forumStore.searchedForumMeetings)) {
      return forumStore.searchedForumMeetings.map((meeting, index) => (
        <MeetingResultContainer>
          <MeetingDateText>
            {moment(meeting.scheduledStartTime).format("ddd, MMM D")}
          </MeetingDateText>
          <ItemCard
            key={index}
            titleText={moment(meeting.scheduledStartTime).format("LT")}
            bodyText={meetingTypeParser(meeting.meetingType)}
            onClick={() => setSelectedMeetingId(meeting.id)}
            selected={!R.isNil(selectedMeetingId) ? selectedMeetingId === meeting.id : false}
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
        additionalBodyComponents={<EntryContainer>{renderSelectedEntry()}</EntryContainer>}
      />
      <StyledItemListContainer>{renderItems()}</StyledItemListContainer>
    </Container>
  );
});

const Container = styled.div``;

const SelectedEntryContainer = styled.div`
  margin-left: 50px;
`;

const StyledItemListContainer = styled(ItemListContainer)`
  padding-left: 5px;
  padding-top: 5px;
  margin-left: -5px;
  width: 370px;
`;

const MeetingResultContainer = styled.div``;

const MeetingDateText = styled(Text)`
  margin-top: 0;
  margin-bottom: 10px;
  margin-left: 8px;
  font-size: 12px;
  font-weight: bold;
`;

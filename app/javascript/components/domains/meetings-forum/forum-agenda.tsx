import * as React from "react";
import styled from "styled-components";
import { EntryContainer, ItemListContainer } from "~/components/shared/journals-and-notes";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { addDays } from "date-fns";
import { CalendarFilter } from "~/components/shared/journals-and-notes/calendar-filter";
import { useMst } from "~/setup/root";
import * as R from "ramda";
import { toJS } from "mobx";
import { observer } from "mobx-react";

export const ForumAgenda = observer(props => {
  const { t } = useTranslation();
  const {
    forumStore,
    teamStore: { teams },
  } = useMst();

  const [selectedDateFilter, setSelectedDateFilter] = useState<string>(
    t("dateFilters.lastThirtyDays"),
  );

  const teamId = forumStore.currentForumTeamId || R.path([0, "id"], toJS(teams));

  const defaultStartDate = addDays(new Date(), -15);
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
    return <ItemsContainer> RENDER ITEMS SECTION </ItemsContainer>;
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
      <ItemListContainer>{renderItems()}</ItemListContainer>
    </Container>
  );
});

const Container = styled.div``;

const ItemsContainer = styled.div``;

const SelectedEntryContainer = styled.div`
  margin-left: 50px;
`;

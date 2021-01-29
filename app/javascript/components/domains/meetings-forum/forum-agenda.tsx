import * as React from "react";
import { color, space, typography } from "styled-system";
import styled from "styled-components";
import {
  MainContainer,
  HeadingContainer,
  EntryContainer,
  ItemListContainer,
} from "~/components/shared/journals-and-notes";
import { Heading } from "~/components/shared";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { IQuestionnaireAttempt } from "~/models/questionnaire-attempt";
import { addDays } from "date-fns";
import { CalendarFilter } from "~/components/shared/journals-and-notes/calendar-filter";

export const ForumAgenda = props => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<IQuestionnaireAttempt>(null);
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>(
    t("dateFilters.lastThirtyDays"),
  );
  const [dateFilter, setDateFilter] = useState<any>({
    selection: {
      startDate: addDays(new Date(), -15),
      endDate: new Date(),
      key: "selection",
    },
    compare: {
      startDate: new Date(),
      endDate: new Date(),
      key: "compare",
    },
  });

  const dateSelectedAction = ranges => {
    console.log("ranges", ranges);
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
        setSelectedItem={setSelectedItem}
        selectedDateFilter={selectedDateFilter}
        setSelectedDateFilter={setSelectedDateFilter}
        setLoading={setLoading}
        dateSelectAction={dateSelectedAction}
        additionalBodyComponents={<EntryContainer>{renderSelectedEntry()}</EntryContainer>}
      />
      <ItemListContainer>{renderItems()}</ItemListContainer>
    </Container>
  );
};

const Container = styled.div``;

const ItemsContainer = styled.div``;

const SelectedEntryContainer = styled.div`
  margin-left: 50px;
`;

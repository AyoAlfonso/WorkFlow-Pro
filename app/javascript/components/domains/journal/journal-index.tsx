import { observer } from "mobx-react";
import styled from "styled-components";
import * as R from "ramda";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMst } from "~/setup/root";
import moment from "moment";
import { toJS } from "mobx";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { addDays } from "date-fns";

import {
  ActionButtonsContainer,
  AvatarContainer,
  BodyRightContainer,
  Container,
  EntryBodyCard,
  EntryContainer,
  EntryCardHeaderContainer,
  EntryHeadingContainer,
  ItemCard,
  ItemContainer,
  ItemListContainer,
  NoSelectedItems,
} from "~/components/shared/journals-and-notes";
import { Card } from "~/components/shared/card";
import { Text } from "~/components/shared/text";
import { Avatar } from "~/components/shared/avatar";
import { Loading } from "~/components/shared";
import { IJournalEntry } from "~/models/journal-entry";
import { CalendarFilter } from "~/components/shared/journals-and-notes/calendar-filter";

export interface IJournalIndexProps {}

export const JournalIndex = observer(
  (props: IJournalIndexProps): JSX.Element => {
    const { t } = useTranslation();

    const [loading, setLoading] = useState<boolean>(true);
    const [selectedItem, setSelectedItem] = useState<IJournalEntry>(null);
    const [selectedDateFilter, setSelectedDateFilter] = useState<string>(
      t("dateFilters.lastThirtyDays"),
    );
    const [dateFilter, setDateFilter] = useState<any>({
      selection: {
        startDate: addDays(new Date(), -30),
        endDate: new Date(),
        key: "selection",
      },
      compare: {
        startDate: new Date(),
        endDate: new Date(),
        key: "compare",
      },
    });

    const { journalStore, userStore } = useMst();

    useEffect(() => {
      journalStore.getJournalEntries(null).then(() => setLoading(false));
    }, []);

    const { journalEntriesFiltered } = journalStore;

    if (R.isNil(userStore.users)) {
      return <Loading />;
    }

    const renderItems = () =>
      loading || R.isNil(journalEntriesFiltered) ? (
        <Loading />
      ) : (
        journalEntriesFiltered.map((item, index) => (
          <ItemContainer key={index}>
            <Text fontSize={"16px"} fontWeight={600}>
              {item.date}
            </Text>
            {item.items.map((journalEntry, journalEntryIndex) => (
              <ItemCard
                key={journalEntryIndex}
                titleText={moment(journalEntry.createdAt).format("LT")}
                bodyText={journalEntry.preview}
                onClick={() => setSelectedItem({ ...journalEntry })}
                selected={!R.isNil(selectedItem) ? selectedItem.id === journalEntry.id : false}
              />
            ))}
          </ItemContainer>
        ))
      );

    const renderSelectedEntryHeading = selectedEntry => {
      const { avatarUrl, defaultAvatarColor, firstName, lastName } = userStore.users.find(
        user => user.id === selectedEntry.userId,
      );
      return (
        <>
          <Text fontSize={"16px"} fontWeight={600}>
            {selectedEntry.title}
          </Text>
          <Text fontSize={"12px"} fontWeight={400} color={"grey100"}>
            {moment(selectedEntry.createdAt).format("dddd, MMMM Do, h:mm a")}
          </Text>
          <AvatarContainer>
            <Avatar
              avatarUrl={avatarUrl}
              firstName={firstName}
              lastName={lastName}
              size={24}
              marginLeft={"0"}
              marginRight={"10px"}
              defaultAvatarColor={defaultAvatarColor}
            />
            <Text fontSize={"12px"} fontWeight={400} color={"grey100"} marginRight={"3px"}>
              {firstName}
            </Text>
            <Text fontSize={"12px"} fontWeight={400} color={"grey100"}>
              {lastName}
            </Text>
          </AvatarContainer>
        </>
      );
    };

    const renderSelectedEntry = () => {
      return R.isNil(selectedItem) ? (
        <NoSelectedItems text={t("journals.startAdding")} />
      ) : (
        <>
          <EntryHeadingContainer>{renderSelectedEntryHeading(selectedItem)}</EntryHeadingContainer>
          <Card
            width={"100%"}
            alignment={"left"}
            noHeaderBorder={true}
            headerComponent={
              <EntryCardHeaderContainer>
                <Text fontSize={"12px"} fontWeight={600}>
                  {t("journals.journalEntry")}
                </Text>
                <ActionButtonsContainer>
                  {/* <IconButtonContainer onClick={() => {}}>
                    <Icon icon={"Edit-2"} size={"16px"} mr={"16px"} />
                  </IconButtonContainer> */}
                  {/* <IconButtonContainer onClick={() => {}}>
                    <Icon icon={"Delete"} size={"16px"} />
                  </IconButtonContainer> */}
                </ActionButtonsContainer>
              </EntryCardHeaderContainer>
            }
          >
            <EntryBodyCard>
              <Text
                fontSize={"12px"}
                mb={"20px"}
                dangerouslySetInnerHTML={{ __html: selectedItem.body }}
              />
            </EntryBodyCard>
          </Card>
        </>
      );
    };

    const dateSelectedAction = ranges => {
      journalStore.getJournalEntries(ranges).then(() => setLoading(false));
    };

    return (
      <Container>
        <CalendarFilter
          header={t("journals.indexTitle")}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          setSelectedItem={setSelectedItem}
          selectedDateFilter={selectedDateFilter}
          setSelectedDateFilter={setSelectedDateFilter}
          setLoading={setLoading}
          dateSelectAction={dateSelectedAction}
        />

        <BodyRightContainer>
          <ItemListContainer>{renderItems()}</ItemListContainer>
          <EntryContainer>{renderSelectedEntry()}</EntryContainer>
        </BodyRightContainer>
      </Container>
    );
  },
);

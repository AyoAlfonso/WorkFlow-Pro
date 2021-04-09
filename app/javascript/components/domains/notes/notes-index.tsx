import { observer } from "mobx-react";
import * as R from "ramda";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMst } from "~/setup/root";
import moment from "moment";
import { toJS } from "mobx";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { addDays } from "date-fns";
import { baseTheme } from "~/themes/base";
import ReactHtmlParser from "react-html-parser";

import MeetingTypes from "~/constants/meeting-types";

import {
  ActionButtonsContainer,
  AvatarContainer,
  BodyContainer,
  EntryBodyCard,
  EntryContainer,
  EntryCardHeaderContainer,
  EntryHeadingContainer,
  FilterContainer,
  FilterOption,
  HeadingContainer,
  IconButtonContainer,
  ItemCard,
  ItemContainer,
  ItemListContainer,
  MainContainer,
  NoSelectedItems,
} from "~/components/shared/journals-and-notes";
import { Card, CardHeaderText } from "~/components/shared/card";
import { Heading } from "~/components/shared/heading";
import { Text } from "~/components/shared/text";
import { Icon } from "~/components/shared/icon";
import { Avatar } from "~/components/shared/avatar";
import { Loading } from "~/components/shared";

export interface INotesIndexProps {}

export const NotesIndex = observer(
  (props: INotesIndexProps): JSX.Element => {
    const { t } = useTranslation();

    const [loading, setLoading] = useState<boolean>(true);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [selectedNoteTypeFilter, setSelectedNoteTypeFilter] = useState<string>(
      t("notes.allNotes"),
    );
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
    const [noteTypeFilter, setNoteTypeFilter] = useState<any>({});

    const { meetingStore, userStore, sessionStore, teamStore } = useMst();

    useEffect(() => {
      meetingStore.getMeetingNotes(null).then(() => setLoading(false));
    }, []);

    const meetingTemplates = meetingStore.meetingTemplates;
    const profile = sessionStore.profile;
    const teams = teamStore.teams;
    const users = userStore.users;

    if (R.isNil(meetingTemplates) || R.isNil(users) || R.isNil(profile) || R.isNil(teams)) {
      return <Loading />;
    }

    const renderItems = (meetings, templates) =>
      meetings.length > 0 && templates.length > 0
        ? meetings.map((meeting, index) => {
            return (
              <ItemContainer key={index}>
                <Text fontSize={"16px"} fontWeight={600}>
                  {meeting.date}
                </Text>
                {meeting.items.map((item, idx) => {
                  return (
                    <ItemCard
                      key={idx}
                      titleText={moment(item.startTime).format("LT")}
                      bodyText={templates.find(mt => mt.id === item.meetingTemplateId).name}
                      onClick={() => setSelectedItem({ ...item })}
                      selected={!R.isNil(selectedItem) ? selectedItem.id === item.id : false}
                    />
                  );
                })}
              </ItemContainer>
            );
          })
        : null;

    const filterNoteTypeOptions = [
      {
        label: t("notes.allNotes"),
      },
      {
        label: t("notes.myNotes"),
        filters: {
          userId: profile.id,
          teamId: null,
        },
        avatar: () => (
          <AvatarContainer>
            <Avatar
              avatarUrl={profile.avatarUrl}
              firstName={profile.firstName}
              lastName={profile.lastName}
              size={24}
              marginLeft={"0"}
              marginRight={"10px"}
              defaultAvatarColor={profile.defaultAvatarColor}
            />
          </AvatarContainer>
        ),
      },
    ].concat(
      teams.map(team => ({
        label: t("notes.teamNotes", { teamName: team.name }),
        filters: {
          userId: null,
          teamId: team.id,
        },
        avatar: () => (
          <AvatarContainer>
            <Avatar
              firstName={team.name}
              lastName={""}
              size={24}
              marginLeft={"0"}
              marginRight={"10px"}
              defaultAvatarColor={team.defaultAvatarColor}
            />
          </AvatarContainer>
        ),
      })),
    );

    const renderSelectedEntryHeading = selectedEntry => {
      const { meetingTemplateId, teamId } = selectedEntry;
      const template = meetingTemplates.find(mt => mt.id === meetingTemplateId);
      let firstName, lastName, avatarColor, avatarUrl;

      if (template.meetingType === MeetingTypes.PERSONAL_WEEKLY) {
        firstName = profile.firstName;
        lastName = profile.lastName;
        avatarColor = profile.defaultAvatarColor;
        avatarUrl = profile.avatarUrl;
      } else if (template.meetingType === MeetingTypes.TEAM_WEEKLY) {
        const team = teams.find(team => team.id === teamId);
        firstName = (team && team.name) || "";
        lastName = "";
        avatarColor = team && team.defaultAvatarColor;
        avatarUrl = null;
      }

      return (
        <>
          <Text fontSize={"16px"} fontWeight={600}>
            {template.name}
          </Text>
          <Text fontSize={"16px"} fontWeight={400} color={"grey100"}>
            {moment(selectedEntry.startTime).format("dddd, MMMM Do, h:mm a")}
          </Text>
          <AvatarContainer>
            <Avatar
              avatarUrl={avatarUrl}
              firstName={firstName}
              lastName={lastName}
              size={24}
              marginLeft={"0"}
              marginRight={"10px"}
              defaultAvatarColor={avatarColor}
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
        <NoSelectedItems text={t("notes.startAdding")} />
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
                  {t("notes.meetingNotes")}
                </Text>
                <ActionButtonsContainer>
                  {/* <IconButtonContainer onClick={() => {}}>
                    <Icon icon={"Edit-2"} size={"16px"} mr={"16px"} />
                  </IconButtonContainer> */}
                  <IconButtonContainer
                    onClick={async () => {
                      if (confirm(t("notes.deleteNote"))) {
                        await meetingStore.updateMeeting({ ...selectedItem, notes: "" });
                        setSelectedItem(null);
                        meetingStore
                          .getMeetingNotes({
                            filters: { ...dateFilter.selection, ...noteTypeFilter },
                          })
                          .then(() => setLoading(false));
                      }
                    }}
                  >
                    <Icon icon={"Delete"} size={"16px"} />
                  </IconButtonContainer>
                </ActionButtonsContainer>
              </EntryCardHeaderContainer>
            }
          >
            <EntryBodyCard>{ReactHtmlParser(selectedItem.notes)}</EntryBodyCard>
          </Card>
        </>
      );
    };

    const renderFilterNoteTypeOptions = () =>
      filterNoteTypeOptions.map((option, index) => (
        <FilterOption
          key={index}
          onClick={() => {
            setLoading(true);
            setSelectedNoteTypeFilter(option.label);
            setNoteTypeFilter({ ...option.filters });
            setSelectedItem(null);
            meetingStore
              .getMeetingNotes({ filters: { ...dateFilter.selection, ...option.filters } })
              .then(() => setLoading(false));
          }}
          option={option}
          selected={selectedNoteTypeFilter === option.label}
        />
      ));

    const filterDateOptions = [
      {
        label: t("dateFilters.today"),
        selection: {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
      },
      {
        label: t("dateFilters.lastSevenDays"),
        selection: {
          startDate: addDays(new Date(), -7),
          endDate: new Date(),
          key: "selection",
        },
      },
      {
        label: t("dateFilters.lastThirtyDays"),
        selection: {
          startDate: addDays(new Date(), -30),
          endDate: new Date(),
          key: "selection",
        },
      },
      {
        label: t("dateFilters.lastNinetyDays"),
        selection: {
          startDate: addDays(new Date(), -90),
          endDate: new Date(),
          key: "selection",
        },
      },
    ];

    const renderFilterDateOptions = () =>
      filterDateOptions.map((option, index) => (
        <FilterOption
          key={index}
          onClick={() => {
            setSelectedDateFilter(option.label);
            handleDateSelect({ selection: { ...option.selection } });
          }}
          option={option}
          selected={selectedDateFilter === option.label}
        />
      ));

    const handleDateSelect = ranges => {
      setDateFilter({
        ...ranges,
      });
      setSelectedItem(null);
      setLoading(true);
      meetingStore
        .getMeetingNotes({ filters: { ...ranges.selection, ...noteTypeFilter } })
        .then(() => setLoading(false));
    };

    const meetingNotes = meetingStore.meetingNotes;

    return (
      <MainContainer>
        <BodyContainer>
          <FilterContainer>
            <Card headerComponent={<CardHeaderText fontSize={"12px"}>Filter</CardHeaderText>}>
              {renderFilterNoteTypeOptions()}
              <DateRange
                showDateDisplay={false}
                showMonthAndYearPickers={false}
                ranges={[...Object.values(dateFilter)]}
                onChange={ranges => {
                  setSelectedDateFilter("");
                  handleDateSelect(ranges);
                }}
                showSelectionPreview={true}
                direction={"vertical"}
                minDate={addDays(new Date(), -90)}
                maxDate={new Date()}
                scroll={{
                  enabled: true,
                  calendarWidth: 320,
                  monthWidth: 320,
                }}
                rangeColors={[baseTheme.colors.primary80]}
              />
              {renderFilterDateOptions()}
            </Card>
          </FilterContainer>
          <ItemListContainer>
            {loading || R.isNil(meetingNotes) || R.isNil(meetingTemplates) ? (
              <Loading />
            ) : (
              renderItems(meetingNotes, meetingTemplates)
            )}
          </ItemListContainer>
          <EntryContainer>{renderSelectedEntry()}</EntryContainer>
        </BodyContainer>
      </MainContainer>
    );
  },
);

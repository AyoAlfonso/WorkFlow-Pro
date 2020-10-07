import { observer } from "mobx-react";
import * as R from "ramda";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMst } from "~/setup/root";
import moment, { fn } from "moment";
import { toJS } from "mobx";
import { DateRange, DefinedRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  addDays,
  addWeeks,
  endOfWeek,
  startOfWeek,
  addMonths,
  endOfMonth,
  startOfMonth,
} from "date-fns";
import { baseTheme } from "~/themes/base";

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
  ItemListContainer,
  ItemCard,
  MainContainer,
  NoSelectedItems,
} from "~/components/shared/journals-and-notes";
import { Card, CardHeaderText } from "~/components/shared/card";
import { Heading } from "~/components/shared/heading";
import { Text } from "~/components/shared/text";
import { Icon } from "~/components/shared/icon";
import { Avatar } from "~/components/shared/avatar";
import { Loading } from "~/components/shared";
import { IQuestionnaireAttempt } from "~/models/questionnaire-attempt";

export interface IJournalIndexProps {}

export const JournalIndex = observer(
  (props: IJournalIndexProps): JSX.Element => {
    const [selectedItem, setSelectedItem] = useState<IQuestionnaireAttempt>(null);
    const [selectedDateFilter, setSelectedDateFilter] = useState<string>("");
    const [dateFilter, setDateFilter] = useState<any>({
      selection: {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
      compare: {
        startDate: new Date(),
        endDate: new Date(),
        key: "compare",
      },
    });

    const [loading, setLoading] = useState<boolean>(true);
    const { questionnaireStore, userStore } = useMst();
    const { t } = useTranslation();

    useEffect(() => {
      questionnaireStore.getQuestionnaireAttempts(null).then(() => setLoading(false));
    }, []);

    const questionnaireAttemptsData = questionnaireStore.questionnaireAttemptsData;

    if (loading || R.isNil(questionnaireAttemptsData) || R.isNil(userStore.users)) {
      return <Loading />;
    }

    const parseRenderedSteps = renderedSteps =>
      R.pipe(
        R.filter(R.hasPath(["metadata", "journalQuestion"])),
        R.map(step => {
          if (step.id === "rating") {
            return {
              question: R.path(["metadata", "journalQuestion"], step),
              answer: `${R.path(["value"], step)} / 5`,
            };
          } else {
            return {
              question: R.path(["metadata", "journalQuestion"], step),
              answer: R.path(["value"], step),
            };
          }
        }),
      )(renderedSteps);

    const renderItems = () =>
      questionnaireAttemptsData.map((item, index) => (
        <div key={index}>
          <Text fontSize={"12px"} fontWeight={600}>
            {item.date}
          </Text>
          {item.items.map((qa, qaIndex) => (
            <ItemCard
              key={qaIndex}
              titleText={moment(qa.completedAt).format("LT")}
              bodyText={qa.questionnaireType}
              onClick={() => setSelectedItem({ ...qa })}
              selected={!R.isNil(selectedItem) ? selectedItem.id === qa.id : false}
            />
          ))}
        </div>
      ));

    const renderSelectedEntryHeading = selectedEntry => {
      const { avatarUrl, defaultAvatarColor, firstName, lastName } = userStore.users.find(
        user => user.id === selectedEntry.userId,
      );
      return (
        <>
          <Text fontSize={"12px"} fontWeight={600}>
            {selectedEntry.questionnaireType}
          </Text>
          <Text fontSize={"12px"} fontWeight={400} color={"grey100"}>
            {moment(selectedEntry.completedAt).format("dddd, MMMM Do, h:mm a")}
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
            <Text fontSize={"9px"} fontWeight={400} color={"grey100"} marginRight={"3px"}>
              {firstName}
            </Text>
            <Text fontSize={"9px"} fontWeight={400} color={"grey100"}>
              {lastName}
            </Text>
          </AvatarContainer>
        </>
      );
    };

    const renderSelectedEntry = () => {
      const questionsAnswers = parseRenderedSteps(
        toJS(R.pathOr([], ["renderedSteps"], selectedItem)),
      );
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
                  <IconButtonContainer onClick={() => {}}>
                    <Icon icon={"Edit-2"} size={"16px"} mr={"16px"} />
                  </IconButtonContainer>
                  <IconButtonContainer onClick={() => {}}>
                    <Icon icon={"Delete"} size={"16px"} />
                  </IconButtonContainer>
                </ActionButtonsContainer>
              </EntryCardHeaderContainer>
            }
          >
            <EntryBodyCard>
              {questionsAnswers.map((step, index) => (
                <div key={index}>
                  <Text fontSize={"12px"} fontWeight={600} mb={"20px"}>
                    {step.question}
                  </Text>
                  <Text fontSize={"12px"} fontWeight={400} mb={"20px"}>
                    {step.answer}
                  </Text>
                </div>
              ))}
            </EntryBodyCard>
          </Card>
        </>
      );
    };

    const filterOptions = [
      {
        label: t("dateFilters.today"),
        selection: {
          startDate: new Date(),
          key: "selection",
          endDate: new Date(),
        },
      },
      {
        label: t("dateFilters.yesterday"),
        selection: {
          startDate: addDays(new Date(), -1),
          key: "selection",
          endDate: addDays(new Date(), -1),
        },
      },
      {
        label: t("dateFilters.lastWeek"),
        selection: {
          startDate: startOfWeek(addWeeks(new Date(), -1)),
          key: "selection",
          endDate: endOfWeek(addWeeks(new Date(), -1)),
        },
      },
      {
        label: t("dateFilters.lastMonth"),
        selection: {
          startDate: startOfMonth(addMonths(new Date(), -1)),
          key: "selection",
          endDate: endOfMonth(addMonths(new Date(), -1)),
        },
      },
    ];

    const renderDateFilterOptions = () => {
      return (
        <>
          {filterOptions.map((option, index) => (
            <FilterOption
              key={index}
              onClick={() => {
                setSelectedDateFilter(option.label);
                handleDateSelect({ selection: { ...option.selection } });
              }}
              option={option}
              selected={selectedDateFilter === option.label}
            />
          ))}
        </>
      );
    };

    const handleDateSelect = ranges => {
      setDateFilter({
        ...ranges,
      });
      setLoading(true);
      questionnaireStore.getQuestionnaireAttempts(ranges.selection).then(() => setLoading(false));
    };

    return (
      <MainContainer>
        <HeadingContainer>
          <Heading type={"h1"} fontSize={"24px"}>
            Journal Entries
          </Heading>
        </HeadingContainer>
        <BodyContainer>
          <FilterContainer>
            <Card headerComponent={<CardHeaderText>Filter</CardHeaderText>}>
              {renderDateFilterOptions()}
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
            </Card>
          </FilterContainer>
          <ItemListContainer>{renderItems()}</ItemListContainer>
          <EntryContainer>{renderSelectedEntry()}</EntryContainer>
        </BodyContainer>
      </MainContainer>
    );
  },
);

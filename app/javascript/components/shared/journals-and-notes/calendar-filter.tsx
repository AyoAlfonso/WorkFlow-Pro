import * as React from "react";
import {
  HeadingContainer,
  BodyContainer,
  FilterContainer,
  FilterOption,
} from "~/components/shared/journals-and-notes";
import { Heading, Card, CardHeaderText } from "~/components/shared";
import { useTranslation } from "react-i18next";
import { addDays } from "date-fns";
import { DateRange } from "react-date-range";
import { baseTheme } from "~/themes/base";
import styled from "styled-components";
import { IQuestionnaireAttempt } from "~/models/questionnaire-attempt";

interface ICalendarFilterProps {
  header: string;
  dateFilter: any;
  setDateFilter: React.Dispatch<React.SetStateAction<any>>;
  setSelectedItem: React.Dispatch<React.SetStateAction<IQuestionnaireAttempt>>;
  selectedDateFilter: string;
  setSelectedDateFilter: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  dateSelectAction: any;
  additionalBodyComponents?: JSX.Element;
}

export const CalendarFilter = ({
  header,
  dateFilter,
  setDateFilter,
  setSelectedItem,
  selectedDateFilter,
  setSelectedDateFilter,
  setLoading,
  dateSelectAction,
  additionalBodyComponents,
}: ICalendarFilterProps) => {
  const { t } = useTranslation();

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

  const handleDateSelect = ranges => {
    setDateFilter({
      ...ranges,
    });
    setSelectedItem(null);
    setLoading(true);
    dateSelectAction(ranges.selection);
  };

  const renderDateFilterOptions = () =>
    filterOptions.map((option, index) => (
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

  return (
    <Container>
      <HeadingContainer>
        <Heading type={"h1"} fontSize={"24px"}>
          {header}
        </Heading>
      </HeadingContainer>
      <BodyContainer>
        <FilterContainer>
          <Card headerComponent={<CardHeaderText fontSize={"16px"}>Filter</CardHeaderText>}>
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
        {additionalBodyComponents}
      </BodyContainer>
    </Container>
  );
};

const Container = styled.div``;

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

interface ICalendarFilterProps {
  header: string;
  dateFilter: any;
  setDateFilter: React.Dispatch<React.SetStateAction<any>>;
  setSelectedItem?: React.Dispatch<React.SetStateAction<any>>;
  selectedDateFilter: string;
  setSelectedDateFilter: React.Dispatch<React.SetStateAction<string>>;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  dateSelectAction: any;
  additionalComponentsBelow?: JSX.Element;
  additionalBodyComponents?: JSX.Element;
  width?: string;
  minDate?: any;
  maxDate?: any;
  customFilterOptions?: any;
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
  additionalComponentsBelow,
  additionalBodyComponents,
  width,
  minDate,
  maxDate,
  customFilterOptions,
}: ICalendarFilterProps) => {
  const { t } = useTranslation();

  const filterOptions = customFilterOptions || [
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
    if (setSelectedItem) {
      setSelectedItem(null);
    }
    if (setLoading) {
      setLoading(true);
    }
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
    <Container width={width}>
      <HeadingContainer>
        <Heading type={"h1"} fontSize={"24px"}>
          {header}
        </Heading>
      </HeadingContainer>
      <StyledBodyContainer>
        <StyledFilterContainer>
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
              shownDate={new Date()}
              showSelectionPreview={true}
              direction={"vertical"}
              minDate={minDate || addDays(new Date(), -90)}
              maxDate={maxDate || new Date()}
              scroll={{
                enabled: true,
                calendarWidth: 320,
                monthWidth: 320,
              }}
              rangeColors={[baseTheme.colors.primary80]}
            />
          </Card>
          {additionalComponentsBelow}
        </StyledFilterContainer>
        {additionalBodyComponents}
      </StyledBodyContainer>
    </Container>
  );
};

type ContainerProps = {
  width?: string;
};

const Container = styled.div<ContainerProps>`
  width: ${props => props.width};
`;

const StyledFilterContainer = styled(FilterContainer)`
  max-height: 80vh;
`;

const StyledBodyContainer = styled(BodyContainer)`
  display: block;
  overflow-y: auto;
  padding-left: 4px;
`;

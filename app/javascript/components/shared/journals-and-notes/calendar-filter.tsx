import React, { useState } from "react";
import {
  HeadingContainer,
  BodyContainer,
  FilterContainer,
  FilterOption,
} from "~/components/shared/journals-and-notes";
import { Heading, Card, CardHeaderText, Button } from "~/components/shared";
import { useTranslation } from "react-i18next";
import { addDays } from "date-fns";
import { DateRange } from "react-date-range";
import { baseTheme } from "~/themes/base";
import styled from "styled-components";
import Modal from "styled-react-modal";
import { Icon } from "~/components/shared/icon";
import { TypographyProps } from "styled-system";

interface ICalendarFilterProps {
  header: string;
  dateFilter: any;
  headerSize?: string;
  headerFontSize?: string;
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
  headerSize = "h1",
  headerFontSize = "24px",
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

  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
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

  const renderCustomDateRange = (): JSX.Element => {
    return (
      <DateRangeModal
        isOpen={showCustomDateRange}
        onBackgroundClick={() => setShowCustomDateRange(false)}
      >
        <DatePickerModalHeaderContainer>
          <DatePickerModalHeader>Select Date Range</DatePickerModalHeader>
          <DateModalIconContainer onClick={() => setShowCustomDateRange(false)}>
            <Icon icon={"Close"} size={"16px"} iconColor={"grey80"} ml="8px" />
          </DateModalIconContainer>
        </DatePickerModalHeaderContainer>
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
        <Button
          variant={"primary"}
          small
          onClick={() => {
            setShowCustomDateRange(false);
          }}
          ml="0.5em"
          mt="0.5em"
        >
          Done
        </Button>
      </DateRangeModal>
    );
  };

  return (
    <Container width={width}>
      <HeadingContainer>
        <Heading type={headerSize} fontSize={headerFontSize}>
          {header}
        </Heading>
      </HeadingContainer>
      <StyledBodyContainer>
        <StyledFilterContainer>
          <Card headerComponent={<CardHeaderText fontSize={"16px"}>Filter</CardHeaderText>}>
            {renderDateFilterOptions()}
            <CardBottomText>
              <StyledChevronIconContainer
                onClick={e => {
                  e.stopPropagation();
                  setShowCustomDateRange(!showCustomDateRange);
                }}
              >
                Custom Range
                <StyledChevronIcon
                  icon={showCustomDateRange ? "Chevron-Up" : "Chevron-Down"}
                  size={"12px"}
                  iconColor={showCustomDateRange ? "grey100" : "primary100"}
                />
              </StyledChevronIconContainer>
              {showCustomDateRange ? renderCustomDateRange() : <></>}
            </CardBottomText>
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
const StyledChevronIcon = styled(Icon)`
  display: inline-block;
  padding: 0px 15px;
`;

const DateRangeModal = Modal.styled`
  width: fit-content;
  border-radius: 8px;
  height: fit-content;
  background-color: ${props => props.theme.colors.white};
  padding: 0.5em;
`;

const StyledChevronIconContainer = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;
const Container = styled.div<ContainerProps>`
  width: ${props => props.width};
  // min-width: 370px;
  @media only screen and (max-width: 768px) {
    width: 100%;
    margin-bottom: 1em;
  }
`;

const CardBottomText = styled.h5<TypographyProps>`
  margin: 1rem 1rem 1rem;
`;

const StyledFilterContainer = styled(FilterContainer)`
  max-height: 80vh;
  padding: 0.5rem;
`;

const StyledBodyContainer = styled(BodyContainer)`
  display: block;
  overflow-y: auto;
`;

const DatePickerModalHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 0.5em;
  padding-right: 0.5em;
`;

const DatePickerModalHeader = styled.h1`
  font-size: 18px;
`;

const DateModalIconContainer = styled.div`
  margin-left: auto;
  cursor: pointer;
`;
import * as React from "react";
import { useState } from "react";
import { useMst } from "~/setup/root";
import styled from "styled-components";
import { space, color } from "styled-system";
import { WidgetHeaderSortButtonMenu } from "~/components/shared/widget-header-sort-button-menu";
//import Icon from "../../shared/icon";

interface KeyActivitiesHeaderProps {
  hideFilter?: boolean;
  showAllKeyActivities?: boolean;
  setShowAllKeyActivities?: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
}

export const KeyActivitiesHeader = (props: KeyActivitiesHeaderProps): JSX.Element => {
  const { showAllKeyActivities, setShowAllKeyActivities, title, hideFilter } = props;
  const [sortOptionsOpen, setSortOptionsOpen] = useState<boolean>(false);

  const { keyActivityStore } = useMst();

  const sortMenuOptions = [
    {
      label: "Sort by Priority",
      value: "by_priority",
    },
    {
      label: "Sort by Due Date",
      value: "by_due_date",
    },
    {
      label: "Sort by Priority and Due Date",
      value: "by_priority_and_due_date",
    },
  ];

  const handleSortMenuItemClick = value => {
    setSortOptionsOpen(false);
    keyActivityStore.resortKeyActivities({ sort: value });
  };

  return (
    <Container>
      <KeyActivitiesText> {title || "Pyns"} </KeyActivitiesText>
      {!hideFilter && (
        <FilterContainer>
          <FilterOptions
            onClick={() => setShowAllKeyActivities(false)}
            mr={"15px"}
            color={!showAllKeyActivities ? "primary100" : "grey40"}
          >
            Week
          </FilterOptions>
          <FilterOptions
            onClick={() => setShowAllKeyActivities(true)}
            color={showAllKeyActivities ? "primary100" : "grey40"}
          >
            Master
          </FilterOptions>
          <WidgetHeaderSortButtonMenu
            onButtonClick={setSortOptionsOpen}
            onMenuItemClick={handleSortMenuItemClick}
            menuOpen={sortOptionsOpen}
            menuOptions={sortMenuOptions}
            ml={"15px"}
          />
        </FilterContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  border-bottom: 1px solid #e3e3e3;
  padding-left: 10px;
  padding-right: 10px;
`;

const KeyActivitiesText = styled.h4`
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 20px;
  font-size: 16px;
  font-weight: 600;
`;

const FilterContainer = styled.div`
  display: flex;
  margin-left: auto;
  justify-content: center;
  align-items: center;
`;

type FilterOptionsType = {
  mr?: string;
};

const FilterOptions = styled.p<FilterOptionsType>`
  ${space}
  ${color}
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
`;

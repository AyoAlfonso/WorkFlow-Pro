import * as React from "react";
import styled from "styled-components";
import { space, color } from "styled-system";
//import Icon from "../../shared/icon";

interface KeyActivitiesHeaderProps {
  showAllKeyActivities: boolean;
  setShowAllKeyActivities: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
}

export const KeyActivitiesHeader = (props: KeyActivitiesHeaderProps): JSX.Element => {
  const { showAllKeyActivities, setShowAllKeyActivities, title } = props;

  return (
    <Container>
      <KeyActivitiesText> {title || "Key Activities"} </KeyActivitiesText>
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

        {/* 
          COMMENT FROM PARHAM JUNE 19 2020: WE MIGHT NOT NEED THIS IF WE CAN AUTOSORT KeyActivities WHENEVER THEY ARE BEING ADDED

          <SortingChevronContainer>
          <ChevronUpContainer>
            <Icon icon={"Chevron-Up"} size={10} color="grey40" />
          </ChevronUpContainer>
          <ChevronDownContainer>
            <Icon icon={"Chevron-Down"} size={10} color="grey40" />
          </ChevronDownContainer>
        </SortingChevronContainer> */}
      </FilterContainer>
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
  font-size: 13pt;
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
  font-size: 11pt;
  font-weight: 400;
  cursor: pointer;
`;

// const SortingChevronContainer = styled.div`
//   margin-right: 0;
//   margin-top: -3px;
// `;

// const ChevronUpContainer = styled.div`
//   margin-bottom: -5px;
// `;

// const ChevronDownContainer = styled.div`
//   margin-top: -5px;
// `;

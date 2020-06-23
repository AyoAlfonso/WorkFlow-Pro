import * as React from "react";
import styled from "styled-components";
import { space } from "styled-system";
//import Icon from "../../shared/Icon";

interface IssuesHeaderProps {
  showAllIssues: boolean;
  setShowAllIssues: React.Dispatch<React.SetStateAction<boolean>>;
}

export const IssuesHeader = (props: IssuesHeaderProps): JSX.Element => {
  const { showAllIssues, setShowAllIssues } = props;

  return (
    <Container>
      <IssuesText> Issues </IssuesText>
      <FilterContainer>
        <FilterOptions
          onClick={() => setShowAllIssues(false)}
          mr={"15px"}
          color={!showAllIssues ? "#4a96ed" : "#c4c4c4"}
        >
          Open
        </FilterOptions>
        <FilterOptions
          onClick={() => setShowAllIssues(true)}
          color={showAllIssues ? "#4a96ed" : "#c4c4c4"}
        >
          All
        </FilterOptions>

        {/* 
          COMMENT FROM PARHAM JUNE 19 2020: WE MIGHT NOT NEED THIS IF WE CAN AUTOSORT ISSUES WHENEVER THEY ARE BEING ADDED

          <SortingChevronContainer>
          <ChevronUpContainer>
            <Icon icon={"Chevron-Up"} size={10} color="#c4c4c4" />
          </ChevronUpContainer>
          <ChevronDownContainer>
            <Icon icon={"Chevron-Down"} size={10} color="#c4c4c4" />
          </ChevronDownContainer>
        </SortingChevronContainer> */}
      </FilterContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  border-bottom: 1px solid #e3e3e3;
  padding-left: 20px;
  padding-right: 20px;
`;

const IssuesText = styled.h3`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FilterContainer = styled.div`
  display: flex;
  margin-left: auto;
  justify-content: center;
  align-items: center;
`;

const FilterOptions = styled.p`
  ${space}
  font-size: 14px;
  cursor: pointer;
  color: ${props => props.color || "#c4c4c4"};
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

import * as React from "react";
import styled from "styled-components";
//import { ReactComponent as Chevron } from "../../../lynchpyn-icons/Chevron.svg";

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

        <SortingChevronContainer>
          {/* <img src={"/lynchpyn-icons/Chevron.svg"} alt="Icon" height="10px" width="10px" /> */}
          <div>^</div>
          <div>v</div>
        </SortingChevronContainer>
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
  margin-right: 15px;
  font-size: 14px;
  cursor: pointer;
  color: ${props => props.color || "#c4c4c4"};
`;

const SortingChevronContainer = styled.div`
  margin-right: 0;
`;

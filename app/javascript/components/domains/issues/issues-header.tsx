import * as React from "react";
import styled from "styled-components";
import { space, color } from "styled-system";
//import Icon from "../../shared/icon";

interface IssuesHeaderProps {
  showOpenIssues: boolean;
  setShowOpenIssues: React.Dispatch<React.SetStateAction<boolean>>;
}

export const IssuesHeader = (props: IssuesHeaderProps): JSX.Element => {
  const { showOpenIssues, setShowOpenIssues } = props;

  return (
    <Container>
      <IssuesText> Issues </IssuesText>
      <FilterContainer>
        <FilterOptions
          onClick={() => setShowOpenIssues(true)}
          mr={"15px"}
          color={showOpenIssues ? "primary100" : "grey40"}
        >
          Open
        </FilterOptions>
        <FilterOptions
          onClick={() => setShowOpenIssues(false)}
          color={!showOpenIssues ? "primary100" : "grey40"}
        >
          Closed
        </FilterOptions>

        {/* 
          COMMENT FROM PARHAM JUNE 19 2020: WE MIGHT NOT NEED THIS IF WE CAN AUTOSORT ISSUES WHENEVER THEY ARE BEING ADDED

          <SortingChevronContainer>
          <ChevronUpContainer>
            <Icon icon={"Chevron-Up"} size={10} iconColor="grey40" />
          </ChevronUpContainer>
          <ChevronDownContainer>
            <Icon icon={"Chevron-Down"} size={10} iconColor="grey40" />
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

const IssuesText = styled.h4`
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 20px;
  font-size: 14pt;
  font-weight: 400;
`;

const FilterContainer = styled.div`
  display: flex;
  margin-left: auto;
  justify-content: center;
  align-items: center;
`;

const FilterOptions = styled.p`
  ${space}
  ${color}
  font-size: 12pt;
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

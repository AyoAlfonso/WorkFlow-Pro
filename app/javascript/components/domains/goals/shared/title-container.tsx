import * as React from "react";
import styled from "styled-components";
import { space, color } from "styled-system";
import { HomeTitle } from "../../home/shared-components";
import { EnlargedHomeTitle } from "./enlarged-home-title";
import { Icon } from "~/components/shared/icon";

interface ITitleContainerProps {
  showMinimizedCards: boolean;
  setShowMinimizedCards: React.Dispatch<React.SetStateAction<boolean>>;
  showCompanyGoals: boolean;
  setShowCompanyGoals: React.Dispatch<React.SetStateAction<boolean>>;
  largeHomeTitle?: boolean;
}

export const TitleContainer = ({
  showMinimizedCards,
  setShowMinimizedCards,
  showCompanyGoals,
  setShowCompanyGoals,
  largeHomeTitle,
}: ITitleContainerProps): JSX.Element => {
  const renderExpandAnnualInitiativesIcon = (): JSX.Element => {
    return showMinimizedCards ? (
      <IconContainer>
        <Icon icon={"Chevron-Down"} size={"15px"} iconColor={"primary100"} />
      </IconContainer>
    ) : (
      <IconContainer marginTop={"3px"}>
        <Icon icon={"Chevron-Up"} size={"15px"} iconColor={"white"} />
      </IconContainer>
    );
  };

  return (
    <Container>
      {largeHomeTitle ? (
        <EnlargedHomeTitle> Goals </EnlargedHomeTitle>
      ) : (
        <HomeTitle> Goals </HomeTitle>
      )}

      <ExpandAnnualInitiativesButton
        showMinimizedCards={showMinimizedCards}
        onClick={() => setShowMinimizedCards(!showMinimizedCards)}
      >
        {renderExpandAnnualInitiativesIcon()}
      </ExpandAnnualInitiativesButton>
      <FilterContainer>
        <FilterOptions
          onClick={() => setShowCompanyGoals(false)}
          color={!showCompanyGoals ? "primary100" : "grey40"}
        >
          Me
        </FilterOptions>
        <FilterOptions
          onClick={() => setShowCompanyGoals(true)}
          color={showCompanyGoals ? "primary100" : "grey40"}
        >
          Company
        </FilterOptions>
      </FilterContainer>
    </Container>
  );
};

type ExpandAnnualInitiativesButtonType = {
  showMinimizedCards: boolean;
};

const ExpandAnnualInitiativesButton = styled.div<ExpandAnnualInitiativesButtonType>`
  border-radius: 50px;
  border: 1px solid #e3e3e3;
  box-shadow: 0px 3px 6px #f5f5f5;
  height: 25px;
  width: 25px;
  margin-left: 16px;
  margin-top: 10px;
  background-color: ${props =>
    props.showMinimizedCards ? props.theme.colors.white : props.theme.colors.primary100};
`;

const Container = styled.div`
  display: flex;
`;

type IconContainerType = {
  marginTop?: string;
};

const IconContainer = styled.div<IconContainerType>`
  text-align: center;
  margin-top: ${props => props.marginTop || "6px"};
  &: hover {
    cursor: pointer;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  margin-left: auto;
  margin-right: 10px;
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
  margin-left: 16px;
`;

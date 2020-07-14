import * as React from "react";
import { observer } from "mobx-react";
import { HomeContainerBorders, HomeTitle } from "./shared-components";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { useState, useEffect } from "react";
import { space, color } from "styled-system";
import { AnnualInitiativeCard } from "../goals/annual-initiative/annual-initiative-card";
import { Icon } from "../../shared/icon";
import { Loading } from "../../shared/loading";

export const HomeGoals = (): JSX.Element => {
  const { goalStore } = useMst();

  const [showCompanyGoals, setShowCompanyGoals] = useState<boolean>(true);
  const [showMinimizedCards, setShowMinimizedCards] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    goalStore.load().then(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />;
  }

  const companyGoals = goalStore.companyGoals;
  const personalGoals = goalStore.personalGoals;

  const renderRallyingCry = (): JSX.Element => {
    return (
      <VisionContainer>
        <VisionTitle>Rallying Cry</VisionTitle>
        <VisionText> {companyGoals.rallyingCry} </VisionText>
      </VisionContainer>
    );
  };

  const renderPersonalVision = (): JSX.Element => {
    return (
      <VisionContainer>
        <VisionTitle>Personal Vision</VisionTitle>
        <VisionText> {personalGoals.personalVision}</VisionText>
      </VisionContainer>
    );
  };

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

  const renderAnnualInitiatives = (annualInitiatives): JSX.Element => {
    return annualInitiatives.map((annualInitiative, index) => {
      return (
        <AnnualInitiativeCard
          key={index}
          index={index}
          annualInitiative={annualInitiative}
          totalNumberOfAnnualInitiatives={annualInitiatives.length}
          showMinimizedCards={showMinimizedCards}
        />
      );
    });
  };

  return (
    <Container>
      <TitleContainer>
        <HomeTitle> Goals </HomeTitle>
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
            style={!showCompanyGoals ? { textDecoration: "underline" } : {}}
          >
            Me
          </FilterOptions>
          <FilterOptions
            onClick={() => setShowCompanyGoals(true)}
            color={showCompanyGoals ? "primary100" : "grey40"}
            style={showCompanyGoals ? { textDecoration: "underline" } : {}}
          >
            Company
          </FilterOptions>
        </FilterContainer>
      </TitleContainer>

      {renderRallyingCry()}

      <InitiativesContainer>
        {renderAnnualInitiatives(
          showCompanyGoals ? companyGoals.goals : companyGoals.myAnnualInitiatives,
        )}
      </InitiativesContainer>

      <PersonalVisionContainer>
        {renderPersonalVision()}
        <InitiativesContainer>{renderAnnualInitiatives(personalGoals.goals)}</InitiativesContainer>
      </PersonalVisionContainer>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 30px;
`;

const InitiativesContainer = styled.div`
  display: flex;
  margin-top: 15px;
`;

const PersonalVisionContainer = styled.div`
  margin-top: 20px;
  padding-top: 10px;
`;

const VisionContainer = styled(HomeContainerBorders)`
  height: 60px;
  display: flex;
`;

const VisionTitle = styled.p`
  ${color}
  font-size: 20px;
  color: ${props => props.theme.colors.primary100};
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 16px;
  display: flex;
  align-items: center;
  height: inherit;
  position: absolute;
`;

const VisionText = styled.p`
  font-size: 15px;
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  margin-bottom: auto;
`;

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

const TitleContainer = styled.div`
  display: flex;
`;

type IconContainerType = {
  marginTop?: string;
};

const IconContainer = styled.div<IconContainerType>`
  text-align: center;
  margin-top: ${props => props.marginTop || "6px"};
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
  font-size: 12pt;
  font-weight: 400;
  cursor: pointer;
  margin-left: 16px;
`;

import * as React from "react";
import { HomeContainerBorders, HomeTitle } from "./shared-components";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { useState } from "react";
import { space, color } from "styled-system";

export const HomeGoals = (): JSX.Element => {
  const { goalStore } = useMst();

  const companyGoals = goalStore.companyGoals;
  const personalGoals = goalStore.personalGoals;

  const [showCompanyGoals, setShowCompanyGoals] = useState<boolean>(true);

  const goalsToShow = showCompanyGoals ? companyGoals : personalGoals;

  console.log("comapny goals", companyGoals);
  console.log("personal goals", personalGoals);

  const renderRallyingCry = (): JSX.Element => {
    return (
      <VisionContainer>
        <VisionText>Rallying Cry</VisionText>
      </VisionContainer>
    );
  };

  const renderPersonalVision = (): JSX.Element => {
    return (
      <VisionContainer>
        <VisionText>Personal Vision</VisionText>
      </VisionContainer>
    );
  };

  const renderAnnualInitiatives = () => {
    return goalsToShow.map((annualInitiative, index) => (
      <AnnualInitiativesItem
        key={index}
        margin-right={index + 1 == goalsToShow.length ? "0px" : "15px"}
      >
        {annualInitiative.description}
      </AnnualInitiativesItem>
    ));
  };

  return (
    <Container>
      <TitleContainer>
        <HomeTitle> Goals </HomeTitle>
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
      <InitiativesContainer>{renderAnnualInitiatives()}</InitiativesContainer>

      <PersonalVisionContainer>
        {renderPersonalVision()}
        <InitiativesContainer>{renderAnnualInitiatives()}</InitiativesContainer>
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
  height: 40px;
`;

const VisionText = styled.p`
  text-align: center;
  margin-top: 10px;
`;

const AnnualInitiativesItem = styled(HomeContainerBorders)`
  height: 100px;
  width: 20%;
  min-width: 240px;
  margin-right: ${props => props["margin-right"] || "0px"};
`;

const TitleContainer = styled.div`
  display: flex;
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

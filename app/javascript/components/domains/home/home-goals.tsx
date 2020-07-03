import * as React from "react";
import { HomeContainerBorders, HomeTitle } from "./shared-components";
import styled from "styled-components";

export const HomeGoals = (): JSX.Element => {
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
    const values = [1, 2, 3, 4, 5];
    return values.map((value, index) => (
      <AnnualInitiativesItem key={index} margin-right={index + 1 == values.length ? "0px" : "15px"}>
        Annual Initiative {index}
      </AnnualInitiativesItem>
    ));
  };

  return (
    <Container>
      <HomeTitle> Goals </HomeTitle>
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

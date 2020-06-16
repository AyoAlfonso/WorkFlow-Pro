import * as React from "react";
import styled from "styled-components";
import { HomeHeaderBar } from "./home-header-bar";
import { HomePersonalStatus } from "./home-personal-status";
import { HomePersonalItems } from "./home-personal-items";
import { HomeCoreFour } from "./home-core-four";
import { HomeGoals } from "./home-goals";

export const HomeContainer = (): JSX.Element => {
  return (
    <Container>
      <HomeHeaderBar />
      <HomePersonalStatus />
      <HomePersonalItems />
      <HomeCoreFour />
      <HomeGoals />
    </Container>
  );
};

const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 90%;
  margin-bottom: 50px;
`;

import * as React from "react";
import styled from "styled-components";
import { HomePersonalStatus } from "./home-personal-status";
import { HomePersonalItems } from "./home-personal-items";
import { HomeCoreFour } from "./home-core-four";
import { HomeGoals } from "./home-goals";
import { useMst } from "../../../setup/root";

export const HomeContainer = (): JSX.Element => {
  const { userStore } = useMst();

  console.log("users", userStore.count);

  return (
    <Container>
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
  width: 80%;
  margin-bottom: 50px;
`;

import * as React from "react";
import { HomePersonalStatus } from "./home-personal-status";
import { HomePersonalItems } from "./home-personal-items";
import { HomeCoreFour } from "./home-core-four";
import { HomeGoals } from "./home-goals";

export const HomeContainer = (): JSX.Element => {
  return (
    <>
      <HomePersonalStatus />
      <HomePersonalItems />
      <HomeCoreFour />
      <HomeGoals />
    </>
  );
};

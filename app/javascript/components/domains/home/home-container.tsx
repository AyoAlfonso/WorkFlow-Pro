import * as React from "react";
import { HomePersonalStatus } from "./home-personal-status";
import { HomePersonalItems } from "./home-personal-items";
import { HomeCoreFour } from "./home-core-four";
import { HomeGoals } from "./home-goals";
import { useMst } from "../../../setup/root";

export const HomeContainer = (): JSX.Element => {
  const { userStore } = useMst();

  console.log("users", userStore.count);

  return (
    <>
      <HomePersonalStatus />
      <HomePersonalItems />
      <HomeCoreFour />
      <HomeGoals />
    </>
  );
};

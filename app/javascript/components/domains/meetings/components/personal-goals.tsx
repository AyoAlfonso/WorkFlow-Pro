import * as React from "react";

import { Text } from "~/components/shared/text";
import { CoreFourOnly } from "~/components/domains/goals/goals-core-four";
import { HomeGoals } from "~/components/domains/home/home-goals";

export const PersonalGoals = (props: {}): JSX.Element => {
  return (
    <>
      <CoreFourOnly />
      <HomeGoals />
    </>
  );
};

import * as React from "react";
import { HomeKeyActivities } from "~/components/domains/home/home-key-activities/home-key-activities";

interface DailyPlanningProps {
  hideListSelector?: boolean;
  disabled?: boolean;
}

export const DailyPlanning = ({ hideListSelector, disabled }: DailyPlanningProps): JSX.Element => {
  return <HomeKeyActivities hideListSelector={hideListSelector} width={"100%"} disabled={disabled} />;
};

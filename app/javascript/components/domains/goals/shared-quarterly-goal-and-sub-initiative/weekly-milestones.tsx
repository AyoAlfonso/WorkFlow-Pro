import * as React from "react";
import { MilestoneCard } from "../milestone/milestone-card";

interface IWeeklyMilestonesProps {
  editable: boolean;
  allMilestones: any;
  activeMilestones: any;
  showInactiveMilestones: boolean;
}

export const WeeklyMilestones = ({
  editable,
  allMilestones,
  activeMilestones,
  showInactiveMilestones,
}: IWeeklyMilestonesProps): JSX.Element => {
  const milestonesToShow = showInactiveMilestones ? allMilestones : activeMilestones;
  return milestonesToShow.map((milestone, index) => {
    return <MilestoneCard key={index} milestone={milestone} editable={editable} />;
  });
};

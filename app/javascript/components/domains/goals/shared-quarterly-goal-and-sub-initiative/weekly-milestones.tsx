import * as React from "react";
import { MilestoneCard } from "../milestone/milestone-card";

interface IWeeklyMilestonesProps {
  editable: boolean;
  allMilestones: any;
  activeMilestones: any;
  showInactiveMilestones: boolean;
  itemType: string;
}

export const WeeklyMilestones = ({
  editable,
  allMilestones,
  activeMilestones,
  showInactiveMilestones,
  itemType,
}: IWeeklyMilestonesProps): JSX.Element => {
  const milestonesToShow = showInactiveMilestones ? allMilestones : activeMilestones;
  return milestonesToShow.map((milestone, index) => {
    return (
      <MilestoneCard key={index} milestone={milestone} editable={editable} itemType={itemType} />
    );
  });
};

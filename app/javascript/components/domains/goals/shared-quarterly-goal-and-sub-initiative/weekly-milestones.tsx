import * as React from "react";
import { observer } from "mobx-react";
import { MilestoneCard } from "../milestone/milestone-card";

interface IWeeklyMilestonesProps {
  editable: boolean;
  allMilestones: any;
  activeMilestones: any;
  showInactiveMilestones: boolean;
  itemType: string;
}

export const WeeklyMilestones = observer(
  ({
    editable,
    allMilestones,
    activeMilestones,
    showInactiveMilestones,
    itemType,
  }: IWeeklyMilestonesProps): JSX.Element => {
    const milestonesToShow = showInactiveMilestones ? allMilestones : activeMilestones;
    return milestonesToShow.map(milestone => {
      return (
        <MilestoneCard
          key={milestone.id}
          milestone={milestone}
          editable={editable}
          itemType={itemType}
        />
      );
    });
  },
); 

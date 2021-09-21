import React from "react";
import { MilestoneType } from "~/types/milestone";
import { useMst } from "~/setup/root";
import * as R from "ramda";
import * as moment from "moment";
import { observer } from "mobx-react";
import { Select } from "../../../shared/input";

interface MilestoneDropdownProps {
  milestone: MilestoneType;
  milestoneStatus: string;
  editable: boolean;
  fromMeeting?: boolean;
  itemType: string;
}

export const MilestoneDropdown = observer((props: MilestoneDropdownProps): JSX.Element => {
  const { milestone, milestoneStatus, editable, fromMeeting, itemType } = props;
  const { quarterlyGoalStore, subInitiativeStore, milestoneStore } = useMst();

  const statusChangable = moment(milestone.weekOf).isSameOrBefore(moment(), "week");

  const updateStatus = (status) => {
    if (fromMeeting) {
      milestoneStore.updateStatusFromPersonalMeeting(milestone.id, status);
    }
    if (!fromMeeting) {
      switch (itemType) {
        case "quarterlyGoal":
          quarterlyGoalStore.updateMilestoneStatus(milestone.id, status);
          break;
        case "subInitiative":
          subInitiativeStore.updateMilestoneStatus(milestone.id, status);
          break;
        default:
          break;
      }
    }
  }

  const statusArray = ["unstarted", "in_progress", "incomplete", "completed"];

  return (
    <Select
      onChange={e => {
        updateStatus(e.target.value);
      }}
      value={milestoneStatus}
      width={125}
      disabled={!statusChangable && !editable}
    >
      {R.map(
        (status: string, index: number) => (
          <option key={index} value={status}>
            {status}
          </option>
        ),
        statusArray
      )}
    </Select>
  );
});
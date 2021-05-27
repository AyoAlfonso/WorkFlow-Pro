import * as React from "react";
import styled from "styled-components";
import { baseTheme } from "../../../../themes";
import { MilestoneType } from "~/types/milestone";
import { useState, useEffect } from "react";
import { useMst } from "~/setup/root";
import * as moment from "moment";
import { observer } from "mobx-react";

interface IIndividualVerticalStatusBlockColorIndicatorProps {
  milestone: MilestoneType;
  milestoneStatus: string;
  editable: boolean;
  fromMeeting?: boolean;
  itemType: string;
}

export const IndividualVerticalStatusBlockColorIndicator = observer(
  (props: IIndividualVerticalStatusBlockColorIndicatorProps): JSX.Element => {
    const { milestone, milestoneStatus, editable, fromMeeting, itemType } = props;
    const { quarterlyGoalStore, subInitiativeStore, milestoneStore } = useMst();

    const colorChangable = moment(milestone.weekOf).isSameOrBefore(moment(), "week");
    const determineStatusColor = status => {
      switch (status) {
        case "incomplete":
          return warningRed;
        case "in_progress":
          return cautionYellow;
        case "completed":
          return finePine;
        default:
          return grey20;
      }
    };

    useEffect(() => {
      setStatusColor(determineStatusColor(milestoneStatus));
    }, [milestone]);

    const [statusColor, setStatusColor] = useState<any>(null);
    const { warningRed, cautionYellow, finePine, grey20 } = baseTheme.colors;

    const updateStatus = () => {
      let statusValue = "";
      switch (milestone.status) {
        case "unstarted":
          statusValue = "completed";
          break;
        case "incomplete":
          statusValue = "unstarted";
          break;
        case "in_progress":
          statusValue = "incomplete";
          break;
        case "completed":
          statusValue = "in_progress";
          break;
        default:
          statusValue = "";
      }

      if (fromMeeting) {
        milestoneStore.updateStatusFromPersonalMeeting(milestone.id, statusValue);
      }

      if (!fromMeeting) {
        switch (itemType) {
          case "quarterlyGoal":
            quarterlyGoalStore.updateMilestoneStatus(milestone.id, statusValue);
            break;
          case "subInitiative":
            subInitiativeStore.updateMilestoneStatus(milestone.id, statusValue);
            break;
          default:
            break;
        }
      }

      setStatusColor(determineStatusColor(statusValue));
    };

    return (
      <StatusBlock
        backgroundColor={statusColor}
        colorChangable={colorChangable}
        onClick={() => {
          if (colorChangable && editable) {
            updateStatus();
          }
        }}
      />
    );
  },
);

type StatusBlockType = {
  backgroundColor?: string;
  colorChangable: boolean;
};

const StatusBlock = styled.div<StatusBlockType>`
  width: 15px;
  height: 70px;
  border-radius: 10px;
  margin: auto;
  background-color: ${props => props.backgroundColor || props.theme.colors.grey20};
  &: hover {
    cursor: ${props => props.colorChangable && "pointer"};
  }
`;

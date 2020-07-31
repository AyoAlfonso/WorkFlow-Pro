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
}

export const IndividualVerticalStatusBlockColorIndicator = observer(
  (props: IIndividualVerticalStatusBlockColorIndicatorProps): JSX.Element => {
    const { milestone, milestoneStatus } = props;
    const { quarterlyGoalStore } = useMst();

    const colorChangable =
      moment(milestone.weekOf).isSame(moment(), "week") ||
      moment(milestone.weekOf).isBefore(moment(), "week");

    const determineStatusColor = () => {
      switch (milestoneStatus) {
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
      setStatusColor(determineStatusColor());
    });

    const [statusColor, setStatusColor] = useState<any>(null);
    const { warningRed, cautionYellow, finePine, grey20 } = baseTheme.colors;

    const updateStatus = () => {
      let statusValue = "";
      switch (milestone.status) {
        case "unstarted":
          statusValue = "incomplete";
          break;
        case "incomplete":
          statusValue = "in_progress";
          break;
        case "in_progress":
          statusValue = "completed";
          break;
        case "completed":
          statusValue = "unstarted";
          break;
        default:
          statusValue = "";
      }
      quarterlyGoalStore.updateMilestoneStatus(milestone.id, statusValue);
    };

    return (
      <StatusBlock
        backgroundColor={statusColor}
        colorChangable={colorChangable}
        onClick={() => {
          if (colorChangable) {
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

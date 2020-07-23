import * as React from "react";
import styled from "styled-components";
import { baseTheme } from "../../../../themes";
import { MilestoneType } from "~/types/milestone";

interface IIndividualVerticalStatusBlockColorIndicatorProps {
  milestone: MilestoneType;
}

export const IndividualVerticalStatusBlockColorIndicator = (
  props: IIndividualVerticalStatusBlockColorIndicatorProps,
): JSX.Element => {
  const { milestone } = props;

  const renderStatusBlock = () => {
    const { warningRed, cautionYellow, finePine, grey20 } = baseTheme.colors;
    let backgroundColor;
    switch (milestone.status) {
      case "incomplete":
        backgroundColor = warningRed;
        break;
      case "in_progress":
        backgroundColor = cautionYellow;
        break;
      case "completed":
        backgroundColor = finePine;
        break;
      default:
        backgroundColor = grey20;
        break;
    }
    return <StatusBlock backgroundColor={backgroundColor} />;
  };

  return renderStatusBlock();
};

type StatusBlockType = {
  backgroundColor?: string;
};

const StatusBlock = styled.div<StatusBlockType>`
  width: 15px;
  height: 70px;
  border-radius: 10px;
  margin: auto;
  background-color: ${props => props.backgroundColor || props.theme.colors.grey20};
`;

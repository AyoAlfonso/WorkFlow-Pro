import * as React from "react";
import styled from "styled-components";
import { baseTheme } from "../../../../themes";
import { MilestoneType } from "~/types/milestone";

interface IStatusBlockColorIndicatorProps {
  milestones: Array<MilestoneType>;
  indicatorWidth: number;
  indicatorHeight: number;
  marginBottom?: number;
}

export const StatusBlockColorIndicator = (props: IStatusBlockColorIndicatorProps): JSX.Element => {
  const { milestones, indicatorWidth, indicatorHeight, marginBottom } = props;
  const renderStatusBlocks = () => {
    return milestones.map((milestone, index) => {
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
      return (
        <StatusBlock
          backgroundColor={backgroundColor}
          key={index}
          indicatorHeight={indicatorHeight}
          indicatorWidth={indicatorWidth}
        />
      );
    });
  };

  return <Container marginBottom={marginBottom}>{renderStatusBlocks()}</Container>;
};

type ContainerType = {
  marginBottom?: number;
};

const Container = styled.div<ContainerType>`
  display: flex;
  padding-left: 16px;
  padding-right: 16px;
  margin-bottom: ${props => props.marginBottom}px;
`;

type StatusBlockType = {
  backgroundColor?: string;
  indicatorWidth: number;
  indicatorHeight: number;
};

const StatusBlock = styled.div<StatusBlockType>`
  width: ${props => props.indicatorWidth}px;
  height: ${props => props.indicatorHeight || 5}px;
  border-radius: 5px;
  margin-right: 1px;
  background-color: ${props => props.backgroundColor || props.theme.colors.grey20};
`;

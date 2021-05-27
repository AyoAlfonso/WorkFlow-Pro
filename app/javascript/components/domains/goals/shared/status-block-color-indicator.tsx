import * as React from "react";
import { useEffect } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { baseTheme } from "../../../../themes";
import { MilestoneType } from "~/types/milestone";
// import { SubInitiativesType } from "~/types/sub-initiatives";


interface IStatusBlockColorIndicatorProps {
  milestones: Array<MilestoneType>;
  indicatorWidth: number;
  indicatorHeight: number;
  marginBottom?: number;
  marginTop?: number;
  // subInitiatives?:Array<SubInitiativesType>;
}

export const StatusBlockColorIndicator = observer((props: IStatusBlockColorIndicatorProps): JSX.Element => {
  const { milestones, indicatorWidth, indicatorHeight, marginBottom, marginTop } = props;
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

  return (
    <Container marginBottom={marginBottom} marginTop={marginTop}>
      {renderStatusBlocks()}
    </Container>
  );
});

type ContainerType = {
  marginBottom?: number;
  marginTop?: number;
};

const Container = styled.div<ContainerType>`
  display: flex;
  padding-left: 17px;
  padding-right: 17px;
  margin-top: ${props => props.marginTop || 0}px;
  margin-bottom: ${props => props.marginBottom || 0}px;
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
  margin-right: 2px;
  background-color: ${props => props.backgroundColor || props.theme.colors.grey20};
`;

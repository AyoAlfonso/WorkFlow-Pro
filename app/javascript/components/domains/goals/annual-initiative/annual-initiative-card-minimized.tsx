import * as React from "react";
import styled from "styled-components";
import { color } from "styled-system";
import { baseTheme } from "../../../../themes";
import { Icon } from "../../../shared/icon";
import { AnnualInitiativeType } from "~/types/annual-initiative";
import * as moment from "moment";
import { MilestoneCard } from "../milestone/milestone-card";

interface IAnnualInitiativeCardMinimizedProps {
  annualInitiative: AnnualInitiativeType;
  setShowMinimizedCard: React.Dispatch<React.SetStateAction<boolean>>;
  disableOpen?: boolean;
}

export const AnnualInitiativeCardMinimized = ({
  annualInitiative,
  disableOpen,
  setShowMinimizedCard,
}: IAnnualInitiativeCardMinimizedProps): JSX.Element => {
  const renderStatusSquares = () => {
    return annualInitiative.quarterlyGoals.map((quarterlyGoal, index) => {
      const { warningRed, cautionYellow, finePine, grey40 } = baseTheme.colors;

      //if there is no currentMilestone, use the last milestone, assuming this is past the 13th week

      let currentMilestone;
      currentMilestone = quarterlyGoal.milestones.find(milestone =>
        moment(milestone.weekOf).isSame(moment(), "week"),
      );
      if (!currentMilestone) {
        currentMilestone = quarterlyGoal.milestones[quarterlyGoal.milestones.length - 1];
      }

      let backgroundColor = grey40;

      if (currentMilestone && currentMilestone.status) {
        switch (currentMilestone.status) {
          case "incomplete":
            backgroundColor = warningRed;
            break;
          case "in_progress":
            backgroundColor = cautionYellow;
            break;
          case "completed":
            backgroundColor = finePine;
            break;
        }
      }
      return <QuarterlyGoalIndicator key={index} backgroundColor={backgroundColor} />;
    });
  };

  return (
    <Container>
      <StatusSquareContainer>{renderStatusSquares()}</StatusSquareContainer>
      {disableOpen ? null : (
        <MaximizeIconContainer onClick={() => setShowMinimizedCard(false)}>
          <Icon
            icon={"Chevron-Down"}
            size={"15px"}
            iconColor={"grey60"}
            style={{ marginTop: "5px" }}
          />
        </MaximizeIconContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  ${color}
  height: 50px;
  background-color: ${props => props.theme.colors.backgroundGrey};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  display: flex;
  padding-left: 16px;
  padding-right: 16px;
  position: relative;
`;

type QuarterlyGoalIndicatorType = {
  backgroundColor?: string;
};

const QuarterlyGoalIndicator = styled.div<QuarterlyGoalIndicatorType>`
  height: 16px;
  width: 16px;
  background-color: ${props => props.backgroundColor || props.theme.colors.grey80};
  margin-right: 6px;
  margin-top: auto;
  margin-bottom: auto;
  border-radius: 3px;
`;

const MaximizeIconContainer = styled.div`
  background-color: white;
  border-radius: 50px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: auto;
  margin-bottom: 3px;
  &: hover {
    cursor: pointer;
  }
`;

const StatusSquareContainer = styled.div`
  position: absolute;
  display: flex;
  margin-top: 5px;
`;

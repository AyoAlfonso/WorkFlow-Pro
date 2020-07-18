import * as React from "react";
import styled from "styled-components";
import { color } from "styled-system";
import { baseTheme } from "../../../../themes";
import { Icon } from "../../../shared/icon";
import { AnnualInitiativeType } from "~/types/annual-initiative";

interface IAnnualInitiativeCardMinimizedProps {
  annualInitiative: AnnualInitiativeType;
  setShowMinimizedCard: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AnnualInitiativeCardMinimized = (
  props: IAnnualInitiativeCardMinimizedProps,
): JSX.Element => {
  const { annualInitiative, setShowMinimizedCard } = props;

  const renderStatusSquares = () => {
    return annualInitiative.quarterlyGoals.map((quarterlyGoal, index) => {
      const { warningRed, cautionYellow, finePine } = baseTheme.colors;
      let backgroundColor;
      switch (quarterlyGoal.status) {
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
      return <QuarterlyGoalIndicator key={index} backgroundColor={backgroundColor} />;
    });
  };

  return (
    <Container>
      <StatusSquareContainer>{renderStatusSquares()}</StatusSquareContainer>
      <MaximizeIconContainer onClick={() => setShowMinimizedCard(false)}>
        <Icon
          icon={"Chevron-Down"}
          size={"15px"}
          iconColor={"grey60"}
          style={{ marginTop: "5px" }}
        />
      </MaximizeIconContainer>
    </Container>
  );
};

const Container = styled.div`
  ${color}
  height: 25px;
  background-color: ${props => props.theme.colors.backgroundGrey};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  display: flex;
  padding-left: 16px;
  padding-right: 16px;
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
  &: hover {
    cursor: pointer;
  }
`;

const StatusSquareContainer = styled.div`
  position: absolute;
  display: flex;
  margin-top: 5px;
`;

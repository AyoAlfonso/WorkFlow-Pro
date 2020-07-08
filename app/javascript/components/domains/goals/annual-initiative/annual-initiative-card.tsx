import * as React from "react";
import { HomeContainerBorders, HomeTitle } from "../../home/shared-components";
import styled from "styled-components";
import { color } from "styled-system";
import { Text } from "../../../shared/text";
import { baseTheme } from "../../../../themes";

interface IAnnualInitiativeCardProps {
  annualInitiative: any;
  index: number;
  totalNumberOfAnnualInitiatives: number;
}

export const AnnualInitiativeCard = (props: IAnnualInitiativeCardProps): JSX.Element => {
  const { annualInitiative, index, totalNumberOfAnnualInitiatives } = props;

  const renderStatusSquares = () => {
    return annualInitiative.quarterlyGoals.map((quarterlyGoal, index) => {
      const { warningRed, cautionYellow, finePine } = baseTheme.colors;
      let backgroundColor;
      switch (quarterlyGoal.status) {
        case 0:
          backgroundColor = warningRed;
          break;
        case 1:
          backgroundColor = cautionYellow;
          break;
        case 2:
          backgroundColor = finePine;
          break;
      }
      return <QuarterlyGoalIndicator key={index} backgroundColor={backgroundColor} />;
    });
  };

  return (
    <Container
      key={index}
      margin-right={index + 1 == totalNumberOfAnnualInitiatives ? "0px" : "15px"}
    >
      <DescriptionContainer>
        <StyledText> {annualInitiative.description} </StyledText>
      </DescriptionContainer>
      <QuarterlyGoalIndicatorsContainer>{renderStatusSquares()}</QuarterlyGoalIndicatorsContainer>
    </Container>
  );
};

const Container = styled(HomeContainerBorders)`
  height: 100px;
  width: 20%;
  min-width: 240px;
  margin-right: ${props => props["margin-right"] || "0px"};
`;

const DescriptionContainer = styled.div`
  height: 59px;
`;

const StyledText = styled(Text)`
  padding-left: 16px;
  padding-right: 16px;
  &:hover {
    cursor: pointer;
    font-weight: bold;
    text-decoration: underline;
  }
`;

const QuarterlyGoalIndicatorsContainer = styled.div`
  ${color}
  height: 25px;
  background-color: ${props => props.theme.colors.grey20};
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

import * as React from "react";
import { HomeContainerBorders, HomeTitle } from "../../home/shared-components";
import styled from "styled-components";
import { color } from "styled-system";
import { Text } from "../../../shared/text";
import { baseTheme } from "../../../../themes";
import { Icon } from "../../../shared/icon";
import { UserDefaultIcon } from "../../../shared/user-default-icon";

interface IAnnualInitiativeCardExpandedProps {
  annualInitiative: any;
  index: number;
  totalNumberOfAnnualInitiatives: number;
}

export const AnnualInitiativeCardExpanded = (
  props: IAnnualInitiativeCardExpandedProps,
): JSX.Element => {
  const { annualInitiative, index, totalNumberOfAnnualInitiatives } = props;

  // const renderStatusSquares = () => {
  //   return annualInitiative.quarterlyGoals.map((quarterlyGoal, index) => {
  //     const { warningRed, cautionYellow, finePine } = baseTheme.colors;
  //     let backgroundColor;
  //     switch (quarterlyGoal.status) {
  //       case 0:
  //         backgroundColor = warningRed;
  //         break;
  //       case 1:
  //         backgroundColor = cautionYellow;
  //         break;
  //       case 2:
  //         backgroundColor = finePine;
  //         break;
  //     }
  //     return <QuarterlyGoalIndicator backgroundColor={backgroundColor} />;
  //   });
  // };

  const renderStatusBlocks = quarterlyGoal => {
    // each quarterly goal has 13 milestones
    //return quarterlyGoal.milestones.
  };

  const renderQuarterlyGoals = () => {
    //renderStatusBlocks();
    return annualInitiative.quarterlyGoals.map((quarterlyGoal, index) => {
      return (
        <QuarterlyGoalContainer key={index}>
          <RowContainer>
            <StyledText> {quarterlyGoal.description} </StyledText>
            <IconContainer>
              <Icon icon={"Options"} size={"25px"} iconColor={"grey60"} />
            </IconContainer>
          </RowContainer>
          <RowContainer>
            <IconContainer>
              <UserDefaultIcon
                size={40}
                firstName={quarterlyGoal.ownedBy.firstName}
                lastName={quarterlyGoal.ownedBy.lastName}
              />
            </IconContainer>
          </RowContainer>
        </QuarterlyGoalContainer>
      );
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

      <QuarterlyGoalsContainer>{renderQuarterlyGoals()}</QuarterlyGoalsContainer>
    </Container>
  );
};

const Container = styled(HomeContainerBorders)`
  width: 20%;
  min-width: 240px;
  margin-right: ${props => props["margin-right"] || "0px"};
  height: fit-content;
  &:hover {
    cursor: pointer;
  }
`;

const RowContainer = styled.div`
  display: flex;
`;

const DescriptionContainer = styled.div`
  height: 48px;
`;

const QuarterlyGoalsContainer = styled.div`
  background-color: ${props => props.theme.colors.backgroundGrey};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  padding: 8px;
`;

const StyledText = styled(Text)`
  padding-left: 16px;
  padding-right: 16px;
`;

const QuarterlyGoalContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  margin-bottom: 16px;
  padding-bottom: 8px;
`;

const IconContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  margin-left: auto;
  margin-right: 16px;
  display: flex;
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

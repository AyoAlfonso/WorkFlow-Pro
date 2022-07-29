import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { getAverage, getPercentage, getResponses, getTotalNumberOfResponses } from "~/utils/check-in-functions";

interface NumericalStepInsightsProps {
  insightsToShow: Array<any>;
  steps: Array<any>;
}

interface ColumnBarProps {
  average: number;
  num: number;
}

export const NumericalStepInsights = ({
  insightsToShow,
  steps,
}: NumericalStepInsightsProps): JSX.Element => {
  const numbers = Array.from({ length: 10 }, (_, i) => i + 1);

  const stepQuestions = steps
    .map(step => {
      if (step.name === "Numeric") {
        return step.question;
      } else return;
    })
    .filter(Boolean);

  const checkInArtifactLogs = insightsToShow
    .map(artifact => {
      if (artifact.checkInArtifactLogs[0]) {
        return {
          ...artifact.checkInArtifactLogs[0],
          ownedBy: artifact.ownedById,
          updatedAt: artifact.updatedAt,
        };
      }
    })
    .filter(Boolean);

  const ColumnBar = (props: ColumnBarProps): JSX.Element => {
    const { average, num } = props;

    const height = (average / 100) * 150;

    return (
      <Column>
        <ColumnText color={height <= 125 ? "#000" : "#fff"}>{num}</ColumnText>
        <ColumnBarFillDiv completed={average} animate={{ height: `${height}px` }} />
      </Column>
    );
  };

  return (
    <>
      {stepQuestions.map((question, index) => (
        <Container key={`${question}-${index}`}>
          <HeaderContainer>
            <QuestionText>{question}</QuestionText>
            <Tag>{`Avg. ${getAverage(getResponses(question, checkInArtifactLogs, "numeric")) || 0}`}</Tag>
          </HeaderContainer>
          <ColumnsContainer>
            {numbers.map(num => {
              const average = getPercentage(getResponses(question, checkInArtifactLogs, "numeric"));
              const value = average.find(item => item.value === num.toString());
              return (
                <ColumnContainer key={num}>
                  <ColumnBar average={value?.percentage || 0} num={num}/>
                  <Percentage>{`${value?.percentage || 0}%`}</Percentage>
                </ColumnContainer>
              );
            })}
          </ColumnsContainer>
          <Divider />
          <InfoContainer>
            <InfoText>
              {!getTotalNumberOfResponses(question, checkInArtifactLogs, "numeric")
                ? "No response"
                : getTotalNumberOfResponses(question, checkInArtifactLogs, "numeric") == 1
                ? "1 response"
                : `${getTotalNumberOfResponses(question, checkInArtifactLogs, "numeric")} total responses`}
            </InfoText>
          </InfoContainer>
        </Container>
      ))}
    </>
  );
};

const Container = styled.div`
  box-shadow: 0px 3px 6px #00000029;
  background: ${props => props.theme.colors.white};
  border-radius: 8px;
  padding: 16px 0;
  margin-bottom: 16px;
  // height: 250px;
`;

const HeaderContainer = styled.div`
  padding: 0 1em;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const QuestionText = styled.span`
  color: ${props => props.theme.colors.black};
  font-size: 20px;
  font-weight: bold;
  display: inline-block;
`;

const Divider = styled.div`
  border-top: 1px solid ${props => props.theme.colors.grey40};
`;

const InfoContainer = styled.div`
  display: flex;
  padding: 0 1em;
  margin-top: 0.5em;
`;

const InfoText = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.grey40};
  margin-left: auto;
`;

const Tag = styled.span`
  display: inline-block;
  padding: 0.5em;
  color: ${props => props.theme.colors.grey100};
  background-color: ${props => props.theme.colors.backgroundGrey};
  font-size: 0.75em;
  border-radius: 4px;
`;

const ColumnsContainer = styled.div`
  padding: 0 1em;
  display: flex;
  justify-content: space-between;
  margin-bottom: 2em;
`;

const ColumnContainer = styled.div`
  width: max-content;
  text-align: center;
`;

const Column = styled.div`
  height: 150px;
  width: 24px;
  border-radius: 4px;
  background: ${props => props.theme.colors.backgroundGrey};
  margin-bottom: 0.5em;
  position: relative;

  @media only screen and (max-width: 768px) {
    width: 18px;
  }
`;

const Percentage = styled.span`
  font-weight: bold;
  font-size: 14px;
  text-align: center;
`;

type ColumnBarFillProps = {
  completed: string | number;
};

const ColumnBarFillDiv = styled(motion.div)<ColumnBarFillProps>`
  width: 100%;
  height: ${props => props.completed}%;
  border-radius: inherit;
  background: ${props => props.theme.colors.primary100};
  position: absolute;
  bottom: 0;
`;

type ColumnTextProps = {
  color: string;
};

const ColumnText = styled.span<ColumnTextProps>`
  color: ${props => props.color};
  font-weight: bold;
  position: absolute;
  top: 8px;
  z-index: 2;
  display: inline-table;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  font-size: 12px;
`;

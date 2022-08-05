import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { agreementScale } from "../data/selection-scale-data";
import {
  getAverage,
  getPercentage,
  getResponses,
  getTotalNumberOfResponses,
} from "~/utils/check-in-functions";
import {
  ColumnBar,
  ColumnContainer,
  ColumnsContainer,
  Container,
  DescriptionText,
  Divider,
  HeaderContainer,
  InfoContainer,
  InfoText,
  Percentage,
  QuestionText,
  Tag,
} from "./sentiment-insights";

interface AgreementInsightsProps {
  insightsToShow: Array<any>;
  steps: Array<any>;
}

const AgreementInsights = ({ insightsToShow, steps }: AgreementInsightsProps): JSX.Element => {
  const stepQuestions = steps
    .map(step => {
      if (step.name === "Agreement Scale") {
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

  return (
    <>
      {stepQuestions.map((question, index) => {
        const totalNumberOfResponses = getTotalNumberOfResponses(
          question,
          checkInArtifactLogs,
          "agreement_scale",
        );
        return (
          <Container key={`${question}-${index}`}>
            <HeaderContainer>
              <QuestionText>{question}</QuestionText>
              <Tag>{`Avg. ${getAverage(
                getResponses(question, checkInArtifactLogs, "agreement_scale"),
              ) || 0}`}</Tag>
            </HeaderContainer>
            <ColumnsContainer>
              {agreementScale.map(({ option, label }) => {
                const average = getPercentage(
                  getResponses(question, checkInArtifactLogs, "agreement_scale"),
                );
                const value = average.find(item => item.value === option.toString());
                return (
                  <ColumnContainer key={option}>
                    <ColumnBar average={value?.percentage || 0} num={option} />
                    <Percentage>{`${value?.percentage || 0}%`}</Percentage>
                    <DescriptionText>{label}</DescriptionText>
                  </ColumnContainer>
                );
              })}
            </ColumnsContainer>
            <Divider />
            <InfoContainer>
              <InfoText>
                {!totalNumberOfResponses
                  ? "No response"
                  : totalNumberOfResponses == 1
                  ? "1 response"
                  : `${totalNumberOfResponses} total responses`}
              </InfoText>
            </InfoContainer>
          </Container>
        );
      })}
    </>
  );
};

export default AgreementInsights;

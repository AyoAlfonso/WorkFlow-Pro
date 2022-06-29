import React from "react";
import styled from "styled-components";
import { agreementScale, sentimentScale } from "../data/selection-scale-data";

interface SelectionScaleInsightsProps {
  type?: string;
}

export const SelectionScaleInsights = ({ type }: SelectionScaleInsightsProps): JSX.Element => {
  return (
    <Container>
      <HeaderContainer>
        <QuestionText>How productive were you today?</QuestionText>
        <Tag>Avg. 8.5</Tag>
      </HeaderContainer>
      <ColumnsContainer>
        {type == "sentiment"
          ? sentimentScale.map(({ option, label }) => (
              <ColumnContainer>
                <Column>{option}</Column>
                <Percentage>0%</Percentage>
                <DescriptionText>{label}</DescriptionText>
              </ColumnContainer>
            ))
          : agreementScale.map(({ option, label }) => (
              <ColumnContainer>
                <Column>{option}</Column>
                <Percentage>0%</Percentage>
                <DescriptionText>{label}</DescriptionText>
              </ColumnContainer>
            ))}
      </ColumnsContainer>
      <Divider />
      <InfoContainer>
        <InfoText>2 total responses</InfoText>
      </InfoContainer>
    </Container>
  );
};

const Container = styled.div`
  box-shadow: 0px 3px 6px #00000029;
  background: ${props => props.theme.colors.white};
  border-radius: 8px;
  padding: 16px 0;
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
  // width: 64px;
  text-align: center;
  align-items: center;
  display: flex;
  flex-direction: column;

  @media only screen and (max-width: 768px) {
    width: 48px;
  }
`;

const Column = styled.div`
  height: 150px;
  width: 64px;
  border-radius: 4px;
  background: ${props => props.theme.colors.backgroundGrey};
  padding: 0.5em;
  color: ${props => props.theme.colors.black};
  font-weight: bold;
  margin-bottom: 0.5em;

  @media only screen and (max-width: 768px) {
    width: 48px;
  }
`;

const Percentage = styled.span`
  font-weight: bold;
  font-size: 14px;
  text-align: center;
  display: block;
  margin-bottom: 0.5em;
`;

const DescriptionText = styled.span`
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.theme.colors.grey100};
`;

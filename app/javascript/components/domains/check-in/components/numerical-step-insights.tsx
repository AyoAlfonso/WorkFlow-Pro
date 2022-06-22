import React from "react";
import styled from "styled-components";

export const NumericalStepInsights = (): JSX.Element => {
  const numbers = Array.from({ length: 10 }, (_, i) => i + 1);
  return (
    <Container>
      <HeaderContainer>
        <QuestionText>How productive were you today?</QuestionText>
        <Tag>Avg. 8.5</Tag>
      </HeaderContainer>
      <ColumnsContainer>
        {numbers.map(num => (
          <ColumnContainer key={num}>
            <Column>{num}</Column>
            <Percentage>0%</Percentage>
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
  width: max-content;
  text-align: center;
`;

const Column = styled.div`
  height: 150px;
  width: 16px;
  border-radius: 4px;
  background: ${props => props.theme.colors.backgroundGrey};
  padding: 0.5em;
  color: ${props => props.theme.colors.black};
  font-weight: bold;
  margin-bottom: 0.5em;

  @media only screen and (max-width: 768px) {
    width: 12px;
  }
`;

const Percentage = styled.span`
  font-weight: bold;
  font-size: 14px;
  text-align: center;
`;

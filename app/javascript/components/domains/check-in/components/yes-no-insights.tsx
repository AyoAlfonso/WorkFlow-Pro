import React from 'react'
import styled from "styled-components";

export const YesNoInsights = (): JSX.Element => {
  return (
    <Container>
      <HeaderContainer>
        <QuestionText>How productive were you today?</QuestionText>
      </HeaderContainer>
      <ColumnsContainer>
        <ColumnContainer>
          <Percentage>0%</Percentage>
          <Column>
            <LabelText>Yes</LabelText>
            <LabelText>0 responses</LabelText>
          </Column>
        </ColumnContainer>
        <ColumnContainer>
          <Percentage>100%</Percentage>
          <Column>
            <LabelText>No</LabelText>
            <LabelText>0 responses</LabelText>
          </Column>
        </ColumnContainer>
      </ColumnsContainer>
      <Divider />
      <InfoContainer>
        <InfoText>2 total responses</InfoText>
      </InfoContainer>
    </Container>
  );
}

const Container = styled.div`
  box-shadow: 0px 3px 6px #00000029;
  background: ${props => props.theme.colors.white};
  border-radius: 8px;
  padding: 16px 0;
  // height: 250px;
`;

const HeaderContainer = styled.div`
  padding: 0 1em;
  margin-bottom: 2em;
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

const ColumnsContainer = styled.div`
  padding: 0 1em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 2em;
`; 

const ColumnContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0 2em;
  margin-bottom: 2em;
`

const Column = styled.div`
  height: 64px;
  padding: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props => props.theme.colors.backgroundGrey};
  border-radius: 4px;
  flex: 1;
`;

const Percentage = styled.span`
  font-weight: bold;
  font-size: 14px;
  width: 3em;
  text-align: center;
`;

const LabelText = styled.span`
  color: ${props => props.theme.colors.black};
  font-weight: bold;
  font-size: 16px;
`
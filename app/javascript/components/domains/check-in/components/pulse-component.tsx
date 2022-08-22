import * as React from 'react'
import { observer } from "mobx-react";
import styled from "styled-components";
import { useMst } from "~/setup/root";

interface PulseComponentProps {
  question: string;
  disabled?: boolean;
}

const PulseComponent = ({ question, disabled }: PulseComponentProps): JSX.Element => {
  const { sessionStore } = useMst();
  return (
    <Container>
      <QuestionText>{question}</QuestionText>
    </Container>
  );
};

export default PulseComponent

const Container = styled.div`
  background: ${props => props.theme.colors.white};
  padding: 1em;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 8px;
`;

const QuestionText = styled.span`
  display: block;
  color: ${props => props.theme.colors.black};
  font-size: 20px;
  font-weight: bold;
  font-family: Exo;
  text-align: left;
  margin-bottom: 0.5em;
`;
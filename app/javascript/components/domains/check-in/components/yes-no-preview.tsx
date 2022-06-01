import * as React from "react";
import styled from "styled-components";
import { Button } from "~/components/shared";

interface YesNoPreviewProps {
  question: string;
}

export const YesNoPreview = ({ question }: YesNoPreviewProps): JSX.Element => {
  return (
    <Container>
      <QuestionText>{question}</QuestionText>
      <ButtonsContainer>
        <YesButton variant={"primary"} onClick={() => console.log("log")} small>
          Yes
        </YesButton>
        <NoButon variant={"primary"} onClick={() => console.log("log")} small>
          No
        </NoButon>
      </ButtonsContainer>
    </Container>
  );
};

const Container = styled.div`
  background: ${props => props.theme.colors.white};
  padding: 1em;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 8px;
  height: 140px;
`;

const QuestionText = styled.span`
  display: block;
  color: ${props => props.theme.colors.black};
  font-size: 20px;
  font-weight: bold;
  font-family: Exo;
  text-align: left;
  margin-bottom: 2.25em;
`;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const YesButton = styled(Button)`
  margin-right: 1em;
  font-size: 12px;
  width: 64px;
  height: 30px;
`;

const NoButon = styled(Button)`
  font-size: 12px;
  width: 64px;
  height: 30px;
  background-color: ${props => props.theme.colors.mipBlue};
  border-color: ${props => props.theme.colors.mipBlue};
`;

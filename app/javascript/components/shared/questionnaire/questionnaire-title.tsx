import * as React from "react";
import styled from "styled-components";
import { Text } from "~/components/shared/text";

export interface QuestionnaireTitleProps {
  title: string;
}

export const QuestionnaireTitle = (props: QuestionnaireTitleProps): JSX.Element => (
  <HeaderDiv>
    <Text color={"black"} fontSize={2} fontWeight={"regular"} py={0} my={0}>
      {props.title}
    </Text>
  </HeaderDiv>
);

const HeaderDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
`;

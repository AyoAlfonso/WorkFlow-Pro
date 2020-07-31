import * as React from "react";
import styled from "styled-components";

export const JournalHeader = (): JSX.Element => (
  <Container>
    <JournalText> Journal </JournalText>
  </Container>
);

const Container = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
  padding-left: 20px;
  padding-right: 20px;
`;

const JournalText = styled.h4`
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 20px;
  font-size: 13pt;
  font-weight: 600;
`;

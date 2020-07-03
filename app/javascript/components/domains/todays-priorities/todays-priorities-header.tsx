import * as React from "react";
import styled from "styled-components";

export const TodaysPrioritiesHeader = (): JSX.Element => {
  return (
    <Container>
      <TodaysPrioritiesText> Today's Priorities</TodaysPrioritiesText>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  border-bottom: 1px solid #e3e3e3;
  padding-left: 10px;
  padding-right: 10px;
`;

const TodaysPrioritiesText = styled.h4`
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 20px;
  font-size: 14pt;
  font-weight: 400;
`;

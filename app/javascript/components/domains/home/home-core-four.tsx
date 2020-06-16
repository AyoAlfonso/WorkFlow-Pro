import * as React from "react";
import styled from "styled-components";
import { HomeContainerBorders, HomeTitle } from "./shared-components";

export const HomeCoreFour = (): JSX.Element => {
  return (
    <Container>
      <HomeTitle> Core Four </HomeTitle>
      <ValuesContainer>Company Values Here</ValuesContainer>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 30px;
`;

const ValuesContainer = styled(HomeContainerBorders)`
  height: 120px;
`;

import * as React from "react";
import styled from "styled-components";

export const HomePersonalStatus = (): JSX.Element => {
  return (
    <Container>
      <GreetingText> Hey Steven </GreetingText>
      <DropdownContainer>Status Dropdown</DropdownContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
`;

const GreetingText = styled.p`
  font-size: 32px;
`;

const DropdownContainer = styled.div`
  margin-left: 50px;
  margin-top: 38px;
  border-radius: 5px;
  border: 1px solid #e3e3e3;
  height: 20px;
  padding: 5px;
`;

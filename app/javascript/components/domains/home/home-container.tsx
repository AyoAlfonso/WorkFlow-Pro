import * as React from "react";
import styled from "styled-components";

const StyledTitle = styled.h1`
  color: ${(props) => props.theme.colors.warningRed};
`;

export const HomeContainer = (): JSX.Element => {
  return (
    <div>
      <StyledTitle>Home</StyledTitle>
    </div>
  );
};

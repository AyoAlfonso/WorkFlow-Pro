import * as React from "react";
import { HomeContainerBorders } from "./shared-components";
import styled from "styled-components";

export const HomeHeaderBar = (): JSX.Element => {
  return (
    <Container>
      <PlaceholderText className="home-header-bar__placeholder-text">
        Home Header Bar
      </PlaceholderText>
    </Container>
  );
};

const Container = styled(HomeContainerBorders)`
  margin-top: 40px;
  height: 40px;
`;

const PlaceholderText = styled.div`
  text-align: center;
  margin-top: 10px;
`;

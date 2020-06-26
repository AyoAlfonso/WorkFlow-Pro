import * as React from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { Flex, Box } from "rebass";
import { HomeContainerBorders } from "../home/shared-components";

export const HeaderBar = (): JSX.Element => {
  const { sessionStore } = useMst();
  return (
    <Container>
      <Flex
        px={2}
        color="black"
        bg="white"
        boxShadow="0px 0px 0px 2px #f5f5f5"
        border="1px solid #000000"
        alignItems="center"
        className="home-header-bar__placeholder-text"
      >
        <PlaceholderText className="home-header-bar__placeholder-text">
          Home Header Bar
        </PlaceholderText>
        <Box mx="auto" />
        <button onClick={() => sessionStore.logoutRequest()}>Logout</button>
      </Flex>
    </Container>
  );
};

const Container = styled(HomeContainerBorders)`
  margin-left: auto;
  margin-right: auto;
  margin-top: 40px;
  height: 40px;
  width: 80%;
`;

const PlaceholderText = styled.div`
  text-align: center;
  margin-top: 10px;
`;

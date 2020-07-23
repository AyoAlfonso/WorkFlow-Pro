import * as React from "react";
import { Flex, Box } from "rebass";
import { Loading } from "~/components/shared/loading";
import styled from "styled-components";

export const LoadingScreen = (): JSX.Element => (
  <Flex
    sx={{
      alignItems: "center",
      height: "100%",
      width: "100%",
    }}
  >
    <Box sx={{ margin: "auto", border: "1", alignItems: "center" }}>
      <img src={"/assets/LynchPyn-Logo-Blue_300x300"} width="120"></img>
      <div style={{ height: "24px" }}></div>
      <LoadingContainer>
        <Loading />
      </LoadingContainer>
    </Box>
  </Flex>
);

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

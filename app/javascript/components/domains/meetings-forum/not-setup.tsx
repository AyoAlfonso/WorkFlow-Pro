import * as React from "react";
import { color, space, typography } from "styled-system";
import styled from "styled-components";
import { Flex, Box, Image } from "rebass";
import { LynchPynBadge } from "./components/lynchpyn-badge"

const StyledText = styled.p`
  ${color}
  ${space}
  ${typography}
`;

export const ForumNotSetup = props => (
  <Flex
    sx={{
      alignItems: "center",
      height: "100%",
      width: "100%",
    }}
  >
    <Box sx={{ minWidth: "200px", margin: "auto", border: "1" }}>
      <StyledText fontFamily={"Lato"}>You have not been added to your forum team yet.</StyledText>
    </Box>
    <LynchPynBadge/>
  </Flex>
);

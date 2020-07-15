import * as React from "react";
import { color, space, typography } from "styled-system";
import styled from "styled-components";
import { Flex, Box } from "rebass";

const StyledText = styled.p`
  ${color}
  ${space}
  ${typography}
`;

export const Placeholder = props => (
  <Flex
    sx={{
      alignItems: "center",
      height: "100%",
      width: "100%",
    }}
  >
    <Box sx={{ minWidth: "200px", margin: "auto", border: "1" }}>
      <StyledText fontFamily={"Lato"}>Under Construction</StyledText>
    </Box>
  </Flex>
);
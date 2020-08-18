import * as React from "react";
import { Flex, Box } from "rebass";
import { TextNoMargin } from "~/components/shared/text";

import styled from "styled-components";

export const Divider = styled.div`
  height: 1px;
  width: 100%;
  margin-top: 4px;
  margin-bottom: 4px;
  background-color: lightgrey;
`;

export const Table = ({ columns, headers, data }) => (
  <Box width={[1, 1, 1]} sx={{ minWidth: 480 }}>
    <Flex flexWrap="wrap">
      {headers.map((item, index) => {
        return (
          <Box key={`header-${index}`} px={2} width={1 / columns}>
            <TextNoMargin fontSize={2} color={"black"}>
              {item}
            </TextNoMargin>
          </Box>
        );
      })}
      <Divider />
      {data.map((item, index) => {
        return (
          <>
            <Box key={`data-${index}`} px={2} width={1 / columns}>
              {item}
            </Box>
            {(index + 1) % 4 == 0 ? <Divider /> : <></>}
          </>
        );
      })}
    </Flex>
  </Box>
);

import * as React from "react";
import { Flex, Box } from "rebass";
import { Text } from "~/components/shared/text";

export const Table = ({ columns, headers, data }) => (
  <Box width={[1, 1, 1]} sx={{ minWidth: 480 }}>
    <Flex flexWrap="wrap">
      {headers.map((item, index) => {
        return (
          <Box key={`header-${index}`} px={2} width={1 / columns}>
            <Text fontSize={2} color={"black"}>
              {item}
            </Text>
          </Box>
        );
      })}
      {data.map((item, index) => {
        return (
          <Box key={`data-${index}`} px={2} width={1 / columns}>
            {item}
          </Box>
        );
      })}
    </Flex>
  </Box>
);

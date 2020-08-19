import * as React from "react";
import { Text } from "~/components/shared/text";
import styled from "styled-components";
import { baseTheme } from "../../themes";

type ActiveDotProps = {
  active: boolean;
};

const ActiveDot = styled.div<ActiveDotProps>`
  background-color: ${props =>
    props.active ? baseTheme.colors.finePine : baseTheme.colors.poppySunrise};
  border-radius: 9999px;
  height: 8px;
  width: 8px;
  margin-right: 8px;
`;

export const Status = ({ active }: { active: boolean }): JSX.Element => {
  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      <ActiveDot active={active} />
      <Text fontSize={1} color={"black"}>
        {active ? "Active" : "Inactive"}
      </Text>
    </div>
  );
};

import * as React from "react";
import * as R from "ramda";
import { Text } from "~/components/shared/text";
import styled from "styled-components";
import { baseTheme } from "../../themes";
import { useTranslation } from "react-i18next";

type ActiveDotProps = {
  color: string;
};

const ActiveDot = styled.div<ActiveDotProps>`
  background-color: ${props => props.color};
  border-radius: 9999px;
  height: 8px;
  width: 8px;
  margin-right: 8px;
`;

const settings = {
  active: { color: baseTheme.colors.finePine },
  pending: { color: baseTheme.colors.cautionYellow },
  inactive: { color: baseTheme.colors.poppySunrise },
};

export const Status = ({ status }: { status: string }): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      <ActiveDot color={R.path([status, "color"], settings)} />
      <Text fontSize={1} color={"black"}>
        {t(`status.${status}`)}
      </Text>
    </div>
  );
};

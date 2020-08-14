import * as React from "react";
import styled from "styled-components";
import { Icon } from "../../shared/icon";
import { baseTheme } from "../../../themes/base";

interface IKeyActivityPriorityIconProps {
  priority: string;
}

export const KeyActivityPriorityIcon = ({
  priority,
}: IKeyActivityPriorityIconProps): JSX.Element => {
  const { colors } = baseTheme;

  const renderPriorityIcon = () => {
    switch (priority) {
      case "medium":
        return (
          <Icon
            icon={"Priority-High"}
            size={24}
            iconColor={colors.cautionYellow}
            style={{ marginTop: "2px" }}
          />
        );
      case "high":
        return (
          <Icon
            icon={"Priority-Urgent"}
            size={24}
            iconColor={colors.warningRed}
            style={{ marginTop: "2px" }}
          />
        );
      case "frog":
        return (
          <Icon
            icon={"Priority-Frog"}
            size={24}
            iconColor={colors.frog}
            style={{ marginTop: "2px" }}
          />
        );
      default:
        return <EmptyIconContainer />;
    }
  };

  return renderPriorityIcon();
};

const EmptyIconContainer = styled.div`
  width: 24px;
  height: 24px;
`;

import * as React from "react";
import { Icon } from "../../shared/icon";
import { baseTheme } from "../../../themes/base";

interface IKeyActivityPriorityIconProps {
  priority: string;
  size?: number;
  mr?: number;
}

export const KeyActivityPriorityIcon = ({
  priority,
  size = 18,
  mr = 0,
}: IKeyActivityPriorityIconProps): JSX.Element => {
  const { colors } = baseTheme;

  const renderPriorityIcon = () => {
    switch (priority) {
      case "medium":
        return (
          <Icon
            icon={"Priority-High"}
            size={size}
            mr={mr}
            iconColor={colors.cautionYellow}
            style={{ marginTop: "2px" }}
          />
        );
      case "high":
        return (
          <Icon
            icon={"Priority-Urgent"}
            size={size}
            mr={mr}
            iconColor={colors.warningRed}
            style={{ marginTop: "2px" }}
          />
        );
      case "frog":
        return (
          <Icon
            icon={"Priority-MIP"}
            size={size}
            mr={mr}
            iconColor={colors.mipBlue}
            style={{ marginTop: "2px" }}
          />
        );
      default:
        return (
          <Icon
            icon={"Priority-None"}
            size={size}
            mr={mr}
            iconColor={colors.greyActive}
            style={{ marginTop: "2px" }}
          />
        );
    }
  };

  return renderPriorityIcon();
};

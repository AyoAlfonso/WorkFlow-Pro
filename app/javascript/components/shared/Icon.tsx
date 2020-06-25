import * as React from "react";
import IcoMoon from "react-icomoon";
import styled from "styled-components";
import { layout, space } from "styled-system";
import { baseTheme } from "../../themes/base";
const iconSet = require("../../assets/icons/selection.json");

const IconContainer = styled.div`
  ${layout}
  ${space}
`;

const Icon = ({ ...props }) => {
  const { iconColor } = props;
  return (
    <IconContainer>
      <IcoMoon
        iconSet={iconSet}
        color={`${iconColor in baseTheme.colors ? baseTheme.colors[iconColor] : iconColor}`}
        {...props}
      />
    </IconContainer>
  );
};

export default Icon;

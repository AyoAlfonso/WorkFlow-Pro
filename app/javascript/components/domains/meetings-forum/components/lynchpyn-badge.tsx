import * as React from "react";
import styled from "styled-components";
import { Image } from "rebass";

const BadgeContainer = styled.div`
  position: fixed;
  z-index: 99;
  right: 0;
  bottom: 0;
  left: auto;
  top: auto;
`;
const lynchPynBadgePath = require("../../../../assets/images/LynchPynBadge.png");

export const LynchPynBadge = (): JSX.Element => {
  return (
    <BadgeContainer>
      <Image
        sx={{
          height: 36,
        }}
        src={lynchPynBadgePath}
      />
    </BadgeContainer>
  );
};

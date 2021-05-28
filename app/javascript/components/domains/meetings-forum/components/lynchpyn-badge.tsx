import * as React from "react";
import styled from "styled-components";
import { Image, Link } from "rebass";

//to do : Make actual semantic button
const BadgeContainer = styled.div`
  position: fixed;
  z-index: 99;
  right: 0;
  bottom: 0;
  left: auto;
  top: auto;
  cursor: pointer;
`;
const lynchPynBadgePath = require("../../../../assets/images/LynchPynBadge.png");

export const LynchPynBadge = (): JSX.Element => {
  return (
    <Link href="http://go.lynchpyn.com/forum">
      <BadgeContainer>
        <Image
          sx={{
            height: 36,
          }}
          src={lynchPynBadgePath}
        />
      </BadgeContainer>
    </Link>
  );
};

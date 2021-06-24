import * as React from "react";
import styled from "styled-components";
import { Image, Link } from "rebass";

//to do : Make actual semantic button
const ImageContainer = styled.div`
  position: fixed;
  z-index: 99;
  right: 0;
  bottom: -2px;
  left: auto;
  top: auto;
  cursor: pointer;
`;
const BadgeContainer = styled.div`
  z-index: 0;
`;

const lynchPynBadgePath = require("../../../../assets/images/LynchPynBadge.png");

export const LynchPynBadge = (): JSX.Element => {
  return (
    <BadgeContainer>
      <Link href="http://go.lynchpyn.com/forum">
        <ImageContainer>
          <Image
            sx={{
              height: 36,
            }}
            src={lynchPynBadgePath}
          />
        </ImageContainer>
      </Link>
    </BadgeContainer>
  );
};

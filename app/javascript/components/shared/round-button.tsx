import * as React from "react";
import { color } from "styled-system";
import styled from "styled-components";
import { motion } from "framer-motion";
import { baseTheme } from "~/themes/base";

type IconContainerType = {
  backgroundColor?: string;
  size?: string;
};

const StyledButton = styled(motion.div)<IconContainerType>`
  ${color}
  height: ${({ size }) => (size ? size : "40px")};
  width: ${({ size }) => (size ? size : "40px")};
  border-radius: 50px;
  box-shadow: 0px 3px 6px ${baseTheme.colors.grayShadow};
  &:hover {
    cursor: pointer;
  }
`;

export const RoundButton = props => {
  const { rotate, rotation, ...restProps } = props;
  return (
    <StyledButton
      {...restProps}
      animate={{
        transform: rotate ? `rotate(${rotation ? rotation : 45}deg)` : "rotate(0deg)",
      }}
      transition={{ ease: "easeOut", duration: 0.4 }}
    >
      {props.children}
    </StyledButton>
  );
};

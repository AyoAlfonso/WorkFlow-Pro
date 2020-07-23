import React from "react";
import styled from "styled-components";

export interface ISideNavDrawerProps {
  isOpen: boolean;
}

export const SideNavDrawer: React.FunctionComponent<ISideNavDrawerProps> = styled.div`
  background-color: white;
  box-shadow: 0px 0px 1px #00000029;
  display: ${props => (props.isOpen ? "inherit" : "none")};
  left: 128px;
  height: 100%;
  position: absolute;
  width: 216px;
`;
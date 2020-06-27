import * as React from "react";
import styled from "styled-components";
import { Box } from "rebass";
import { Icon } from "../../../components/shared/Icon";
import { Text } from "../../../components/shared/Text";
import { NavLink } from "react-router-dom";
import { space, color } from "styled-system";
import { string } from "prop-types";

const StyledSideNav = styled.div`
  position: fixed; /* Fixed Sidebar (stay in place on scroll and position relative to viewport) */
  height: 100%;
  width: 128px; /* Set the width of the sidebar */
  z-index: 1; /* Stay on top of everything */
  top: 0em; /* Stay at the top */
  background-color: white; /* White */
  overflow-x: hidden; /* Disable horizontal scroll */
  box-shadow: 0px 0px 0px 2px #f5f5f5;
  display: flex;
  flex-direction: column;
`;

const StyledNavLink = styled(NavLink)`
  ${color}
  text-align: center;
  align-item: center;
  text-decoration: none;
  margin: 16px;
  a:link,
  a:visited {
    color: ${props => props.theme.colors.primary100};
  }
`;

const IconBorder = styled.div`
  box-shadow: 0px 3px 6px #00000029;
  width: 48px;
  height: 48px;
  margin: auto;
  align-time: center;
`;

type SideBarElementType = {
  marginTop?: string;
  margin?: string;
};
const SideBarElement = styled.div<SideBarElementType>`
  text-align: center;
  align-tiems: center;
  margin: ${props => props.margin || "32px"};
  margin-top: ${props => props.marginTop || "32px"};
`;

export const SideNav = (): JSX.Element => {
  return (
    <StyledSideNav>
      <SideBarElement>
        <Icon icon={"Logo"} size={"4em"} iconColor={"primary100"} />
      </SideBarElement>

      <StyledNavLink to="/">
        <IconBorder>
          <Icon icon={"Home"} size={"2em"} iconColor={"primary100"} />
        </IconBorder>
        <Text fontSize={1}>Home</Text>
      </StyledNavLink>
      <StyledNavLink to="/team">
        <IconBorder>
          <Icon icon={"User"} size={"2em"} iconColor={"primary100"} />
        </IconBorder>
        <Text fontSize={1}>Team</Text>
      </StyledNavLink>
      <StyledNavLink to="/company">
        <IconBorder>
          <Icon icon={"Company"} size={"2em"} iconColor={"primary100"} />
        </IconBorder>
        <Text fontSize={1}>Company</Text>
      </StyledNavLink>
      <StyledNavLink to="/stats">
        <IconBorder>
          <Icon icon={"Stats"} size={"2em"} iconColor={"primary100"} />
        </IconBorder>
        <Text fontSize={1}>Stats</Text>
      </StyledNavLink>

      <SideBarElement margin={"16px"} marginTop={"auto"}>
        <Icon icon={"Help"} size={"2em"} iconColor={"primary100"} />
      </SideBarElement>
    </StyledSideNav>
  );
};

// const Container = styled.div`
//   margin-left: auto;
//   margin-right: auto;
//   width: 90%;
//   margin-bottom: 50px;
// `;

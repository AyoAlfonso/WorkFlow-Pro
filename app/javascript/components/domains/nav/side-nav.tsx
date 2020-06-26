import * as React from "react";
import styled from "styled-components";
import { Box } from "rebass";
import { Icon } from "../../../components/shared/Icon";
import { NavLink } from "react-router-dom";
import { space, color } from "styled-system";

const StyledSideNav = styled.div`
  position: fixed; /* Fixed Sidebar (stay in place on scroll and position relative to viewport) */
  height: 100%;
  width: 128px; /* Set the width of the sidebar */
  z-index: 1; /* Stay on top of everything */
  top: 0em; /* Stay at the top */
  background-color: white; /* White */
  overflow-x: hidden; /* Disable horizontal scroll */
  box-shadow: 0px 0px 0px 2px #f5f5f5;
  ${color}
`;

const StyledNavLink = styled(NavLink)`
  ${color}
  text-align: center;
  align-tiems: center;
  text-decoration: none;
  a:link,
  a:visited {
    color: ${props => props.theme.colors.primary100};
  }
`;

export const SideNav = (): JSX.Element => {
  return (
    <StyledSideNav>
      <StyledNavLink to="/">
        <Icon icon={"Home"} size={"2em"} color={"primary100"} />
        <div>Home</div>
      </StyledNavLink>
      <StyledNavLink to="/team">
        <Icon icon={"User"} size={"2em"} color={"primary100"} />
        <div>Team</div>
      </StyledNavLink>
      <StyledNavLink to="/company">
        <Icon icon={"Company"} size={"2em"} color={"primary100"} />
        <div>Company</div>
      </StyledNavLink>
      <StyledNavLink to="/stats">
        <Icon icon={"Stats"} size={"2em"} color={"primary100"} />
        <div>Stats</div>
      </StyledNavLink>
      <StyledNavLink to="/help">
        <Icon icon={"Help"} size={"2em"} color={"primary100"} />
        <div>Help</div>
      </StyledNavLink>
    </StyledSideNav>
  );
};

// const Container = styled.div`
//   margin-left: auto;
//   margin-right: auto;
//   width: 90%;
//   margin-bottom: 50px;
// `;

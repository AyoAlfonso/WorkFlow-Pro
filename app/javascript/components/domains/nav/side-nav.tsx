import * as React from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { Box } from "rebass";
import { Icon } from "../../../components/shared/icon";
import { Text } from "../../../components/shared/text";
import { NavLink, Link } from "react-router-dom";
import { space, color } from "styled-system";
import { matchPath } from "react-router";

import { useTranslation } from "react-i18next";

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

type SideBarElementType = {
  marginTop?: string;
  margin?: string;
};
const SideBarElement = styled.div<SideBarElementType>`
  text-align: center;
  align-items: center;
  margin: ${props => props.margin || "32px"};
  margin-top: ${props => props.marginTop || "32px"};
`;

const StyledNavLink = styled(NavLink)`
  ${color}
  text-align: center;
  align-item: center;
  text-decoration: none;
  margin: 16px;
  &:link,
  &:visited {
    color: ${props => props.theme.colors.text};
  }
`;

const IconBorder = styled.div`
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 10px;
  width: 48px;
  height: 48px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;
interface StyledNavLinkChildrenActiveProps {
  to: string;
  icon: string;
  children: any;
  disabled?: boolean;
}
const StyledNavLinkChildrenActive = ({
  to,
  icon,
  children,
  disabled,
}: StyledNavLinkChildrenActiveProps): JSX.Element => {
  const { router } = useMst();
  var pathMatch = matchPath(router.location.pathname, to);
  var isActive = pathMatch ? (to == "/" ? pathMatch.isExact : true) : false;

  return isActive ? (
    <StyledNavLink to={to} disabled={disabled}>
      <IconBorder>
        <Icon icon={icon} size={"2em"} iconColor={"primary100"} m={"auto"} />
      </IconBorder>
      <Text>{children}</Text>
    </StyledNavLink>
  ) : (
    <StyledNavLink to={to} disabled={disabled}>
      <IconBorder>
        <Icon icon={icon} size={"2em"} iconColor={"grey40"} m={"auto"} />
      </IconBorder>
      <Text color={"grey40"}>{children}</Text>
    </StyledNavLink>
  );
};

export const SideNav = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <StyledSideNav>
      <SideBarElement>
        <Icon icon={"Logo"} size={"4em"} iconColor={"primary100"} />
      </SideBarElement>

      <StyledNavLinkChildrenActive to="/" icon={"Home"}>
        {t("navigation.home")}
      </StyledNavLinkChildrenActive>

      <StyledNavLinkChildrenActive to="/team" icon={"User"}>
        {t("navigation.team")}
      </StyledNavLinkChildrenActive>

      <StyledNavLinkChildrenActive to="/company" icon={"Company"}>
        {t("navigation.company")}
      </StyledNavLinkChildrenActive>

      <StyledNavLinkChildrenActive to="/goals" icon={"Stats"}>
        {t("navigation.goals")}
      </StyledNavLinkChildrenActive>

      {/* <SideBarElement margin={"16px"} marginTop={"auto"}>
        <Icon icon={"Help"} size={"2em"} iconColor={"primary100"} />
      </SideBarElement> */}
    </StyledSideNav>
  );
};

import React, { useState } from "react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { Box } from "rebass";
import { Icon } from "../../../components/shared/icon";
import { Text } from "../../../components/shared/text";
import { NavLink, Link } from "react-router-dom";
import { space, color } from "styled-system";
import { matchPath } from "react-router";

import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import Popup from "reactjs-popup";

const StyledSideNav = styled.div`
  position: fixed; /* Fixed Sidebar (stay in place on scroll and position relative to viewport) */
  height: 100%;
  width: 128px; /* Set the width of the sidebar */
  z-index: 1; /* Stay on top of everything */
  top: 0em; /* Stay at the top */
  background-color: white; /* White */
  // Disable hidden x-overflow to allow nested menu items
  // overflow-x: hidden; /* Disable horizontal scroll*/
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
  currentPathName: string;
}

const NavMenuIconText = styled(Text)`
  text-align: center;
`;
interface INavMenuIconProps {
  active?: boolean;
  icon: string;
}

const NavMenuIcon: React.FunctionComponent<INavMenuIconProps> = ({
  active = false,
  children,
  icon,
}) => {
  return (
    <>
      <IconBorder>
        <Icon icon={icon} size={"2em"} iconColor={active ? "primary100" : "grey40"} m={"auto"} />
      </IconBorder>
      <NavMenuIconText>{children}</NavMenuIconText>
    </>
  );
};

const StyledNavLinkChildrenActive = ({
  to,
  icon,
  children,
  disabled,
  currentPathName,
}: StyledNavLinkChildrenActiveProps): JSX.Element => {
  const isActive = isNavMenuIconActive(currentPathName, to);
  return (
    <StyledNavLink to={to} disabled={disabled}>
      <NavMenuIcon active={isActive} icon={icon}>
        {children}
      </NavMenuIcon>
    </StyledNavLink>
  );
};

const isNavMenuIconActive = (currentPath: string, to: string): boolean => {
  const pathMatch = matchPath(currentPath, to);
  return pathMatch ? (to == "/" ? pathMatch.isExact : true) : false;
};

const PopupContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const PopupTriggerContainer = styled.div`
  :hover {
    cursor: pointer;
  }
`;

const SideNavChildLink = styled(NavLink)`
  border-radius: 8px;
  text-decoration: none;
  &:link,
  &:visited {
    color: ${props => props.theme.colors.greyActive};
  }
  &:hover {
    color: ${props => props.theme.colors.primaryActive};
    background-color: ${props => props.theme.colors.primary20};
  }
`;

const SideNavChildLinkContainer = styled.div`
  align-items: center;
  height: 40px;
  padding-left: 20px;
  width: 250px;
  display: flex;
`;

const SideNavChildLinkText = styled.p`
  flex: 1;
  margin: 0;
`;

export const SideNavNoMst = (currentPathName: string): JSX.Element => {
  const { t } = useTranslation();
  return (
    <StyledSideNav>
      <SideBarElement>
        <Icon icon={"Logo"} size={"4em"} iconColor={"primary100"} />
      </SideBarElement>

      <StyledNavLinkChildrenActive to="/" icon={"Home"} currentPathName={currentPathName}>
        {t("navigation.home")}
      </StyledNavLinkChildrenActive>

      <StyledNavLinkChildrenActive to="/team" icon={"User"} currentPathName={currentPathName}>
        {t("navigation.team")}
      </StyledNavLinkChildrenActive>

      <Popup
        arrow={false}
        closeOnDocumentClick
        // Had errors trying to do .styled(Popup): https://github.com/yjose/reactjs-popup/issues/118#issuecomment-533941132
        contentStyle={{ borderRadius: 8, border: "none", boxShadow: "none" }}
        // defaultOpen={true}
        mouseLeaveDelay={10000}
        mouseEnterDelay={0}
        offsetY={-20}
        on={"click"}
        position={"right center"}
        trigger={
          <PopupTriggerContainer>
            <NavMenuIcon icon={"Company"} active={isNavMenuIconActive(currentPathName, "/company")}>
              {t("navigation.company")}
            </NavMenuIcon>
          </PopupTriggerContainer>
        }
      >
        <PopupContainer>
          <SideNavChildLink to="/company/accountability">
            <SideNavChildLinkContainer>
              <SideNavChildLinkText>{"Accountability Chart"}</SideNavChildLinkText>
            </SideNavChildLinkContainer>
          </SideNavChildLink>
          <SideNavChildLink to="/company/strategic_plan">
            <SideNavChildLinkContainer>
              <SideNavChildLinkText>{"The Plan"}</SideNavChildLinkText>
            </SideNavChildLinkContainer>
          </SideNavChildLink>
        </PopupContainer>
      </Popup>
      <StyledNavLinkChildrenActive to="/goals" icon={"Stats"} currentPathName={currentPathName}>
        {t("navigation.goals")}
      </StyledNavLinkChildrenActive>

      {/* <SideBarElement margin={"16px"} marginTop={"auto"}>
        <Icon icon={"Help"} size={"2em"} iconColor={"primary100"} />
      </SideBarElement> */}
    </StyledSideNav>
  );
};

export const SideNav = observer(
  (): JSX.Element => {
    const { router } = useMst();
    return SideNavNoMst(router.location.pathname);
  },
);

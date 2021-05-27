import React, { useState } from "react";
import * as R from "ramda";
import styled from "styled-components";
import { useMst } from "../../../../setup/root";
import { toJS } from "mobx";
import { Icon } from "../../../shared/icon";
import { Text } from "../../../shared/text";
import { NavLink } from "react-router-dom";
import { color } from "styled-system";
import { matchPath } from "react-router";

import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { SideNavChildLink } from "./side-nav-child-link";
import { SideNavChildPopup } from "./side-nav-child-popup";
import { Image } from "rebass";
import { ICompany } from "~/models/company";

const StyledSideNav = styled.div`
  position: fixed; /* Fixed Sidebar (stay in place on scroll and position relative to viewport) */
  height: 100%;
  width: 96px; /* Set the width of the sidebar */
  z-index: 4; /* Stay on top of everything */
  top: 0em; /* Stay at the top */
  background-color: ${props => props.theme.colors.mipBlue};
  // Disable hidden x-overflow to allow nested menu items
  // overflow-x: hidden; /* Disable horizontal scroll*/
  box-shadow: 0px 3px 6px #00000029;
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
  margin: ${props => props.margin || "16px"};
  margin-top: ${props => props.marginTop || "32px"};
`;

type StyledIconType = {
  active: boolean;
};

export const StyledIcon = styled(Icon)<StyledIconType>`
  transition: 0.3s ease-out;
  color: ${props => props.active ? props.theme.colors.white : props.theme.colors.greyInactive};
`;

type StyledNavLinkType = {
  active: boolean;
};

const StyledNavLink = styled(NavLink)<StyledNavLinkType>`
  ${color}
  align-item: center;
  text-decoration: none;
  &:link,
  &:visited {
    color: ${props => props.theme.colors.white};
  }
`;

const IconContainer = styled.div`
  width: 48px;
  height: 48px;
  margin-left: auto;
  margin-right: auto;
  padding: 0px;
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

interface SideNavChildPopupContainerProps {
  active: boolean;
  disableOnActive: boolean;
};

const SideNavChildContainer = styled.div<SideNavChildPopupContainerProps>`
  padding-top: 16px;
  padding-bottom: 16px;
  transition: 0.3s;
  background-color: ${props => props.active ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0)"};
  ${props => props.active && props.disableOnActive ? "" :
    `&:hover ${StyledIcon} {
    transform: scale(1.25) translateY(-10%);
    color: ${props.theme.colors.white};
  }
  &:hover ${NavMenuIconText} {
    color: ${props.theme.colors.white}
  }
  &:hover {
    background-color: rgba(255,255,255,0.25);
  }`}
`;

interface INavMenuIconTextProps {
  active: boolean;
}

const NavMenuIconText = styled.h4<INavMenuIconTextProps>`
  text-align: center;
  font-size: 15px;
  margin-top: 8px;
  margin-bottom: 0;
  color: ${props => props.active ? props.theme.colors.white : props.theme.colors.greyInactive};
`;
interface INavMenuIconProps {
  active?: boolean;
  disableOnActive?: boolean;
  icon: string;
}

const NavMenuIcon: React.FunctionComponent<INavMenuIconProps> = ({
  active = false,
  disableOnActive = true,
  children,
  icon,
}) => {
  return (
    <SideNavChildContainer active={active} disableOnActive={disableOnActive}>
      <IconContainer>
        <StyledIcon icon={icon} size={"32px"} active={active} m={"auto"} />
      </IconContainer>
      <NavMenuIconText active={active}>{children}</NavMenuIconText>
    </SideNavChildContainer>
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
  // CHRIS' NOTE: CANT PASS BOOLEAN TO STYLED COMPONENTS, HENCE THE TOSTRING()
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

export const SideNavNoMst = (
  currentPathName: string,
  teams: any,
  company?: ICompany,
): JSX.Element => {
  const { t } = useTranslation();

  const [teamNavChildOpen, setTeamNavChildOpen] = useState<boolean>(false);
  const [companyNavChildOpen, setCompanyNavChildOpen] = useState<boolean>(false);
  const [meetingsNavChildOpen, setMeetingsNavChildOpen] = useState<boolean>(false);

  const renderForumOrTeam = (teamLength: number, isForum = true) => {
    const domain = isForum ? "forum" : "team"
    switch (teamLength) {
      case 0:
        return (
          <StyledNavLinkChildrenActive
            to={`/${domain}/`}
            icon={"Team"}
            currentPathName={currentPathName}
          >
            {isForum ? t("navigation.forum") : t("navigation.team")}
          </StyledNavLinkChildrenActive>
        );
      case 1:
        return (
          <StyledNavLinkChildrenActive
            to={`/${domain}/${R.path(["0", "id"], teams) || ""}`}
            icon={"Team"}
            currentPathName={currentPathName}
          >
            {isForum ? t("navigation.forum") : t("navigation.team")}
          </StyledNavLinkChildrenActive>
        );
      default:
        return (
          <SideNavChildPopup
            trigger={
              <NavMenuIcon
                icon={"Team"}
                active={isNavMenuIconActive(currentPathName, `/${domain}`)}
                disableOnActive={false}
              >
                {isForum ? t("navigation.forum") : t("navigation.team")}
              </NavMenuIcon>
            }
            navOpen={teamNavChildOpen}
            setNavOpen={setTeamNavChildOpen}
            setOtherNavOpen={[setCompanyNavChildOpen, setMeetingsNavChildOpen]}
          >
            {teams.map((team: any, index: number) => (
              <SideNavChildLink key={index} to={`/${domain}/${team.id}`} linkText={team.name} />
            ))}
          </SideNavChildPopup>
        );
    }
  };

  return (
    <StyledSideNav>
      <SideBarElement margin={"16px"} marginTop={"16px"}>
        {!R.isNil(company) && company.logoUrl ? (
          <Image
            sx={{
              width: 48,
              height: 48,
            }}
            src={`${company.logoUrl}`}
          />
        ) : (
            <Image
              sx={{
                width: 48,
                height: 48,
              }}
              src={"/assets/LynchPyn-Logo_Favicon_White"}
            />
          )}
      </SideBarElement>


      <StyledNavLinkChildrenActive to="/" icon={"Home"} currentPathName={currentPathName}>
        {t("navigation.home")}
      </StyledNavLinkChildrenActive>
      <StyledNavLinkChildrenActive to="/goals" icon={"Goals"} currentPathName={currentPathName}>
        {t("navigation.goals")}
      </StyledNavLinkChildrenActive>

      {company && company.accessCompany ? renderForumOrTeam(R.path(["length"], teams) || 0, false) : <> </>}

      {company && company.accessCompany ? (
        <SideNavChildPopup
          trigger={
            <NavMenuIcon
              icon={"Company"}
              active={isNavMenuIconActive(currentPathName, "/company")}
              disableOnActive={false}
            >
              {t("navigation.company")}
            </NavMenuIcon>
          }
          navOpen={companyNavChildOpen}
          setNavOpen={setCompanyNavChildOpen}
          setOtherNavOpen={[setTeamNavChildOpen, setMeetingsNavChildOpen]}
        >
          <SideNavChildLink
            to="/company/accountability"
            linkText={t("company.accountabilityChart")}
          />
          {/* <SideNavChildLink to="/company/strategic_plan" linkText={`The ${company.name} Plan`} /> */}
          <SideNavChildLink
            to="/company/strategic_plan"
            linkText={`The ${company && company.name} Plan`}
          />
        </SideNavChildPopup>
      ) : (
          <> </>
        )}

      {company && company.accessForum ? renderForumOrTeam(R.path(["length"], teams) || 0) : <> </>}

      {company && company.accessForum && !R.isNil(R.path(["0", "id"], teams)) ? (
        <SideNavChildPopup
          trigger={
            <NavMenuIcon
              icon={"Meeting"}
              active={isNavMenuIconActive(currentPathName, "/meetings")}
              disableOnActive={false}
            >
              {t("navigation.meetings")}
            </NavMenuIcon>
          }
          navOpen={meetingsNavChildOpen}
          setNavOpen={setMeetingsNavChildOpen}
          setOtherNavOpen={[setTeamNavChildOpen, setCompanyNavChildOpen]}
        >
          <SideNavChildLink to="/meetings/section_1" linkText={t("forum.annualHub")} />
          <SideNavChildLink to="/meetings/section_2" linkText={t("forum.upcomingHub")} />
          <SideNavChildLink to="/meetings/agenda" linkText={t("forum.agenda")} />
        </SideNavChildPopup>
      ) : (
          <> </>
        )}

      {!R.isNil(company) && company.logoUrl ? (
        <SideBarElement margin={"16px"} marginTop={"auto"}>
          <Image
            sx={{
              width: 48,
              height: 48,
            }}
            marginTop={16}
            src={"/assets/LynchPyn-Logo_Favicon_White"}
          />
        </SideBarElement>
      ) : (
          <></>
        )}
    </StyledSideNav>
  );
};

export const SideNav = observer(
  (): JSX.Element => {
    const {
      router,
      teamStore,
      sessionStore: { profile },
      companyStore: { company },
    } = useMst();

    return SideNavNoMst(router.location.pathname, toJS(profile.currentCompanyUserTeams), company);
  },
);

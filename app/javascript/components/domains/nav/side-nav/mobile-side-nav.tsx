import React from "react";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";
import { baseTheme } from "~/themes";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Icon } from "../../../shared/icon";
import { getWeekOf } from "~/utils/date-time";

interface IMobileSideNavProps {
  showSideNav: boolean;
  mobileNavMenuRef: React.RefObject<HTMLDivElement>;
  setShowSideNav: React.Dispatch<React.SetStateAction<boolean>>;
  userId: number;
}

const MobileSideNav = observer(
  ({ showSideNav, mobileNavMenuRef, setShowSideNav, userId }: IMobileSideNavProps): JSX.Element => {
    const {
      sessionStore,
      companyStore: { company },
    } = useMst();

    const { t } = useTranslation();

    const productFeatures = sessionStore.profile?.productFeatures;

    const showGoal = productFeatures && productFeatures.objective;
    const showScorecard = productFeatures && productFeatures.scorecard;
    const checkIn = productFeatures && productFeatures.checkIn;

    const history = useHistory();

    return (
      <MobileNavMenu showSideNav={showSideNav} ref={mobileNavMenuRef}>
        <MobileMenuOption
          showSideNav={showSideNav}
          onClick={() => {
            history.push("/");
            setShowSideNav(false);
          }}
        >
          <Icon icon={"Planner"} mr="1em" size={"24px"} iconColor={baseTheme.colors.primary100} />
          {t<string>("navigation.planner")}
        </MobileMenuOption>
        {showGoal && (
          <MobileMenuOption
            showSideNav={showSideNav}
            onClick={() => {
              history.push(`/goals`);

              setShowSideNav(false);
            }}
          >
            <Icon
              icon={"New-Goals"}
              mr="1em"
              size={"24px"}
              iconColor={baseTheme.colors.primary100}
            />
            {t<string>("navigation.goals")}
          </MobileMenuOption>
        )}
        {showScorecard && (
          <MobileMenuOption
            showSideNav={showSideNav}
            onClick={() => {
              history.push(`/scorecard/company/${company.id}`);

              setShowSideNav(false);
            }}
          >
            <Icon
              icon={"Scorecard_New"}
              mr="1em"
              size={"24px"}
              iconColor={baseTheme.colors.primary100}
            />
            {t<string>("navigation.scorecards")}
          </MobileMenuOption>
        )}
        {company && checkIn && (
          <MobileMenuOption
            showSideNav={showSideNav}
            onClick={() => {
              history.push(`/check-in`);

              setShowSideNav(false);
            }}
          >
            <Icon
              icon={"Check-in-page"}
              mr="1em"
              size={"24px"}
              iconColor={baseTheme.colors.primary100}
            />
            {t<string>("navigation.checkin")}
          </MobileMenuOption>
        )}
      </MobileNavMenu>
    );
  },
);

export default MobileSideNav;

type MobileNavMenuProps = {
  showSideNav: boolean;
};

const MobileNavMenu = styled.div<MobileNavMenuProps>`
  height: calc(100vh - 60px);
  background: ${props => props.theme.colors.white};
  z-index: 2;
  width: ${props => (props.showSideNav ? "85vw" : "0")};
  position: fixed;
  padding-top: 40px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  transition: 0.2s;
  left: 0;
  display: none;
  margin-top: 5px;

  @media only screen and (max-width: 768px) {
    display: block;
  }
`;

const MobileMenuOption = styled.div<MobileNavMenuProps>`
  font-size: 14px;
  align-items: center;
  padding: 5px 30px;
  margin-bottom: 0.5em;
  top: 0;
  left: 0;
  display: ${props => (props.showSideNav ? "flex" : "none")};
  width: 70vw;
  transition: 0.2s;

  &:hover {
    background: ${props => props.theme.colors.backgroundGrey};
  }
`;

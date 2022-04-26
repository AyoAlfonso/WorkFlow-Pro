import { observer } from "mobx-react";
import * as React from "react";
import { useMst } from "~/setup/root";
import moment from "moment";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Icon } from "~/components/shared";
import { useHistory } from "react-router-dom";
import * as R from "ramda";
import { toJS } from "mobx";
// import { Loading } from "~/components/shared";
export const HeaderText = observer(
  ({ location }): JSX.Element => {
    const { sessionStore, forumStore, companyStore, teamStore } = useMst();
    const { t } = useTranslation();
    const history = useHistory();
    const locationPath = location.pathname.split("/");
    const subPath = locationPath[2];
    const teamId =
      locationPath[3] || forumStore.currentForumTeamId || R.path([0, "id"], toJS(teamStore.teams));
    const getGreetingTime = currentTime => {
      const splitAfternoon = 12; // 24hr time to split the afternoon
      const splitEvening = 18; // 24hr time to split the evening
      const currentHour = parseFloat(currentTime.format("HH"));
      if (currentHour >= splitAfternoon && currentHour <= splitEvening) {
        return "Good Afternoon";
      } else if (currentHour >= splitEvening) {
        return "Good Evening";
      }
      return "Good Morning";
    };
    if (!companyStore.company) {
      return <></>;
    }

    const currentTeam = teamStore.teams.find(team => team.id == teamId);

    const isForum = companyStore.company?.displayFormat == "Forum";
    switch (locationPath[1]) {
      case "team":
      case "forum":
        // eslint-disable-next-line no-case-declarations
        const team = teamStore.teams.find(team => team.id == subPath);
        return <> {team ? `${team.name} Overview` : "Team Overview"} </>;
      case "company":
        if (subPath == "accountability") {
          return <> {t("company.accountabilityChart")}</>;
        } else if (subPath == "strategic_plan") {
          return <> The {companyStore.company.name} Plan </>;
        }
        return <></>;
      case "meetings":
        switch (subPath) {
          case "section_1": {
            return isForum ? (
              <SubHeaderContainer>
                <BackHeaderText onClick={() => history.push(`/team/${teamId}`)}>
                  {currentTeam?.name}
                </BackHeaderText>
                <ChevronRight icon={"Chevron-Left"} size={"24px"} iconColor={"grey100"} />
                <BreadcrumbHeaderText> {t("forum.scheduledTopics")} </BreadcrumbHeaderText>
              </SubHeaderContainer>
            ) : (
              <> {t("forum.annualHub")} </>
            );
          }

          case "section_2":
            return isForum ? (
              <SubHeaderContainer>
                <BackHeaderText onClick={() => history.push(`/team/${currentTeam.id}`)}>
                  {currentTeam?.name}
                </BackHeaderText>
                <ChevronRight icon={"Chevron-Left"} size={"24px"} iconColor={"grey100"} />
                <BreadcrumbHeaderText> {t("forum.topicsVault")} </BreadcrumbHeaderText>
              </SubHeaderContainer>
            ) : (
              <> {t("forum.upcomingHub")} </>
            );
          case "agenda":
            return isForum ? (
              <SubHeaderContainer>
                <BackHeaderText onClick={() => history.push(`/team/${currentTeam.id}`)}>
                  {currentTeam?.name}
                </BackHeaderText>
                <ChevronRight icon={"Chevron-Left"} size={"24px"} iconColor={"grey100"} />
                <BreadcrumbHeaderText> {t("forum.meetingManagement")}</BreadcrumbHeaderText>
              </SubHeaderContainer>
            ) : (
              <> {t("forum.meetingAgenda")} </>
            );
          default:
            return <></>;
        }
      case "goals":
        return <> {t("goals.indexTitle")} </>;
      case "scorecards":
        return <> {t("scorecards.indexTitle")} </>;
      case "account":
        return <> {t("profile.accountSettings")} </>;
      case "notes":
        return <> {t("notes.indexTitle")} </>;
      case "journals":
        return <> {t("journals.indexTitle")} </>;
      case "scorecard":
        return <> {t("scorecards.indexTitle")} </>;
      case "weekly-check-in":
        return <>{t("Weekly Check-in")}</>;
      case "check-in":
        return <>{t("Check-ins")}</>;
      case "audit-logs":
        return <>{t("Audit Logs")}</>;
      default:
        return <>{`${getGreetingTime(moment())} ${sessionStore.profile.firstName}`}</>;
    }
  },
);
const BreadcrumbHeaderText = styled.span`
  display: inline-block;
  font-size: 32px;
  font-weight: bold;
  margin-top: 15px;
  margin-bottom: 25px;
`;
const BackHeaderText = styled(BreadcrumbHeaderText)`
  color: ${props => props.theme.colors.grey100};
  margin-right: 0.5em;
  cursor: pointer;
`;

const ChevronRight = styled(Icon)`
  transform: rotate(180deg);
  margin-right: 0.5em;
  margin-top: 0.25em;
`;

const SubHeaderContainer = styled.div`
  display: flex;
  height: 50px;
`;

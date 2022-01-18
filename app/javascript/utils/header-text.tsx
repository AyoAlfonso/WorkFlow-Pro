import { observer } from "mobx-react";
import * as React from "react";
import { useMst } from "~/setup/root";
import moment from "moment";
import { useTranslation } from "react-i18next";

export const HeaderText = observer(
  ({ location }): JSX.Element => {
    const { sessionStore, companyStore, teamStore } = useMst()
    const { t } = useTranslation();

    const locationPath = location.pathname.split("/");
    const subPath = locationPath[2];

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

    switch (locationPath[1]) {
      case "team":
      case "forum":
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
          case "section_1":
            return <> {t("forum.annualHub")} </>;
          case "section_2":
            return <> {t("forum.upcomingHub")} </>;
          case "agenda":
            return <> {t("forum.agenda")} </>;
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
      default:
        return <>{`${getGreetingTime(moment())} ${sessionStore.profile.firstName}`}</>;
    }
  },
);

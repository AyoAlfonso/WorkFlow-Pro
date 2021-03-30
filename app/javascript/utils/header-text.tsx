import { observer } from "mobx-react";
import * as React from "react";
import { useMst } from "~/setup/root";
import * as moment from "moment";

export const HeaderText = observer(
  ({ location }): JSX.Element => {
    const { sessionStore, companyStore, teamStore } = useMst();

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
          return <> Accountability Matrix</>;
        } else if (subPath == "strategic_plan") {
          return <> The ${companyStore.company.name} Plan </>;
        }
        return <></>;
      case "meetings":
        switch (subPath) {
          case "section_1":
            return <> Annual Hub </>;
          case "section_2":
            return <> Upcoming Hub </>;
          case "agenda":
            return <> Meeting Management </>;
          default:
            return <></>;
        }
      case "goals":
        return <> Goals </>;
      case "account":
        return <>Account Settings</>;
      case "notes":
        return <>Notes</>;
      case "journals":
        return <>Journal Entries</>;
      default:
        return (
          <>
            {getGreetingTime(moment())} {sessionStore.profile.firstName}
          </>
        );
    }
  },
);

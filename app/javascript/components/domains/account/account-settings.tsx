import React from "react";
import { useTranslation } from "react-i18next";
import { AccountProfile } from "./profile";
import { Notifications } from "./notifications";
import { Security } from "./security";
import { Meeting } from "./meeting";
import { Users } from "./users";
import { Teams } from "./teams";
import { Company } from "./company";
import { TabsLayout } from "~/components/layouts/tabs-layout";

export const AccountSettings = (): JSX.Element => {
  const { t } = useTranslation();

  const tabOptions = [
    {
      name: "Profile",
      component: <AccountProfile />,
    },
    {
      name: "Notifications",
      component: <Notifications />,
    },
    {
      name: "Meeting",
      component: <Meeting />,
    },
    {
      name: "Users",
      component: <Users />,
    },
    {
      name: "Teams",
      component: <Teams />,
    },
    {
      name: "Company",
      component: <Company />,
    },
    {
      name: "Security",
      component: <Security />,
    },
  ];

  return <TabsLayout headerText={""} tabOptions={tabOptions} />;
};

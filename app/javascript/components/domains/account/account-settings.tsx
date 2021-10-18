import React, { useState, useEffect } from "react";
import { useMst } from "~/setup/root";
import { Loading } from "../../shared/loading";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { AccountProfile } from "./profile";
import { Notifications } from "./notifications";
import { Security } from "./security";
import { Templates } from "./templates";
import { Meeting } from "./meeting";
import { Users } from "./users";
import { Teams } from "./teams";
import { Company } from "./company";
import { TabsLayout } from "~/components/layouts/tabs-layout";

export const AccountSettings = observer(
  (): JSX.Element => {
    const { t } = useTranslation();
    const { companyStore } = useMst();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      companyStore.load().then(() => setLoading(false));
    }, []);

    if (loading || !companyStore.company) {
      return <Loading />;
    }

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
        name: companyStore.company.displayFormat,
        component: <Company />,
      },
      {
        name: "Security",
        component: <Security />,
      },

      // Release next version
      // {
      //   name: "Templates",
      //   component: <Templates />,
      // },
    ];

    return <TabsLayout headerText={""} tabOptions={tabOptions} />;
  },
);

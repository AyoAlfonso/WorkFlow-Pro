import * as React from "react";
import { HomePersonalItems } from "./home-personal-items";
import { useMst } from "../../../setup/root";
import { Loading } from "../../shared/loading";
import { observer } from "mobx-react";

export const HomeContainer = observer(
  (): JSX.Element => {
    const {
      companyStore: { company },
  } = useMst();
   if (company == null) {
      return <Loading />;
    }
  return <HomePersonalItems />;
})
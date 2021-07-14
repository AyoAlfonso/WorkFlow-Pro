import { observer } from "mobx-react";
import * as React from "react";
import { useMst } from "~/setup/root";
import { Loading } from "~/components/shared";
import { PulseSelector } from "./pulse-selector";

interface IPulseSelectorProps {
  onClick?: any;
}

export const PulseSelectorWrapper = observer(
  ({ onClick }: IPulseSelectorProps): JSX.Element => {
    const {
      staticDataStore: { emotionAdjectives },
      sessionStore: { profile },
    } = useMst();

    if (!emotionAdjectives || !profile) {
      return <Loading />;
    }

    return <PulseSelector onClick={onClick}/>;
  },
);

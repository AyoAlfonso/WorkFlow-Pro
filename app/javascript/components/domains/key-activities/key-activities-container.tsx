import * as React from "react";
import { KeyActivitiesHeader } from "./key-activities-header";
import { KeyActivitiesBody } from "./key-activities-body";
import { useState } from "react";

export const KeyActivitiesContainer = (): JSX.Element => {
  const [showAllKeyActivities, setShowAllKeyActivities] = useState<boolean>(
    false
  );

  return (
    <>
      <KeyActivitiesHeader
        showAllKeyActivities={showAllKeyActivities}
        setShowAllKeyActivities={setShowAllKeyActivities}
      />
      <KeyActivitiesBody showAllKeyActivities={showAllKeyActivities} />
    </>
  );
};

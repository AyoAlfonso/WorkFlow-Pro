import * as React from "react";
import { Text } from "~/components/shared/text";
import { CoreFourOnly } from "~/components/domains/goals/goals-core-four";
import { HomeGoals } from "~/components/domains/home/home-goals";
import { IMeeting } from "~/models/meeting";

interface IPersonalGoalsProps {
  company?: any;
  meeting?: IMeeting;
}

export const PersonalGoals = ({ company, meeting }: IPersonalGoalsProps): JSX.Element => {
  const isPersonalMeeting =
    meeting?.meetingType == "personal_daily" || meeting?.meetingType == "personal_weekly";
  const isForum = company?.displayFormat == "Forum";
  const show = isPersonalMeeting && isForum
  return (
    <>
      {show ? <></> : <CoreFourOnly />}
      <HomeGoals isForum={isForum} />
    </>
  );
};

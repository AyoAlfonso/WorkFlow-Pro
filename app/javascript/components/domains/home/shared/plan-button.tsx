import * as React from "react";
import * as R from "ramda";
import { useState } from "react";
import { useMst } from "../../../../setup/root";
import { useHistory } from "react-router";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";
import { Icon } from "~/components/shared/icon";
import { IconContainerWithPadding } from "~/components/shared/icon";
import {
  HeaderContainerNoBorder,
  AccordionHeaderText,
} from "~/components/shared/styles/container-header";
import { AccordionSummaryInverse } from "~/components/shared/accordion-components";

export const Plan = ({
  buttonText = "Plan"
}): JSX.Element => {
  const history = useHistory();
  const {
    sessionStore: { profile },
    meetingStore
  } = useMst();

  const onPlanClicked = () => {
    if (profile.questionnaireTypeForPlanning == "daily") {
      meetingStore.createPersonalDailyMeeting().then(({ meeting }) => {
        if (!R.isNil(meeting)) {
          history.push(`/personal_planning/${meeting.id}`);
        } else {
          showToast("Failed to start planning.", ToastMessageConstants.ERROR);
        }
      });
    } else {
      onReflectClicked();
    }
  };

  const onReflectClicked = () => {
    meetingStore.createPersonalWeeklyMeeting().then(({ meeting }) => {
      if (!R.isNil(meeting)) {
        history.push(`/personal_planning/${meeting.id}`);
      } else {
        showToast("Failed to start planning.", ToastMessageConstants.ERROR);
      }
    });
  };
  return (
    <AccordionSummaryInverse
      onClick={e => onPlanClicked()}
    >
      <HeaderContainerNoBorder>
        <div style={{ width: "30px" }} />
        <AccordionHeaderText expanded={"notMatching"} accordionPanel={"team"} inverse={true}>
          {buttonText}
        </AccordionHeaderText>
      </HeaderContainerNoBorder>
      <IconContainerWithPadding>
        <Icon icon={""} size={16} iconColor={"white"} />
      </IconContainerWithPadding>
    </AccordionSummaryInverse>
  );
}

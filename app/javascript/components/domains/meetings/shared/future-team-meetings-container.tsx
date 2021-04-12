import * as React from "react";
import { AccordionSummaryInverse } from "~/components/shared/accordion-components";
import { IconContainerWithPadding } from "~/components/shared/icon";
import { Icon } from "~/components/shared/icon";
import {
  HeaderContainerNoBorder,
  AccordionHeaderText,
} from "~/components/shared/styles/container-header";
interface IFutureTeamMeetingsContainerProps {
  handleMeetingClick: any;
  titleText?: string;
  buttonText?: string;
}

export const FutureTeamMeetingsContainer = ({
  handleMeetingClick,
  titleText,
  buttonText = "Team Meeting",
}: IFutureTeamMeetingsContainerProps): JSX.Element => {
  return (
    <AccordionSummaryInverse
      onClick={e => {
        handleMeetingClick();
      }}
    >
      <HeaderContainerNoBorder>
        <div style={{ width: "30px" }} />
        <AccordionHeaderText expanded={"notMatching"} accordionPanel={"team"} inverse={true}>
          Team Meeting
        </AccordionHeaderText>
      </HeaderContainerNoBorder>
      <IconContainerWithPadding>
        <Icon icon={"Team"} size={16} iconColor={"white"} />
      </IconContainerWithPadding>
    </AccordionSummaryInverse>
  );
};

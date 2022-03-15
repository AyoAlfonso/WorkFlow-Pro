import * as React from "react";
import { AccordionSummary } from "~/components/shared/accordion-components";
import { IconContainerWithPadding } from "~/components/shared/icon";
import { Icon } from "~/components/shared/icon";
import styled from "styled-components";
import { HeaderContainerNoBorder } from "~/components/shared/styles/container-header";
interface ITeamForumManagementContainerProps {
  handleMeetingClick: any;
  titleText?: string;
  buttonText?: string;
}

export const TeamForumManagementContainer = ({
  handleMeetingClick,
  titleText,
  buttonText = "Forum Meeting",
}: ITeamForumManagementContainerProps): JSX.Element => {
  return (
    <AccordionSummary
      onClick={e => {
        handleMeetingClick();
      }}
    >
      <HeaderContainerNoBorder>
        <div style={{ width: "30px" }} />
        <AccordionHeaderText>{buttonText}</AccordionHeaderText>
     </HeaderContainerNoBorder>
      <IconContainerWithPadding>
        <Icon icon={"Team"} size={16} iconColor={"blue"} />
      </IconContainerWithPadding>
     </AccordionSummary> 
  );
};

export const AccordionHeaderText = styled.h4`
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 20px;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.blueRibbon};
`;

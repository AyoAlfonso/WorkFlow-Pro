import * as React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { toJS } from "mobx";

import { OverallTeamPulse } from "./overall-team-pulse";
import { TeamPulseCard } from "./team-pulse-card";
import { NoMoodRatings } from "~/components/shared/no-mood-ratings";

import { CardLayout } from "~/components/layouts/card-layout";
import { Icon } from "~/components/shared";
import { AccordionSummary } from "~/components/shared/accordion-components";
import { IconContainerWithPadding } from "~/components/shared/icon";
import {
  HeaderContainerNoBorder,
  AccordionHeaderText,
} from "~/components/shared/styles/container-header";

interface ITeamPulsePanel {
  team: any;
  title: string;
  expanded: string;
  handleChange: any;
}

export const TeamPulsePanel = ({
  team,
  expanded,
  handleChange,
  title,
}: ITeamPulsePanel): JSX.Element => {
  const { t } = useTranslation();
  return (
    <>
      <AccordionSummary>
        <HeaderContainerNoBorder>
          <Icon
            icon={expanded === "team-pulse-panel" ? "Chevron-Up" : "Chevron-Down"}
            size={15}
            style={{ paddingRight: "15px" }}
            iconColor={expanded === "team-pulse-panel" ? "primary100" : "grey60"}
          />
          <AccordionHeaderText expanded={expanded} accordionPanel={"team-pulse-panel"}>
            {" "}
            {title}{" "}
          </AccordionHeaderText>
        </HeaderContainerNoBorder>
      </AccordionSummary>
      {expanded === "team-pulse-panel" && (
        <CardLayout customHeader={<></>}>
          {team.averageTeamEmotionScore > 0 ? (
            <TeamPulseBody>
              <OverallTeamPulse value={team.averageTeamEmotionScore} />
              <TeamPulseCard data={toJS(team.formattedAverageWeeklyUserEmotions) || []} />
            </TeamPulseBody>
          ) : (
            <NoMoodWrapper>
              <NoMoodRatings />
            </NoMoodWrapper>
          )}
        </CardLayout>
      )}
    </>
  );
};

const TeamPulseBody = styled.div`
  display: flex;
  padding-top: 36px;
  padding-bottom: 36px;
`;

const NoMoodWrapper = styled.div`
  padding-top: 40px;
  padding-bottom: 40px;
`;

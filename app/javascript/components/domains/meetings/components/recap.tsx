import * as React from "react";
import * as R from "ramda";
import * as moment from "moment";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { SemiCircleGauge } from "~/components/shared/progress-bars/semi-circle-gauge";
import { useMst } from "~/setup/root";
import { baseTheme } from "~/themes/base";
import { Card, CardBody } from "../../../shared/card";
import { Text } from "../../../shared/text";
import { useParams } from "react-router-dom";
import { Loading } from "~/components/shared/loading";
import { observer } from "mobx-react";

import { KeyActivitiesHeader } from "~/components/domains/key-activities/key-activities-header-no-filter";
import {
  KeyActivitiesWrapperContainer,
  KeyActivityListSubHeaderContainer,
} from "~/components/domains/key-activities/key-activities-list";
import { TeamKeyActivitiesBody } from "../shared/team-key-activities-body";

export interface IRecapProps {}

export const Recap = observer(
  (props: IRecapProps): JSX.Element => {
    const { t } = useTranslation();
    const { meetingStore } = useMst();
    const { meeting_id, team_id } = useParams();

    useEffect(() => {
      meetingStore.getMeetingRecap(parseInt(team_id), parseInt(meeting_id));
    }, []);

    if (R.isNil(meetingStore.meetingRecap)) {
      return <Loading />;
    }

    const {
      milestoneProgressAverages,
      keyActivities,
      issues,
      averageMilestoneProcessPercentage,
    } = meetingStore.meetingRecap;

    // the average completed percentage of milestones that belong to the quarterly goals that belong to the users of the team for the current week
    const goalProgress = averageMilestoneProcessPercentage;

    // key activities that belong to the current meeting's meeting_template and team
    const tasksCompletedCount = keyActivities.filter(ka => ka.completedAt !== null).length;
    const totalTasksCount = keyActivities.length;

    // issues that belong to this team
    const issuesCompletedCount = issues.filter(issue => issue.completedAt !== null).length;
    const ISSUES_TARGET_PER_WEEK = 3;

    const cardProps = {
      width: "320px",
      alignment: "left",
      ml: "25px",
      mb: "25px",
    };

    const graphProps = [
      {
        title: t("meeting.milestoneProgress"),
        percentage: goalProgress,
        text: `${goalProgress.toFixed(2)}%`,
      },
      {
        title: t("meeting.tasksCompleted"),
        percentage: (tasksCompletedCount / totalTasksCount) * 100,
        text: `${tasksCompletedCount} / ${totalTasksCount}`,
      },
      {
        title: t("meeting.issuesAddressed"),
        percentage:
          ((issuesCompletedCount <= ISSUES_TARGET_PER_WEEK
            ? issuesCompletedCount
            : ISSUES_TARGET_PER_WEEK) /
            ISSUES_TARGET_PER_WEEK) *
          100,
        text: `${issuesCompletedCount}`,
      },
    ];

    const renderGraphCards = () =>
      graphProps.map((graph, index) => {
        const { title, percentage, text } = graph;
        return (
          <Card
            {...cardProps}
            headerComponent={
              <Text fontSize={"16px"} fontWeight={"bold"}>
                {title}
              </Text>
            }
            key={index}
          >
            <CardBody>
              <SemiCircleGauge
                percentage={percentage}
                text={text}
                textColor="text"
                tickCount={10}
                hasTicks={true}
                hasLabels={true}
                hasLine={false}
              />
            </CardBody>
          </Card>
        );
      });

    return (
      <Container>
        <SingleListContainer>
          <KeyActivitiesHeader title={t("meeting.teamsPyns")} />
          <KeyActivityListSubHeaderContainer>
            {moment()
              .subtract(1, "days")
              .format("MMMM D")}
          </KeyActivityListSubHeaderContainer>
          <TeamKeyActivitiesBody />
        </SingleListContainer>
        <GraphContainer>{renderGraphCards()}</GraphContainer>
      </Container>
    );
  },
);

const SingleListContainer = styled.div`
  overflow-y: auto;
  height: 100%;
  min-width: 525px;
  width: 50%;
  padding-right: 16px;
`;

const Container = styled.div`
  display: flex;
  width: 100%;
`;

const GraphContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

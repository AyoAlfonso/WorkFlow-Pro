import * as React from "react";
import * as R from "ramda";
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
import { TeamKeyActivities } from "~/components/domains/meetings/components/team-key-activities";

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

    const { milestones, keyActivities, issues } = meetingStore.meetingRecap;

    // milestones that belong to the quarterly goals that belong to the users of the team
    const completedMilestonesCount = milestones.filter(ms => ms.status === "completed").length;
    const goalProgress = (completedMilestonesCount / milestones.length) * 100;

    // key activities that belong to the current meeting's meeting_template and team
    const tasksCompletedCount = keyActivities.filter(ka => ka.completedAt !== null).length;
    const totalTasksCount = keyActivities.length;

    // issues that belong to this team
    const issuesCompletedCount = issues.filter(issue => issue.completedAt !== null).length;
    const totalIssuesCount = issues.length;

    const cardProps = {
      width: "320px",
      alignment: "left",
      ml: "25px",
      mb: "25px",
    };

    const graphProps = [
      {
        title: t("meeting.goalProgress"),
        percentage: goalProgress,
        text: `${goalProgress}%`,
      },
      {
        title: t("meeting.tasksCompleted"),
        percentage: (tasksCompletedCount / totalTasksCount) * 100,
        text: `${tasksCompletedCount} / ${totalTasksCount}`,
      },
      {
        title: t("meeting.issuesAddressed"),
        percentage: (issuesCompletedCount / totalIssuesCount) * 100,
        text: `${issuesCompletedCount} / ${totalIssuesCount}`,
      },
    ];

    const renderGraphCards = () =>
      graphProps.map((graph, index) => {
        const { title, percentage, text } = graph;
        return (
          <Card
            {...cardProps}
            headerComponent={
              <Text fontSize={"20px"} fontWeight={"bold"}>
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
        <KeyActivityContainer>
          <TeamKeyActivities />
        </KeyActivityContainer>
        <GraphContainer>{renderGraphCards()}</GraphContainer>
      </Container>
    );
  },
);

const Container = styled.div`
  display: flex;
  width: 100%;
`;

const KeyActivityContainer = styled.div`
  width: 45%;
`;

const GraphContainer = styled.div`
  width: 55%;
  display: flex;
  flex-wrap: wrap;
`;

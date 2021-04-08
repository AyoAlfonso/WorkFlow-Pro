import * as React from "react";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { Text } from "~/components/shared/text";
import { HomeKeyActivities } from "~/components/domains/home/home-key-activities/home-key-activities";
import { MilestoneCard } from "~/components/domains/goals/milestone/milestone-card";
import { Loading } from "~/components/shared/loading";
import { useEffect, useState } from "react";
import styled from "styled-components";

export const Milestones = observer(
  (): JSX.Element => {
    const { milestoneStore } = useMst();

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      milestoneStore.getMilestonesForPersonalMeeting().then(() => {
        setLoading(false);
      });
    }, []);

    if (loading) {
      return <Loading />;
    }

    const renderWeeklyMilestones = (): JSX.Element[] => {
      return milestoneStore.milestonesForPersonalMeeting.map((milestone, index) => (
        <MilestoneContainer key={index}>
          <StyledText>{`${milestone.quarterlyGoalDescription || ""}`}</StyledText>
          <MilestoneCard key={index} milestone={milestone} editable={true} fromMeeting={true} />
        </MilestoneContainer>
      ));
    };

    return (
      <Container>
        <SideContainer>
          <HomeKeyActivities todayOnly={true} width={"100%"} />
        </SideContainer>
        <SideContainer>{renderWeeklyMilestones()}</SideContainer>
      </Container>
    );
  },
);

const Container = styled.div`
  display: flex;
  width: 100%;
`;

const MilestoneContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const SideContainer = styled.div`
  width: 50%;
`;

// const Container = styled.div`
//   margin-bottom: 16px;
// `;

const StyledText = styled.h4`
  font-size: 20px;
  margin-bottom: 8px;
  margin-top: 0;
`;

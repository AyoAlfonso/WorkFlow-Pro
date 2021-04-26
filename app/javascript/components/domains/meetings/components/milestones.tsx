import * as React from "react";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { Text } from "~/components/shared/text";
import { HomeKeyActivities } from "~/components/domains/home/home-key-activities/home-key-activities";
import { MilestoneCard } from "~/components/domains/goals/milestone/milestone-card";
import { Loading } from "~/components/shared/loading";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { ColumnContainerParent, ColumnContainer } from "~/components/shared/styles/row-style";

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
      return milestoneStore.milestonesForPersonalMeeting.map(milestone => (
        <MilestoneContainer key={milestone.id}>
          <StyledText>{`${milestone.quarterlyGoalDescription || ""}`}</StyledText>
          <MilestoneCard
            key={milestone.id}
            milestone={milestone}
            editable={true}
            fromMeeting={true}
            itemType={"quarterlyGoal"}
          />
        </MilestoneContainer>
      ));
    };

    return (
      <ColumnContainerParent>
        <ColumnContainer>
          <HomeKeyActivities todayOnly={true} width={"100%"} />
        </ColumnContainer>
        <ColumnContainer>{renderWeeklyMilestones()}</ColumnContainer>
      </ColumnContainerParent>
    );
  },
);

const MilestoneContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const StyledText = styled.h4`
  font-size: 20px;
  margin-bottom: 8px;
  margin-top: 0;
`;

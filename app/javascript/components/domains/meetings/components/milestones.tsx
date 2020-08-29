import * as React from "react";
import * as R from "ramda";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useMst } from "~/setup/root";
import { Text } from "~/components/shared/text";
import { MilestoneCard } from "~/components/domains/goals/milestone/milestone-card";
import { Loading } from "~/components/shared/loading";

export const Milestones = observer(
  (): JSX.Element => {
    const {
      meetingStore: { currentPersonalPlanning },
    } = useMst();

    const renderWeeklyMilestones = (): JSX.Element[] => {
      return currentPersonalPlanning.myCurrentMilestones.map((milestone, index) => (
        <div key={index}>
          <Text fontSize={2}>{`${milestone.quarterlyGoalDescription || ""}`}</Text>
          <MilestoneCard
            key={index}
            milestone={milestone}
            unstarted={milestone.status == "unstarted"}
            editable={true}
          />
        </div>
      ));
    };

    return currentPersonalPlanning && currentPersonalPlanning.myCurrentMilestones ? (
      <>{renderWeeklyMilestones()}</>
    ) : (
      <Loading />
    );
  },
);

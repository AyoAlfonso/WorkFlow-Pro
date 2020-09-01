import * as React from "react";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { Text } from "~/components/shared/text";
import { MilestoneCard } from "~/components/domains/goals/milestone/milestone-card";
import { Loading } from "~/components/shared/loading";
import { useEffect, useState } from "react";

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
        <div key={index}>
          <Text fontSize={2}>{`${milestone.quarterlyGoalDescription || ""}`}</Text>
          <MilestoneCard
            key={index}
            milestone={milestone}
            unstarted={milestone.status == "unstarted"}
            editable={true}
            fromMeeting={true}
          />
        </div>
      ));
    };

    return <> {renderWeeklyMilestones()} </>;
  },
);
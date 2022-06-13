import * as React from "react";
import * as R from "ramda";
import { useEffect } from "react";
import { observer } from "mobx-react";
import { MilestoneType } from "~/types/milestone";
import { HomeContainerBorders } from "../../home/shared-components";
import { Text } from "../../../shared/text";
import { Avatar } from "../../../shared/avatar";
import ContentEditable from "react-contenteditable";
import { useMst } from "~/setup/root";
import styled from "styled-components";
import { Loading } from "~/components/shared/loading";
import { useParams } from "react-router-dom";
import { toJS } from "mobx";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { MilestoneCard } from "../../goals/milestone/milestone-card";
import { EmptyState } from "./empty-state";
import { getWeekOf } from "~/utils/date-time";

export const WeeklyMilestones = observer(
  (props): JSX.Element => {
    const { sessionStore, milestoneStore } = useMst();
    const { t } = useTranslation();

    const { weekOf } = useParams();
    const { milestonesForWeeklyCheckin } = milestoneStore;

    const currentWeekOf = weekOf || getWeekOf()

    useEffect(() => {
      milestoneStore.getMilestonesForWeeklyCheckin(currentWeekOf);
    }, []);

    const renderHeading = (): JSX.Element => {
      return (
        <Container>
          <StyledHeader>
            What's the status on your Milestones from week of{" "}
            <u>{moment(weekOf).format("MMMM D")}</u>?
          </StyledHeader>
        </Container>
      );
    };

    const renderLoading = () => (
      <LoadingContainer>
        <Loading />
      </LoadingContainer>
    );

    const renderUserAvatar = () => {
      return (
        <Avatar
          size={32}
          marginLeft={"0"}
          firstName={sessionStore.profile.firstName}
          lastName={sessionStore.profile.lastName}
          defaultAvatarColor={sessionStore.profile.defaultAvatarColor}
          avatarUrl={sessionStore.profile.avatarUrl}
        />
      );
    };

    const renderMilestones = (): JSX.Element => {
      return (
        <>
          {R.isNil(milestonesForWeeklyCheckin) ? (
            renderLoading()
          ) : (
            <>
              {renderHeading()}
              {milestonesForWeeklyCheckin?.map(milestone => (
                <Container key={milestone.id}>
                  <AvatarContainer>
                    {renderUserAvatar()}
                    <StyledText>
                      {milestone.quarterlyGoalDescription
                        ? milestone.quarterlyGoalDescription
                        : milestone.subinitiativeDescription}
                    </StyledText>
                  </AvatarContainer>
                  <MilestoneContainer>
                    <MilestoneCard
                      itemType={milestone.milestoneableType}
                      editable={true}
                      milestone={milestone}
                      fromWeeklyCheckIn={true}
                    />
                  </MilestoneContainer>
                </Container>
              ))}
            </>
          )}
        </>
      );
    };
    return (
      <>
        {!R.isEmpty(milestonesForWeeklyCheckin) ? (
          <>{renderMilestones()}</>
        ) : (
          <EmptyState
            heading={t("weeklyCheckIn.milestones.emptyText")}
            infoText={t("weeklyCheckIn.milestones.create")}
          />
        )}
      </>
    );
  },
);

const Container = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
  padding-left: 16px;
  padding-right: 16px;
  @media only screen and (max-width: 768px) {
    padding: 0 16px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 15px;
  margin-bottom: 25px;
`;

const MilestoneContainer = styled.div`
  margin-bottom: 15px;
`;

const StyledText = styled.span`
  font-size: 16px;
  font-weight: bold;
  margin-left: 5px;
`;

const StyledHeader = styled.h1`
  margin-bottom: 25px;
  @media only screen and (max-width: 768px) {
    font-size: 24px;
  }
`;

type MilestoneDetailsType = {
  unstarted: boolean;
  currentWeek: boolean;
};

const MilestoneDetails = styled(HomeContainerBorders)<MilestoneDetailsType>`
  padding: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
  width: 90%;
  border: ${props =>
    (!props.unstarted || props.currentWeek) && `1px solid ${props.theme.colors.primary100}`};
  color: ${props => props.unstarted && props.theme.colors.grey60};
`;

type WeekOfTextType = {
  unstarted: boolean;
};

const WeekOfText = styled(Text)<WeekOfTextType>`
  color: ${props => (props.unstarted ? props.theme.colors.grey60 : props.theme.colors.primary100)};
  margin-top: 8px;
  margin-bottom: 8px;
`;

const WeekOfTextValue = styled.span`
  text-decoration: underline;
  font-weight: bold;
`;

const MilestoneContentEditable = styled(ContentEditable)`
  margin-top: 8px;
  margin-bottom: 8px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 16px;
  padding-right: 16px;
  color: ${props => props.theme.colors.black};
`;

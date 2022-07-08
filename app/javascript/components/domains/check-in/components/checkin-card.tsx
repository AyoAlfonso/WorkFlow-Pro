import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Button } from "~/components/shared/button";
import { Icon } from "~/components/shared/icon";
import { ICheckInArtifact } from "~/models/check-in-artifacts";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { toJS } from "mobx";
import moment from "moment";

interface CheckInCardProps {
  checkin: ICheckInArtifact;
}

export const CheckInCard = observer(
  ({ checkin }: CheckInCardProps): JSX.Element => {
    const { checkInTemplateStore, sessionStore, teamStore } = useMst();

    const history = useHistory();

    const { checkInTemplate } = checkin;

    const { name, ownerType, id, viewers, participants, runOnce } = checkInTemplate;

    const getStatus = entityArray => {
      const status = entityArray.map(item => {
        if (item.type == "company") {
          return "true";
        } else if (item.type == "user") {
          const isUser = sessionStore.profile?.id == item.id;
          if (isUser) {
            return "true";
          }
        } else if (item.type == "team") {
          const team = teamStore.teams?.find(team => team.id == item.id);
          const isUser = team?.users?.find(user => user.id == sessionStore.profile?.id);
          if (isUser) {
            return "true";
          }
        }
      });
      return status.includes("true");
    };

    const isViewer = getStatus(viewers);
    const isParticipant = getStatus(participants);

    const dueDate = new Date(checkin.startTime).toDateString();
    // const isEntryNeeded = new Date()
    const isEntryNeeded = () => {
      const dateA = moment(dueDate);
      const dateB = moment(new Date());
      const diff = dateA.diff(dateB, "hours");
      return diff < 24;
    };

    return (
      <Container>
        <TitleContainer>
          <Title disabled={!isViewer} onClick={() => history.push(`/check-in/insights/${id}`)}>
            {name}
          </Title>
          <IconContainer onClick={() => {}}>
            <Icon icon={"Settings"} size="18px" iconColor={"greyActive"} />
          </IconContainer>
        </TitleContainer>
        <InfoContainer>
          <Tag>{ownerType.replace(/(^\w|\s\w)/g, m => m.toUpperCase())}</Tag>
          {!runOnce && (
            <>
              <DueDate>{`Due: ${dueDate}`}</DueDate>

              {isViewer && !isParticipant ? (
                <EntryBadge>{isEntryNeeded() == true && `• Response Expected`}</EntryBadge>
              ) : (
                <EntryBadge>{isEntryNeeded() == true && ` • Entry Needed`}</EntryBadge>
              )}
            </>
          )}
        </InfoContainer>
        {isParticipant && (
          <ActionsContainer>
            <ButtonsContainer>
              <Button
                variant={"primary"}
                mr="1em"
                width="80px"
                fontSize="12px"
                onClick={() => history.push(`/check-in/run/${checkin.id}`)}
                small
                style={{ whiteSpace: "nowrap" }}
              >
                Check-in
              </Button>
              <Button
                variant={"greyOutline"}
                mr="1em"
                width="80px"
                fontSize="12px"
                onClick={() => {
                  checkInTemplateStore.skipCheckIn(checkin.id);
                }}
                small
              >
                Skip
              </Button>
            </ButtonsContainer>
            <StreakContainer>
              <Icon icon={"Streak"} size="24px" mr="0.5em" iconColor={"greyActive"} />
              <StreakCount>0</StreakCount>
            </StreakContainer>
          </ActionsContainer>
        )}
      </Container>
    );
  },
);

const IconContainer = styled.div`
  display: none;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const Container = styled.div`
  padding: 1em;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};

  &:hover {
    background-color: ${props => props.theme.colors.backgroundBlue};
    ${IconContainer} {
      display: block;
    }
  }
`;

const TitleContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  justify-content: space-between;
  align-items: center;
`;

type TitleProps = {
  disabled?: boolean;
};

const Title = styled.span<TitleProps>`
  font-size: 1em;
  font-weight: bold;
  color: ${props => props.theme.colors.black};
  cursor: pointer;
  pointer-events: ${props => (props.disabled ? "none" : "auto")};
`;

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;
const Tag = styled.span`
  display: inline-block;
  padding: 0.5em;
  color: ${props => props.theme.colors.grey100};
  background-color: ${props => props.theme.colors.grey20};
  font-size: 0.75em;
  margin-right: 0.75em;
  border-radius: 4px;
`;

const DueDate = styled.span`
  color: ${props => props.theme.colors.grey100};
  font-size: 0.75em;
  margin-right: 2px;
`;

const EntryBadge = styled.span`
  color: ${props => props.theme.colors.grey100};
  font-size: 0.75em;
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonsContainer = styled.div`
  display: flex;
`;

const StreakContainer = styled.div`
  display: flex;
`;

const StreakCount = styled.span`
  display: inline-block;
  border-radius: 50%;
  padding: 0.5em 0.8em;
  border: 1px solid ${props => props.theme.colors.greyActive};
  font-size: 0.75em;
  color: ${props => props.theme.colors.greyActive};
`;

import * as React from "react";
import { useState } from "react";
import * as R from "ramda";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { CardBody } from "../../../shared/card";
import { Text } from "../../../shared/text";
import { useMst } from "~/setup/root";
import { Avatar } from "~/components/shared/avatar";
import { useParams } from "react-router-dom";
import { Input, Select } from "~/components/shared/input";
import { baseTheme } from "~/themes/base";
import { Button } from "~/components/shared/button";
import { Loading } from "~/components/shared/loading";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";

export interface IMeetingRatingProps {}

interface IScore {
  userId: number;
  value: string;
}

export const MeetingRating = (props: IMeetingRatingProps): JSX.Element => {
  const [scores, setScores] = useState<Array<IScore>>([]);

  const { t } = useTranslation();
  const { team_id, meeting_id } = useParams();
  const {
    teamStore: { teams },
    userStore: { users },
    meetingStore: { updateMeeting },
  } = useMst();

  if (!teams || !users) {
    return <Loading />;
  }

  const currentTeam = teams.find(team => team.id === parseInt(team_id));

  if (!currentTeam) {
    showToast(
      "There was an issue getting your team. Please refresh and try again",
      ToastMessageConstants.ERROR,
    );
    return <Loading />;
  }

  const teamLeads = users.filter(user => currentTeam.isALead(user));
  const teamMembers = users.filter(user => currentTeam.isANonLead(user));
  const MEETING_MAX_RATING = "5";

  const saveScores = () => {
    const averageScore = Number(
      R.pipe(
        R.filter(score => score.value !== ""),
        R.reduce((acc, curr) => acc + parseInt(curr.value), 0),
        R.divide(R.__, scores.length),
      )(scores).toFixed(1),
    );
    updateMeeting({ id: meeting_id, averageRating: averageScore }).then(meeting => {
      meeting ? showToast("Meeting ratings updated!", ToastMessageConstants.SUCCESS) : null;
    });
  };

  // to do add consideration < 0
  const handleScoreChange = (user, value) => {
    const formattedValue = parseInt(value);
    setScores(
      R.pipe(
        R.reject(score => score.userId === user.id),
        R.append({
          userId: user.id,
          value:
            formattedValue > parseInt(MEETING_MAX_RATING)
              ? MEETING_MAX_RATING
              : formattedValue < 1
              ? 1
              : isNaN(formattedValue)
              ? 1
              : formattedValue,
        }),
      )(scores),
    );
  };

  const renderUserRows = users => {
    return users
      .filter(user => user.status == "active")
      .map((user, index) => {
        const score = scores.find(score => score.userId === user.id);
        const inputValue = R.isNil(score) ? "" : score.value;
        const valueArray = [0, 1, 2, 3, 4, 5];
        return (
          <RowDiv key={index}>
            <AvatarNameContainer>
              <Avatar
                avatarUrl={user.avatarUrl ? user.avatarUrl : null}
                defaultAvatarColor={user.defaultAvatarColor}
                firstName={user.firstName}
                lastName={user.lastName}
                size={48}
                marginLeft={"inherit"}
              />
              <Text fontSize={"15px"} fontWeight={"regular"} ml={"20px"}>
                {`${user.firstName} ${user.lastName}`}
              </Text>
            </AvatarNameContainer>
            <ScoreContainer>
              <ValueContainer>
                <Select
                  name="userRating"
                  value={inputValue}
                  onChange={e => handleScoreChange(user, e.target.value)}
                >
                  {valueArray.map(num => (
                    <option key={num} value={num == 0 ? "" : num}>
                      {num == 0 ? "" : num}
                    </option>
                  ))}
                </Select>
              </ValueContainer>
              <ScoreDivider />
              <InputContainer>
                <PlaceHolderInputDiv>
                  <Text color={"grey40"} fontSize={"15px"} fontWeight={"regular"}>
                    {MEETING_MAX_RATING}
                  </Text>
                </PlaceHolderInputDiv>
              </InputContainer>
            </ScoreContainer>
          </RowDiv>
        );
      });
  };

  return (
    <Container>
      <CardBody>
        <BodyContainer>
          {renderUserRows(teamMembers)}
          {renderUserRows(teamLeads)}
        </BodyContainer>
        <ButtonDiv>
          <Button variant={"primaryOutline"} onClick={saveScores} small>
            {t("meeting.saveRatings")}
          </Button>
        </ButtonDiv>
      </CardBody>
    </Container>
  );
};

const Container = styled.div`
  width: 600px;
  margin-left: 16px;
`;

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 15px;
`;

const RowDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 48px;
  margin-bottom: 15px;
`;

const AvatarNameContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 70%;
`;

const ScoreContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 30%;
  margin-right: 30px;
`;

const DividerContainer = styled.div`
  height: 34px;
  width: 15px;
  padding: 0;
  margin: 0 0 0 15px;
`;

const DividerLine = styled.div`
  height: 100%;
  width: 100%;
  background: linear-gradient(
    to top left,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0) calc(50% - 0.8px),
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0) calc(50% + 0.8px),
    rgba(0, 0, 0, 0) 100%
  );
`;

const ScoreDivider = () => (
  <DividerContainer>
    <DividerLine />
  </DividerContainer>
);

const InputContainer = styled.div`
  width: 47px;
  height: 34px;
  margin-left: 15px;
`;

const ValueContainer = styled.div`
  height: 34px;
  margin-left: 15px;
  width: 60px;
`;

const PlaceHolderInputDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 34px;
  border: 1px solid ${baseTheme.colors.grey20};
  border-radius: 4px;
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 15px;
  margin-bottom; 15px;
`;

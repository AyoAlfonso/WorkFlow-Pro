import React from "react";
import styled from "styled-components";
import { Avatar, StripedProgressBar, Text } from "~/components/shared";
import { useMst } from "~/setup/root";
import { determineStatusLabel } from "../../goals/shared/key-element";

interface InitiativeInsightsProps {
  insightsToShow: Array<any>;
}
const InitiativeInsights = ({ insightsToShow }: InitiativeInsightsProps): JSX.Element => {
  const { sessionStore, userStore } = useMst();
  // artifact = CheckInTemplateStore.currentCheckInArtifact;

  const checkInArtifactLogs = insightsToShow
    .map(artifact => {
      if (artifact.checkInArtifactLogs[0]) {
        return {
          ...artifact.checkInArtifactLogs[0],
          ownedBy: artifact.ownedById,
          updatedAt: artifact.updatedAt,
        };
      }
    })
    .filter(Boolean);
    
  const findUser = owner_id => {
    return userStore.users.find(id => id === owner_id);
  };

  const completion = element => {
    const starting = element.completionStartingValue;
    const target = element.completionTargetValue;
    const current =
      element.completionCurrentValue == ""
        ? element.completionStartingValue
        : element.completionCurrentValue;

    if (element.greaterThan === 1) {
      return Math.min(Math.max(current - starting, 0) / (target - starting), 1) * 100;
    } else {
      return current <= target
        ? 100
        : current >= target * 2
        ? 0
        : ((target + target - current) / target) * 100;
    }
  };

  const element = {
    completionStartingValue: null,
    completionTargetValue: 100,
    completionCurrentValue: 50,
    greaterThan: 1,
  };

  return (
    <Container>
      <HeaderContainer>
        <HeaderText>Initiatives</HeaderText>
      </HeaderContainer>
      <InitiativesContainer>
        <InitiativeContainer>
          <AvatarContainer>
            <Avatar
              size={32}
              marginLeft={"0px"}
              marginTop={"0px"}
              marginRight={"16px"}
              firstName={sessionStore.profile.firstName}
              lastName={sessionStore.profile.lastName}
              defaultAvatarColor={sessionStore.profile.defaultAvatarColor}
              avatarUrl={sessionStore.profile.avatarUrl}
            />
            <StyledText>{`${sessionStore.profile.firstName} ${sessionStore.profile.lastName}`}</StyledText>
          </AvatarContainer>
          <Divider /> <br />
          <AvatarContainer>
            <Avatar
              size={32}
              marginLeft={"0px"}
              marginTop={"0px"}
              marginRight={"16px"}
              firstName={sessionStore.profile.firstName}
              lastName={sessionStore.profile.lastName}
              defaultAvatarColor={sessionStore.profile.defaultAvatarColor}
              avatarUrl={sessionStore.profile.avatarUrl}
            />
            <StyledText>Prevent overworking, boost morale, and improve quality of work</StyledText>
          </AvatarContainer>{" "}
          <br />
          <KeyElementName>Improve profitability by 20%</KeyElementName>
          <KeyElementContainer>
            {determineStatusLabel("completed")}
            <TargetValueContainer>
              <TargetValue>
                <b>15%</b>/ 20%
              </TargetValue>
            </TargetValueContainer>
            <ProgressBarContainer>
              <StripedProgressBar variant={"completed"} completed={completion(element)} />
            </ProgressBarContainer>
          </KeyElementContainer>
        </InitiativeContainer>
      </InitiativesContainer>
      <Divider />
      <InfoContainer>
        <InfoText>2 total responses</InfoText>
      </InfoContainer>
    </Container>
  );
};

export default InitiativeInsights;

const Container = styled.div`
  box-shadow: 0px 3px 6px #00000029;
  background: ${props => props.theme.colors.white};
  border-radius: 8px;
  padding: 16px 0;
  margin-bottom: 16px;
  // height: 250px;
`;

const HeaderContainer = styled.div`
  padding: 0 1em;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderText = styled.span`
  color: ${props => props.theme.colors.black};
  font-size: 20px;
  font-weight: bold;
  display: inline-block;
`;

const AvatarContainer = styled.div`
  padding: 0 1em;
  display: flex;
  align-items: center;
  margin-bottom: 1em;
`;

const InitiativesContainer = styled.div``;

const InitiativeContainer = styled.div``;

const StyledText = styled(Text)`
  font-weight: bold;
  font-size: 14px;
  margin: 0;
`;

const KeyElementName = styled(StyledText)`
  padding: 0 1em;
  margin-bottom: 24px;
`;

const Divider = styled.div`
  border-top: 1px solid ${props => props.theme.colors.grey40};
`;

const InfoContainer = styled.div`
  display: flex;
  padding: 0 1em;
  margin-top: 0.5em;
`;

const InfoText = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.grey40};
  margin-left: auto;
`;

const KeyElementContainer = styled.div`
  display: flex;
  align-items: center;
  padding-right: 1em;
  margin-bottom: 2em;
`;

const ProgressBarContainer = styled.div`
  flex: 1;
`;

const TargetValueContainer = styled.div`
  margin-left: 1em;
  margin-right: 2em;
`;

const TargetValue = styled.span`
  display: inline-block;
`;

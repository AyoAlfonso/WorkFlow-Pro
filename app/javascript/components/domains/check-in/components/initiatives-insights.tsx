import React, { useState } from "react";
import { Avatar, StripedProgressBar, Text } from "~/components/shared";
import { useMst } from "~/setup/root";
import { determineStatusLabel } from "../../goals/shared/key-element";
import { Loading } from "~/components/shared/loading";
import styled from "styled-components";

interface InitiativeInsightsProps {
  insightsToShow: Array<any>;
}
const InitiativeInsights = ({ insightsToShow }: InitiativeInsightsProps): JSX.Element => {
  const { sessionStore, userStore } = useMst();
  const participants = new Set();
  if (!userStore.users.length) {
    return <Loading />;
  }

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
    return userStore.users.find(user => user.id == owner_id);
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

  const keys = ["objecteableId, objecteableType, ownedById"];

  return (
    <Container>
      <HeaderContainer>
        <HeaderText>Initiative</HeaderText>
      </HeaderContainer>
      <InitiativesContainer>
        {checkInArtifactLogs.map((artifactLog, i) => {
          let user = findUser(artifactLog.ownedBy);
          const filteredArtifactLogs = artifactLog.objectiveLogsFull?.filter(
            (s => o => (k => !s.has(k) && s.add(k))(keys.map(k => o[k]).join("|")))(new Set()),
          );

          return (
            <div key={`log-${i}`}>
              {filteredArtifactLogs.length > 0 ? (
                <AvatarContainer>
                  <br />
                  <Divider />
                  <Avatar
                    size={32}
                    marginLeft={"0px"}
                    marginTop={"0px"}
                    marginRight={"16px"}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    defaultAvatarColor={user.defaultAvatarColor}
                    avatarUrl={user.avatarUrl}
                  />
                  <StyledText>{`${user.firstName} ${user.lastName}`}</StyledText>
                </AvatarContainer>
              ) : (
                <></>
              )}
              {filteredArtifactLogs.map(objectiveLogsFull => {
                user = findUser(objectiveLogsFull.ownedById);

                participants.add(objectiveLogsFull.id);
                return (
                  <InitiativeContainer>
                    {/* { i > 0 ? : return ( <Divider />) : null} */}
                    <Divider />
                    <br />
                    <AvatarContainer>
                      <Avatar
                        size={32}
                        marginLeft={"0px"}
                        marginTop={"0px"}
                        marginRight={"16px"}
                        firstName={user.firstName}
                        lastName={user.lastName}
                        defaultAvatarColor={user.defaultAvatarColor}
                        avatarUrl={user.avatarUrl}
                      />
                      <StyledText>
                        {objectiveLogsFull.objecteableData.contextDescription.replace(
                          /<\/?[a-z][a-z0-9]*[^<>]*>/gi,
                          "",
                        )}
                      </StyledText>
                    </AvatarContainer>{" "}
                    <br />
                    {objectiveLogsFull.objecteableData?.keyElements.map(keyElement => {
                      return (
                        <>
                          <KeyElementName>{keyElement.value}</KeyElementName>
                          <KeyElementContainer>
                            <CompletiontStatus>
                              {determineStatusLabel(keyElement.status)}
                            </CompletiontStatus>
                            <TargetValueContainer>
                              <TargetValue>
                                <b>{keyElement.completionCurrentValue}</b>/{" "}
                                {keyElement.completionTargetValue}
                              </TargetValue>
                            </TargetValueContainer>
                            <ProgressBarContainer>
                              <StripedProgressBar
                                variant={keyElement.status}
                                completed={completion(keyElement)}
                              />
                            </ProgressBarContainer>
                          </KeyElementContainer>
                        </>
                      );
                    })}
                  </InitiativeContainer>
                );
              })}
            </div>
          );
        })}
      </InitiativesContainer>

      <Divider />
      <InfoContainer>
        <InfoText>{participants?.size} total response(s)</InfoText>
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
  // margin-left: 1em;
  margin-right: 1em;
`;

const TargetValue = styled.span`
  display: inline-block;
  font-size: 10px;
`;

const CompletiontStatus = styled.div`
  display: inline-block;
  font-size: 10px;
`;

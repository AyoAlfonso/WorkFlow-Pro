import React from "react";
import styled from "styled-components";
import { Avatar } from "~/components/shared";
import { useMst } from "~/setup/root";

export const OpenEndedInsights = (): JSX.Element => {
  const { sessionStore } = useMst()
  return (
    <Container>
      <HeaderContainer>
        <QuestionText>What did you do today?</QuestionText>
      </HeaderContainer>
      <ResponsesContainer>
        <ResponseContainer>
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
          <TextContainer>
            <NameText>{`${sessionStore.profile.firstName} ${sessionStore.profile.lastName}`}</NameText>
            <ResponseText>Not a lot</ResponseText>
            <DateText>08:46PM</DateText>
          </TextContainer>
        </ResponseContainer>
        <ResponseContainer>
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
          <TextContainer>
            <NameText>{`${sessionStore.profile.firstName} ${sessionStore.profile.lastName}`}</NameText>
            <ResponseText>Not a lot</ResponseText>
            <DateText>08:46PM</DateText>
          </TextContainer>
        </ResponseContainer>
      </ResponsesContainer>
      <Divider />
      <InfoContainer>
        <InfoText>2 total responses</InfoText>
      </InfoContainer>
    </Container>
  );
};

const Container = styled.div`
  box-shadow: 0px 3px 6px #00000029;
  background: ${props => props.theme.colors.white};
  border-radius: 8px;
  padding: 16px 0;
  // height: 250px;
`;

const ResponsesContainer = styled.div`
  padding: 0 1em;
`;

const HeaderContainer = styled.div`
  padding: 0 1em;
  margin-bottom: 24px;
`;

const ResponseContainer = styled.div`
  display: flex;
  margin-bottom: 1em;
`;

const QuestionText = styled.span`
  color: ${props => props.theme.colors.black};
  font-size: 20px;
  font-weight: bold;
  display: inline-block;
`;

const TextContainer = styled.div``

const NameText = styled.span`
  color: ${props => props.theme.colors.black};
  font-size: 12px;
  font-weight: bold;
  display: block;
  margin-bottom: 0.5em;
`;

const ResponseText = styled.span`
  font-style: italic;
  font-size: 12px;
  color: ${props => props.theme.colors.black};
  display: block;
  margin-bottom: 4px;
`;

const DateText = styled.span`
  font-size: 9px;
  color: ${props => props.theme.colors.grey100};
`;

const Divider = styled.div`
  border-top: 1px solid ${props => props.theme.colors.grey40};
`;

const InfoContainer = styled.div`
  display: flex;
  padding: 0 1em;
  margin-top: 0.5em;
`

const InfoText = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.grey40};
  margin-left: auto;
`
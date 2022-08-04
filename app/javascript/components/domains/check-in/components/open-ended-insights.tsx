import { observer } from "mobx-react";
import moment from "moment";
import React from "react";
import styled from "styled-components";
import { Avatar } from "~/components/shared";
import { useMst } from "~/setup/root";
import { getTotalNumberOfResponses } from "~/utils/check-in-functions";

interface OpenEndedInsightsProps {
  insightsToShow: Array<any>;
  steps: Array<any>;
}

export const OpenEndedInsights = observer(
  ({ insightsToShow, steps }: OpenEndedInsightsProps): JSX.Element => {
    const { userStore } = useMst();

    const stepQuestions = steps
      .map(step => {
        if (step.name === "Open-ended") {
          return step.question;
        } else return;
      })
      .filter(Boolean);

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

    const getUser = userId => {
      const user = userStore.users?.find(user => user.id === userId);
      if (user) {
        return user;
      }
    };

    const getResponse = (question, log) => {
      const response = log.responses?.find(
        response => response.prompt == question && response.questionType == "open_ended",
      );
      return response?.response;
    };

    return (
      <>
        {stepQuestions?.map((question, index) => {
          const totalNumberOfResponses = getTotalNumberOfResponses(
            question,
            checkInArtifactLogs,
            "open_ended",
          );
          return (
            <Container key={`${question}-${index}`}>
              <HeaderContainer>
                <QuestionText>{question}</QuestionText>
              </HeaderContainer>
              <ResponsesContainer>
                {checkInArtifactLogs.length ? (
                  checkInArtifactLogs.map(log => {
                    const response = getResponse(question, log);
                    const user = getUser(log.ownedBy);
                    if (response) {
                      return (
                        <ResponseContainer key={log.ownedBy}>
                          <Avatar
                            size={32}
                            marginLeft={"0px"}
                            marginTop={"0px"}
                            marginRight={"16px"}
                            firstName={user?.firstName}
                            lastName={user?.lastName}
                            defaultAvatarColor={user?.defaultAvatarColor}
                            avatarUrl={user?.avatarUrl}
                          />
                          <TextContainer>
                            <NameText>{`${user?.firstName} ${user?.lastName}`}</NameText>
                            <ResponseText>{response}</ResponseText>
                            <DateText>{moment(log.updatedAt).format("hh:mm a")}</DateText>
                          </TextContainer>
                        </ResponseContainer>
                      );
                    }
                  })
                ) : (
                  <></>
                )}
              </ResponsesContainer>
              <Divider />
              <InfoContainer>
                <InfoText>
                  {!totalNumberOfResponses
                    ? "No response"
                    : totalNumberOfResponses == 1
                    ? "1 response"
                    : `${totalNumberOfResponses} total responses`}
                </InfoText>
              </InfoContainer>
            </Container>
          );
        })}
      </>
    );
  },
);

const Container = styled.div`
  box-shadow: 0px 3px 6px #00000029;
  background: ${props => props.theme.colors.white};
  border-radius: 8px;
  padding: 16px 0;
  margin-bottom: 16px;
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

const TextContainer = styled.div``;

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
`;

const InfoText = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.grey40};
  margin-left: auto;
`;

const QuestionContainer = styled.div``;

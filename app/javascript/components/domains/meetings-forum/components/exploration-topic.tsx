import * as React from "react";
import * as R from "ramda";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { HeaderText } from "~/components/shared/styles/container-header";
import { Text, Icon, Loading } from "~/components/shared";
import { Avatar } from "~/components/shared/avatar";
import { useTranslation } from "react-i18next";
import { ColumnContainer, Container } from "./row-style";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";

export const ExplorationTopic = observer((): JSX.Element => {
  const { t } = useTranslation();
  const { 
    meetingStore, 
    teamStore: { currentTeam },
  } = useMst();
  const meeting = meetingStore.currentMeeting;

  if (R.isNil(currentTeam)) {
    return <Loading />;
  }

  const explorationTopic = R.path(["forumExplorationTopic"], meeting.settings);
  const currentTeamUsers = currentTeam.users;

  const explorationTopicOwner = currentTeamUsers.find(
    member => member.id == R.path(["forumExplorationTopicOwnerId"], meeting.settings),
  );


  return (
    <MainContainer>
      <HeaderContainer>
        <HeaderTextContent>{t("meetingForum.explorationTopic.whoTitle")}</HeaderTextContent>
        <HeaderTextContent>{t("meetingForum.explorationTopic.topicTitle")}</HeaderTextContent>
      </HeaderContainer>
      <Container>
            <ColumnContainer>
              { R.isNil(explorationTopicOwner) ? (
                <>
                  <ImageContainer>
                    <Icon icon={"User"} size={"30px"} iconColor={"grey80"} />
                  </ImageContainer>
                  <AddMemberText>{t("meetingForum.explorationTopic.noTopicOwner")}</AddMemberText>
                </>

              ) : (
                <>
                  <Avatar
                    firstName={explorationTopicOwner.firstName}
                    lastName={explorationTopicOwner.lastName}
                    defaultAvatarColor={explorationTopicOwner.defaultAvatarColor}
                    avatarUrl={explorationTopicOwner.avatarUrl}
                    size={48}
                    marginLeft={"inherit"}
                    marginRight={"inherit"}
                  />
                  <HostedByName>{`${explorationTopicOwner.firstName} ${explorationTopicOwner.lastName}`}</HostedByName>
                </>
                )
              }
            </ColumnContainer>
            <ColumnContainer>
              <ExplorationTopicContent explorationTopic={explorationTopic} >
                { R.isNil(explorationTopic) ? (
                    t("meetingForum.explorationTopic.noTopic")
                  ) : (
                    {explorationTopic}
                  )
                }
              </ExplorationTopicContent>
            </ColumnContainer>
          </Container>
    </MainContainer>
  );
});

const ImageContainer = styled.div`
  border-radius: 9999px;
  border: ${props => `3px solid ${props.theme.colors.grey80}`};
  width: 42px;
  height: 42px;
  display: flex;
  justify-content: center;
`;

const HostedByName = styled(Text)`
  margin-left: 15px;
`;

const AddMemberText = styled(HostedByName)`
  font-style: italic;
  color: ${props => props.theme.colors.grey80};
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 24px;
`;

const HeaderTextContent = styled(HeaderText)`
  text-align: left;
  justify-content: start;
  margin-right: auto;
  margin-left: 16px;
  min-width: 240px;
`;

type ExplorationTopic = {
  explorationTopic?: string
}

const ExplorationTopicContent = styled.p<ExplorationTopic>`
  margin-top: 0px;
  margin-bottom: 0px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 10px;
  border: 1px solid #e3e3e3;
  box-shadow: 0px 3px 6px #f5f5f5;
  padding-left: 16px;
  padding-right: 16px;
  width: 100%;
  height: 25px;
  color: ${props => 
    !props.explorationTopic ? props.theme.colors.grey60 : props.theme.colors.black };
`;

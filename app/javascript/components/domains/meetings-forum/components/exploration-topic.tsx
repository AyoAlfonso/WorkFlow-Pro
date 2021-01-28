import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { HeaderText } from "~/components/shared/styles/container-header";
import { Text } from "~/components/shared/text";
import { Avatar } from "~/components/shared/avatar";
import { useTranslation } from "react-i18next";
import { ColumnContainer, Container } from "./row-style";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";

export const ExplorationTopic = observer((): JSX.Element => {
  const { t } = useTranslation();
  const { meetingStore } = useMst();
  const meeting = meetingStore.currentMeeting;

  const explorationTopic = R.path(["forumExplorationTopic"], meeting.settings);

  return (
    <MainContainer>
      <HeaderContainer>
        <HeaderTextContent>{t("meetingForum.explorationTopic.whoTitle")}</HeaderTextContent>
        <HeaderTextContent>{t("meetingForum.explorationTopic.topicTitle")}</HeaderTextContent>
      </HeaderContainer>
      <Container>
            <ColumnContainer>
              <Avatar
                firstName={"sample"}
                lastName={"sample"}
                size={48}
                marginLeft={"inherit"}
                marginRight={"inherit"}
              />
              <Text>Sample sample</Text>
            </ColumnContainer>
            <ColumnContainer>
              <ExplorationTopicContent>
                {explorationTopic}
              </ExplorationTopicContent>
            </ColumnContainer>
          </Container>
    </MainContainer>
  );
});

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

const ExplorationTopicContent = styled(Text)`
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 10px;
  border: 1px solid #e3e3e3;
  box-shadow: 0px 3px 6px #f5f5f5;
  padding-left: 16px;
  padding-right: 16px;
`;

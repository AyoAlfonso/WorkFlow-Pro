import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { HeaderText } from "~/components/shared/styles/container-header";
import { Loading } from "~/components/shared";
import { Container as SectionContainer } from "./row-style";
import { useTranslation } from "react-i18next";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";
import { ForumTopic } from "./forum-topic";

export const ExplorationTopic = observer((): JSX.Element => {
  const { t } = useTranslation();
  const { 
    meetingStore: { currentMeeting }, 
    teamStore: { currentTeam },
  } = useMst();

  if (R.isNil(currentTeam) || R.isNil(currentMeeting)) {
    return <Loading />;
  }

  return (
    <Container>
      <HeaderContainer>
        <HeaderTextContent>{t("meetingForum.explorationTopic.whoTitle")}</HeaderTextContent>
        <HeaderTextContent>{t("meetingForum.explorationTopic.topicTitle")}</HeaderTextContent>
      </HeaderContainer>
      <SectionContainer>
        <ForumTopic disabled={true} meeting={currentMeeting} teamMembers={currentTeam.users} />
      </SectionContainer>
    </Container>
  );
});

const Container = styled.div`
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

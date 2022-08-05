import React from "react";
import { useMst } from "~/setup/root";
import {
  AvatarContainer,
  EntryBodyCard,
  EntryContainer,
  EntryCardHeaderContainer,
  EntryHeadingContainer,
  NoSelectedItems,
} from "~/components/shared/journals-and-notes";
import * as R from "ramda";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Card } from "~/components/shared/card";
import { Text } from "~/components/shared/text";
import { Icon } from "~/components/shared/icon";
import { Avatar } from "~/components/shared/avatar";
import moment from "moment";

interface JournalInsightsProps {
  insightsToShow: Array<any>;
}

const JournalInsights = ({ insightsToShow }: JournalInsightsProps): JSX.Element => {
  const { userStore } = useMst();
  const { t } = useTranslation();

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

  const renderSelectedEntryHeading = selectedEntry => {
    const user = getUser(selectedEntry.userId);
    const { avatarUrl, defaultAvatarColor, firstName, lastName } = user;
    return (
      <>
        <Text fontSize={"16px"} fontWeight={600}>
          {selectedEntry.title}
        </Text>
        <Text fontSize={"12px"} fontWeight={400} color={"grey100"}>
          {moment(selectedEntry.loggedAt).format("dddd, MMMM Do, h:mm a")}
        </Text>
        <AvatarContainer>
          <Avatar
            avatarUrl={avatarUrl}
            firstName={firstName}
            lastName={lastName}
            size={24}
            marginLeft={"0"}
            marginRight={"10px"}
            defaultAvatarColor={defaultAvatarColor}
          />
          <Text fontSize={"12px"} fontWeight={400} color={"grey100"} marginRight={"3px"}>
            {firstName}
          </Text>
          <Text fontSize={"12px"} fontWeight={400} color={"grey100"}>
            {lastName}
          </Text>
        </AvatarContainer>
      </>
    );
  };

  const renderSelectedEntry = (data) => {
    return R.isNil(data) ? (
      <NoSelectedItems text={t("journals.startAdding")} />
    ) : (
      <>
        <EntryHeadingContainer>{renderSelectedEntryHeading(data)}</EntryHeadingContainer>
        <Card
          width={"100%"}
          alignment={"left"}
          noHeaderBorder={true}
          headerComponent={
            <EntryCardHeaderContainer>
              <Text fontSize={"12px"} fontWeight={600}>
                {t("journals.journalEntry")}
              </Text>
            </EntryCardHeaderContainer>
          }
        >
          <EntryBodyCard>
            <Text fontSize={"12px"} mb={"20px"} dangerouslySetInnerHTML={{ __html: data.body }} />
          </EntryBodyCard>
        </Card>
      </>
    );
  };

  return (
    <>
      {checkInArtifactLogs.length && checkInArtifactLogs.map(log => {
        const journalLogs = log.journalLogsFull;
        return journalLogs.map(journalLog => (
          <Container key={journalLog.id}>
            <EntryContainer>{renderSelectedEntry(journalLog)}</EntryContainer>
          </Container>
        ))
      })}
    </>
  );
};

export default JournalInsights;

const Container = styled.div`
  margin-bottom: 1em;
`;

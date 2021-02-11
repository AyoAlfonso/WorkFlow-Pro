import * as React from "react";
import { useEffect, useState } from "react";
import * as R from "ramda";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useMst } from "~/setup/root";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavHeader } from "~/components/domains/nav/nav-header";
import { Loading } from "~/components/shared/loading";
import { Section1ForumMeetings } from "./components/section-1-forum-meetings";

export const Section1 = observer(
  (): JSX.Element => {
    const { t } = useTranslation();
    const {
      companyStore,
      companyStore: { company },
      teamStore: { teams },
      forumStore,
    } = useMst();

    // if there is a no team id, get the first team
    const { team_id } = useParams();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      async function setUp() {
        await companyStore.load();
        setLoading(false);
      }
      setUp();
    }, [company]);

    if (loading || !company) {
      return (
        <Container>
          <HeaderContainer>
            <NavHeader>{t("forum.section1")}</NavHeader>
          </HeaderContainer>
          <Loading />
        </Container>
      );
    } else if (forumStore.error) {
      return <></>;
    }

    const teamId =
    (team_id && parseInt(team_id)) || forumStore.currentForumTeamId || R.path(["0", "id"], teams);

    //TODO: will remove nave header when we do the header section
    //TODO: need to sort by scheduled start time from view?
    
    return (
      <Container>
        <HeaderContainer>
          <NavHeader>{t("forum.section1")}</NavHeader>
        </HeaderContainer>
        <Section1ForumMeetings company={company} teamId={teamId} />
      </Container>
    );
  },
);

const Container = styled.div``;

const HeaderContainer = styled.div`
  display: flex;
  margin-top: 10px;
`;

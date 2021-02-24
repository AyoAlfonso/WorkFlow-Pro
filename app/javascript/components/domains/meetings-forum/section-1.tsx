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
import { toJS } from "mobx";

export const Section1 = observer(
  (): JSX.Element => {
    const { t } = useTranslation();
    const {
      companyStore,
      companyStore: { company },
      teamStore,
      forumStore,
    } = useMst();

    const { team_id } = useParams();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      async function setUp() {
        await companyStore.load();
        setLoading(false);
      }
      !company ? setUp() : setLoading(false);
    }, [company]);

    // if there is a no team id, get the first team
    const teamId =
      (team_id && parseInt(team_id)) ||
      forumStore.currentForumTeamId ||
      R.path(["0", "id"], toJS(teamStore.teams));

    //TODO: will remove nave header when we do the header section
    //TODO: need to sort by scheduled start time from view?

    if (loading || !company || !teamId) {
      return (
        <Container>
          <HeaderContainer>
            <NavHeader>{t("forum.section1")}</NavHeader>
          </HeaderContainer>
          <Loading />
        </Container>
      );
    }

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

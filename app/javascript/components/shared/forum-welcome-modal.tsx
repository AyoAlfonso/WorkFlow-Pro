import * as React from "react";
import styled from "styled-components";
import { ModalWithHeader } from "../shared";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { useState } from "react";
import { Loading } from "./loading";
import * as R from "ramda";
import YouTube from "react-youtube";

export const ForumWelcomeModal = observer(
  (): JSX.Element => {
    const {
      sessionStore: { profile, updateUserCompanyFirstTimeAccess },
      companyStore: { company },
    } = useMst();

    const [modalOpen, setModalOpen] = useState<boolean>(profile.firstAccessToForum);

    if (!profile || !company) {
      return <Loading />;
    }

    const youtubeVideoString = R.path(["forumIntroVideo", "value"], company).substr(
      R.path(["forumIntroVideo", "value"], company).length - 11,
    );

    const opts = {
      height: "720",
      width: "960",
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 0 as any,
      },
    };

    return (
      <ModalWithHeader
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        headerText="Welcome!"
        width="65rem"
        onCloseAction={() => {
          updateUserCompanyFirstTimeAccess({
            companyId: profile.defaultSelectedCompanyId,
            firstTimeAccess: false,
          });
        }}
      >
        <Container>
          <YouTube videoId={youtubeVideoString} id={youtubeVideoString} opts={opts} />
        </Container>
      </ModalWithHeader>
    );
  },
);

const Container = styled.div`
  text-align: center;
  padding-top: 36px;
  padding-bottom: 36px;
`;

import React, { useState, useEffect } from "react";
import { KeyActivityModalContent } from "./key-activity-modal-content";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";
import { Loading } from "~/components/shared/loading";
import styled from "styled-components";

interface IKeyActivityModalContentWrapperProps {
  keyActivityId: string | number;
  setKeyActivityModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const KeyActivityModalContentWrapper = observer(
  ({
    setKeyActivityModalOpen,
    keyActivityId,
  }: IKeyActivityModalContentWrapperProps): JSX.Element => {
    const [keyActivity, setKeyActivity] = useState<any>(null);
    const { keyActivityStore } = useMst();
    useEffect(() => {
      if (!keyActivityId) return;

      keyActivityStore.fetchKeyActivity(keyActivityId).then(keyActivity => {
        if (keyActivityStore.currentKeyActivity) {
          setKeyActivity(keyActivityStore.currentKeyActivity);
        } else {
          setKeyActivityModalOpen(false);
        }
      });
    }, [keyActivityId]);

    if (!keyActivity) {
      return (
        <LoadBodyContainer>
          <Loading />
        </LoadBodyContainer>
      );
    }
    return (
      // <></>
      <KeyActivityModalContent
        setKeyActivityModalOpen={setKeyActivityModalOpen}
        keyActivity={keyActivity}
      ></KeyActivityModalContent>
    );
  },
);

const LoadBodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

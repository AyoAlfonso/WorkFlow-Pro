import * as React from "react";
import styled from "styled-components";
import moment from "moment";
import { TextDiv } from "~/components/shared";
import { CreateKeyActivityModal } from "../key-activities/create-key-activity-modal";
import { CreateKeyActivityButton } from "../key-activities/create-key-activity-button";
import { KeyActivitiesList } from "../key-activities/key-activities-list";
import { useState } from "react";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { toJS } from "mobx";

interface IAddPyns {
  formData: any;
}

export const AddPyns = observer(
  ({ formData }: IAddPyns): JSX.Element => {
    const { keyActivityStore } = useMst();

    const [createKeyActivityModalOpen, setCreateKeyActivityModalOpen] = useState<boolean>(false);

    return (
      <Container>
        <TextDiv fontFamily={"Exo"} fontSize={"22px"} fontWeight={600}>
          Today
        </TextDiv>
        <TextDiv fontSize={"16px"} color={"greyInactive"} my={"16px"}>
          {moment().format("MMMM D")}
        </TextDiv>
        <KeyActivitiesListContainer>
          <CreateKeyActivityButton
            onButtonClick={() => {
              setCreateKeyActivityModalOpen(true);
            }}
          />
          <KeyActivitiesList
            keyActivities={toJS(keyActivityStore.keyActivitiesForOnboarding)}
            droppableId={`todays-activities`}
          />
        </KeyActivitiesListContainer>

        <CreateKeyActivityModal
          createKeyActivityModalOpen={createKeyActivityModalOpen}
          setCreateKeyActivityModalOpen={setCreateKeyActivityModalOpen}
          defaultTypeAsWeekly={true}
          onboardingCompanyId={formData.id}
        />
      </Container>
    );
  },
);

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const KeyActivitiesListContainer = styled.div`
  height: 100%;
`;

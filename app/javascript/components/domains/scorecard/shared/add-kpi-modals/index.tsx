import React, { useState, useCallback } from "react";
import { ModalWithHeader } from "~/components/shared/modal-with-unique-header";
import { useTranslation } from "react-i18next";
import { baseTheme } from "~/themes";
import styled, { css } from "styled-components";
import { titleCase } from "~/utils/camelize";
import { observer } from "mobx-react";
import MenuItem from "@material-ui/core/MenuItem";
import { Input } from "~/components/shared/input";
// import { LabelSelectionDropdownList } from "../../../shared/label-selection-dropdown-list";
import { Source } from "./source";
import { Existing } from "./existing";
import { RollUp } from "./roll-up";
import { Average } from "./average";

interface IAddKPIModalProps {
  KPIs: any;
  showAddKPIModal: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  headerText?: string;
  kpiModalType: string;
}

export const AddKPIModal = observer(
  ({ KPIs, showAddKPIModal, setModalOpen, kpiModalType }: IAddKPIModalProps): JSX.Element => {
    const formattedKpiModalType = titleCase(kpiModalType);

    return (
      <ModalWithHeader
        modalOpen={showAddKPIModal}
        setModalOpen={setModalOpen}
        headerText={formattedKpiModalType}
        width="480px"
      >
        <Container>
          {kpiModalType == "source" && (
            <Source
              KPIs={KPIs}
              kpiModalType={formattedKpiModalType}
              setModalOpen={setModalOpen}
            ></Source>
          )}
          {/* {kpiModalType == "existing" && <Existing></Existing>}
          {kpiModalType == "roll up" && <RollUp></RollUp>}
          {kpiModalType == "average" && <Average></Average>} */}
        </Container>
      </ModalWithHeader>
    );
  },
);

const Container = styled.div`
  height: 30rem;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const LeftContainer = styled.div`
  width: 200px;
  height: 100%;
  background: #f7f8fa 0% 0% no-repeat padding-box;
`;

const RightContainer = styled.div`
  height: 100%;
  background: #f7f8fa 0% 0% no-repeat padding-box;
`;

const inputStyles = css`
  margin: 0px;
  font-size: 12px;
`;

const StyledInput = styled(Input)`
  ${inputStyles}
`;

const LynchpynLogoContainer = styled.div`
  text-align: center;
  margin-top: auto;
  margin-bottom: 16px;
`;

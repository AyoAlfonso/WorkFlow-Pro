import React, { useRef, useEffect } from "react";
import { ModalWithHeader } from "~/components/shared/modal-with-header";
import { useTranslation } from "react-i18next";
import { baseTheme } from "~/themes";
import styled, { css } from "styled-components";
import { titleCase } from "~/utils/camelize";
import { observer } from "mobx-react";
import MenuItem from "@material-ui/core/MenuItem";
import { Input } from "~/components/shared/input";
// import { LabelSelectionDropdownList } from "../../../shared/label-selection-dropdown-list";
// import { Source } from "./source";
import { Existing } from "./existing";
import { RollUp } from "./roll-up";
import { Average } from "./average";
import * as R from "ramda";

interface IAdvancedKPIModalProps {
  KPIs: any[];
  showAddKPIModal: boolean;
  setShowFirstStage?: React.Dispatch<React.SetStateAction<boolean | null>>;
  headerText?: string;
  kpiModalType: string;
  setExternalManualKPIData: React.Dispatch<React.SetStateAction<any>>;
  setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  existingSelectedKPIs?: any[];
  originalKPI?: number;
}

export const AdvancedKPIModal = observer(
  ({
    KPIs,
    showAddKPIModal,
    setShowFirstStage,
    setModalOpen,
    kpiModalType,
    setExternalManualKPIData,
    existingSelectedKPIs,
    originalKPI,
  }: IAdvancedKPIModalProps): JSX.Element => {
    const formattedKpiModalType = titleCase(kpiModalType);
    const optionsRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = event => {
        if (optionsRef.current && !optionsRef.current.contains(event.target)) {
          setModalOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [optionsRef]);

    return (
      <ModalContainer
        modalOpen={showAddKPIModal}
        setModalOpen={setModalOpen}
        headerText={formattedKpiModalType}
        width="480px"
        height="0px"
        ref={optionsRef}
      >
        <InnerContainer>
          {kpiModalType == "existing" && (
            <Existing
              KPIs={KPIs}
              kpiModalType={formattedKpiModalType}
              setModalOpen={setModalOpen}
              setExternalManualKPIData={setExternalManualKPIData}
              setShowFirstStage={setShowFirstStage}
              existingSelectedKPIs={existingSelectedKPIs}
              originalKPI={originalKPI}
            ></Existing>
          )}
          {["rollup", "roll up"].includes(kpiModalType) && (
            <RollUp
              KPIs={KPIs}
              kpiModalType={formattedKpiModalType}
              setModalOpen={setModalOpen}
              setExternalManualKPIData={setExternalManualKPIData}
              setShowFirstStage={setShowFirstStage}
              existingSelectedKPIs={existingSelectedKPIs}
              originalKPI={originalKPI}
            ></RollUp>
          )}
          {["average", "avr"].includes(kpiModalType) && (
            <Average
              KPIs={KPIs}
              kpiModalType={formattedKpiModalType}
              setModalOpen={setModalOpen}
              setExternalManualKPIData={setExternalManualKPIData}
              setShowFirstStage={setShowFirstStage}
              existingSelectedKPIs={existingSelectedKPIs}
              originalKPI={originalKPI}
            ></Average>
          )}
        </InnerContainer>
      </ModalContainer>
    );
  },
);

const InnerContainer = styled.div`
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

const ModalContainer = styled(ModalWithHeader)`
  height: 0px;
`;

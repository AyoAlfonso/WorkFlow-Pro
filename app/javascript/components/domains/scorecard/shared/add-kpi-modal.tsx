import React, { useState, useCallback } from "react";
import { ModalWithHeader } from "~/components/shared/modal-with-header";
import { useTranslation } from "react-i18next";
import { baseTheme } from "../../../../themes";
import styled, { css } from "styled-components";
import { titleCase } from "../../../../utils/camelize";
import { observer } from "mobx-react";
import MenuItem from "@material-ui/core/MenuItem";
import { Input } from "~/components/shared/input";

interface IAddKPIModalProps {
  kpis: any;
  showAddKPIModal: true;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  headerText?: string;
  kpiModalType: string;
}

export const AddKPIModal = observer(
         ({
           kpis,
           showAddKPIModal,
           setModalOpen,
           headerText,
           kpiModalType,
         }: IAddKPIModalProps): JSX.Element => {
           const renderIndividualKPIS = (): Array<JSX.Element> => {
             return kpis.map((kpi, index) => {
               return (
                 // <MenuItem value={kpi.id} key={index}>
                 // {kpi.owner.firstName} {kpi.owner.firstName}
                 // </MenuItem>

                 <MenuItem value={kpi.id} key={index}>
                   {kpi.owner.firstName} {kpi.owner.firstName}
                   {/* </br> */}
                   {kpi.name}
                 </MenuItem>
               );
             });
           };
           return (
             <ModalWithHeader
               modalOpen={showAddKPIModal}
               setModalOpen={setModalOpen}
               // headerText={titleCase(headerText)}
               width="480px"
             >
               <Container>
                 <LeftContainer>
                   {
                     (kpiModalType == "source" && (
                       <LynchpynLogoContainer>
                         <img src={"/assets/LynchPyn-Logo_Horizontal-Blue"} width="100"></img>
                       </LynchpynLogoContainer>
                     ))
                   }
                   {kpiModalType != "source" && (
                     <LynchpynLogoContainer>
                       {/* <img src={"/assets/LynchPyn-Logo_Horizontal-Blue"} width="100"></img> */}
                     </LynchpynLogoContainer>
                   )}
                 </LeftContainer>

                 <RightContainer>
                   <StyledInput placeholder={"Search KPI"} />
                   {renderIndividualKPIS()}
                 </RightContainer>
               </Container>
             </ModalWithHeader>
           );
         },
       );

const Container = styled.div`
  height: 30rem;
`;

const LeftContainer = styled.div`
  top: 64px;
  left: 320px;
  width: 200px;
  height: 400px;
  background: var(--bkng-grey) 0% 0% no-repeat padding-box;
  background: #f7f8fa 0% 0% no-repeat padding-box;
  border-radius: 8px 0px 0px 8px;
  opacity: 1;
`;

const RightContainer = styled.div`
  top: 64px;
  right: 120px;
  width: 200px;
  height: 400px;
  background: var(--bkng-grey) 0% 0% no-repeat padding-box;
  background: #f7f8fa 0% 0% no-repeat padding-box;
  border-radius: 8px 0px 0px 8px;
  opacity: 1;
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
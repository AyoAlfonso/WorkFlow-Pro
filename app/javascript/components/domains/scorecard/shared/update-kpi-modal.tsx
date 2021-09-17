import React, { useState } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { useMst } from "~/setup/root";
import {
  InputFromUnitType,
  ModalWithHeader,
  InputHeaderWithComment,
  SaveButton,
  StyledInput,
  FormContainer,
  FormElementContainer,
} from "./modal-elements";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router";

interface UpdateKPIModalProps {
  kpiId: number;
  ownedById: number;
  unitType: string;
  year: number;
  week: number;
  currentValue: number | undefined;
  headerText: string;
  setUpdateKPIModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateKPIModalOpen: boolean;
  renderNewValue?: any;
  setKpis: any;
}

export const UpdateKPIModal = observer(
  ({
    kpiId,
    unitType,
    year,
    week,
    currentValue,
    headerText,
    setUpdateKPIModalOpen,
    updateKPIModalOpen,
    renderNewValue,
    setKpis,
  }: UpdateKPIModalProps): JSX.Element => {
     const history = useHistory();
    const { keyPerformanceIndicatorStore, sessionStore, scorecardStore } = useMst();
    const [value, setValue] = useState<number>(currentValue);
    const [comment, setComment] = useState("");
    const { owner_type, owner_id } = useParams();

    const handleSave = () => {
      if (value != undefined) {
        const log = {
          keyPerformanceIndicatorId: kpiId,
          userId: sessionStore.profile.id,
          score: value,
          note: null,
          week,
          fiscalYear: year,
          fiscalQuarter: Math.floor((week - 1) / 13) + 1,
        };
        if (comment != "") {
          log.note = comment;
        }
        keyPerformanceIndicatorStore.createScorecardLog(log).then(() => {
         
          setUpdateKPIModalOpen(false);
          setKpis(scorecardStore.kpis);
          renderNewValue ? renderNewValue(value) : null;
          history.push(`/scorecard/0/0`)
          setTimeout(history.push(`/scorecard/${owner_type}/${owner_id}`), 2000, 0);
        })
      }
    };

    const handleChange = e => {
      setValue(Number(e.target.value.replace(/[^0-9\.]+/g, "")));
    };

    return (
      <ModalWithHeader
        header={headerText}
        isOpen={updateKPIModalOpen}
        setIsOpen={setUpdateKPIModalOpen}
      >
        <FormContainer>
          <FormElementContainer>
            <InputHeaderWithComment>New value</InputHeaderWithComment>
            <InputFromUnitType
              unitType={unitType}
              placeholder={"Add the new value..."}
              onChange={handleChange}
              defaultValue={currentValue}
            />
          </FormElementContainer>
          <FormElementContainer>
            <InputHeaderWithComment comment={"optional"}>Comment</InputHeaderWithComment>
            <StyledInput
              placeholder={"Add a comment..."}
              onChange={e => {
                setComment(e.target.value);
              }}
            />
          </FormElementContainer>
          <FormElementContainer>
            <SaveButton onClick={handleSave}>Save</SaveButton>
          </FormElementContainer>
        </FormContainer>
      </ModalWithHeader>
    );
  },
);

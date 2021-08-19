import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useMst } from "~/setup/root";
import { Select } from "~/components/shared/input";
import { OwnedBy } from "./scorecard-owned-by";
import {
  InputFromUnitType,
  ModalWithHeader,
  InputHeaderWithComment,
  SaveButton,
  StyledInput,
  FormContainer,
  FormElementContainer,
  RowContainer,
} from "./modal-elements";
import { toJS } from "mobx";
import { TrixEditor } from "react-trix";

interface AddManualKPIModalProps {
  addManualKPIModalOpen: boolean;
  setAddManualKPIModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddManualKPIModal = observer(
  ({ addManualKPIModalOpen, setAddManualKPIModalOpen }: AddManualKPIModalProps): JSX.Element => {
    const { owner_id, owner_type } = useParams();
    const { keyPerformanceIndicatorStore, sessionStore, descriptionTemplateStore } = useMst();
    const [title, setTitle] = useState<string>(undefined);
    const [greaterThan, setGreaterThan] = useState(1);
    const [description, setDescription] = useState<string>(undefined);
    const [unitType, setUnitType] = useState<string>("numerical");
    const [owner, setOwner] = useState(sessionStore?.profile);
    const [targetValue, setTargetValue] = useState<number>(undefined);
    const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
    const [needsAttentionThreshold, setNeedsAttentionThreshold] = useState(90);

    useEffect(() => {
      if (!descriptionTemplateStore.descriptionTemplates) {
        descriptionTemplateStore.fetchDescriptiveTemplates();
      }
      const template = toJS(descriptionTemplateStore.descriptionTemplates).find(
        t => t.templateType == "kpi",
      );
      if (template) {
        setDescription(template.body.body);
      }
    }, []);

    const handleSave = () => {
      const kpi = {
        viewers: [{ type: owner_type, id: owner_id }],
        title,
        description: "",
        greaterThan: greaterThan === 1,
        ownedById: owner.id,
        unitType,
        targetValue,
        needsAttentionThreshold,
      };
      if (description) {
        kpi.description = description;
      }
      keyPerformanceIndicatorStore.createKPI(kpi).then(result => {
        if (!result) {
          return;
        }
        // Reset and close
        setTitle(undefined);
        setGreaterThan(1);
        setDescription(undefined);
        setUnitType("numerical");
        setOwner(sessionStore?.profile);
        setTargetValue(undefined);
        setShowAdvancedSettings(false);
        setNeedsAttentionThreshold(90);
        setAddManualKPIModalOpen(false);
      });
    };

    const handleChange = (e, setStateAction) => {
      setStateAction(Number(e.target.value.replace(/[^0-9.]+/g, "")));
    };

    return (
      <ModalWithHeader
        header={"Add Manual KPI"}
        isOpen={addManualKPIModalOpen}
        setIsOpen={setAddManualKPIModalOpen}
      >
        <FormContainer>
          <RowContainer>
            <FormElementContainer>
              <InputHeaderWithComment>Title</InputHeaderWithComment>
              <StyledInput
                type={"text"}
                placeholder={"e.g. Employee NPS"}
                onChange={e => {
                  setTitle(e.target.value);
                }}
              />
            </FormElementContainer>
          </RowContainer>
          <RowContainer>
            <FormElementContainer>
              <InputHeaderWithComment comment={"optional"}>Description</InputHeaderWithComment>
              <TrixEditor
                className={"trix-kpi-modal"}
                autoFocus={false}
                placeholder={"Add a description..."}
                onChange={s => {
                  setDescription(s);
                }}
                value={description}
                mergeTags={[]}
              />
            </FormElementContainer>
          </RowContainer>
          <RowContainer>
            <FormElementContainer>
              <InputHeaderWithComment>Unit</InputHeaderWithComment>
              <Select
                name={"unitType"}
                onChange={e => {
                  setUnitType(e.target.value);
                }}
                value={unitType}
                fontSize={12}
                height={15}
                pt={6}
                pb={10}
              >
                <option key={"numerical"} value={"numerical"}>
                  # Numerical
                </option>
                <option key={"percentage"} value={"percentage"}>
                  % Percentage
                </option>
                <option key={"currency"} value={"currency"}>
                  $ Currency
                </option>
              </Select>
            </FormElementContainer>
            <FormElementContainer>
              <InputHeaderWithComment>Owner</InputHeaderWithComment>
              <OwnedBy
                ownedBy={owner}
                setOwnedBy={setOwner}
                marginLeft={"0px"}
                marginTop={"auto"}
                marginBottom={"auto"}
                fontSize={"12px"}
                disabled={false}
                center={false}
              />
            </FormElementContainer>
          </RowContainer>
          <RowContainer>
            <FormElementContainer>
              <InputHeaderWithComment>Logic</InputHeaderWithComment>
              <Select
                name={"logic"}
                onChange={e => {
                  setGreaterThan(e.target.value);
                }}
                value={greaterThan}
                fontSize={12}
                height={15}
                pt={6}
                pb={10}
              >
                <option key={"greater-than"} value={1}>
                  Greater than or equal to
                </option>
                <option key={"less-than"} value={0}>
                  Less than or equal to
                </option>
              </Select>
            </FormElementContainer>
            <FormElementContainer>
              <InputHeaderWithComment>Target Value</InputHeaderWithComment>
              <InputFromUnitType
                unitType={unitType}
                placeholder={"0"}
                onChange={e => {
                  handleChange(e, setTargetValue);
                }}
                defaultValue={targetValue}
              />
            </FormElementContainer>
          </RowContainer>
          <AdvancedSettingsButton
            onClick={() => {
              setShowAdvancedSettings(!showAdvancedSettings);
            }}
          >
            Advanced Settings
          </AdvancedSettingsButton>
          {showAdvancedSettings && (
            <RowContainer>
              <FormElementContainer>
                <InputHeaderWithComment>Needs Attention Threshold</InputHeaderWithComment>
                <InputFromUnitType
                  name="needs-attention-threshold"
                  unitType={"percentage"}
                  placeholder={"90"}
                  onChange={e => {
                    handleChange(e, setNeedsAttentionThreshold);
                  }}
                  defaultValue={needsAttentionThreshold}
                />
              </FormElementContainer>
              <FormElementContainer />
            </RowContainer>
          )}
          <FormElementContainer>
            <SaveButton onClick={handleSave}>Save</SaveButton>
          </FormElementContainer>
        </FormContainer>
      </ModalWithHeader>
    );
  },
);

const AdvancedSettingsButton = styled.div`
  font-size: 12px;
  margin-top: 16px;
  font-weight: bold;
  width: max-content;
  color: ${props => props.theme.colors.primary100};

  &:hover {
    cursor: pointer;
  }
`;

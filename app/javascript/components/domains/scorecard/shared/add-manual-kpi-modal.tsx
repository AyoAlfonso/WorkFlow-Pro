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
  showAddManualKPIModal: boolean;
  setShowAddManualKPIModal: React.Dispatch<React.SetStateAction<boolean>>;
  externalManualKPIData?: any;
}

export const AddManualKPIModal = observer(
  ({
    showAddManualKPIModal,
    setShowAddManualKPIModal,
    externalManualKPIData,
  }: AddManualKPIModalProps): JSX.Element => {
    const { owner_id, owner_type } = useParams();
    const { keyPerformanceIndicatorStore, sessionStore, descriptionTemplateStore } = useMst();
    const [title, setTitle] = useState<string>(
      (externalManualKPIData?.selectedKPIs?.length &&
        externalManualKPIData.selectedKPIs[0].title) ||
        undefined,
    );
    const [greaterThan, setGreaterThan] = useState(1);
    const [description, setDescription] = useState<string>(undefined);
    const [unitType, setUnitType] = useState<string>(
      externalManualKPIData?.unitType || "numerical",
    );
    const [owner, setOwner] = useState(sessionStore?.profile);
    const [targetValue, setTargetValue] = useState<number>(
      externalManualKPIData?.targetValue || undefined,
    );
    const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
    const [needsAttentionThreshold, setNeedsAttentionThreshold] = useState(90);
    const [selectedKPIs, setSelectedKPIs] = useState(externalManualKPIData?.selectedKPIs);
    const [selectedTagInputCount, setSelectedTagInputCount] = useState(0);

    useEffect(() => {
      setSelectedTagInputCount(externalManualKPIData?.selectedKPIs?.length - 3);
    }, [selectedKPIs]);

    const removeTagInput = id => {
      setSelectedKPIs(selectedKPIs.filter(kpi => kpi.id != id));
    };
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
        parentType: externalManualKPIData?.kpiModalType,
        parentKpi: selectedKPIs?.map(kpi => kpi.id),
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
        setShowAddManualKPIModal(false);
      });
    };

    const handleChange = (e, setStateAction) => {
      setStateAction(Number(e.target.value.replace(/[^0-9.]+/g, "")));
    };

    const renderTaggedInput = (): Array<JSX.Element> => {
      return selectedKPIs?.slice(0, 3).map((kpi, key) => {
        return (
          <TagInput id={key} key={key}>
            <TagTitle>{kpi.title}</TagTitle>
            <TagInputClose onClick={() => removeTagInput(kpi.id)}> x </TagInputClose>
          </TagInput>
        );
      });
    };

    return (
      <ModalWithHeader
        header={`Add ${externalManualKPIData?.kpiModalType || "Manual"} KPI`}
        isOpen={showAddManualKPIModal}
        setIsOpen={setShowAddManualKPIModal}
        width={"720px"}
      >
        <FormContainer>
          <RowContainer>
            <FormElementContainer>
              <InputHeaderWithComment>Title</InputHeaderWithComment>
              <StyledInput
                type={"text"}
                value={title}
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
              <TrixEditorContainer>
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
              </TrixEditorContainer>
            </FormElementContainer>
          </RowContainer>
          <RowContainer>
            <FormElementContainer>
              {selectedTagInputCount > 0 ? (
                <InputHeaderWithComment comment={"optional"}>KPI Selection</InputHeaderWithComment>
              ) : (
                <> </>
              )}
              <MultiTagInputContainer>
                {renderTaggedInput()}

                {selectedTagInputCount > 0 ? (
                  <SelectedTagInputCount> {selectedTagInputCount}+ </SelectedTagInputCount>
                ) : (
                  <> </>
                )}
              </MultiTagInputContainer>
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
                disabled={!!selectedKPIs?.length}
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
              <InputHeaderWithComment>Condition</InputHeaderWithComment>
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

const SelectedTagInputCount = styled.span`
  background: #1065f6;
  color: #ffffff;
  padding: 0.2rem 0.4rem;
  border-radius: 5px;
`;

const SelectionBox = styled.div`
  background-color: #ffffff;
  display: grid;
  grid-template-columns: 11fr 1fr;
  height: 100%;
  align-items: center;
  padding: 0rem 1.2rem;
  border-top-right-radius: 10px;

  @media only screen and (min-width: 280px) and (max-width: 767px) {
    padding: 0.7em 0.3rem;
    width: 100%;
  }
`;
const MultiTagInputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  height: 100%;
  align-items: center;
`;
const TagInput = styled.span`
  border: 1px solid #1065f6;
  color: #1065f6;
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
  font-size: 0.8rem;
  height: 1.5rem;
  white-space: nowrap;
  align-items: center;
  text-overflow: ellipsis;
  overflow: hidden;
  justify-content: space-between;
  display: inline;
`;
const TagTitle = styled.span`
  max-width: 100px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline;
`;

const TagInputClose = styled.span`
  font-size: 1rem;
  color: #cdd1dd;
  font-weight: 600;
  margin-left: 0.2rem;
  height: 1.5rem;
  align-items: center;
  display: inline;
`;

const TrixEditorContainer = styled.div`
  margin-top: 4px;
`;

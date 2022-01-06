import React, { useState, useEffect } from "react";
import * as R from "ramda";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useMst } from "~/setup/root";
import { Select } from "~/components/shared/input";
import { OwnedBy } from "./scorecard-owned-by";
import { Button } from "~/components/shared/button";
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
import ReactQuill from "react-quill";
import { useHistory } from "react-router";

interface ManualKPIModalProps {
  showAddManualKPIModal: boolean;
  setShowAddManualKPIModal: React.Dispatch<React.SetStateAction<boolean>>;
  externalManualKPIData?: any;
}

export const ManualKPIModal = observer(
  ({
    showAddManualKPIModal,
    setShowAddManualKPIModal,
    externalManualKPIData,
  }: ManualKPIModalProps): JSX.Element => {
    const history = useHistory();
    const { t } = useTranslation();
    const { owner_id, owner_type } = useParams();
    const { keyPerformanceIndicatorStore, sessionStore, descriptionTemplateStore } = useMst();

    const getValueOfLocalStorage = key => {
      try {
        return JSON.parse(localStorage.getItem(key));
      } catch (error) {
        false;
      }
    };

    const cachedUnitType = !!getValueOfLocalStorage("cachedUnitType")
      ? getValueOfLocalStorage("cachedUnitType")
      : "";
    const cachedKpiTitle = !!getValueOfLocalStorage("cachedKpiTitle")
      ? getValueOfLocalStorage("cachedKpiTitle")
      : "";
    const cachedTargetValue = !!getValueOfLocalStorage("cachedTargetValue")
      ? getValueOfLocalStorage("cachedTargetValue")
      : 0;
    const cacheNeedsAttentionThreshold = !!getValueOfLocalStorage("cacheNeedsAttentionThreshold")
      ? getValueOfLocalStorage("cacheNeedsAttentionThreshold")
      : "";
    const cachedGreaterThan = !!getValueOfLocalStorage("cachedGreaterThan")
      ? getValueOfLocalStorage("cachedGreaterThan")
      : "";

    const [title, setTitle] = useState<string>(
      (externalManualKPIData?.selectedKPIs?.length &&
        externalManualKPIData.selectedKPIs[0].title) ||
        cachedKpiTitle,
    );

    const getgreaterThanValue = () => {
      if (!R.isNil(externalManualKPIData)) {
        if (externalManualKPIData.greaterThan) {
          return externalManualKPIData.greaterThan;
        } else {
          return false;
        }
        if (cachedGreaterThan) {
          return cachedGreaterThan;
        } else {
          return false;
        }
      } else {
        return true;
      }
    };

    const [greaterThan, setGreaterThan] = useState<boolean>(getgreaterThanValue());
    const [description, setDescription] = useState<string>(externalManualKPIData?.description);
    const [unitType, setUnitType] = useState<string>(
      externalManualKPIData?.unitType || cachedUnitType || "numerical",
    );
    const [owner, setOwner] = useState(
      externalManualKPIData?.selectedKPIs?.length > 0
        ? externalManualKPIData?.selectedKPIs[0].ownedBy
        : sessionStore?.profile,
    );
    const [targetValue, setTargetValue] = useState<number>(
      externalManualKPIData?.targetValue || cachedTargetValue,
    );
    const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
    const [needsAttentionThreshold, setNeedsAttentionThreshold] = useState(
      externalManualKPIData?.needsAttentionThreshold || cacheNeedsAttentionThreshold || 90,
    );
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
      if (template && !externalManualKPIData?.description) {
        setDescription(template.body.body);
      }
    }, []);

    const resetModal = () => {
      clearData();
      setShowAddManualKPIModal(false);
    };
    const clearCacheKPIModalData = () => {
      localStorage.setItem("cachedKpiTitle", undefined);
      localStorage.setItem("cachedTargetValue", undefined);
      localStorage.setItem("cachedGreaterThan", undefined);
      localStorage.setItem("cacheNeedsAttentionThreshold", undefined);
      localStorage.setItem("cachedUnitType", undefined);
    };
    const clearData = () => {
      setTitle(undefined);
      setGreaterThan(true);
      setDescription(undefined);
      setUnitType("numerical");
      setOwner(sessionStore?.profile);
      setTargetValue(undefined);
      setShowAdvancedSettings(false);
      setNeedsAttentionThreshold(90);
      setShowAddManualKPIModal(false);
    };

    const handleSave = () => {
      if (!R.isNil(externalManualKPIData?.kpiModalType)) {
        externalManualKPIData.kpiModalType =
          externalManualKPIData?.kpiModalType == "Average"
            ? "avr"
            : externalManualKPIData?.kpiModalType == "Roll Up"
            ? "rollup"
            : externalManualKPIData?.kpiModalType == "Existing"
            ? "existing"
            : externalManualKPIData?.kpiModalType;
      }

      const kpi = {
        viewers: [{ type: owner_type, id: owner_id }],
        title,
        description: "",
        greaterThan,
        ownedById: owner.id,
        unitType,
        targetValue,
        parentType: externalManualKPIData?.kpiModalType?.toLowerCase().replace(/\s+/g, ""),
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
        clearData();
        clearCacheKPIModalData();
        setShowAddManualKPIModal(false);
        history.push(`/scorecard/0/0`);
        setTimeout(history.push(`/scorecard/${owner_type}/${owner_id}`), 1000, 0);
      });
    };

    const handleChange = (e, setStateAction, cachePropName) => {
      localStorage.setItem(cachePropName, JSON.stringify(e.target.value));
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
        headerFontSize={"21px"}
      >
        <FormContainer>
          <RowContainer>
            <FormElementContainer>
              <InputHeaderWithComment fontSize={"14px"}>Title</InputHeaderWithComment>
              <StyledInput
                type={"text"}
                value={title}
                style={{ marginTop: "4px" }}
                placeholder={"e.g. Employee NPS"}
                onChange={e => {
                  localStorage.setItem("cachedKpiTitle", JSON.stringify(e.target.value));
                  setTitle(e.target.value);
                }}
              />
            </FormElementContainer>
          </RowContainer>
          <RowContainer>
            <FormElementContainer>
              <InputHeaderWithComment fontSize={"14px"} childFontSize={"12px"} comment={"optional"}>
                Description
              </InputHeaderWithComment>
              <TrixEditorContainer>
                <ReactQuill
                  className="trix-kpi-modal"
                  theme="snow"
                  value={description}
                  onChange={(content, delta, source, editor) => {
                    setDescription(editor.getHTML());
                  }}
                />
              </TrixEditorContainer>
            </FormElementContainer>
          </RowContainer>
          <RowContainer>
            <FormElementContainer>
              {selectedTagInputCount > 0 ? (
                <InputHeaderWithComment
                  fontSize={"14px"}
                  childFontSize={"12px"}
                  comment={"optional"}
                >
                  KPI Selection
                </InputHeaderWithComment>
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
              <InputHeaderWithComment fontSize={"14px"}> Unit</InputHeaderWithComment>
              <Select
                name={"unitType"}
                onChange={e => {
                  localStorage.setItem("cachedUnitType", JSON.stringify(e.target.value));
                  setUnitType(e.target.value);
                }}
                style={{ marginTop: "4px" }}
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
              <InputHeaderWithComment fontSize={"14px"}>Owner</InputHeaderWithComment>
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
              <InputHeaderWithComment fontSize={"14px"}>Condition</InputHeaderWithComment>
              <Select
                name={"logic"}
                onChange={(e, s) => {
                  localStorage.setItem(
                    "cachedGreaterThan",
                    JSON.stringify(e.target.value == 1 ? true : false),
                  );
                  setGreaterThan(e.target.value == 1 ? true : false);
                }}
                value={greaterThan ? 1 : 0}
                fontSize={12}
                height={15}
                style={{ marginTop: "4px" }}
                pb={10}
                mt={4}
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
              <InputHeaderWithComment fontSize={"14px"}>Target Value</InputHeaderWithComment>
              <InputFromUnitType
                unitType={unitType}
                style={{ marginTop: "4px" }}
                placeholder={"0"}
                onChange={e => {
                  handleChange(e, setTargetValue, "cachedTargetValue");
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
                  style={{ marginTop: "4px" }}
                  onChange={e => {
                    handleChange(e, setNeedsAttentionThreshold, "cacheNeedsAttentionThreshold");
                  }}
                  defaultValue={needsAttentionThreshold}
                />
              </FormElementContainer>
              <FormElementContainer />
            </RowContainer>
          )}
          <ButtonContainer>
            <Button
              small
              variant={"primary"}
              m={1}
              style={{ width: "50%", fontSize: "small" }}
              onClick={handleSave}
            >
              {t("general.save")}
            </Button>
            <Button
              small
              variant={"redOutline"}
              m={1}
              style={{ width: "50%", fontSize: "small" }}
              onClick={() => {
                resetModal();
                clearCacheKPIModalData();
              }}
            >
              {t("general.cancel")}
            </Button>
          </ButtonContainer>
        </FormContainer>
      </ModalWithHeader>
    );
  },
);

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  width: 10px;
`;

const AdvancedSettingsButton = styled.div`
  font-size: 12px;
  font-weight: bold;
  width: max-content;
  color: ${props => props.theme.colors.primary100};

  &:hover {
    cursor: pointer;
  }
`;

const CancelButton = styled(Button)`
  display: inline-block;
  align-items: center;
  justify-content: center;
  width: auto;
  font-size: 14px;
  font-weight: bold;
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

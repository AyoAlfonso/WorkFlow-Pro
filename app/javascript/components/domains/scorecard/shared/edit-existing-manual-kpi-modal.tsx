import React, { useState, useEffect, useRef } from "react";
import * as R from "ramda";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useMst } from "~/setup/root";
import { Select } from "~/components/shared/input";
import { OwnedBy } from "./scorecard-owned-by";
import { AdvancedKPIModal } from "./advanced-kpi-modals";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
import { useHistory } from "react-router";
import { Loading } from "~/components/shared/loading";

import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

interface AddExistingManualKPIModalProps {
  kpiId?: number;
  showAddManualKPIModal: boolean;
  setShowAddManualKPIModal: React.Dispatch<React.SetStateAction<boolean>>;
  headerText?: string;
  kpis?: any;
}

export const AddExistingManualKPIModal = observer(
  ({
    kpiId,
    showAddManualKPIModal,
    setShowAddManualKPIModal,
    headerText,
    kpis,
  }: AddExistingManualKPIModalProps): JSX.Element => {
    const history = useHistory();
    const { owner_id, owner_type } = useParams();
    const { keyPerformanceIndicatorStore, sessionStore, scorecardStore } = useMst();
    const [title, setTitle] = useState<string>(undefined);
    const [kpi, setKpi] = useState(null);
    const [greaterThan, setGreaterThan] = useState<boolean>(true);
    const [description, setDescription] = useState<any>(null);
    const [unitType, setUnitType] = useState<string>(undefined);
    const [owner, setOwner] = useState(undefined);
    const [targetValue, setTargetValue] = useState<number>(undefined);
    const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
    const [needsAttentionThreshold, setNeedsAttentionThreshold] = useState(undefined);
    const [selectedKPIs, setSelectedKPIs] = useState(undefined);
    const [selectedTagInputCount, setSelectedTagInputCount] = useState(0);
    const [showFirstStage, setShowFirstStage] = useState(undefined);
    const [manualKPIDataInput, setManualKPIDataInput] = useState(undefined);

    useEffect(() => {
      if (!R.isNil(kpiId)) {
        const advancedKPI = scorecardStore.kpis.find(kpi => kpi.id == kpiId && kpi.parentType);
        keyPerformanceIndicatorStore.getKPI(kpiId).then(() => {
          const KPI = advancedKPI || keyPerformanceIndicatorStore?.kpi;
          if (KPI) {
            setTitle(KPI.title);
            setOwner(KPI.ownedBy);
            // setDescription(KPI.description);
            setGreaterThan(KPI.greaterThan);
            setUnitType(KPI.unitType);
            setTargetValue(KPI.targetValue);
            setNeedsAttentionThreshold(KPI.needsAttentionThreshold);
            setSelectedKPIs(KPI.relatedParentKpis);
            setKpi(KPI);
          }
        });
      }
    }, [kpiId]);

    useEffect(() => {
      if (!R.isNil(manualKPIDataInput)) {
        setSelectedKPIs(manualKPIDataInput.selectedKPIs);
        setUnitType(manualKPIDataInput.unitType);
      }
    }, [manualKPIDataInput]);

    useEffect(() => {
      setSelectedTagInputCount(selectedKPIs?.length - 3);
    }, [selectedKPIs]);

    const removeTagInput = id => {
      setSelectedKPIs(selectedKPIs.filter(kpi => kpi.id != id));
    };

    useEffect(() => {
      if (!R.isNil(kpi)) {
        setShowFirstStage(!!kpi.parentType);
      }
    }, [kpi]);

    useEffect(() => {
      const convertedHtml = htmlToDraft(kpi?.description || "");
      const contentState = ContentState.createFromBlockArray(convertedHtml.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      setDescription(editorState || EditorState.createEmpty());
    }, [kpi]);

    const resetModal = () => {
      setTitle(undefined);
      setGreaterThan(true);
      setDescription(EditorState.createEmpty());
      setUnitType("numerical");
      setOwner(sessionStore?.profile);
      setTargetValue(undefined);
      setShowAdvancedSettings(false);
      setNeedsAttentionThreshold(90);
      setShowAddManualKPIModal(false);
    };

    const handleSave = () => {
      if (!kpi.viewers.findIndex(viewer => viewer.id == owner.id)) {
        kpi.viewers.push = { type: "user", id: owner.id };
      }
      const updatedKpi = {
        viewers: kpi.viewers,
        title,
        description,
        greaterThan,
        ownedById: owner.id,
        unitType,
        targetValue,
        parentType: kpi.parentType,
        parentKpi: selectedKPIs?.map(kpi => kpi.id),
        needsAttentionThreshold,
        id: kpi.id,
      };
     
      if (description) {
        updatedKpi.description = draftToHtml(convertToRaw(description.getCurrentContent()));
      }
      keyPerformanceIndicatorStore.updateKPI(updatedKpi).then(result => {
        if (!result) {
          return;
        }
        // Reset and close
        resetModal();
        history.push(`/scorecard/0/0`);
        setTimeout(history.push(`/scorecard/${owner_type}/${owner_id}`), 1000, 0);
      });
    };

    const handleChange = (e, setStateAction) => {
      setStateAction(Number(e.target.value.replace(/[^0-9.]+/g, "")));
    };
    const closeAllModals = () => {
      setShowFirstStage(false);
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

    if (R.isNil(kpi)) {
      return <Loading />;
    }

    return showFirstStage ? (
      <AdvancedKPIModal
        KPIs={kpis}
        showAddKPIModal={showFirstStage}
        kpiModalType={kpi.parentType}
        setShowFirstStage={setShowFirstStage}
        setModalOpen={closeAllModals}
        setExternalManualKPIData={setManualKPIDataInput}
        existingSelectedKPIs={kpi.relatedParentKpis}
        originalKPI={kpi.id}
        setShowAddManualKPIModal={setShowAddManualKPIModal}
      />
    ) : (
      !showFirstStage && (
        <ModalWithHeader
          header={headerText}
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
                  placeholder={"e.g. Employee NPS"}
                  onChange={e => {
                    setTitle(e.target.value);
                  }}
                />
              </FormElementContainer>
            </RowContainer>
            <RowContainer>
              <FormElementContainer>
                <InputHeaderWithComment
                  fontSize={"14px"}
                  childFontSize={"12px"}
                  comment={"optional"}
                >
                  Description
                </InputHeaderWithComment>
                <TrixEditorContainer>
                  {/* <ReactQuill
                    theme="snow"
                    placeholder={"Add a description..."}
                    value={description}
                    onChange={setDescription}
                  /> */}
                  <Editor
                    placeholder={"Add a description..."}
                    editorState={description}
                    onEditorStateChange={e => setDescription(e)}
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
                <InputHeaderWithComment fontSize={"14px"}>Owner</InputHeaderWithComment>
                {owner && (
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
                )}
              </FormElementContainer>
            </RowContainer>
            <RowContainer>
              <FormElementContainer>
                <InputHeaderWithComment fontSize={"14px"}>Condition</InputHeaderWithComment>
                <Select
                  name={"logic"}
                  onChange={e => {
                    setGreaterThan(e.target.value == 1 ? true : false);
                  }}
                  value={greaterThan ? 1 : 0}
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
                <InputHeaderWithComment fontSize={"14px"}>Target Value</InputHeaderWithComment>
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
      )
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

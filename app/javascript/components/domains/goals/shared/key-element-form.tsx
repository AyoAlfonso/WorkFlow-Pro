import * as React from "react";
import * as R from "ramda";
import styled, { css } from "styled-components";
import { space, SpaceProps } from "styled-system";
import { useState, useRef, useEffect } from "react";
import { Input, Label, Button, TextDiv } from "~/components/shared";
import { Select } from "~/components/shared/input";
import { baseTheme } from "~/themes/base";
import { Store } from "@material-ui/icons";
import { useMst } from "~/setup/root";
import { InputFromUnitType } from "~/components/domains/scorecard/shared/modal-elements";
import { OwnedBy } from "../../scorecard/shared/scorecard-owned-by";

interface IKeyElementFormProps {
  onCreate: (keyElementParams: any) => void;
  onClose: () => void;
  setActionType: any;
  type?: any;
  setSelectedElement: any;
  keysForOnboarding?: any;
  callbackForOnboarding?: any;
  showAddButton?: any;
  item?: any;
  store?: any;
}

export const KeyElementForm = ({
  onCreate,
  onClose,
  setActionType,
  setSelectedElement,
  type,
  keysForOnboarding,
  callbackForOnboarding,
  showAddButton,
  item,
  store,
}: IKeyElementFormProps): JSX.Element => {
  const { userStore, sessionStore, companyStore } = useMst();
  const { users } = userStore;
  const [title, setTitle] = useState<string>("");
  const [completionType, setCompletionType] = useState<string>("numerical");
  const [completionTargetValue, setCompletionTargetValue] = useState<string>("");
  const [ownedBy, setOwnedBy] = useState<any>(sessionStore.profile);
  const [condition, setCondition] = useState<number>(1);

  const selectOptions = [
    { label: "Numerical #", value: "numerical" },
    { label: "Percentage %", value: "percentage" },
    { label: "Currency $", value: "currency" },
    { label: "Completion", value: "binary" },
  ];

  const selectCondition = [
    { label: "Greater than or equal to", value: 1 },
    { label: "Less than or equal to", value: 0 },
  ];

  const resetForm = () => {
    setTitle("");
    setCompletionType("numerical");
    setCompletionTargetValue("");
    setCondition(0);
    setActionType("Add");
    setSelectedElement(null);
  };

  const parseTarget = target => {
    let val = target;
    if (val.includes("$")) {
      val = val.split("$")[1];
    }
    if (val.includes(",")) {
      val = val.split(",").join("");
    }
    return val;
  };

  const createKeyElement = () => {
    const keyElementParams = {
      value: title,
      completionType,
      completionTargetValue: completionType == "binary" ? 0 : parseTarget(completionTargetValue),
      greaterThan: Number(condition),
      ownedBy: ownedBy.id,
    };
    if (type === "onboarding") {
      return callbackForOnboarding(keysForOnboarding, keyElementParams);
    }
    onCreate(keyElementParams);
  };

  const createMilestones = () => {
    if (companyStore.company.objectivesKeyType == "Milestones" || !item || type === "onboarding")
      return;
    if (item.milestones.length) {
      return;
    } else {
      store.createMilestones(item.id);
    }
  };

  const isValid =
    !R.isEmpty(title) && !R.isEmpty(completionType) && completionType == "binary"
      ? true
      : !R.isEmpty(completionTargetValue) && !R.isNil(ownedBy) && !R.isNil(condition);

  const handleSave = () => {
    if (isValid) {
      createKeyElement();
      createMilestones();
      onClose();
      showAddButton && showAddButton(false);
    }
  };

  const handleSaveAndAddAnother = () => {
    if (isValid) {
      createKeyElement();
      createMilestones();
      resetForm();
    }
  };

  const completionSymbol = () => {
    switch (completionType) {
      case "binary":
        return "";
      case "numerical":
        return "#";
      case "percentage":
        return "%";
      case "currency":
        return "$";
    }
  };

  return (
    <Container>
      <RowContainer>
        <FormElementContainer>
          <InputHeaderContainer>
            <InputHeader>Title</InputHeader>
          </InputHeaderContainer>
          <StyledInput
            onChange={e => {
              e.preventDefault();
              setTitle(e.currentTarget.value);
            }}
            value={title}
            placeholder={"Title..."}
          />
        </FormElementContainer>
      </RowContainer>
      <RowContainer mt={"16px"}>
        <FormElementContainer>
          <InputHeaderContainer>
            <InputHeader>Unit</InputHeader>
          </InputHeaderContainer>
          <Select
            onChange={e => {
              e.preventDefault();
              setCompletionType(e.currentTarget.value);
            }}
            value={completionType}
            fontSize={12}
            height={15}
            pt={6}
            pb={10}
          >
            {selectOptions.map(({ label, value }, index) => (
              <option key={`option-${index}`} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </FormElementContainer>
        <FormElementContainer>
          <InputHeaderContainer>
            <InputHeader>Owner</InputHeader>
          </InputHeaderContainer>
          <OwnedBy
            ownedBy={ownedBy}
            setOwnedBy={setOwnedBy}
            marginLeft={"0px"}
            marginTop={"auto"}
            marginBottom={"auto"}
            fontSize={"12px"}
            disabled={false}
            center={false}
          />
        </FormElementContainer>
      </RowContainer>

      <RowContainer mt={"16px"}>
        {completionType !== "binary" && (
          <FormElementContainer>
            <InputHeaderContainer>
              <InputHeader>Condition</InputHeader>
            </InputHeaderContainer>
            <Select
              onChange={e => {
                e.preventDefault();
                setCondition(e.currentTarget.value);
              }}
              value={condition}
              fontSize={12}
              height={15}
              pt={6}
              pb={10}
            >
              {selectCondition.map(({ label, value }, index) => (
                <option key={`option-${index}`} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </FormElementContainer>
        )}
        {completionType !== "binary" && (
          <FormElementContainer>
            <InputHeaderContainer>
              <InputHeader>Target Value</InputHeader>
            </InputHeaderContainer>
            <InputFromUnitType
              unitType={completionType}
              placeholder={"90"}
              defaultValue={completionTargetValue}
              max={completionType === "percentage" ? 100 : null}
              onChange={e => {
                e.preventDefault();
                const value =
                  completionType === "percentage" && e.currentTarget.value > 100
                    ? 100
                    : e.currentTarget.value;
                setCompletionTargetValue(value);
              }}
              value={completionTargetValue}
            />
            <CompletionTypeContainer>
              <TextDiv fontSize={"12px"}>{completionSymbol()}</TextDiv>
            </CompletionTypeContainer>
          </FormElementContainer>
        )}
      </RowContainer>
      <ButtonRowContainer mt={completionType === "binary" ? "20px" : "0"}>
        <Button
          style={{ padding: "8px 16px" }}
          variant={"primary"}
          onClick={handleSave}
          small
          disabled={!isValid}
        >
          <TextDiv fontSize={"12px"}>Save</TextDiv>
        </Button>
        {type !== "onboarding" && (
          <Button
            style={{ padding: "8px 16px" }}
            variant={"primaryOutline"}
            onClick={handleSaveAndAddAnother}
            small
            disabled={!isValid}
          >
            <TextDiv fontSize={"12px"}>Save & Add Another</TextDiv>
          </Button>
        )}
      </ButtonRowContainer>
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

const RowContainer = styled.div<SpaceProps>`
  ${space}
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 16px;
`;

const ButtonRowContainer = styled(RowContainer)`
  margin-top: 5%;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const CompletionTypeContainer = styled.div`
  position: absolute;
  right: 30px;
  top: 9px;
`;

const InputHeader = styled.p`
  margin: 0px;
  font-size: 14px;
  font-weight: bold;
`;

const InputHeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export const FormElementContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 4px;
  .trix-kpi-modal {
    font-size: 12px;
    margin: 0px;
    margin-top: 4px;
  }
`;

const inputStyles = css`
  margin: 0px;
  font-size: 12px;
`;

export const StyledInput = styled(Input)`
  ${inputStyles}
`;

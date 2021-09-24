import React, { useRef, useState, useEffect } from "react";
import { useMst } from "~/setup/root";
import styled from "styled-components";
import { observer } from "mobx-react";
import { Icon } from "../../../shared/icon";
import { Button } from "~/components/shared/button";
import { TextDiv } from "~/components/shared/text";
import { AddKPIModal } from "./add-kpi-modals";
import { AddManualKPIModal } from "./add-manual-kpi-modal";
import { toJS } from "mobx";
interface IAddKPIDropdownProps {
  kpis: any[];
}

export const AddKPIDropdown = observer(
  ({ kpis }: IAddKPIDropdownProps): JSX.Element => {
    const optionsRef = useRef(null);
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [showAddKPIModal, setAddKPIModal] = useState<boolean>(false);
    const [kpiModalType, setAddKPIModalType] = useState<string>("");
    const [showAddManualKPIModal, setShowAddManualKPIModal] = useState<boolean>(false);
    const [externalManualKPIData, setExternalManualKPIData] = useState({});

    useEffect(() => {
      const handleClickOutside = event => {
        if (optionsRef.current && !optionsRef.current.contains(event.target)) {
          setShowOptions(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [optionsRef, kpis]);
    const clickKPIOptions = type => {
      setAddKPIModal(!showAddKPIModal);
      setAddKPIModalType(type);
    };
    const setManualKPIData = data => {
      setShowAddManualKPIModal(!showAddManualKPIModal);
      setAddKPIModal(false);
      setExternalManualKPIData(data);
    };
    return (
      <Container ref={optionsRef}>
        <StyledButton
          small
          variant={"grey"}
          onClick={() => {
            setShowOptions(!showOptions);
          }}
          width={"fill"}
        >
          <CircularIcon icon={"Plus"} size={"12px"} />
          <AddKPIText>Add KPI</AddKPIText>
        </StyledButton>
        {showOptions && (
          <DropdownOptionsContainer onClick={e => e.stopPropagation()}>
            <OptionContainer
              onClick={() => {
                setShowAddManualKPIModal(!showAddManualKPIModal);
              }}
            >
              <OptionText>Manual</OptionText>
            </OptionContainer>
            {/* <OptionContainer
              onClick={() => {
                clickKPIOptions("source");
              }}
            >
              <OptionText>Source</OptionText>
            </OptionContainer> */}
            <OptionContainer
              onClick={() => {
                clickKPIOptions("existing");
              }}
            >
              <OptionText>Existing</OptionText>
            </OptionContainer>
            <OptionContainer
              onClick={() => {
                clickKPIOptions("roll up");
              }}
            >
              <OptionText>Roll Up</OptionText>
            </OptionContainer>
            <OptionContainer
              onClick={() => {
                clickKPIOptions("average");
              }}
            >
              <OptionText>Average</OptionText>
            </OptionContainer>
          </DropdownOptionsContainer>
        )}

        {showAddKPIModal && (
          <AddKPIModal
            KPIs={kpis}
            showAddKPIModal={showAddKPIModal}
            kpiModalType={kpiModalType}
            setModalOpen={setAddKPIModal}
            setExternalManualKPIData={setManualKPIData}
          />
        )}
        {showAddManualKPIModal && (
          <AddManualKPIModal
            showAddManualKPIModal={showAddManualKPIModal}
            setShowAddManualKPIModal={setShowAddManualKPIModal}
            externalManualKPIData={externalManualKPIData}
          />
        )}
      </Container>
    );
  },
);

const Container = styled.div`
  position: relative;
`;

type StyledButtonType = {
  width?: string;
};

const StyledButton = styled(Button)<StyledButtonType>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${props => (props.width != "auto" ? props.width : "auto")};
  padding-left: 0;
  padding-right: 0;
  background-color: ${props => props.theme.colors.white};
  border-color: ${props => props.theme.colors.white};
  &:hover {
    color: ${props => props.theme.colors.primary100};
  }
`;

const CircularIcon = styled(Icon)`
  box-shadow: 2px 2px 6px 0.5px rgb(0 0 0 / 20%);
  color: ${props => props.theme.colors.white};
  border-radius: 50%;
  height: 25px;
  width: 25px;
  background-color: ${props => props.theme.colors.primary100};
  &:hover {
    background-color: ${props => props.theme.colors.primaryActive};
  }
`;

const AddKPIText = styled(TextDiv)`
  margin-left: 10px;
  white-space: break-spaces;
  color: ${props => props.theme.colors.primary100};
  font-size: 14px;
`;

const DropdownOptionsContainer = styled.div`
  position: absolute;
  width: 78px;
  background-color: ${props => props.theme.colors.white};
  bottom: 30px;
  padding-top: 8px;
  padding-bottom: 8px;
  box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  z-index: 3;
  height: auto;
  overflow: auto;
  margin-bottom: 4px;
`;

const TextContainer = styled.div`
  font-size: 14px;
  margin-left: 8px;
  margin-top: auto;
  margin-bottom: auto;
  color: ${props => props.theme.colors.black};
`;

const OptionText = styled(TextContainer)`
  color: ${props => props.theme.colors.black};
  margin-left: 8px;
  white-space: nowrap;
`;

export const StyledIcon = styled(Icon)``;

const OptionContainer = styled.div`
  display: flex;
  height: 24px;
  margin-top: 4px;
  margin-bottom: 4px;
  &: hover {
    cursor: pointer;
    background-color: ${props => props.theme.colors.primary100};
  }
  &:hover ${OptionText} {
    color: white;
  }
`;

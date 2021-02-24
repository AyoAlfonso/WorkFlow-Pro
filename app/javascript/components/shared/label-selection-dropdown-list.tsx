import * as React from "react";
import styled from "styled-components";
import { Text } from "./text";
import { Icon, Input, Select } from "./";
import { useState } from "react";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import * as R from "ramda";

interface ILabelSelectionDropdownListProps {
  labelsList: any;
  onLabelSelect: any;
  selectedItemId?: number | string;
  afterLabelSelectAction?: any;
}

export const LabelSelectionDropdownList = observer(
  ({
    labelsList,
    onLabelSelect,
    selectedItemId,
    afterLabelSelectAction,
  }: ILabelSelectionDropdownListProps): JSX.Element => {
    const {
      teamStore: { teams },
      labelStore,
    } = useMst();

    const [labelInput, setLabelInput] = useState<string>("");
    const [selectedTeamId, setSelectedTeamId] = useState<any>(selectedItemId || "");

    const renderTeamName = label => {
      if (label.teamId) {
        const teamName = teams.find(team => team.id == label.teamId).name;
        return `(${teamName})`;
      }
    };

    const renderLabelOptions = (): Array<JSX.Element> => {
      return labelsList.map((label, index) => {
        return (
          <LabelOption
            key={index}
            onClick={() => {
              onLabelSelect(label);
              labelStore.setSelectedLabelObj(label);
              if (afterLabelSelectAction) {
                afterLabelSelectAction(label.name);
              }
            }}
          >
            <Icon icon={"Label"} size={"25px"} iconColor={label.color ? label.color : "grey60"} />
            <LabelOptionText>
              {`${label.name}`} {renderTeamName(label)}
            </LabelOptionText>
          </LabelOption>
        );
      });
    };

    const renderDefaultValue = (): JSX.Element => {
      return <StyledOption value={""}> </StyledOption>;
    };

    const renderTeams = (): Array<JSX.Element> => {
      return teams.map((team, index) => {
        return (
          <StyledOption key={index} value={team.id}>
            {team.name}
          </StyledOption>
        );
      });
    };

    const createAndSetLabel = () => {
      labelStore.createLabel(labelInput, selectedTeamId).then(data => {
        onLabelSelect(data);
        setLabelInput("");
      });
    };

    const renderCustomLabelInput = (): JSX.Element => {
      return (
        <CustomLabelOption>
          <InputContainer>
            <HelperText> Team </HelperText>
            <StyledSelect
              name="teams"
              onChange={e => {
                setSelectedTeamId(e.target.value);
              }}
              value={selectedTeamId}
            >
              {renderDefaultValue()}
              {renderTeams()}
            </StyledSelect>
          </InputContainer>

          <LabelContainer>
            <HelperText> Label Name</HelperText>
            <Input
              onChange={e => setLabelInput(e.target.value)}
              value={labelInput}
              onKeyDown={key => {
                if (key.keyCode == 13) {
                  createAndSetLabel();
                }
              }}
            />
          </LabelContainer>
        </CustomLabelOption>
      );
    };

    return (
      <ActionDropdownContainer>
        {renderCustomLabelInput()}
        {renderLabelOptions()}
      </ActionDropdownContainer>
    );
  },
);

const ActionDropdownContainer = styled.div`
  position: absolute;
  background-color: ${props => props.theme.colors.white};
  box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.1);
  margin-left: -10px;
  margin-top: 5px;
  border-radius: 10px;
  padding: 10px;
  z-index: 2;
  height: auto;
  overflow: auto;
`;

const LabelOptionText = styled(Text)`
  color: ${props => props.theme.colors.primary100};
  cursor: pointer;
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 6px;
  padding-bottom: 6px;
  padding-left: 12px;
  padding-right: 18px;
`;

const CustomLabelOption = styled.div`
  padding: 5px;
  display: flex;
`;

const LabelOption = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 5px;
  padding-right: 10px;
  &:hover {
    background-color: ${props => props.theme.colors.primary100};
  }
  &:hover ${LabelOptionText} {
    color: white;
  }
`;

const StyledSelect = styled(Select)`
  height: 36px;
  text-overflow: ellipsis;
`;

const StyledOption = styled.option``;

const InputContainer = styled.div``;

const HelperText = styled(Text)`
  color: ${props => props.theme.colors.grey60};
  font-size: 12px;
`;

const LabelContainer = styled(InputContainer)`
  margin-left: 10px;
`;

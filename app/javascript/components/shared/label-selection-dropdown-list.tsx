import * as React from "react";
import styled from "styled-components";
import { Icon } from "./";
import { useState } from "react";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import * as R from "ramda";
import TextField from "@material-ui/core/TextField";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { toJS } from "mobx";

interface ILabelSelectionDropdownListProps {
  labelsList: any;
  setSelectedLabel: any;
  afterLabelSelectAction?: any;
  closeModal: any;
}

const filter = createFilterOptions<any>({ limit: 5 });

export const LabelSelectionDropdownList = observer(
  ({
    labelsList,
    setSelectedLabel,
    afterLabelSelectAction,
    closeModal,
  }: ILabelSelectionDropdownListProps): JSX.Element => {
    const { labelStore } = useMst();

    const [value, setValue] = useState<any>(null);

    const createAndSetLabel = (label, selectedGroup) => {
      if (label) {
        const labelName = selectedGroup ? label.inputValue : label.name;
        labelStore.createLabel(labelName, selectedGroup).then(data => {
          setSelectedLabel(data);
        });
      }
    };

    return (
      <ActionDropdownContainer>
        <CloseIconContainer onClick={() => closeModal()}>
          <Icon icon={"Close"} size={"16px"} iconColor={"grey60"} />
        </CloseIconContainer>
        <Autocomplete
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            if (afterLabelSelectAction) {
              afterLabelSelectAction(newValue.type ? newValue.inputValue : newValue.name);
            }
            if (typeof newValue !== "string" && newValue && newValue.inputValue) {
              createAndSetLabel(newValue, newValue.type);
            } else {
              setSelectedLabel(newValue);
            }
            closeModal();
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);
            if (params.inputValue !== "") {
              filtered.push(
                {
                  inputValue: params.inputValue,
                  name: `Add "${params.inputValue}"`,
                  type: "personal",
                },
                {
                  inputValue: params.inputValue,
                  name: `Add "${params.inputValue}" for all users`,
                  type: "company",
                },
              );
            }

            return filtered;
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          size={"small"}
          id="search-for-labels"
          options={toJS(labelsList)}
          getOptionLabel={option => {
            if (typeof option === "string") {
              return option;
            }
            if (option.inputValue) {
              return option.inputValue;
            }
            return option.name;
          }}
          renderOption={option => {
            const iconName = R.length(R.path(["inputValue"], option)) > 0 ? "Plus" : "Label";
            return (
              <OptionContainer newLabel={iconName == "Plus"}>
                <Icon
                  icon={iconName}
                  size={"16px"}
                  iconColor={option.color ? option.color : "grey60"}
                  mr={2}
                />
                {option.name}
              </OptionContainer>
            );
          }}
          openOnFocus={true}
          style={{ width: 300, height: "auto" }}
          freeSolo
          renderInput={params => (
            <TextField {...params} label="Search for labels" variant="outlined" />
          )}
        />
      </ActionDropdownContainer>
    );
  },
);

const ActionDropdownContainer = styled.div`
  position: absolute;
  background-color: ${props => props.theme.colors.white};
  box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 10px;
  z-index: 2;
  margin-left: -80px;
  margin-top: 5px;
  height: auto;
  overflow: auto;
`;

type OptionContainerProps = {
  newLabel: boolean;
};

const CloseIconContainer = styled.div`
  text-align: right;
  margin-bottom: 5px;
`;

const OptionContainer = styled.div<OptionContainerProps>`
  display: flex;
  font-size: 12px;
  color: ${props => (props.newLabel ? props.theme.colors.greyActive : props.theme.colors.black)};
`;

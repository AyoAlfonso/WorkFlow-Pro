import React, { useState } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useMst } from "~/setup/root";
import { Icon } from "./icon";
import { Text } from "./text";
import { Avatar } from "~/components/shared/avatar";
import TextField from "@material-ui/core/TextField";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { toJS } from "mobx";

interface ITeamSelectionDropdownProps {
  teamsList: any;
  onTeamSelect: any;
}

const filter = createFilterOptions<any>({ limit: 5 });

export const TeamSelectionDropdown = observer(
  ({ teamsList, onTeamSelect }: ITeamSelectionDropdownProps): JSX.Element => {
    const {
      teamStore,
    } = useMst();
    const [value, setValue] = useState<any>(null);
    const [open, setOpen] = useState<boolean>(false);

    console.log(open);

    return (
      <ActionDropdownContainer marginLeft="0px">
        <Autocomplete
          value={value}
          onChange={(event, newValue) => {
            console.log(newValue);
            if (newValue.inputValue) {
              teamStore.createTeamAndInviteUsers(newValue.inputValue, {}).then((data) => console.log(data))
            }
            setValue(newValue);
            onTeamSelect(newValue?.id);
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);
            if (params.inputValue !== "") {
              filtered.push({
                inputValue: params.inputValue,
                name: `Create "${params.inputValue}"`,
              });
            }
            return filtered;
          }}
          // selectOnFocus
          clearOnEscape
          size={"small"}
          options={toJS(teamsList)}
          getOptionLabel={option => {
            return `${option.name ? option.name : "Unamed Team"}`;
          }}
          renderOption={option => {
            console.log(option);
            return (
              <OptionContainer>
                {option.inputValue ? (
                  <Icon
                    icon={"Plus"}
                    size={"20px"}
                    iconColor={option.color ? option.color : "grey60"}
                    mr={2}
                  />
                ) : (
                  <Avatar
                    defaultAvatarColor={option.defaultAvatarColor}
                    firstName={option.name}
                    lastName={""}
                    size={45}
                    marginLeft={"0px"}
                  />
                )}
                <TeamOptionText> {`${option.name ? option.name : "Unamed Team"}`}</TeamOptionText>
              </OptionContainer>
            );
          }}
          freeSolo
          renderInput={params => <TextField {...params} label="Select Team" variant="outlined" />}
        />
      </ActionDropdownContainer>
    );
  },
);

type ActionDropdownContainerProps = {
  marginLeft?: string;
};

const ActionDropdownContainer = styled.div<ActionDropdownContainerProps>`
  position: relative;
  border-radius: 12px;
  padding: 5px;
  z-index: 2;
  margin-left: ${props => props.marginLeft && props.marginLeft};
  margin-top: 5px;
  height: auto;
`;

const OptionContainer = styled.div`
  display: flex;
  font-size: 14px;
  color: ${props => props.theme.colors.black};
`;

const TeamOptionText = styled(Text)`
  cursor: pointer;
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 12px;
`;

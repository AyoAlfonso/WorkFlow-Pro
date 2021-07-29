import * as React from "react";
import styled from "styled-components";
import { UserType } from "~/types/user";
import { Avatar } from "~/components/shared/avatar";
import { Text } from "./text";
// import { Icon } from "~/components/shared/icon";
import TextField from "@material-ui/core/TextField";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { toJS } from "mobx";
import { Icon } from "./icon";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

interface IMultiOptionTypeSelectionDropdownList {
  userList: Array<UserType>;
  onUserSelect: any;
  setShowUsersList: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  showUsersList: boolean;
}

const filter = createFilterOptions<any>({ limit: 5 });

const useStyles = makeStyles({
  textField: {
    paddingTop: 0,
    paddingBottom: 0,
    fontFamily: "Lato",
  },
});

export const MultiOptionTypeSelectionDropdownList = ({
  userList,
  title,
  onUserSelect,
  setShowUsersList,
  showUsersList,
}: IMultiOptionTypeSelectionDropdownList): JSX.Element => {
  const [value, setValue] = useState<any>(null);
  const classes = useStyles();
  return (
    <ActionDropdownContainer>
      <CloseIconContainer onClick={() => setShowUsersList(!showUsersList)}>
        <Icon icon={"Close"} size={"16px"} iconColor={"grey80"} />
      </CloseIconContainer>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          onUserSelect(newValue);
          setShowUsersList(false);
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        size={"small"}
        id="search-for-labels"
        options={userList}
        getOptionLabel={option => {
          return `${option.name} ${option.lastName}`;
        }}
        renderOption={option => {
          return (
            <OptionContainer>
              <Avatar
                defaultAvatarColor={option.defaultAvatarColor}
                avatarUrl={option.avatarUrl}
                firstName={option.name || ""}
                lastName={option.lastName || ""}
                size={45}
                marginLeft={"0px"}
              />
              <UserOptionText> {`${option.name} ${option.lastName || ""}`}</UserOptionText>
            </OptionContainer>
          );
        }}
        openOnFocus={true}
        style={{ width: 300, height: "auto" }}
        freeSolo
        renderInput={params => (
          <TextField
            {...params}
            label={`Select ${title}`}
            variant="outlined"
            className={classes.textField}
            margin="dense"
          />
        )}
      />
    </ActionDropdownContainer>
  );
};

const ActionDropdownContainer = styled.div`
  position: absolute;
  background-color: ${props => props.theme.colors.white};
  box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 10px;
  z-index: 2;
  height: auto;
  overflow: auto;
`;

const OptionContainer = styled.div`
  display: flex;
  font-size: 14px;
  color: ${props => props.theme.colors.black};
`;

const UserOptionText = styled(Text)`
  cursor: pointer;
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 12px;
`;

const CloseIconContainer = styled.div`
  padding-left: 90%;
  &:hover {
    cursor: pointer;
  }
`;

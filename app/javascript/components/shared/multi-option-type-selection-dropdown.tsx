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
  userList: any[];
  onUserSelect: any;
  setShowUsersList: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  showUsersList: boolean;
}

const filter = createFilterOptions<any>();

function alphabetically(ascending) {

  return function (a, b) {

    if (a === b) {
        return 0;
    }
    else if (a === null) {
        return 1;
    }
    else if (b === null) {
        return -1;
    }
    else if (a.type === "team" && a != null) {
        return -1;
    }
    else if (b.type === "team" && b != null) {
        return 1;
    }
    else if (a.type === "company") {
        return -1;
    }
    else if (b.type === "company") {
        return 1;
    }
    else if (ascending) {
        return a.name < b.name ? -1 : 1;
    }
    else { 
        return a.name < b.name ? 1 : -1;
    }

  };

}

function typesort() {
  return function (a, b) {
    if (a.type === "company") {
        return -1;
    }
    else if (b.type === "company") {
        return 1;
    }
  };
}

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
  const alphabeticallySortedList = userList.sort(alphabetically(true));
  return (
    <ActionDropdownContainer>
      <CloseIconContainer onClick={() => setShowUsersList(!showUsersList)}>
        <Icon icon={"Close"} size={"16px"} iconColor={"grey80"} />
      </CloseIconContainer>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          if(typeof newValue === 'object' && newValue !== null) {
              setValue(newValue);
              onUserSelect(newValue);
              setShowUsersList(false);
          }
        }}
        // filterOptions={(options, params) => {
        //   const filtered = filter(options, params);
        //   return filtered;
        // }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        size={"small"}
        id="search-for-labels"
        options={alphabeticallySortedList.sort(typesort())}
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
  overflow-y: scroll;
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

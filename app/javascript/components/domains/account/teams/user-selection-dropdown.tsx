import * as React from "react";
import styled from "styled-components";
import { UserType } from "~/types/user";
import { Avatar } from "~/components/shared/avatar";
import { Text } from "~/components/shared/text";
import TextField from "@material-ui/core/TextField";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { toJS } from "mobx";
import { Icon } from "~/components/shared/icon";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

interface IUserSelectionDropdownListProps {
  userList: Array<UserType>;
  onUserSelect: any;
  currentUser: UserType | any;
  updateMemberListState: any;
  setSelectedUserId: any;
}

const filter = createFilterOptions<any>({ limit: 5 });

const useStyles = makeStyles({
  textField: {
    paddingTop: 0,
    paddingBottom: 0,
    fontFamily: "Lato",
  },
});

export const UserSelectionDropdownList = ({
  userList,
  onUserSelect,
  currentUser,
  updateMemberListState,
  setSelectedUserId,
}: IUserSelectionDropdownListProps): JSX.Element => {
  const [value, setValue] = useState<any>(null);
  const classes = useStyles();

  useEffect(() => {
    setValue(currentUser && currentUser);
  }, [currentUser]);

  return (
    <ActionDropdownContainer>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          updateMemberListState("userId", newValue.id);
          setSelectedUserId(newValue.id);
          setValue(newValue);
          onUserSelect();
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          return filtered;
        }}
        clearOnEscape
        handleHomeEndKeys
        size={"small"}
        id="search-for-labels"
        options={toJS(userList)}
        getOptionLabel={option => {
          return `${option.firstName} ${option.lastName}`;
        }}
        renderOption={option => {
          return (
            <OptionContainer>
              <Avatar
                defaultAvatarColor={option.defaultAvatarColor}
                avatarUrl={option.avatarUrl}
                firstName={option.firstName}
                lastName={option.lastName}
                size={45}
                marginLeft={"0px"}
              />
              <UserOptionText> {`${option.firstName} ${option.lastName}`}</UserOptionText>
            </OptionContainer>
          );
        }}
        openOnFocus={true}
        freeSolo
        renderInput={params => (
          <TextField
            {...params}
            label={`Select User`}
            variant="outlined"
            className={classes.textField}
            margin="dense"
          />
        )}
      />
    </ActionDropdownContainer>
  );
};

const ActionDropdownContainer = styled.div``;

const CloseIconContainer = styled.div`
  text-align: right;
  margin-bottom: 5px;
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

import * as React from "react";
import styled from "styled-components";
import { useMst } from "~/setup/root";
import { UserType } from "~/types/user";
import { Avatar } from "~/components/shared/avatar";
import { Text } from "~/components/shared/text";
import TextField from "@material-ui/core/TextField";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { toJS } from "mobx";
import { Icon } from "~/components/shared/icon";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

interface ITeamManagerDropdownListProps {
  userList: Array<UserType>;
  setTeamManagerId: any;
  currentUser: UserType | any;
  updateMemeberListState: any;
  team: any;
}

const filter = createFilterOptions<any>({ limit: 5 });

const useStyles = makeStyles({
  textField: {
    paddingTop: 0,
    paddingBottom: 0,
    fontFamily: "Lato",
  },
});

export const TeamManagerDropdownList = ({
  userList,
  setTeamManagerId,
  currentUser,
  updateMemeberListState,
  team,
}: ITeamManagerDropdownListProps): JSX.Element => {
  const [value, setValue] = useState<any>(null);
  const classes = useStyles();
  const { userStore } = useMst();

  useEffect(() => {
    setValue(currentUser && currentUser);
  }, []);

  return (
    <ActionDropdownContainer>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          if (team) {
            userStore.updateUserTeamManagerStatus(newValue.id, team.id, true, {
              note: `Updated user and team manager status via the team manager module on settings page `,
            });
          }
          setValue(newValue);
          setTeamManagerId(newValue.id);
          updateMemeberListState(newValue.id);
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

const ActionDropdownContainer = styled.div`
  margin-right: 25px;
`;

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

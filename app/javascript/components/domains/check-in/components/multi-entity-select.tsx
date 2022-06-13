import * as React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { Avatar } from "~/components/shared/avatar";
import { makeStyles } from "@material-ui/core";
import { Icon, Text } from "~/components/shared";
import { IUser } from "~/models/user";

interface IMultiEntitySelectionDropdownList {
  userList: any[];
  onUserSelect: (item:any) => void;
  placeholder?: string;
  selectedItems?: any[];
  setSelectedItems?: React.Dispatch<React.SetStateAction<any[]>>;
  currentUser?: IUser;
}

function alphabetically(ascending) {
  return function(a, b) {
    if (a === b) {
      return 0;
    } else if (a === null) {
      return 1;
    } else if (b === null) {
      return -1;
    } else if (a.type === "team" && a != null) {
      return -1;
    } else if (b.type === "team" && b != null) {
      return 1;
    } else if (a.type === "company") {
      return -1;
    } else if (b.type === "company") {
      return 1;
    } else if (ascending) {
      return a.name < b.name ? -1 : 1;
    } else {
      return a.name < b.name ? 1 : -1;
    }
  };
}

function typesort() {
  return function(a, b) {
    if (a.type === "company") {
      return -1;
    } else if (b.type === "company") {
      return 1;
    }
  };
}

const useStyles = makeStyles({
  textField: {
    paddingTop: 0,
    paddingBottom: 0,
    fontFamily: "Lato",
    border: "0px",
  },
});

export const MultiEntitySelectionDropdownList = ({
  userList,
  placeholder,
  onUserSelect,
  selectedItems,
  setSelectedItems,
  currentUser,
}: IMultiEntitySelectionDropdownList): JSX.Element => {
  const alphabeticallySortedList = userList.sort(alphabetically(true)).sort(typesort());

  const [inputValue, setInputValue] = useState<string>("");
  const [showList, setShowList] = useState<boolean>(false);
  const [filteredList, setFilteredList] = useState(alphabeticallySortedList);

  useEffect(() => {
    setFilteredList(alphabeticallySortedList);
  }, [alphabeticallySortedList]);

  const isAlreadySelected = (option: any) => {
    const exitingItem = selectedItems.find(
      item => item.type === option.type && item.id === option.id,
    );
    return exitingItem ? true : false;
  };

  const deleteItem = (option: any) => {
    const newList = selectedItems.filter(
      item => item.type !== option.type || item.id !== option.id,
    );
    setSelectedItems(newList);
  };

  if (!userList.length) return <></>;

  return (
    <Container>
      <InputContainer>
        <Icon icon={"New-User"} size={"1em"} mr={"1em"} iconColor={"primary100"} />
        <InputField
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={e => {
            setInputValue(e.target.value);
            const filtered = alphabeticallySortedList.filter(option =>
              option.name?.toLowerCase().includes(e.target.value.toLowerCase()),
            );
            setFilteredList(filtered);
          }}
          onFocus={() => setShowList(true)}
          onBlur={() => {
            setTimeout(() => {
              setShowList(false);
            }, 300);
          }}
        />
      </InputContainer>
      {showList && (
        <ListContainer>
          {filteredList.map((option, index) => (
            <OptionContainer
              key={`option-${index}`}
              disabled={isAlreadySelected(option)}
              onClick={() => {
                onUserSelect(option);
                setInputValue("");
                setShowList(false);
              }}
            >
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
          ))}
        </ListContainer>
      )}
      {selectedItems && selectedItems.length > 0 && (
        <SelectedItemsContainer>
          {selectedItems.map((option, index) => (
            <SelectedItemContainer key={`selected-${index}`}>
              <Avatar
                defaultAvatarColor={option.defaultAvatarColor}
                avatarUrl={option.avatarUrl}
                firstName={option.name || ""}
                lastName={option.lastName || ""}
                size={32}
                marginLeft={"0px"}
              />
              <ItemText> {`${option.name} ${option.lastName || ""} ${option.type == "user" && option.id == currentUser.id ? "(me)" : ""}`}</ItemText>
              <IconContainer onClick={() => deleteItem(option)}>
                <Icon icon={"Close"} size={"12px"} iconColor={"grey100"} />
              </IconContainer>
            </SelectedItemContainer>
          ))}
        </SelectedItemsContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;

const InputContainer = styled.div`
  display: flex;
  border: 1px solid ${props => props.theme.colors.greyInactive};
  padding: 0.5em;
  align-items: center;
  border-radius: 4px;
`;

const ListContainer = styled.div`
  position: absolute;
  background-color: ${props => props.theme.colors.white};
  box-shadow: 0px 3px 6px #00000029;
  width: -webkit-fill-available;
  width: moz-available;
  height: fit-content;
  max-height: 400px;
  overflow-y: auto;
  padding: 0.5em 0;
  z-index: 1;
`;

type OptionContainerProps = {
  disabled: boolean;
};

const OptionContainer = styled.div<OptionContainerProps>`
  display: flex;
  font-size: 14px;
  color: ${props => props.theme.colors.black};
  padding: 0.5em;
  background-color: ${props =>
    props.disabled ? props.theme.colors.greyInactive : props.theme.colors.white};
  &:hover {
    background-color: ${props => props.theme.colors.backgroundGrey};
  }
  cursor: pointer;
  pointer-events: ${props => (props.disabled ? "none" : "auto")};
`;

const UserOptionText = styled(Text)`
  cursor: pointer;
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 12px;
`;

const InputField = styled.input`
  border: 0px;
  flex: 1;
  &:focus {
    outline: 0px;
  }
  &::placeholder {
    color: ${props => props.theme.colors.grey100};
    font-size: 14px;
    font-family: Lato;
  }
`;

const SelectedItemsContainer = styled.div`
  margin-top: 1em;
`;

const SelectedItemContainer = styled.div`
  display: flex;
  padding: 0.5em;
  align-items: center;
  box-shadow: 0px 3px 6px #00000029;
  background-color: ${props => props.theme.colors.white};
  border-radius: 4px;
  margin-bottom: 0.5em;
`;

const ItemText = styled(Text)`
  margin: 0;
  margin-left: 1em;
  font-weight: bold;
`;

const IconContainer = styled.div`
  margin-left: auto;
  cursor: pointer;
`;

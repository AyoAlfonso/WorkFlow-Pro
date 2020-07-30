import React from "react";
import styled from "styled-components";
import { Icon } from "~/components/shared/icon";
import { IHomePersonalStatusOption } from "./home-personal-status-options";

export interface IHomePersonalStatusDropdownMenuItemProps {
  menuItem: IHomePersonalStatusOption;
  onSelect: () => void;
  rightIcon?: JSX.Element;
}
export const HomePersonalStatusDropdownMenuItem = ({
  menuItem,
  onSelect,
  rightIcon,
}: IHomePersonalStatusDropdownMenuItemProps): JSX.Element => {
  return (
    <DropdownMenuItem {...menuItem.containerProps} onClick={() => onSelect()}>
      <Icon {...menuItem.iconProps} margin={"0px 10px"} />
      <div>{menuItem.label}</div>
      {/* Empty div is to even out spacing */}
      {rightIcon ? rightIcon : <div></div>}
    </DropdownMenuItem>
  );
};

const DropdownMenuItem = styled.div`
  align-items: center;
  background-color: ${props => props.theme.colors[props.backgroundColor]};
  color: ${props => props.theme.colors[props.color]};
  display: flex;
  height: 32px;
  justify-content: space-between;
  padding: 5px;
  :hover {
    border: solid 2px ${props => props.theme.colors[props.color]};
  }
`;

import React from "react";
import styled from "styled-components";
import * as R from "ramda";
import { Icon } from "~/components/shared/icon";
import { IHomePersonalStatusOption } from "./home-personal-status-options";

export interface IHomePersonalStatusDropdownMenuItemProps {
  menuItem: IHomePersonalStatusOption;
  onSelect: () => void;
  rightIcon?: JSX.Element;
  style?: any;
}
export const HomePersonalStatusDropdownMenuItem = ({
  menuItem,
  onSelect,
  rightIcon,
  style,
}: IHomePersonalStatusDropdownMenuItemProps): JSX.Element => {
  return (
    <DropdownMenuItem
      {...menuItem.containerProps}
      style={style}
      onClick={() => onSelect()}
      rightIcon={rightIcon}
    >
      {R.isEmpty(menuItem.iconProps.icon) ? (
        <div></div>
      ) : (
        <Icon {...menuItem.iconProps} margin={"0px 10px"} />
      )}
      <div>{menuItem.label}</div>
      {/* Empty div is to even out spacing */}
      {rightIcon ? rightIcon : <div></div>}
    </DropdownMenuItem>
  );
};

type DropdownMenuItemType = {
  backgroundColor?: any;
  rightIcon?: any;
};

const DropdownMenuItem = styled.div<DropdownMenuItemType>`
  align-items: center;
  background-color: ${props => props.theme.colors[props.backgroundColor]};
  color: ${props => props.theme.colors[props.color]};
  display: flex;
  height: 32px;
  justify-content: space-between;
  padding: 5px;
  &: hover {
    border: ${props => props.rightIcon && `solid 2px ${props => props.theme.colors[props.color]}`};
    cursor: pointer;
  }
`;

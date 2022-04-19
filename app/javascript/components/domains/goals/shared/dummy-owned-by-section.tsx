import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { UserType } from "~/types/user";
import { useMst } from "~/setup/root";
import { observer } from "mobx-react";
import { useState, useEffect } from "react";
import { SubHeaderText } from "~/components/shared/sub-header-text";
import { Avatar } from "~/components/shared/avatar";
import { RoleAdministrator, RoleCEO } from "~/lib/constants";
import { UserSelectionDropdownList } from "~/components/shared/user-selection-dropdown-list";
import { Text } from "~/components/shared/text";
import { Loading } from "~/components/shared";
import { baseTheme } from "~/themes/base";

interface IOwnedBySectionProps {
  color: string;
  firstname: string;
  lastname: string;
  userIconBorder?: string;
  disabled?: boolean;
  size?: number;
  marginLeft?: string;
  marginRight?: string;
  marginTop?: string;
  marginBottom?: string;
  nameWidth?: string;
  fontSize?: string;
}

export const DummyOwnedBySection = observer(
  ({
    color,
    firstname,
    lastname,
    userIconBorder,
    disabled,
    size,
    nameWidth,
    fontSize,
    ...restProps
  }: IOwnedBySectionProps): JSX.Element => {
    const {
        fadedYellow,
        fadedGreen,
        fadedRed,
        successGreen,
        poppySunrise,
        warningRed,
        backgroundGrey,
        greyActive,
    } = baseTheme.colors;

    return (
      <Container width={100}>
              <Avatar
                defaultAvatarColor={color}
                firstName={firstname}
                lastName={lastname}
                size={size || 20}
                border={userIconBorder}
                {...restProps}
              />
              <OwnedByName fontSize={fontSize} nameWidth={nameWidth} type={"fieldLabel"}>
                {firstname} {lastname}
              </OwnedByName>
      </Container>
    );
  },
);

type ContainerProps = {
  width?: number;
};

const Container = styled.div<ContainerProps>`
  margin-left: 0px;
  width: ${props => `${props.width}%` || "auto"};
  display: flex;
  align-items: center center;
`;

const SubHeaderContainer = styled.div`
  display: flex;
`;

const OwnedByName = styled(Text)`
  margin-left: 8px;
  letter-spacing: 0px;
  color: ${props => props.theme.colors.black};
  width: ${props => `${props.nameWidth}` || "auto"};
  overflow: hidden;
  font-size: ${props => `${props.fontSize}` || "12px"};
  text-overflow: ellipsis;
`;
